import React from 'react';
import { GlassCard } from '../components/UIComponents';
import { Share2 } from 'lucide-react';

const NetworkMap = () => {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Share2 className="text-indigo-500" />
                        TOPOLOGY MAP
                    </h2>
                    <p className="text-muted">Visual representation of the honeypot mesh</p>
                </div>
            </div>

            <GlassCard className="flex-1 flex items-center justify-center min-h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50"></div>

                <div className="text-center relative z-10">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                        <Share2 size={64} className="text-indigo-500 mb-6 relative z-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Visualization Engine Loading</h3>
                    <p className="text-muted max-w-md mx-auto">
                        Constructing 3D force-directed graph of active nodes and attack vectors...
                    </p>
                </div>

                {/* Decorative grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </GlassCard>
        </div>
    );
};

export default NetworkMap;
