import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
  color: string;
}

interface ChoiceModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  options: ChoiceOption[];
  onSelect: (optionId: string) => void;
}

export function ChoiceModal({ isOpen, title, description, options, onSelect }: ChoiceModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl pointer-events-auto"
        >
          <div className="w-full max-w-2xl text-center flex flex-col items-center">
            
            <AlertTriangle className="w-16 h-16 text-orange-500 mb-8 animate-pulse" />
            
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-[0.2em] mb-4 text-glow shadow-black drop-shadow-xl">
              {title}
            </h2>
            
            <p className="text-gray-400 font-mono text-sm leading-loose max-w-xl mb-12">
              {description}
            </p>

            <div className="flex gap-8 w-full justify-center">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelect(opt.id)}
                  className="flex flex-col items-center flex-1 max-w-[240px] p-8 border-2 rounded-xl transition-all hover:scale-105"
                  style={{ 
                    borderColor: `${opt.color}40`, 
                    backgroundColor: `${opt.color}10`,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = opt.color;
                    e.currentTarget.style.boxShadow = `0 0 30px ${opt.color}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = `${opt.color}40`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span 
                    className="text-2xl font-bold uppercase tracking-widest mb-3"
                    style={{ color: opt.color }}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.3em] mt-16">
              The World Will Remember Your Choice
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
