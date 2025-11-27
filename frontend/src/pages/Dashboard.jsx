import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ShieldAlert, Activity, Server, Globe, Zap, Shield, Wifi, Clock } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { GlassCard, AnimatedStat, PulseBadge } from '../components/UIComponents';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { attacks, peers, startTime } = useSocket();
    const [uptime, setUptime] = useState('00:00:00');

    // Uptime timer
    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - startTime;

            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            setUptime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    // Generate chart data from attacks
    const chartData = useMemo(() => {
        const now = new Date();
        const hours = Array.from({ length: 24 }, (_, i) => {
            const hour = new Date(now);
            hour.setHours(now.getHours() - (23 - i), 0, 0, 0);
            return {
                name: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                attacks: 0,
                timestamp: hour.getTime()
            };
        });

        attacks.forEach(attack => {
            const attackTime = new Date(attack.timestamp).getTime();
            const bucket = hours.find(h => {
                const nextHour = h.timestamp + 3600000;
                return attackTime >= h.timestamp && attackTime < nextHour;
            });
            if (bucket) bucket.attacks++;
        });

        return hours;
    }, [attacks]);

    const stats = useMemo(() => {
        const highSeverity = attacks.filter(a => a.severity === 'High').length;
        const testMessages = attacks.filter(a => a.payload.includes('heartbeat')).length;
        return {
            totalMessages: attacks.length,
            highSeverity: highSeverity,
            testMessages: testMessages,
            realAttacks: attacks.length - testMessages,
            peersCount: Object.keys(peers).length
        };
    }, [attacks, peers]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">COMMAND CENTER</h2>
                    <p className="text-muted">Real-time Threat Intelligence & Mesh Monitoring</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                        <Clock size={16} className="text-blue-400" />
                        <span className="text-blue-100 font-mono font-bold">{uptime}</span>
                    </div>
                    <PulseBadge status="online" text="SYSTEM ACTIVE" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedStat
                    icon={<ShieldAlert />}
                    label="Total Interceptions"
                    value={stats.totalMessages}
                    trend="+12%"
                    color="blue"
                />
                <AnimatedStat
                    icon={<Zap />}
                    label="Critical Threats"
                    value={stats.highSeverity}
                    trend="+5%"
                    color="red"
                />
                <AnimatedStat
                    icon={<Server />}
                    label="System Heartbeats"
                    value={stats.testMessages}
                    color="indigo"
                />
                <AnimatedStat
                    icon={<Globe />}
                    label="Active Nodes"
                    value={stats.peersCount}
                    color="green"
                />
            </div>

            {/* Main Chart */}
            <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="text-blue-500" />
                            Traffic Analysis
                        </h3>
                    </div>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                            <Area type="monotone" dataKey="attacks" stroke="#3b82f6" strokeWidth={3} fill="url(#colorAttacks)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* High Priority Threats */}
                <GlassCard className="p-0 border-red-500/20">
                    <div className="p-6 border-b border-white/5 bg-red-500/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="text-red-500" />
                            Active Threats
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <AnimatePresence>
                            {attacks.filter(a => a.severity === 'High').slice(0, 5).map((attack, i) => (
                                <motion.div
                                    key={attack.id || i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center justify-between p-4 bg-red-500/10 rounded-2xl border border-red-500/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-red-500/20 rounded-xl text-red-500">
                                            <ShieldAlert size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-red-200">{attack.topic}</div>
                                            <div className="text-xs text-red-400/80 font-mono mt-1">{attack.payload.substring(0, 40)}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                                        {new Date(attack.timestamp).toLocaleTimeString()}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {attacks.filter(a => a.severity === 'High').length === 0 && (
                            <div className="text-center py-12 text-muted">
                                <Shield size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No active threats detected</p>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Live Traffic */}
                <GlassCard className="p-0">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Wifi className="text-blue-500" />
                            Live Traffic
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <AnimatePresence>
                            {attacks.filter(a => a.severity !== 'High').slice(0, 5).map((attack, i) => (
                                <motion.div
                                    key={attack.id || i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${attack.payload.includes('heartbeat') ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>
                                        <div>
                                            <div className="font-semibold text-white">{attack.topic}</div>
                                            <div className="text-xs text-muted font-mono mt-1">{attack.payload.substring(0, 40)}...</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted font-medium">
                                        {new Date(attack.timestamp).toLocaleTimeString()}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Dashboard;
