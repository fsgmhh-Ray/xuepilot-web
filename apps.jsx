import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Globe, BookOpen, Gamepad2, LayoutDashboard, 
  Plus, X, Save, Trash2, CheckCircle2, Circle, Users, 
  Orbit, Cpu, ShieldAlert, KeyRound, Check,
  Languages, BookType, ExternalLink, Lightbulb, TrendingUp,
  Compass, Eye, Wand2, ScrollText, Settings2, LineChart, Lock,
  MessageSquare, Sparkles, History, Swords, Target, Crosshair
} from 'lucide-react';

// ==========================================
// 1. 全局设计系统 (Simple & Clean)
// ==========================================
const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.6); }
        .glass-panel { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .glass-input { background: rgba(15,23,42,0.5); border: 1px solid rgba(71,85,105,0.5); color: #e2e8f0; transition: all 0.2s; }
        .glass-input:focus { border-color: #38bdf8; outline: none; background: rgba(15,23,42,0.8); box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
        .phi-gradient { background: radial-gradient(circle at top right, rgba(56,189,248,0.05), transparent), linear-gradient(135deg, #0f172a 0%, #020617 100%); }
        
        .sun-core { background: radial-gradient(circle at 30% 30%, #fff 0%, #fbbf24 20%, #ea580c 50%, #7c2d12 100%); box-shadow: 0 0 60px rgba(234, 88, 12, 0.6), 0 0 120px rgba(251, 191, 36, 0.3), inset -10px -10px 20px rgba(0,0,0,0.5); animation: sunPulse 4s infinite ease-in-out; }
        @keyframes sunPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .planet-locked { filter: grayscale(1) opacity(0.4); cursor: not-allowed; }

        .radar-scan { border-radius: 50%; border: 1px solid rgba(16, 185, 129, 0.2); animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
    `}} />
);

// ==========================================
// 2. 原生全息弹窗引擎
// ==========================================
export const Swal = {
    fire: (options) => new Promise((resolve) => {
        if (options.toast) {
            window.dispatchEvent(new CustomEvent('XP_TOAST', { detail: options }));
            resolve({ isConfirmed: true });
        } else {
            window.dispatchEvent(new CustomEvent('XP_DIALOG', { detail: { ...options, resolve } }));
        }
    })
};

const GlobalOverlays = () => {
    const [dialog, setDialog] = useState(null);
    const [toast, setToast] = useState(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const onDialog = (e) => { setDialog(e.detail); setInputValue(''); };
        const onToast = (e) => { setToast(e.detail); setTimeout(() => setToast(null), e.detail.timer || 2000); };
        window.addEventListener('XP_DIALOG', onDialog); window.addEventListener('XP_TOAST', onToast);
        return () => { window.removeEventListener('XP_DIALOG', onDialog); window.removeEventListener('XP_TOAST', onToast); }
    }, []);

    const handleConfirm = () => { if (dialog?.resolve) dialog.resolve({ isConfirmed: true, value: inputValue }); setDialog(null); };
    const handleCancel = () => { if (dialog?.resolve) dialog.resolve({ isConfirmed: false }); setDialog(null); };

    return (
        <>
            {toast && (
                <div className="fixed top-6 right-6 z-[200] bg-slate-800 border border-slate-600 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce text-white font-bold">
                    {toast.icon === 'success' && <CheckCircle2 className="text-emerald-500" size={20}/>}
                    {toast.title}
                </div>
            )}
            {dialog && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full flex flex-col items-center text-center">
                        {dialog.icon === 'error' && <ShieldAlert className="text-rose-500 mb-4" size={56} />}
                        {dialog.icon === 'success' && <CheckCircle2 className="text-emerald-500 mb-4" size={56} />}
                        <h2 className="text-xl font-black text-white mb-2">{dialog.title}</h2>
                        {dialog.html ? <div dangerouslySetInnerHTML={{ __html: dialog.html }} className="mb-4" /> : <p className="text-slate-400 text-sm mb-6">{dialog.text}</p>}
                        {dialog.input === 'password' && (
                            <input type="password" maxLength={4} value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={dialog.inputPlaceholder || "请输入..."} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-center text-3xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-blue-500 mb-6" autoFocus />
                        )}
                        <div className="flex gap-3 w-full mt-2">
                            {dialog.showCancelButton && <button onClick={handleCancel} className="flex-1 py-3 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition">取消</button>}
                            <button onClick={handleConfirm} className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg">{dialog.confirmButtonText || '确定'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ==========================================
// 3. 身份验证逻辑 (家长守卫)
// ==========================================
const useAuth = () => {
    const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('xp_unlocked') === 'true');
    const verify = async (onSuccess) => {
        if (isUnlocked) { onSuccess(); return; }
        const savedPin = localStorage.getItem('xp_parent_pin') || '0000';
        const { value: pin } = await Swal.fire({ title: '进入家控中枢', html: '<div class="text-sm text-slate-400 mb-4 font-bold">请验证家长管理密码</div>', input: 'password', inputPlaceholder: '请输入 4 位数字密码', confirmButtonText: '验证并进入', showCancelButton: true });
        if (pin === savedPin) { sessionStorage.setItem('xp_unlocked', 'true'); setIsUnlocked(true); onSuccess(); } 
        else if (pin) { Swal.fire({ title: '密码错误', text: '验证失败，请重试。', icon: 'error' }); }
    };
    return { isUnlocked, verify };
};

// ==========================================
// 4. 全局导航侧边栏
// ==========================================
const Sidebar = ({ currentRoute, navigate, auth }) => {
    const handleNav = (route, isProtected = false) => {
        if (isProtected) auth.verify(() => navigate(route));
        else navigate(route);
    };

    const NavItem = ({ id, icon: Icon, label, protected: isProt, activeClass }) => (
        <button onClick={() => handleNav(id, isProt)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all mb-1 ${currentRoute === id ? activeClass : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <Icon size={18} className={currentRoute === id ? 'text-current' : 'text-slate-500'} /> 
            <span className="text-sm font-bold">{label}</span>
            {isProt && <KeyRound size={12} className="ml-auto opacity-30" />}
        </button>
    );

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-30 relative shadow-xl">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                <h1 className="text-xl font-black text-white tracking-widest flex items-center gap-2"><Rocket className="text-blue-500" size={22} /> XUEPILOT</h1>
            </div>
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scroll">
                <div>
                    <div className="text-[10px] text-slate-600 font-black px-2 uppercase tracking-widest mb-3">家长管理</div>
                    <NavItem id="dashboard" icon={LayoutDashboard} label="家控后台" protected activeClass="bg-amber-600/20 text-amber-400 border border-amber-500/30" />
                </div>
                <div>
                    <div className="text-[10px] text-slate-600 font-black px-2 uppercase tracking-widest mb-3">孩子探索</div>
                    <NavItem id="classroom" icon={Globe} label="3D 知识星球" activeClass="bg-blue-600/20 text-blue-400 border border-blue-500/30" />
                    <NavItem id="reader" icon={BookOpen} label="全息智库" activeClass="bg-purple-600/20 text-purple-400 border border-purple-500/30" />
                    <NavItem id="simulator" icon={Gamepad2} label="危机救援演习" activeClass="text-rose-400 bg-rose-900/10" />
                </div>
                <div>
                    <div className="text-[10px] text-slate-600 font-black px-2 uppercase tracking-widest mb-3">专项舱体</div>
                    <NavItem id="english" icon={Languages} label="英文魔法书" activeClass="text-indigo-400 bg-indigo-900/20" />
                    <NavItem id="chinese" icon={BookType} label="大语文时光机" activeClass="text-orange-400 bg-orange-900/20" />
                </div>
            </nav>
        </aside>
    );
};

// ==========================================
// 5. 3D 知识星球 (Classroom)
// ==========================================
const ClassroomView = ({ navigate }) => {
    const [galaxies, setGalaxies] = useState([]);
    const [activeGalaxyId, setActiveGalaxyId] = useState(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isPro, setIsPro] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        setIsPro(localStorage.getItem('xp_is_pro') === 'true');
        const saved = localStorage.getItem('xp_galaxies');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const deployed = parsed.filter(g => g.isDeployed !== false);
                setGalaxies(deployed);
                if (deployed.length > 0) setActiveGalaxyId(deployed[0].id);
            } catch(e){}
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); let animationFrameId;
        let particles = []; let stars = [];
        const resize = () => { canvas.width = window.innerWidth - 256; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();
        const w = canvas.width, h = canvas.height;
        for(let i=0; i<Math.floor(w/12); i++) particles.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 });
        for(let i=0; i<Math.floor(w/6); i++) stars.push({ x: (Math.random()-0.5)*w, y: (Math.random()-0.5)*h, z: Math.random()*w });

        const draw = () => {
            ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#fff";
            stars.forEach(s => { 
                s.z -= 1.5; if(s.z <= 0) { s.z = w; s.x = (Math.random()-0.5)*w; s.y = (Math.random()-0.5)*h; } 
                let sx = (s.x / s.z) * (w / 2) + w / 2, sy = (s.y / s.z) * (h / 2) + h / 2, r = (1 - s.z / w) * 1.5; 
                if(sx>=0 && sx<=w && sy>=0 && sy<=h && r > 0) { ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI*2); ctx.fill(); } 
            });
            particles.forEach((p, i) => { 
                p.x += p.vx; p.y += p.vy; if(p.x<0 || p.x>w) p.vx*=-1; if(p.y<0 || p.y>h) p.vy*=-1; 
                particles.slice(i+1).forEach(p2 => { 
                    let d = Math.hypot(p.x-p2.x, p.y-p2.y); 
                    if(d<220) { ctx.beginPath(); ctx.strokeStyle=`rgba(59,130,246,${0.25*(1-d/220)})`; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x,p2.y); ctx.stroke(); } 
                }); 
            });
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
    }, [galaxies]); 

    const handlePointerDown = (e) => { setIsDragging(true); setDragStart({ x: (e.touches ? e.touches[0].clientX : e.clientX) - pan.x, y: (e.touches ? e.touches[0].clientY : e.clientY) - pan.y }); };
    const handlePointerMove = (e) => { if (!isDragging) return; setPan({ x: (e.touches ? e.touches[0].clientX : e.clientX) - dragStart.x, y: (e.touches ? e.touches[0].clientY : e.clientY) - dragStart.y }); };
    const handlePointerUp = () => setIsDragging(false);

    const getPlanetStyle = (i) => { 
        const c = [['#10b981', '#064e3b', '#10b98166'], ['#3b82f6', '#1e3a8a', '#3b82f666'], ['#8b5cf6', '#4c1d95', '#8b5cf666'], ['#f59e0b', '#78350f', '#f59e0b66']][i % 4]; 
        return { background: `radial-gradient(circle at 30% 30%, ${c[0]}, ${c[1]}, #000)`, boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.8), 0 0 25px ${c[2]}`, border: '1px solid rgba(255,255,255,0.1)' }; 
    };

    return (
        <div className="absolute inset-0 overflow-hidden bg-transparent z-10" onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={handlePointerUp} onMouseLeave={handlePointerUp} onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp}>
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0"></canvas>
            <div className={`absolute inset-0 min-h-full select-none z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                {galaxies.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center pointer-events-none">
                        <div className="text-7xl mb-6 opacity-20 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🌌</div>
                        <h2 className="text-2xl font-black text-slate-400 tracking-widest mb-3">星空轨道为空</h2>
                        <p className="text-slate-500 text-sm">请联系家长在【家控后台】中排课。</p>
                    </div>
                ) : (
                    galaxies.map(g => {
                        const isActive = g.id === activeGalaxyId;
                        const style = isActive ? { left: '50%', top: '50%', transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(1)`, zIndex: 20, opacity: 1 } : { left: `${g.bgX}%`, top: `${g.bgY}%`, transform: 'translate(-50%, -50%) scale(0.12)', zIndex: 10, opacity: 0.6, cursor: 'pointer', pointerEvents: 'auto' };
                        return (
                            <div key={g.id} className="absolute flex items-center justify-center w-0 h-0 transition-transform ease-[cubic-bezier(0.25,1,0.5,1)]" style={style} onClick={() => !isActive && setActiveGalaxyId(g.id)}>
                                <div className="absolute z-30 flex flex-col items-center pointer-events-auto">
                                    <div className="sun-core flex flex-col items-center justify-center rounded-full text-center cursor-pointer border-none" style={{ width: isActive?'160px':'250px', height: isActive?'160px':'250px' }} onClick={() => isActive && setActiveGalaxyId(null)}>
                                        <div className={`drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] ${isActive?'text-5xl mb-1':'text-8xl'}`}>🔮</div>
                                        {isActive && <div className="text-[10px] font-black text-amber-200 uppercase mt-2">{g.title}</div>}
                                    </div>
                                </div>
                                {isActive && g.subjects && (
                                    <div className="absolute pointer-events-none" style={{ left: 0, top: 0 }}>
                                        {g.subjects.map((s, i) => {
                                            const isFree = i === 0; 
                                            return (
                                                <div key={i} className="absolute flex flex-col items-center z-20 cursor-pointer pointer-events-auto group" style={{ left: Math.cos(s.angle)*s.radius, top: Math.sin(s.angle)*s.radius, transform: 'translate(-50%, -50%)' }} onClick={(e) => { e.stopPropagation(); navigate('reader'); }}>
                                                    {isFree || isPro ? <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.5)] z-50">OPEN</div> : <div className="absolute -top-3 -right-3"><Lock size={20} className="text-rose-500 fill-rose-500"/></div>}
                                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-transform group-hover:scale-110 shadow-2xl ${isFree || isPro ? '' : 'planet-locked'}`} style={getPlanetStyle(i)}>{s.icon}</div>
                                                    <span className="mt-4 text-[11px] font-bold text-cyan-100 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-cyan-500/30 group-hover:border-cyan-400 transition whitespace-nowrap">{s.title}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// ==========================================
// 6. 新增舱体: 英文魔法书 (English)
// ==========================================
const EnglishView = () => {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#02040a] relative overflow-hidden">
            <header className="h-16 shrink-0 border-b border-indigo-900/30 px-8 flex items-center justify-between bg-indigo-950/20 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg"><Languages className="text-indigo-400" size={20} /></div>
                    <h2 className="text-xl font-black text-indigo-100 tracking-wide">英文魔法书</h2>
                </div>
                <div className="text-xs text-indigo-400/50 font-mono tracking-widest uppercase">Native Logic Matrix</div>
            </header>

            <div className="flex-1 flex p-6 gap-6">
                {/* 左侧：源材料区 */}
                <div className="w-1/2 glass-panel border-indigo-900/30 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-indigo-200">库源文本 (Source Text)</h3>
                        <button className="text-xs px-4 py-1.5 bg-indigo-900/30 text-indigo-300 rounded-lg border border-indigo-800/50 hover:bg-indigo-600 hover:text-white transition">从全息智库载入</button>
                    </div>
                    <div className="flex-1 bg-slate-950/50 rounded-2xl p-6 border border-slate-800 text-slate-300 leading-loose text-lg font-serif">
                        <span className="bg-indigo-500/20 text-indigo-300 rounded px-1 cursor-pointer hover:bg-indigo-500/40 transition">Evolution</span> is the process of change in all forms of life over generations, and <span className="bg-rose-500/20 text-rose-300 rounded px-1 cursor-pointer hover:bg-rose-500/40 transition">evolutionary</span> biology is the study of how evolution occurs.
                    </div>
                </div>

                {/* 右侧：AI 结构解构区 */}
                <div className="w-1/2 flex flex-col gap-6">
                    <div className="flex-1 glass-panel border-indigo-900/30 rounded-3xl p-8">
                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles size={16}/> 语法与词根解构</h3>
                        <div className="space-y-4">
                            <div className="bg-slate-900 p-5 rounded-2xl border border-indigo-900/20">
                                <h4 className="text-xl font-bold text-white mb-2">Evol- / Volv-</h4>
                                <p className="text-sm text-slate-400 mb-4">词根意义：Roll, turn (滚动、旋转)。引申为“随着时间发展、演变”。</p>
                                <div className="flex gap-2">
                                    <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">Revolve (旋转)</span>
                                    <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">Involve (卷入)</span>
                                </div>
                            </div>
                            <div className="p-4 border border-dashed border-indigo-500/30 rounded-xl text-center text-indigo-300/50 text-sm">
                                选中左侧长难句，召唤 AI 划线分析主谓宾结构
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 7. 新增舱体: 大语文时光机 (Chinese)
// ==========================================
const ChineseView = () => {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#02040a] relative overflow-hidden">
            <header className="h-16 shrink-0 border-b border-orange-900/30 px-8 flex items-center justify-between bg-orange-950/20 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg"><BookType className="text-orange-400" size={20} /></div>
                    <h2 className="text-xl font-black text-orange-100 tracking-wide">大语文时光机</h2>
                </div>
                <div className="text-xs text-orange-400/50 font-mono tracking-widest uppercase">Historical Empathy Engine</div>
            </header>

            <div className="flex-1 flex items-center justify-center p-10 relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576766125468-b5dcaf12b48e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity pointer-events-none"></div>
                
                <div className="max-w-4xl w-full z-10 space-y-8">
                    <div className="text-center mb-12">
                        <History size={48} className="mx-auto text-orange-500/50 mb-4" />
                        <h2 className="text-3xl font-black text-orange-200 tracking-widest mb-2">时空语境模拟未启动</h2>
                        <p className="text-slate-400 text-sm">选择智库中的经典文学，AI 将重现作者所处的时代与情感逻辑。</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-3xl border-orange-900/30 hover:border-orange-500/50 transition cursor-pointer group text-center">
                            <div className="w-16 h-16 mx-auto bg-orange-900/30 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">📜</div>
                            <h3 className="text-lg font-bold text-slate-200 mb-1">导入古文典籍</h3>
                            <p className="text-xs text-slate-500">与李白、苏轼进行跨时空对话</p>
                        </div>
                        <div className="glass-panel p-6 rounded-3xl border-orange-900/30 hover:border-orange-500/50 transition cursor-pointer group text-center">
                            <div className="w-16 h-16 mx-auto bg-orange-900/30 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">🖋️</div>
                            <h3 className="text-lg font-bold text-slate-200 mb-1">现当代文学剖析</h3>
                            <p className="text-xs text-slate-500">还原时代背景与人文思潮</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 8. 新增舱体: 危机救援演习 (Simulator)
// ==========================================
const SimulatorView = () => {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#02040a] relative overflow-hidden">
            <header className="h-16 shrink-0 border-b border-rose-900/30 px-8 flex items-center justify-between bg-rose-950/20 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/20 rounded-lg"><Gamepad2 className="text-rose-400" size={20} /></div>
                    <h2 className="text-xl font-black text-rose-100 tracking-wide">危机救援演习</h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-rose-400/80 font-mono flex items-center gap-2"><div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div> 引擎在线</span>
                </div>
            </header>

            <div className="flex-1 p-8 flex gap-6">
                {/* 雷达与主视区 */}
                <div className="flex-1 glass-panel border-rose-900/30 rounded-3xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(225,29,72,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(225,29,72,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    
                    {/* 雷达扫描 UI */}
                    <div className="relative w-96 h-96 flex items-center justify-center">
                        <div className="absolute inset-0 radar-scan"></div>
                        <div className="absolute inset-4 radar-scan" style={{animationDelay: '1s'}}></div>
                        <div className="absolute inset-8 radar-scan" style={{animationDelay: '2s'}}></div>
                        <Crosshair size={48} className="text-rose-500/50" />
                        
                        {/* 虚拟目标 */}
                        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_#f59e0b] animate-pulse"></div>
                    </div>
                </div>

                {/* 侧边控制台 */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="glass-panel border-rose-900/30 rounded-3xl p-6">
                        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={16}/> 战术控制台</h3>
                        <div className="space-y-4">
                            <button className="w-full py-3 bg-rose-600/20 border border-rose-500/50 text-rose-300 rounded-xl text-sm font-bold hover:bg-rose-600 hover:text-white transition">启动自然灾害模拟</button>
                            <button className="w-full py-3 bg-slate-800/50 border border-slate-700 text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-700 transition">载入物理重力沙盒</button>
                        </div>
                    </div>
                    <div className="flex-1 glass-panel border-rose-900/30 rounded-3xl p-6 flex flex-col">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">事件日志</h3>
                        <div className="flex-1 bg-slate-950/50 rounded-xl p-4 text-[10px] font-mono text-emerald-400/70 space-y-2 overflow-y-auto">
                            <p>{'>'} 系统初始化就绪...</p>
                            <p>{'>'} 等待指挥官下发实战演算指令。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 9. 后台：家控管理面 (Dashboard)
// ==========================================
const DashboardView = () => {
    const [activeTab, setActiveTab] = useState('growth');
    const [isTesting, setIsTesting] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('xp_nova_api_key') || localStorage.getItem('xp_general_api_key') || '');
    const [apiProxy, setApiProxy] = useState(localStorage.getItem('xp_api_proxy') || '');
    const [apiModel, setApiModel] = useState(localStorage.getItem('xp_api_model') || 'gemini-2.5-flash-preview-09-2025');
    const [galaxies, setGalaxies] = useState([]);
    const [activeGalaxyId, setActiveGalaxyId] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('xp_galaxies');
        if (saved) {
            const parsed = JSON.parse(saved); setGalaxies(parsed);
            if (parsed.length > 0) setActiveGalaxyId(parsed[0].id);
        } else {
            const def = { id: 'g_1', title: '宇宙通识星系', isDeployed: true, bgX: 50, bgY: 50, subjects: [{title: '地球科学', icon: '🌍', angle: 0, radius: 130}] };
            setGalaxies([def]); setActiveGalaxyId(def.id); localStorage.setItem('xp_galaxies', JSON.stringify([def]));
        }
    }, []);

    const saveApiConfig = () => {
        localStorage.setItem('xp_nova_api_key', apiKey.trim());
        localStorage.setItem('xp_api_proxy', apiProxy.trim());
        localStorage.setItem('xp_api_model', apiModel.trim());
        Swal.fire({ toast: true, title: 'API 设置已保存', icon: 'success' });
    };

    const activeGalaxy = galaxies.find(g => g.id === activeGalaxyId);
    const updateGalaxies = (newGalaxies) => { setGalaxies(newGalaxies); localStorage.setItem('xp_galaxies', JSON.stringify(newGalaxies)); };
    const addGalaxy = () => {
        const newId = 'g_' + Date.now();
        updateGalaxies([...galaxies, { id: newId, title: '新建星系', isDeployed: false, bgX: 50, bgY: 50, subjects: [] }]);
        setActiveGalaxyId(newId);
    };
    const updateActiveGalaxy = (updates) => updateGalaxies(galaxies.map(g => g.id === activeGalaxyId ? { ...g, ...updates } : g));

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#02040a]">
            <header className="h-16 shrink-0 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md z-10">
                <h2 className="text-xl font-black text-white flex items-center gap-3"><ShieldAlert className="text-amber-500" size={20} /> 后台管理</h2>
                <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-1">
                    <button onClick={() => setActiveTab('growth')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'growth' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}><LineChart size={14}/> 成长看板</button>
                    <button onClick={() => setActiveTab('mission')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'mission' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Orbit size={14}/> 星系排课</button>
                    <button onClick={() => setActiveTab('api')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'api' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Settings2 size={14}/> API 设置</button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scroll">
                <div className="max-w-5xl mx-auto h-full">
                    {activeTab === 'growth' && (
                        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-xl max-w-2xl mx-auto">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="text-5xl bg-slate-800 w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner">🧑‍🚀</div>
                                <div><h3 className="text-xl font-black text-white">乘员 Alpha</h3><span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">档案活跃中</span></div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2"><span>提问深度</span><span className="text-cyan-400">12 轮交互</span></div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full"><div className="h-full bg-cyan-500 rounded-full" style={{width: '75%'}}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2"><span>星球探索进度</span><span className="text-emerald-400">已攻克 3 颗</span></div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width: '65%'}}></div></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mission' && (
                        <div className="flex gap-6 h-full min-h-[400px]">
                            <div className="w-1/3 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col">
                                <div className="flex justify-between mb-4"><span className="text-sm font-bold text-slate-300">星系列表</span><button onClick={addGalaxy} className="text-blue-400 hover:text-blue-300"><Plus size={18}/></button></div>
                                <div className="space-y-2 flex-1 overflow-y-auto">
                                    {galaxies.map(g => (
                                        <div key={g.id} onClick={() => setActiveGalaxyId(g.id)} className={`p-3 rounded-xl cursor-pointer flex items-center justify-between text-sm font-bold ${activeGalaxyId === g.id ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {g.title} {g.isDeployed && <CheckCircle2 size={14} className="text-emerald-500"/>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                                {activeGalaxy ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                                            <input type="text" value={activeGalaxy.title} onChange={e => updateActiveGalaxy({title: e.target.value})} className="bg-transparent border-none text-xl font-bold text-white focus:outline-none" />
                                            <label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={activeGalaxy.isDeployed} onChange={e => updateActiveGalaxy({isDeployed: e.target.checked})}/> 发布到前台</label>
                                        </div>
                                        <div>
                                            <button onClick={() => updateActiveGalaxy({subjects: [...activeGalaxy.subjects, {title:'新星球', icon:'🪐', angle:0, radius:100}]})} className="text-sm text-blue-400 mb-4 flex items-center gap-1"><Plus size={14}/> 添加星球</button>
                                            <div className="space-y-2">
                                                {activeGalaxy.subjects.map((sub, i) => (
                                                    <div key={i} className="flex gap-2 items-center bg-slate-800 p-2 rounded-lg">
                                                        <input type="text" value={sub.icon} onChange={e=>{const n=[...activeGalaxy.subjects]; n[i].icon=e.target.value; updateActiveGalaxy({subjects: n})}} className="w-10 bg-slate-900 p-1 rounded text-center"/>
                                                        <input type="text" value={sub.title} onChange={e=>{const n=[...activeGalaxy.subjects]; n[i].title=e.target.value; updateActiveGalaxy({subjects: n})}} className="flex-1 bg-slate-900 p-1 rounded text-sm text-white"/>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : <div className="text-slate-500 text-center py-20">请选择星系</div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'api' && (
                        <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800">
                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2"><Settings2 size={20}/> API 设置</h3>
                            <p className="text-xs text-slate-500 mb-6">配置大模型接口。支持 Gemini 与兼容 OpenAI 格式的服务商。</p>
                            <div className="space-y-6">
                                <div><label className="block text-xs font-bold text-slate-500 mb-2">API Key</label><input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-..." className="w-full glass-input rounded-xl p-3 font-mono text-sm" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-bold text-slate-500 mb-2">代理地址 (可选)</label><input type="text" value={apiProxy} onChange={e=>setApiProxy(e.target.value)} placeholder="https://..." className="w-full glass-input rounded-xl p-3 text-sm font-mono" /></div>
                                    <div><label className="block text-xs font-bold text-slate-500 mb-2">模型名称</label><input type="text" value={apiModel} onChange={e=>setApiModel(e.target.value)} className="w-full glass-input rounded-xl p-3 text-sm font-mono text-amber-200" /></div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={saveApiConfig} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg">保存设置</button>
                                    <button onClick={() => { setIsTesting(true); setTimeout(() => { setIsTesting(false); Swal.fire({title:'测试成功', icon:'success'}); }, 1000); }} disabled={isTesting} className="px-6 py-3 bg-slate-800 text-emerald-400 rounded-xl font-bold hover:bg-slate-700">{isTesting ? '测试中...' : '测试连接'}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 10. 根应用入口
// ==========================================
export default function App() {
    const [currentRoute, setCurrentRoute] = useState('classroom');
    const auth = useAuth();

    return (
        <div className="flex h-screen w-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans phi-gradient">
            <GlobalStyles />
            <GlobalOverlays />
            <Sidebar currentRoute={currentRoute} navigate={setCurrentRoute} auth={auth} />
            
            <main className="flex-1 relative flex flex-col overflow-hidden border-l border-slate-800 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                {currentRoute === 'dashboard' && <DashboardView />}
                {currentRoute === 'classroom' && <ClassroomView navigate={setCurrentRoute} />}
                
                {/* 新架构组件注入 */}
                {currentRoute === 'english' && <EnglishView />}
                {currentRoute === 'chinese' && <ChineseView />}
                {currentRoute === 'simulator' && <SimulatorView />}
                
                {/* 占位保留，直到 ReaderView 逻辑整合 */}
                {currentRoute === 'reader' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <BookOpen size={64} className="mb-4 opacity-20" />
                        <p>全息智库 (Reader) 组件对接准备中...</p>
                    </div>
                )}
            </main>
        </div>
    );
}