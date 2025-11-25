import React, { useState } from 'react';
import { Settings, Bell, Shield, Save, CheckCircle } from 'lucide-react';
import { GlassCard } from '../components/UIComponents';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
    const [config, setConfig] = useState({
        emailAlerts: true,
        webhooks: false,
        maxConnections: 100,
        banDuration: 60
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // Simulate API call
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Settings className="text-white" />
                        SYSTEM CONFIGURATION
                    </h2>
                    <p className="text-muted">Manage honeypot parameters and notification preferences</p>
                </div>
            </div>

            <GlassCard className="p-8 space-y-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                        <Bell size={20} className="text-primary" />
                        Notifications
                    </h3>
                    <div className="grid gap-4">
                        <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                            <div>
                                <div className="font-bold text-white">Email Alerts</div>
                                <div className="text-sm text-muted">Receive digests of high-severity threats</div>
                            </div>
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-primary"
                                checked={config.emailAlerts}
                                onChange={(e) => setConfig({ ...config, emailAlerts: e.target.checked })}
                            />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                            <div>
                                <div className="font-bold text-white">Real-time Webhooks</div>
                                <div className="text-sm text-muted">Forward events to external SIEM</div>
                            </div>
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-primary"
                                checked={config.webhooks}
                                onChange={(e) => setConfig({ ...config, webhooks: e.target.checked })}
                            />
                        </label>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                        <Shield size={20} className="text-primary" />
                        Security Thresholds
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted">Max Connections per IP</label>
                            <input
                                type="number"
                                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                                value={config.maxConnections}
                                onChange={(e) => setConfig({ ...config, maxConnections: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted">Ban Duration (minutes)</label>
                            <input
                                type="number"
                                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                                value={config.banDuration}
                                onChange={(e) => setConfig({ ...config, banDuration: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-95"
                    >
                        {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                        {saved ? 'Changes Saved' : 'Save Changes'}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

export default SettingsPage;
