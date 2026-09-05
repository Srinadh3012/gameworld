import { saveInventory, loadInventory, saveHotbar, loadHotbar } from '../utils/storage';
import type { LocalInventory } from '../utils/storage';
import { collectItem, useItem, dropItem, craftItem } from '../../services/api';
import { GAME_ITEMS } from '../data/itemData';
import { GAME_RECIPES } from '../data/recipeData';

class InventorySystem {
  private inventory: LocalInventory = { items: [], capacity: 24 };
  private hotbar: (string | null)[] = [null, null, null, null, null];
  private onInventoryChangedCallbacks: (() => void)[] = [];

  constructor() {
    this.inventory = loadInventory();
    this.hotbar = loadHotbar();
  }

  public subscribe(callback: () => void) {
    this.onInventoryChangedCallbacks.push(callback);
    return () => {
      this.onInventoryChangedCallbacks = this.onInventoryChangedCallbacks.filter(c => c !== callback);
    };
  }

  private notify() {
    saveInventory(this.inventory);
    saveHotbar(this.hotbar);
    this.onInventoryChangedCallbacks.forEach(cb => cb());
  }

  public getInventory() {
    return this.inventory;
  }

  public getHotbar() {
    return this.hotbar;
  }

  public setHotbarSlot(index: number, itemId: string | null) {
    if (index >= 0 && index < 5) {
      this.hotbar[index] = itemId;
      this.notify();
    }
  }

  public getItemQuantity(itemId: string): number {
    const item = this.inventory.items.find(i => i.itemId === itemId);
    return item ? item.quantity : 0;
  }

  public hasRecipeRequirements(recipeId: string): boolean {
    const recipe = GAME_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return false;

    return this.hasRequirements(recipe.requiredItems);
  }

  public hasRequirements(requirements: {itemId: string, quantity: number}[]): boolean {
    for (const req of requirements) {
      if (this.getItemQuantity(req.itemId) < req.quantity) {
        return false;
      }
    }
    return true;
  }

  public async consumeItems(requirements: {itemId: string, quantity: number}[]): Promise<boolean> {
    if (!this.hasRequirements(requirements)) return false;
    
    for (const req of requirements) {
      const existing = this.inventory.items.find(i => i.itemId === req.itemId);
      if (existing) {
        existing.quantity -= req.quantity;
        if (existing.quantity <= 0) {
          this.inventory.items = this.inventory.items.filter(i => i.itemId !== req.itemId);
          this.hotbar = this.hotbar.map(id => id === req.itemId ? null : id);
        }
      }
    }
    
    this.notify();
    
    // In a real scenario, we would also call an API to sync the consumption
    return true;
  }

  public async collectItem(itemId: string, quantity: number = 1): Promise<boolean> {
    const itemDef = GAME_ITEMS[itemId];
    if (!itemDef) return false;

    const existing = this.inventory.items.find(i => i.itemId === itemId);
    if (!existing && this.inventory.items.length >= this.inventory.capacity) {
      return false; // Full
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.inventory.items.push({ itemId, quantity });
    }
    this.notify();

    try {
      await collectItem(itemId, quantity);
    } catch (e) {
      console.warn('[InventorySystem] collect sync failed', e);
    }
    return true;
  }

  public async useItem(itemId: string): Promise<boolean> {
    const existing = this.inventory.items.find(i => i.itemId === itemId);
    if (!existing || existing.quantity < 1) return false;

    existing.quantity -= 1;
    if (existing.quantity <= 0) {
      this.inventory.items = this.inventory.items.filter(i => i.itemId !== itemId);
      // Remove from hotbar if empty
      this.hotbar = this.hotbar.map(id => id === itemId ? null : id);
    }
    this.notify();

    try {
      await useItem(itemId);
    } catch (e) {
      console.warn('[InventorySystem] use sync failed', e);
    }
    return true;
  }

  public async dropItem(itemId: string, quantity: number = 1): Promise<boolean> {
    const existing = this.inventory.items.find(i => i.itemId === itemId);
    if (!existing || existing.quantity < quantity) return false;

    existing.quantity -= quantity;
    if (existing.quantity <= 0) {
      this.inventory.items = this.inventory.items.filter(i => i.itemId !== itemId);
      this.hotbar = this.hotbar.map(id => id === itemId ? null : id);
    }
    this.notify();

    try {
      await dropItem(itemId, quantity);
    } catch (e) {
      console.warn('[InventorySystem] drop sync failed', e);
    }
    return true;
  }

  public async craftItem(recipeId: string): Promise<boolean> {
    if (!this.hasRecipeRequirements(recipeId)) return false;

    const recipe = GAME_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return false;

    // Check capacity if new
    const existingOutput = this.inventory.items.find(i => i.itemId === recipe.outputItem);
    if (!existingOutput && this.inventory.items.length >= this.inventory.capacity) return false;

    // Deduct
    for (const req of recipe.requiredItems) {
      const invItem = this.inventory.items.find(i => i.itemId === req.itemId);
      if (invItem) invItem.quantity -= req.quantity;
    }
    this.inventory.items = this.inventory.items.filter(i => i.quantity > 0);

    // Add
    if (existingOutput) {
      existingOutput.quantity += recipe.outputQuantity;
    } else {
      this.inventory.items.push({ itemId: recipe.outputItem, quantity: recipe.outputQuantity });
    }
    this.notify();

    try {
      await craftItem(recipeId);
    } catch (e) {
      console.warn('[InventorySystem] craft sync failed', e);
    }
    return true;
  }
}

export const inventorySystem = new InventorySystem();
