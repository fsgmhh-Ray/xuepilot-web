import React, { useState, useEffect } from 'react';
import { 
  Database, Palette, ToggleLeft, FileText, Settings, 
  ShieldAlert, CheckCircle2, Server, Globe, Power, PaintBucket,
  Users, CreditCard, Mail, Download, Send
} from 'lucide-react';

// ==========================================
// 1. 全局设计系统 (上帝视角的暗黑极客风)
// ==========================================
const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.6); }
        .admin-glass { background: rgba(9, 9, 11, 0.8); backdrop-filter: blur(24px); border: 1px solid rgba(16, 185, 129, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .admin-input { background: rgba(0,0,0,0.5); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; transition: all 0.2s; font-family: monospace; }
        .admin-input:focus { border-color: #34d399; outline: none; background: rgba(0,0,0,0.8); box-shadow: inset 0 0 15px rgba(16, 185, 129, 0.2); }
        .hacker-grid { background-image: linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px); background-size: 40px 40px; }
    `}} />
);

// ==========================================
// 2. 原生全息弹窗引擎 (兼容版)
// ==========================================
export const AdminSwal = {
    fire: (options) => new Promise((resolve) => {
        if (options.toast) {
            window.dispatchEvent(new CustomEvent('ADMIN_TOAST', { detail: options }));
            resolve({ isConfirmed: true });
        } else {
            window.dispatchEvent(new CustomEvent('ADMIN_DIALOG', { detail: { ...options, resolve } }));
        }
    })
};

const AdminOverlays = () => {
    const [toast, setToast] = useState(null);
    useEffect(() => {
        const onToast = (e) => { setToast(e.detail); setTimeout(() => setToast(null), e.detail.timer || 2000); };
        window.addEventListener('ADMIN_TOAST', onToast);
        return () => window.removeEventListener('ADMIN_TOAST', onToast);
    }, []);

    return toast && (
        <div className="fixed top-6 right-6 z-[200] bg-black border border-emerald-500 px-6 py-3 rounded-md shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-3 text-emerald-400 font-mono text-sm uppercase tracking-widest">
            <CheckCircle2 size={16}/> {toast.title}
        </div>
    );
};

// ==========================================
// 3. 创世者身份验证 (God Mode Auth)
// ==========================================
const GodModeAuth = ({ onUnlocked }) => {
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState(false);

    const handleUnlock = (e) => {
        e.preventDefault();
        // 演示环境密码：admin (真实环境应由后端验证)
        if (pwd === 'admin') { onUnlocked(); } 
        else { setError(true); setPwd(''); setTimeout(() => setError(false), 2000); }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-black hacker-grid text-emerald-500 font-mono">
            <div className="admin-glass p-10 rounded-xl w-96 flex flex-col items-center text-center">
                <ShieldAlert size={64} className="mb-6 text-emerald-500/50" />
                <h1 className="text-2xl font-black uppercase tracking-[0.3em] mb-2">创世者矩阵</h1>
                <p className="text-xs text-emerald-500/50 mb-8">SYS_ADMIN_ACCESS_REQUIRED</p>
                <form onSubmit={handleUnlock} className="w-full relative">
                    <input 
                        type="password" value={pwd} onChange={e => setPwd(e.target.value)} 
                        autoFocus placeholder="ENTER MASTER KEY" 
                        className={`w-full bg-black border ${error ? 'border-rose-500 text-rose-500' : 'border-emerald-500/50 text-emerald-400'} p-4 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-emerald-400 transition-colors`}
                    />
                    <button type="submit" className="mt-6 w-full py-4 bg-emerald-900/30 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 font-bold uppercase tracking-widest transition">Initialize ↵</button>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// 4. 创世者总控面板 (Main Dashboard)
// ==========================================
const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('database');

    // --- 状态库 ---
    // 1. 数据库配置
    const [dbConfig, setDbConfig] = useState({ url: 'https://cyws...supabase.co', anonKey: 'eyJhbG...', serviceKey: '**************' });
    // 2. 主题引擎
    const [themeConfig, setThemeConfig] = useState({ primaryColor: '#3b82f6', borderRadius: '1rem', font: 'sans-serif' });
    // 3. 功能开关
    const [featureFlags, setFeatureFlags] = useState({ siteOnline: true, simulatorEnabled: false, writingEnabled: true });
    
    // 4. 用户与订阅资产 (Mock Data)
    const [usersList, setUsersList] = useState([
        { id: 'U-001', email: 'alpha.parent@matrix.com', joinDate: '2023-10-01', isPro: true, lastActive: '2小时前' },
        { id: 'U-002', email: 'beta.mom@nebula.net', joinDate: '2023-10-05', isPro: false, lastActive: '3天前' },
        { id: 'U-003', email: 'gamma.dad@stardust.io', joinDate: '2023-11-12', isPro: false, lastActive: '1周前' },
        { id: 'U-004', email: 'delta.family@void.com', joinDate: '2023-11-20', isPro: true, lastActive: '刚刚' },
    ]);
    // 5. 营销邮件引擎
    const [mailSubject, setMailSubject] = useState('');
    const [mailBody, setMailBody] = useState('');

    const saveChanges = () => {
        AdminSwal.fire({ toast: true, title: 'SYSTEM_UPDATED_SUCCESSFULLY' });
    };

    const toggleUserPro = (id) => {
        setUsersList(usersList.map(u => u.id === id ? { ...u, isPro: !u.isPro } : u));
        AdminSwal.fire({ toast: true, title: 'USER_AUTHORIZATION_UPDATED' });
    };

    const exportEmails = () => {
        const freeEmails = usersList.filter(u => !u.isPro).map(u => u.email).join('\n');
        AdminSwal.fire({ title: 'DATA_DUMP_COMPLETE', text: `成功导出 ${usersList.filter(u=>!u.isPro).length} 个非 PRO 乘员通讯录。\n\n${freeEmails}`, icon: 'success' });
    };

    const sendBroadcast = (e) => {
        e.preventDefault();
        if (!mailSubject || !mailBody) return AdminSwal.fire({ title: 'ACCESS_DENIED', text: '必须填充星际广播的标题与正文。', icon: 'error' });
        const targetCount = usersList.filter(u => !u.isPro).length;
        AdminSwal.fire({ title: 'BROADCAST_LAUNCHED', text: `全域唤醒广播已成功发射至 ${targetCount} 名非 PRO 乘员的终端。`, icon: 'success' });
        setMailSubject(''); setMailBody('');
    };

    const NavButton = ({ id, icon: Icon, label }) => (
        <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-4 px-6 py-4 transition-all border-l-2 ${activeTab === id ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-emerald-500/70 hover:bg-white/5'}`}>
            <Icon size={18} /> <span className="text-sm font-bold tracking-widest uppercase">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen w-screen bg-[#050505] text-slate-200 overflow-hidden font-sans hacker-grid">
            
            {/* 左侧控制台导航 */}
            <aside className="w-72 bg-black/80 border-r border-emerald-900/30 flex flex-col shrink-0 z-20 backdrop-blur-xl">
                <div className="h-24 flex items-center px-8 border-b border-emerald-900/30">
                    <div>
                        <h1 className="text-xl font-black text-emerald-500 tracking-[0.3em] uppercase flex items-center gap-3"><Server size={24}/> Matrix</h1>
                        <span className="text-[10px] text-emerald-600/50 font-mono">SUPER_ADMIN_CONSOLE V3</span>
                    </div>
                </div>
                
                <nav className="flex-1 py-6 flex flex-col gap-2">
                    <NavButton id="database" icon={Database} label="云端数据库" />
                    <NavButton id="theme" icon={PaintBucket} label="全局 UI 主题" />
                    <NavButton id="flags" icon={ToggleLeft} label="核心路由开关" />
                    <NavButton id="cms" icon={FileText} label="全息智库 (CMS)" />
                    <div className="my-2 border-b border-emerald-900/30"></div>
                    <NavButton id="users" icon={Users} label="乘员与订阅资产" />
                    <NavButton id="mail" icon={Mail} label="星际广播与营销" />
                </nav>

                <div className="p-6 border-t border-emerald-900/30">
                    <button className="w-full py-3 flex items-center justify-center gap-2 text-rose-500/70 hover:text-rose-400 hover:bg-rose-900/10 rounded transition text-xs font-bold uppercase tracking-widest">
                        <Power size={14}/> 登出基建区
                    </button>
                </div>
            </aside>

            {/* 右侧主控区 */}
            <main className="flex-1 overflow-y-auto custom-scroll relative">
                {/* 顶栏 */}
                <header className="h-24 flex items-center justify-between px-12 border-b border-emerald-900/30 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase">
                        {activeTab === 'database' && 'DATABASE_CONNECTION'}
                        {activeTab === 'theme' && 'UI_THEME_ENGINE'}
                        {activeTab === 'flags' && 'ROUTING_FEATURE_FLAGS'}
                        {activeTab === 'cms' && 'DATA_VAULT_CMS'}
                        {activeTab === 'users' && 'USER_SUBSCRIPTION_ASSETS'}
                        {activeTab === 'mail' && 'MARKETING_BROADCAST_HUB'}
                    </h2>
                    <button onClick={saveChanges} className="px-8 py-3 bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded text-sm font-bold uppercase tracking-widest transition shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        Apply Changes
                    </button>
                </header>

                <div className="p-12 max-w-5xl mx-auto">
                    
                    {/* 面板 1: 数据库 */}
                    {activeTab === 'database' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                            <div className="admin-glass p-8 rounded-xl space-y-6">
                                <div className="flex items-center gap-3 mb-6 border-b border-emerald-900/30 pb-4">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse"></div>
                                    <h3 className="text-emerald-400 font-bold uppercase tracking-widest">Supabase 神经链路状态：Active</h3>
                                </div>
                                
                                <div>
                                    <label className="block text-xs text-slate-500 mb-2 font-mono uppercase">Supabase URL (Endpoint)</label>
                                    <input type="text" value={dbConfig.url} onChange={e=>setDbConfig({...dbConfig, url: e.target.value})} className="w-full admin-input p-4 rounded text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-2 font-mono uppercase">Public Anon Key (供前端伴读舱使用)</label>
                                    <input type="text" value={dbConfig.anonKey} onChange={e=>setDbConfig({...dbConfig, anonKey: e.target.value})} className="w-full admin-input p-4 rounded text-sm text-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-xs text-rose-500/70 mb-2 font-mono uppercase flex items-center gap-2"><ShieldAlert size={14}/> Service Role Key (仅供本后台与爬虫使用)</label>
                                    <input type="password" value={dbConfig.serviceKey} onChange={e=>setDbConfig({...dbConfig, serviceKey: e.target.value})} className="w-full admin-input p-4 rounded text-sm border-rose-900/30 focus:border-rose-500 text-rose-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 面板 2: 全局 UI 主题 */}
                    {activeTab === 'theme' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                            <div className="admin-glass p-8 rounded-xl space-y-8">
                                <h3 className="text-emerald-400 font-bold uppercase tracking-widest border-b border-emerald-900/30 pb-4">CSS 变量熔炉 (实时下发至前台)</h3>
                                
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-4 font-mono uppercase">全局主色调 (Primary Color)</label>
                                        <div className="flex gap-4">
                                            <input type="color" value={themeConfig.primaryColor} onChange={e=>setThemeConfig({...themeConfig, primaryColor: e.target.value})} className="h-12 w-24 bg-transparent border border-slate-700 rounded cursor-pointer" />
                                            <input type="text" value={themeConfig.primaryColor} onChange={e=>setThemeConfig({...themeConfig, primaryColor: e.target.value})} className="flex-1 admin-input p-3 rounded text-sm uppercase" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-4 font-mono uppercase">全局圆角风格 (Border Radius)</label>
                                        <select value={themeConfig.borderRadius} onChange={e=>setThemeConfig({...themeConfig, borderRadius: e.target.value})} className="w-full admin-input p-3 rounded text-sm appearance-none cursor-pointer">
                                            <option value="0px">极简直角 (0px)</option>
                                            <option value="0.5rem">温和微弧 (0.5rem)</option>
                                            <option value="1rem">现代圆润 (1rem)</option>
                                            <option value="9999px">完全圆角 (Pill)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-6 border border-dashed border-emerald-900/30 rounded flex items-center justify-center bg-black/50">
                                    <button style={{ backgroundColor: themeConfig.primaryColor, borderRadius: themeConfig.borderRadius }} className="px-8 py-4 text-white font-bold tracking-widest shadow-xl transition-all">
                                        前端按钮预览 (Preview)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 面板 3: 核心路由开关 */}
                    {activeTab === 'flags' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                            <div className="admin-glass p-8 rounded-xl">
                                <h3 className="text-emerald-400 font-bold uppercase tracking-widest border-b border-emerald-900/30 pb-4 mb-8">基础设施维护开关</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-black/50 border border-slate-800 rounded">
                                        <div>
                                            <div className="font-bold text-slate-200 text-lg flex items-center gap-2"><Globe size={18}/> 全站服务状态 (Site Online)</div>
                                            <div className="text-xs text-slate-500 mt-1 font-mono">若关闭，前台将进入“系统维护中”拦截页。</div>
                                        </div>
                                        <button onClick={()=>setFeatureFlags({...featureFlags, siteOnline: !featureFlags.siteOnline})} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${featureFlags.siteOnline ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${featureFlags.siteOnline ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-6 bg-black/50 border border-slate-800 rounded">
                                        <div>
                                            <div className="font-bold text-slate-200 text-lg">危机演习舱模块 (Simulator Engine)</div>
                                            <div className="text-xs text-slate-500 mt-1 font-mono">开启后，侧边栏将显示游戏化沙盒入口。</div>
                                        </div>
                                        <button onClick={()=>setFeatureFlags({...featureFlags, simulatorEnabled: !featureFlags.simulatorEnabled})} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${featureFlags.simulatorEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${featureFlags.simulatorEnabled ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 面板 4: CMS 占位 */}
                    {activeTab === 'cms' && (
                        <div className="admin-glass p-8 rounded-xl text-center py-32 animate-[fadeIn_0.3s_ease-out]">
                            <FileText size={64} className="mx-auto text-emerald-900 mb-6" />
                            <h3 className="text-2xl font-black text-slate-300 tracking-widest uppercase mb-2">全息智库编排器挂载中</h3>
                            <p className="text-slate-500 font-mono text-sm">系统正在将旧版的 cms.html 富文本引擎迁移至本基座...</p>
                        </div>
                    )}

                    {/* 面板 5: 乘员与订阅资产 */}
                    {activeTab === 'users' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                            <div className="admin-glass p-8 rounded-xl">
                                <h3 className="text-emerald-400 font-bold uppercase tracking-widest border-b border-emerald-900/30 pb-4 mb-6 flex items-center gap-2"><CreditCard size={18}/> 算力授权与财富罗盘</h3>
                                
                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="bg-black/50 border border-emerald-900/30 p-6 rounded-lg text-center">
                                        <div className="text-3xl font-black text-white mb-1">{usersList.length}</div>
                                        <div className="text-[10px] text-emerald-600 font-mono uppercase tracking-widest">全网总注册家庭</div>
                                    </div>
                                    <div className="bg-black/50 border border-emerald-900/30 p-6 rounded-lg text-center">
                                        <div className="text-3xl font-black text-emerald-400 mb-1">{usersList.filter(u=>u.isPro).length}</div>
                                        <div className="text-[10px] text-emerald-600 font-mono uppercase tracking-widest">PRO 算力授权家庭</div>
                                    </div>
                                    <div className="bg-black/50 border border-emerald-900/30 p-6 rounded-lg text-center">
                                        <div className="text-3xl font-black text-rose-500 mb-1">{usersList.filter(u=>!u.isPro).length}</div>
                                        <div className="text-[10px] text-emerald-600 font-mono uppercase tracking-widest">待转化/休眠池</div>
                                    </div>
                                </div>

                                <div className="bg-black/40 rounded border border-emerald-900/30 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-emerald-900/20 text-emerald-500 text-[10px] uppercase font-mono tracking-widest">
                                            <tr>
                                                <th className="p-4">UID</th>
                                                <th className="p-4">通信链路 (Email)</th>
                                                <th className="p-4">接入坐标 (Date)</th>
                                                <th className="p-4">近期活跃</th>
                                                <th className="p-4">授权评级 (Status)</th>
                                                <th className="p-4 text-right">神权干预 (Action)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-900/20 text-slate-300">
                                            {usersList.map(u => (
                                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-mono text-emerald-600 text-xs">{u.id}</td>
                                                    <td className="p-4">{u.email}</td>
                                                    <td className="p-4 text-xs text-slate-500">{u.joinDate}</td>
                                                    <td className="p-4 text-xs text-slate-500">{u.lastActive}</td>
                                                    <td className="p-4">
                                                        {u.isPro ? 
                                                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-2 py-1 rounded text-[10px] font-bold tracking-widest">PRO_AUTHORIZED</span> : 
                                                            <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded text-[10px] font-bold tracking-widest">FREE_TIER</span>
                                                        }
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => toggleUserPro(u.id)} className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition ${u.isPro ? 'border border-rose-900 text-rose-500 hover:bg-rose-900/30' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-600 hover:text-black'}`}>
                                                            {u.isPro ? 'REVOKE_PRO' : 'GRANT_PRO'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 面板 6: 星际广播与营销 */}
                    {activeTab === 'mail' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                            <div className="admin-glass p-8 rounded-xl flex gap-8">
                                <div className="w-1/3 border-r border-emerald-900/30 pr-8">
                                    <h3 className="text-emerald-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Download size={18}/> 目标雷达扫描</h3>
                                    <div className="bg-black/50 border border-emerald-900/30 rounded p-6 text-center mb-6">
                                        <div className="text-xs text-slate-500 font-mono mb-2">已锁定非 PRO 乘员</div>
                                        <div className="text-5xl font-black text-rose-500 filter drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">{usersList.filter(u=>!u.isPro).length}</div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-6 font-mono">
                                        此模块专门用于转化处于体验期的免费家长。您可以直接导出通讯录列表交由第三方服务商发送，或直接在此控制台发射唤醒广播。
                                    </p>
                                    <button onClick={exportEmails} className="w-full py-3 bg-slate-800 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 rounded font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2">
                                        <Download size={14}/> 导出通信矩阵 (CSV)
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-emerald-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Send size={18}/> 发射营销广播 (Marketing Broadcast)</h3>
                                    <form onSubmit={sendBroadcast} className="space-y-6">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-2 font-mono uppercase">广播代号 (Subject)</label>
                                            <input type="text" value={mailSubject} onChange={e=>setMailSubject(e.target.value)} placeholder="如：[限时] XuePilot V2 算力网关已开启，点击升级 PRO 获取顶级苏格拉底伴读体验" className="w-full admin-input p-4 rounded text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-2 font-mono uppercase">神经信号流 (Email Body - 支持 HTML)</label>
                                            <textarea value={mailBody} onChange={e=>setMailBody(e.target.value)} rows="8" placeholder="尊敬的指挥官，您孩子的系统舱已休眠数日。立即升级 PRO 算力权限，解锁英文魔法书与大语文时光机..." className="w-full admin-input p-4 rounded text-sm custom-scroll leading-relaxed"></textarea>
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-emerald-600/20 hover:bg-emerald-500 border border-emerald-500/50 text-emerald-400 hover:text-black rounded font-black text-sm uppercase tracking-[0.2em] transition shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                            确认发射 🚀
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

// ==========================================
// 5. 根入口
// ==========================================
export default function SuperAdminApp() {
    const [unlocked, setUnlocked] = useState(false);

    return (
        <>
            <GlobalStyles />
            <AdminOverlays />
            {!unlocked ? (
                <GodModeAuth onUnlocked={() => setUnlocked(true)} />
            ) : (
                <SuperAdminDashboard />
            )}
        </>
    );
}