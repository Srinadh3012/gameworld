import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArchetypeRadar } from '../components/profile/ArchetypeRadar';
import { WorldImpactChart } from '../components/profile/WorldImpactChart';
import { Card } from '../components/ui/Card';
import { Globe2, Crosshair, Zap, Hammer, Star, Shield, Activity, Calendar, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, createMyProfile, getWorldMemories } from '../services/api';
import { MOCK_PLAYER_PROFILE } from '../data/mockProfileData';

export function Profile() {
  const { currentUser } = useAuth();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!currentUser) return;
      try {
        setLoading(true);
        let profileRes = await getMyProfile();
        
        if (!profileRes) {
          // Initialize if it doesn't exist
          profileRes = await createMyProfile(currentUser.displayName || 'Initiate');
        }

        if (profileRes && profileRes.data) {
          setPlayer(profileRes.data);
        } else {
          setError('Failed to load profile data.');
        }
      } catch (err: any) {
        console.error('Profile load error:', err);
        setError('GAMEWORLD data is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center pt-20">
        <div className="text-game-neon text-xl font-bold animate-pulse">Loading Legacy...</div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <Shield className="w-16 h-16 text-yellow-500 mb-4" />
        <div className="text-white text-xl font-bold">{error || 'Profile not found'}</div>
        <button onClick={() => window.location.reload()} className="text-game-neon hover:underline">Retry</button>
      </div>
    );
  }

  const displayName = player.username;
  const joinDate = new Date(player.createdAt).toLocaleDateString();
  const avatar = player.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}&backgroundColor=0a0a0a`;

  // Merge with mock arrays for the visual components that aren't fully modeled in the backend yet
  // This preserves the UI while fulfilling the backend data requirements for the player
  const archetypesMap = player.archetypes || MOCK_PLAYER_PROFILE.archetypes;
  
  // Convert Map/Object to the expected format if needed
  const archetypes = {
    explorer: archetypesMap.Explorer || 10,
    builder: archetypesMap.Builder || 10,
    strategist: archetypesMap.Strategist || 10,
    hunter: archetypesMap.Hunter || 10,
    creator: archetypesMap.Creator || 10,
    guardian: archetypesMap.Guardian || 10,
  };

  const legacyStats = player.legacyStats || {
    worldsDiscovered: 0,
    worldsInfluenced: 0,
    eventsParticipated: 0,
    creations: 0,
    discoveries: 0,
    communityImpactScore: 0,
  };

  // We keep mock impacts and timeline for the UI structure unless we fetch them
  const worldImpacts = MOCK_PLAYER_PROFILE.worldImpacts;
  const memorableMoments = MOCK_PLAYER_PROFILE.memorableMoments;
  const timeline = MOCK_PLAYER_PROFILE.timeline;

  return (
    <div className="w-full pb-32 pt-8">
      {/* 1. IDENTITY HEADER */}
      <section className="px-4 mb-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6 border-b border-game-border/50 pb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-game-border bg-game-dark overflow-hidden shadow-[0_0_30px_rgba(138,43,226,0.3)] relative"
          >
            <div className="absolute inset-0 bg-hero-glow opacity-30 animate-pulse pointer-events-none" />
            <img src={avatar} alt={displayName} className="w-full h-full object-cover z-10 relative drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </motion.div>
          
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl md:text-5xl font-display font-black text-white text-glow mb-2">{displayName}</h1>
            <p className="text-xl text-game-neon font-bold tracking-widest uppercase mb-3 flex items-center justify-center md:justify-start gap-2">
              <Award className="w-5 h-5" /> {player.title || 'Initiate'}
            </p>
            <p className="text-gray-500 text-sm flex items-center justify-center md:justify-start gap-1">
              <Calendar className="w-4 h-4" /> Initiated {joinDate}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 space-y-16">
        
        {/* 2. LEGACY STATS */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Universe Footprint
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatBlock label="Discovered" value={legacyStats.worldsDiscovered || 0} icon={<Globe2 />} />
            <StatBlock label="Influenced" value={legacyStats.worldsInfluenced || 0} icon={<Zap />} />
            <StatBlock label="Events" value={legacyStats.eventsParticipated || 0} icon={<Crosshair />} />
            <StatBlock label="Creations" value={legacyStats.creations || 0} icon={<Hammer />} />
            <StatBlock label="Discoveries" value={legacyStats.discoveries || 0} icon={<Star />} />
            <StatBlock label="Impact Score" value={(legacyStats.communityImpact || 0).toLocaleString()} icon={<Shield />} highlight />
          </div>
        </section>

        {/* 3. EVOLUTION & IMPACT (Split View) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 md:p-8 flex flex-col bg-game-dark/80 backdrop-blur border-game-border/50">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Player Evolution</h2>
            <p className="text-gray-400 text-sm mb-8">Behavioral archetype progression based on historical actions.</p>
            <div className="flex-grow flex items-center justify-center">
              <ArchetypeRadar traits={archetypes} />
            </div>
          </Card>
          
          <Card className="p-6 md:p-8 flex flex-col bg-game-dark/80 backdrop-blur border-game-border/50">
            <h2 className="text-2xl font-display font-bold text-white mb-2">World Impact</h2>
            <p className="text-gray-400 text-sm mb-8">Magnitude of influence across different regions of GAMEWORLD.</p>
            <div className="flex-grow flex items-center justify-center">
              <WorldImpactChart impacts={worldImpacts} />
            </div>
          </Card>
        </section>

        {/* 4. MEMORABLE MOMENTS */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-6">Memorable Moments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memorableMoments.map((mm) => (
              <div key={mm.id} className="relative p-6 glass-panel border border-game-neon/30 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-game-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 w-1 h-full bg-game-neon" />
                <span className="text-xs font-bold text-game-neon mb-2 block">{mm.date}</span>
                <h3 className="text-xl font-bold text-white mb-2">{mm.title}</h3>
                <p className="text-gray-400 text-sm">{mm.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. LEGACY TIMELINE */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-6">Legacy Timeline</h2>
          <div className="bg-game-panel rounded-xl border border-game-border p-6 md:p-8">
            <div className="relative border-l border-game-border/50 ml-3 space-y-8 pb-4">
              {timeline.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-6"
                >
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-game-purple shadow-[0_0_8px_rgba(138,43,226,0.8)]" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-gray-500">{item.date}</span>
                    <span className="text-xs uppercase tracking-wider text-game-neon bg-game-neon/10 px-2 py-0.5 rounded">{item.world}</span>
                  </div>
                  <p className="text-gray-200 font-semibold">{item.action}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// Subcomponent for stats
function StatBlock({ label, value, icon, highlight = false }: { label: string, value: number | string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-game-purple/10 border-game-purple/30' : 'bg-game-panel border-game-border'} flex flex-col gap-2`}>
      <div className={`w-5 h-5 ${highlight ? 'text-game-purple' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <div className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-gray-200'}`}>{value}</div>
        <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">{label}</div>
      </div>
    </div>
  );
}
