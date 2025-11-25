import React, { useState } from 'react';
import { Search, Trash2, AlertTriangle, Info } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { GlassCard } from '../components/UIComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimestamp } from '../utils/dateUtils';

const AttackLogs = () => {
    const { attacks } = useSocket();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAttacks = attacks.filter(attack =>
        attack.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attack.payload.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        ACTIVITY LOGS
                    </h2>
                    <p className="text-sm text-muted mt-1">Comprehensive audit trail of all system events</p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="bg-surface/50 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors" title="Clear Logs">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Timestamp</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Severity</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Topic</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Payload</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Source IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredAttacks.map((attack, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="p-4 text-sm text-muted font-mono whitespace-nowrap">
                                            {formatTimestamp(attack.timestamp)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${attack.severity === 'High'
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {attack.severity === 'High' ? <AlertTriangle size={12} /> : <Info size={12} />}
                                                {attack.severity}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-white font-medium">{attack.topic}</td>
                                        <td className="p-4 text-sm text-muted font-mono max-w-md truncate group-hover:whitespace-normal group-hover:break-all transition-all">
                                            {attack.payload}
                                        </td>
                                        <td className="p-4 text-sm text-muted font-mono">
                                            {attack.ip || 'Unknown'}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {filteredAttacks.length === 0 && (
                    <div className="p-12 text-center text-muted">
                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No logs found matching your criteria</p>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default AttackLogs;
