import React from 'react';
import { Globe, Cpu, Wifi } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { GlassCard, PulseBadge } from '../components/UIComponents';
import { motion } from 'framer-motion';
import { formatTimeOnly } from '../utils/dateUtils';

const Peers = () => {
    const { peers } = useSocket();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Globe className="text-emerald-500" />
                        NETWORK NODES
                    </h2>
                    <p className="text-muted">Active mesh network participants</p>
                </div>
                <PulseBadge status="online" text={`${Object.keys(peers).length} NODES ONLINE`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(peers).map(([id, peer], index) => (
                    <motion.div
                        key={id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassCard className="p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Cpu size={96} />
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                                    <Wifi size={24} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                        ONLINE
                                    </span>
                                    <span className="text-[10px] text-muted mt-1 font-mono">
                                        Last seen: {formatTimeOnly(peer.timestamp)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-muted uppercase tracking-wider font-bold mb-1">Node ID</div>
                                    <div className="text-lg font-bold text-white font-mono">{peer.node_id || id}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted uppercase tracking-wider font-bold mb-1">IP Address</div>
                                    <div className="text-sm text-white font-mono bg-background/50 px-3 py-2 rounded-lg border border-white/5 inline-block">
                                        {peer.ip || 'Unknown'}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}

                {Object.keys(peers).length === 0 && (
                    <div className="col-span-full p-12 text-center text-muted border-2 border-dashed border-white/10 rounded-3xl">
                        <Globe size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No peers currently connected to the mesh</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Peers;
