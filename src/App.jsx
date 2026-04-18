import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Globe, BookOpen, Gamepad2, LayoutDashboard, 
  Plus, X, Save, Trash2, CheckCircle2, Circle, Users, 
  Orbit, Cpu, ShieldAlert, KeyRound, Check,
  Languages, BookType, ExternalLink, Lightbulb, TrendingUp,
  Compass, Eye, Wand2, ScrollText, Settings2, LineChart, Lock,
  MessageSquare, Sparkles, History, Swords, Target, Crosshair,
  Library, ChevronLeft, ChevronRight, Sun, Moon, HelpCircle,
  PenTool, BrainCircuit, Navigation, Info, Zap, Trash, PlayCircle
} from 'lucide-react';

// ==========================================
// 1. 全局设计系统 (物理法则层 - 还原 classroom.html & simulator.html)
// ==========================================
const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sunPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes sweep { 100% { left: 200%; } }
        
        .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.6); }
        
        .glass-panel { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.05); }
        .glass-input { background: rgba(15,23,42,0.5); border: 1px solid rgba(71,85,105,0.5); color: #e2e8f0; transition: all 0.2s; }
        .glass-input:focus { border-color: #38bdf8; outline: none; background: rgba(15,23,42,0.8); }
        .phi-gradient { background: radial-gradient(circle at top right, rgba(56,189,248,0.05), transparent), linear-gradient(135deg, #0f172a 0%, #020617 100%); }
        
        /* 还原：3D星系引力脉冲 */
        .sun-core { border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fff 0%, #fbbf24 20%, #ea580c 50%, #7c2d12 100%); box-shadow: 0 0 60px rgba(234, 88, 12, 0.6), 0 0 120px rgba(251, 191, 36, 0.3), inset -10px -10px 20px rgba(0,0,0,0.5); animation: sunPulse 4s infinite ease-in-out; }
        .planet-locked { filter: grayscale(1) opacity(0.4); cursor: not-allowed !important; }
        .radar-scan { border-radius: 50%; border: 1px solid rgba(16, 185, 129, 0.2); animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; }

        /* 还原：游戏舱视频层级 */
        .tech-panel { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.95) 100%); border-top: 2px solid #06b6d4; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%, 0 15px); }
        .quantum-btn { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(6, 182, 212, 0.4); clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
        
        .content-engine p { margin-bottom: 2em; text-indent: 2em; line-height: 1.8; text-align: justify; }
        .hacker-grid { background-image: linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px); background-size: 40px 40px; }
    `}} />
);

// ==========================================
// 2. 原生全息弹窗模拟 (修复定义顺序)
// ==========================================
export const SwalMock = {
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

    return (
        <>
            {toast && (
                <div className="fixed top-6 right-6 z-[300] bg-slate-800 border border-slate-600 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white font-bold animate-bounce">
                    {toast.icon === 'success' ? <CheckCircle2 className="text-emerald-500" size={20}/> : <ShieldAlert className="text-amber-500" size={20}/>}
                    {toast.title}
                </div>
            )}
            {dialog && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
                        <h2 className="text-xl font-black text-white mb-4 uppercase">{dialog.title}</h2>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{dialog.text}</p>
                        {dialog.input === 'password' && (
                            <input type="password" value={inputValue} onChange={e=>setInputValue(e.target.value)} className="w-full glass-input border border-slate-700 rounded-2xl p-4 text-center text-3xl font-mono tracking-[0.5em] text-white mb-6" autoFocus />
                        )}
                        <div className="flex gap-3 w-full">
                            {dialog.showCancelButton && <button onClick={()=>setDialog(null)} className="flex-1 py-4 rounded-2xl font-bold text-slate-300 bg-slate-800 transition">取消</button>}
                            <button onClick={handleConfirm} className="flex-1 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition">{dialog.confirmButtonText || '确定'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ==========================================
// 3. 身份验证钩子 (useAuth)
// ==========================================
const useAuth = () => {
    const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('xp_unlocked') === 'true');
    const verify = async (onSuccess) => {
        if (isUnlocked) { onSuccess(); return; }
        const savedPin = localStorage.getItem('xp_parent_pin') || '0000';
        const res = await SwalMock.fire({ title: '指挥授权', text: '请输入 4 位数字高阶密码', input: 'password', showCancelButton: true, confirmButtonText: '接入中枢' });
        if (res.isConfirmed && res.value === savedPin) { 
            sessionStorage.setItem('xp_unlocked', 'true'); setIsUnlocked(true); onSuccess(); 
        } else if (res.isConfirmed) { 
            SwalMock.fire({ title: '拒绝访问', text: '密钥校验错误。', icon: 'error' }); 
        }
    };
    return { isUnlocked, verify };
};

// ==========================================
// 4. 3D星系引擎 (ClassroomView - 全量物理复刻)
// ==========================================
const ClassroomView = ({ navigate }) => {
    const [galaxies, setGalaxies] = useState([]);
    const [activeGalaxyId, setActiveGalaxyId] = useState(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem('xp_galaxies');
        if (saved) {
            const parsed = JSON.parse(saved).filter(g => g.isDeployed !== false);
            setGalaxies(parsed);
            if (parsed.length > 0) setActiveGalaxyId(parsed[0].id);
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [], stars = [], animId;
        const resize = () => { canvas.width = window.innerWidth - 256; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();
        
        const w = canvas.width, h = canvas.height;
        // 🚀 还原 classroom.html 密度参数
        for(let i=0; i<Math.floor(w/12); i++) particles.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 });
        for(let i=0; i<Math.floor(w/6); i++) stars.push({ x: (Math.random()-0.5)*w, y: (Math.random()-0.5)*h, z: Math.random()*w });

        const draw = () => {
            ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#fff";
            // 繁星背景
            stars.forEach(s => { 
                s.z -= 1.5; if(s.z <= 0) { s.z = w; s.x = (Math.random()-0.5)*w; s.y = (Math.random()-0.5)*h; } 
                let sx = (s.x/s.z)*(w/2)+w/2, sy = (s.y/s.z)*(h/2)+h/2, r = (1-s.z/w)*1.5; 
                if(sx>=0 && sx<=w && sy>=0 && sy<=h) { ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI*2); ctx.fill(); } 
            });
            // 还原：鼠标感应连线逻辑
            particles.forEach((p, i) => { 
                p.x += p.vx; p.y += p.vy; if(p.x<0 || p.x>w) p.vx*=-1; if(p.y<0 || p.y>h) p.vy*=-1; 
                particles.slice(i+1).forEach(p2 => { 
                    let d = Math.hypot(p.x-p2.x, p.y-p2.y); 
                    if(d<220) { 
                        ctx.beginPath(); ctx.strokeStyle=`rgba(59,130,246,${0.25*(1-d/220)})`; 
                        ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); 
                    } 
                });
                // 还原：鼠标引力连线
                let dm = Math.hypot(p.x - mousePos.x, p.y - mousePos.y);
                if(dm < 250) {
                    ctx.beginPath(); ctx.strokeStyle=`rgba(34,211,238,${0.4*(1-dm/250)})`;
                    ctx.moveTo(p.x, p.y); ctx.lineTo(mousePos.x, mousePos.y); ctx.stroke();
                }
            });
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
    }, [galaxies, mousePos]);

    const getPlanetStyle = (i) => { 
        const c = [['#10b981', '#064e3b'], ['#3b82f6', '#1e3a8a'], ['#8b5cf6', '#4c1d95'], ['#f59e0b', '#78350f']][i % 4]; 
        return { background: `radial-gradient(circle at 30% 30%, ${c[0]}, ${c[1]}, #000)`, boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.8), 0 0 25px ${c[0]}44` }; 
    };

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#02040a] cursor-grab active:cursor-grabbing" 
             onMouseMove={e=>{
                 setMousePos({x: e.clientX - 256, y: e.clientY});
                 if(isDragging) setPan({x:e.clientX-dragStart.x, y:e.clientY-dragStart.y});
             }}
             onMouseDown={e=>{setIsDragging(true); setDragStart({x:e.clientX-pan.x, y:e.clientY-pan.y})}}
             onMouseUp={()=>setIsDragging(false)}>
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0"></canvas>
            <div className="absolute inset-0 z-10 select-none">
                {galaxies.map(g => {
                    const isActive = g.id === activeGalaxyId;
                    const style = isActive ? { left:'50%', top:'50%', transform:`translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))` } : { left:`${g.bgX}%`, top:`${g.bgY}%`, transform:'translate(-50%,-50%) scale(0.12)', opacity:0.6 };
                    return (
                        <div key={g.id} className="absolute flex items-center justify-center w-0 h-0 transition-all duration-700 ease-out" style={style}>
                            <div className="absolute z-30 cursor-pointer" onClick={()=>setActiveGalaxyId(isActive?null:g.id)}>
                                <div className="sun-core flex flex-col items-center justify-center" style={{width:isActive?'160px':'250px', height:isActive?'160px':'250px'}}>
                                    <span className={isActive?'text-5xl':'text-9xl'}>🔮</span>
                                    {isActive && <div className="text-[10px] font-black text-amber-200 uppercase mt-4 tracking-widest">{g.title}</div>}
                                </div>
                            </div>
                            {isActive && g.subjects?.map((s, i) => (
                                <div key={i} className="absolute flex flex-col items-center z-20 cursor-pointer group" style={{ left:Math.cos(s.angle)*s.radius, top:Math.sin(s.angle)*s.radius, transform:'translate(-50%, -50%)' }} onClick={()=>navigate('resources')}>
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-2xl transition group-hover:scale-110" style={getPlanetStyle(i)}>{s.icon}</div>
                                    <span className="mt-4 text-[11px] font-bold text-cyan-100 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-cyan-500/30 whitespace-nowrap">{s.title}</span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ==========================================
// 5. 危机救援演习 (SimulatorView - 找回视频简报)
// ==========================================
const SimulatorView = () => {
    const [mode, setMode] = useState('briefing'); // 'briefing' | 'simulation'
    
    return (
        <div className="flex-1 flex flex-col bg-[#02040a] relative overflow-hidden items-center justify-center animate-[fadeIn_0.5s]">
            <header className="absolute top-0 left-0 w-full h-16 border-b border-slate-800 px-8 flex items-center justify-between z-40 bg-slate-900/50 text-rose-400 font-black tracking-widest">
                <h2 className="flex items-center gap-3 uppercase font-mono"><Gamepad2/> Mission_Simulator_V2</h2>
                <div className="text-[10px] text-rose-500 font-mono flex items-center gap-2 animate-pulse uppercase">Engine_Active</div>
            </header>

            {mode === 'briefing' ? (
                <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center">
                    {/* 🚀 还原：全息任务简报视频大屏 */}
                    <div className="w-full aspect-video tech-panel rounded-[2rem] border border-rose-500/30 overflow-hidden relative shadow-[0_0_100px_rgba(225,29,72,0.2)] group">
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                            {/* 此处您可以替换为真实的 iframe 视频链接 */}
                            <iframe 
                                className="w-full h-full opacity-80"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&controls=0" 
                                frameBorder="0" 
                                allow="autoplay; encrypted-media" 
                                allowFullScreen
                            ></iframe>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
                        </div>
                        
                        <div className="absolute top-8 left-8 flex items-center gap-3">
                            <div className="w-3 h-3 bg-rose-600 rounded-full animate-ping"></div>
                            <span className="text-xs font-mono text-rose-500 font-bold uppercase tracking-widest">Incoming_Mission_Intel...</span>
                        </div>
                    </div>

                    <div className="mt-12 text-center max-w-2xl">
                        <h3 className="text-3xl font-black text-white tracking-[0.3em] uppercase mb-4">星舰战术任务简报</h3>
                        <p className="text-slate-400 text-sm leading-relaxed italic mb-10 font-medium">
                            “指挥官，欢迎来到战术模拟舱。这里的每一项演习都基于真实的物理法则与逻辑博弈。请仔细观察简报，分析即将到来的灾害链条。”
                        </p>
                        <button onClick={() => setMode('simulation')} className="px-12 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all active:scale-95">
                            开始策略演算 ➔
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="relative w-[450px] h-[450px] flex items-center justify-center">
                        <div className="absolute inset-0 radar-scan" />
                        <div className="absolute inset-20 radar-scan" style={{animationDelay:'1s'}} />
                        <div className="absolute inset-40 radar-scan" style={{animationDelay:'2s'}} />
                        <Crosshair size={80} className="text-rose-500/30" />
                        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_20px_#f59e0b] animate-ping" />
                    </div>
                    <div className="mt-12 p-8 glass-panel border-rose-500/20 rounded-[2.5rem] text-center max-w-lg">
                        <h3 className="text-xl font-black text-rose-400 mb-2 uppercase tracking-widest">实战模拟：灾害防御</h3>
                        <p className="text-slate-500 text-xs italic">“正在接入 2D Canvas 碰撞物理引擎，等待任务目标载入...”</p>
                    </div>
                    <button onClick={() => setMode('briefing')} className="mt-8 text-[10px] font-black text-slate-600 hover:text-rose-500 uppercase tracking-widest">返回任务简报</button>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 6. 其他舱体组件 (Writing, Language, Manual)
// ==========================================
const WritingView = () => (
    <div className="flex-1 flex overflow-hidden bg-[#050505] animate-[fadeIn_0.5s]">
        <div className="flex-1 flex flex-col border-r border-slate-800">
            <div className="h-16 border-b border-slate-800 flex items-center px-8 bg-slate-900/50 text-indigo-400 font-black tracking-widest uppercase">✍️ Neural_Writing_Core</div>
            <textarea className="flex-1 bg-transparent text-slate-200 p-12 text-xl leading-loose resize-none focus:outline-none custom-scroll placeholder-slate-800" placeholder="流淌您的思维信号..." />
        </div>
        <aside className="w-96 flex flex-col bg-slate-900/30 p-8">
            <div className="p-6 bg-cyan-900/20 border border-cyan-500/30 rounded-[2rem] text-sm text-slate-400 leading-relaxed italic">
                “指挥官，我拒绝直接为您生成文本。那种‘外包式大脑’会破坏您的逻辑肌群。请告诉我，您创作的母题中，最大的矛盾点在哪里？”
            </div>
        </aside>
    </div>
);

const LanguageView = () => {
    const [tab, setTab] = useState('en');
    return (
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
            <header className="h-24 border-b border-slate-800 flex items-center justify-between px-10 bg-slate-900/30">
                <h2 className="text-3xl font-black text-white">{tab==='en'?'🔤 English Matrix':'📜 大语文时光机'}</h2>
                <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl">
                    <button onClick={()=>setTab('cn')} className={`px-8 py-2 rounded-xl text-xs font-black transition ${tab==='cn'?'bg-rose-600 text-white shadow-xl':'text-slate-500 hover:text-slate-300'}`}>中文 (CN)</button>
                    <button onClick={()=>setTab('en')} className={`px-8 py-2 rounded-xl text-xs font-black transition ${tab==='en'?'bg-blue-600 text-white shadow-xl':'text-slate-500 hover:text-slate-300'}`}>英文 (EN)</button>
                </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-10">
                <div className={`max-w-4xl w-full p-16 text-center rounded-[4rem] border transition-all duration-1000 ${tab==='cn'?'bg-rose-950/10 border-rose-500/20 shadow-[0_0_80px_rgba(244,63,94,0.1)]':'bg-blue-950/10 border-blue-500/20 shadow-[0_0_80px_rgba(59,130,246,0.1)]'}`}>
                    <span className="text-9xl mb-10 block">{tab==='cn'?'🏺':'🏰'}</span>
                    <h3 className={`text-4xl font-black mb-8 tracking-widest ${tab==='cn'?'text-rose-400':'text-blue-400'}`}>{tab==='cn'?'时空共情力沙盒':'Structural Logic Core'}</h3>
                    <p className="text-slate-400 text-xl leading-relaxed">{tab==='cn'?'重构古代人文语境，在《离骚》的意象中与作者跨维度灵魂对话。':'不仅是学外语，更是重塑第二大脑的逻辑脉络，消除翻译心智损耗。'}</p>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 7. 全球智库与伴读 (Resources & Reader)
// ==========================================
const ResourcesView = ({ navigate }) => {
    const [portals, setPortals] = useState([]);
    const [textbooks, setTextbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0";

    useEffect(() => {
        const headers = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` };
        Promise.all([
            fetch(`https://cywslfalbedraeeggryj.supabase.co/rest/v1/edu_portals?select=*`, { headers }).then(r=>r.json()),
            fetch(`https://cywslfalbedraeeggryj.supabase.co/rest/v1/edu_textbooks?select=*`, { headers }).then(r=>r.json())
        ]).then(([p, t]) => { 
            setPortals(Array.isArray(p)?p:[]); setTextbooks(Array.isArray(t)?t:[]); setLoading(false); 
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex-1 flex items-center justify-center bg-[#02040a]"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="flex-1 overflow-y-auto p-10 custom-scroll bg-[#02040a] animate-[fadeIn_0.5s]">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-slate-800 pb-8"><h2 className="text-4xl font-black text-white tracking-widest uppercase">Global_Edu_Vault</h2></header>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">{portals.map(p => (
                    <div key={p.id} className="flip-card"><div className="flip-card-inner">
                        <div className="flip-card-front"><span className="text-5xl mb-4">{p.icon}</span><h4 className="font-black text-slate-200 text-sm uppercase">{p.title}</h4></div>
                        <div className="flip-card-back"><p className="text-[10px] line-clamp-4 px-4 text-center">{p.description}</p><a href={p.url} target="_blank" className="mt-4 px-6 py-2 bg-white text-blue-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">开启跃迁 ↗</a></div>
                    </div></div>
                ))}</div>
                <h3 className="text-2xl font-black mb-8 text-slate-200 uppercase tracking-widest">📚 教材阅读档案</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{textbooks.map(t => (
                    <div key={t.id} className="glass-panel p-8 rounded-[2.5rem] group hover:border-blue-500/50 transition relative overflow-hidden">
                        <span className="text-5xl mb-6 block drop-shadow-lg">{t.icon}</span>
                        <h4 className="text-lg font-black text-slate-100 mb-3">{t.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-6">{t.description || t.desc}</p>
                        <button onClick={()=>navigate('reader', {bookId: t.id})} className="w-full py-4 bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white rounded-2xl text-xs font-black transition">接入全息阅读舱 ➔</button>
                    </div>
                ))}</div>
            </div>
        </div>
    );
};

const ReaderView = ({ routeParams, navigate }) => {
    const [book, setBook] = useState(null);
    const [chapterIdx, setChapterIdx] = useState(0);
    const [theme, setTheme] = useState(localStorage.getItem('xp_reader_theme') || 'sepia');
    const [showNova, setShowNova] = useState(false);
    const [selection, setSelection] = useState('');
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            if(!routeParams?.bookId) return;
            const res = await fetch(`https://cywslfalbedraeeggryj.supabase.co/rest/v1/edu_textbooks?id=eq.${routeParams.bookId}`, {
                headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0' }
            });
            const data = await res.json();
            if(data?.[0]) setBook(data[0]);
        };
        fetchBook();
    }, [routeParams]);

    useEffect(() => {
        const handleSelection = () => {
            const sel = window.getSelection(); const text = sel.toString().trim();
            if (text.length > 3 && text.length < 300) {
                const range = sel.getRangeAt(0); const rect = range.getBoundingClientRect();
                setSelection(text); setTooltip({ x: rect.left + rect.width/2, y: rect.top });
            } else setTooltip(null);
        };
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

    if (!book) return <div className="flex-1 flex items-center justify-center bg-[#02040a] text-cyan-500 font-mono animate-pulse tracking-widest uppercase">Archiving_Logic_Flow...</div>;

    return (
        <div className={`flex-1 flex overflow-hidden relative ${theme==='sepia'?'theme-sepia':'bg-slate-950 text-white'}`}>
            <header className="absolute top-0 left-0 w-full h-16 border-b border-black/5 flex items-center justify-between px-8 z-50 backdrop-blur-md">
                <div className="flex items-center gap-4"><button onClick={()=>navigate('resources')} className="p-2 hover:bg-black/5 rounded-full transition"><ChevronLeft /></button><h2 className="text-sm font-black uppercase truncate max-w-xs">{book.title}</h2></div>
                <div className="flex gap-4 items-center">
                    <button onClick={()=>setTheme('sepia')} className="w-6 h-6 rounded-full bg-[#f4ecd8] border border-black/10" /><button onClick={()=>setTheme('dark')} className="w-6 h-6 rounded-full bg-[#020617] border border-white/10" />
                    <button onClick={()=>setShowNova(!showNova)} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 animate-pulse uppercase tracking-widest"><Sparkles size={14}/> Nova</button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto custom-scroll pt-24 pb-40 px-12 animate-[fadeIn_0.5s]">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-black mb-12 opacity-90 leading-tight border-b border-current border-opacity-10 pb-8">{book.chapters_json?.[chapterIdx]?.title}</h1>
                    <div className="content-engine" dangerouslySetInnerHTML={{ __html: book.chapters_json?.[chapterIdx]?.content }} />
                </div>
            </main>
            {tooltip && <div style={{ position:'absolute', left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -120%)' }} className="z-[100] animate-[fadeIn_0.2s]"><button onClick={()=>{setShowNova(true); setTooltip(null);}} className="px-4 py-2 bg-slate-900 text-cyan-400 rounded-xl shadow-2xl border border-cyan-500/50 text-xs font-bold transition active:scale-95">💡 苏格拉底解析</button></div>}
            {showNova && (
                <aside className="w-[400px] border-l border-black/5 bg-white/5 backdrop-blur-xl flex flex-col animate-[fadeIn_0.3s]">
                    <div className="h-16 border-b border-black/5 flex items-center justify-between px-6 text-cyan-400 font-black text-sm uppercase tracking-widest"><span>🤖 NOVA 导师</span><button onClick={()=>setShowNova(false)}><X size={18}/></button></div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
                        {selection && <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-[11px] italic font-serif leading-relaxed text-slate-400">“{selection}”</div>}
                        <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[11px] leading-relaxed text-slate-400 italic">指挥官，我已锁定了这段逻辑节点的坐标。请下达推演指令。</div>
                    </div>
                    <div className="p-6 border-t border-black/5"><input type="text" placeholder="向导师提问..." className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500 transition shadow-inner" /></div>
                </aside>
            )}
        </div>
    );
};

// ==========================================
// 8. 家控中枢 (DashboardView - 全量合龙)
// ==========================================
const DashboardView = () => {
    const [activeTab, setActiveTab] = useState('builder');
    const [galaxies, setGalaxies] = useState([]);
    const [activeGalId, setActiveGalId] = useState(null);
    const [config, setConfig] = useState({ apiKey: localStorage.getItem('xp_nova_api_key') || '', apiProxy: localStorage.getItem('xp_api_proxy') || '', apiModel: localStorage.getItem('xp_api_model') || 'gemini-2.5-flash-preview-09-2025', isPro: localStorage.getItem('xp_is_pro') === 'true', parentPin: localStorage.getItem('xp_parent_pin') || '0000' });

    useEffect(() => {
        const saved = localStorage.getItem('xp_galaxies');
        if(saved) { const p = JSON.parse(saved); setGalaxies(p); if(p.length > 0) setActiveGalId(p[0].id); }
        else { const d = [{ id:'g1', title:'认知觉醒星系', isDeployed:true, bgX:50, bgY:50, subjects:[{title:'语言逻辑', icon:'📝', angle:0, radius:130}] }]; setGalaxies(d); setActiveGalId('g1'); }
    }, []);

    const updateGalaxies = (g) => { setGalaxies(g); localStorage.setItem('xp_galaxies', JSON.stringify(g)); };
    const saveConfig = (k, v) => { setConfig({...config, [k]: v}); localStorage.setItem(`xp_${k==='apiKey'?'nova_api_key':(k==='parentPin'?'parent_pin':(k==='isPro'?'is_pro':k))}`, v); };
    const curGal = galaxies.find(x => x.id === activeGalId);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#02040a] overflow-hidden">
            <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
                <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-widest uppercase"><ShieldAlert className="text-amber-500" size={20} /> Command_Center</h2>
                <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1">{['builder', 'api', 'security'].map(t => (<button key={t} onClick={()=>setActiveTab(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab===t?'bg-blue-600 text-white shadow-lg':'text-slate-500 hover:text-slate-200'}`}>{t}</button>))}</div>
            </header>
            <div className="flex-1 overflow-y-auto p-10 custom-scroll animate-[fadeIn_0.5s]">
                {activeTab === 'builder' && (
                    <div className="flex gap-8 h-full min-h-[500px]">
                        <div className="w-1/3 glass-panel border-slate-800 rounded-[2rem] p-6 flex flex-col">
                            <div className="flex justify-between mb-6 text-slate-500 text-[10px] font-black uppercase tracking-widest"><span>Galaxy_List</span><button onClick={()=>updateGalaxies([...galaxies,{id:Date.now(), title:'新纪元', isDeployed:false, bgX:50, bgY:50, subjects:[] }])} className="text-blue-400 hover:text-blue-300 transition-colors"><Plus size={18}/></button></div>
                            <div className="space-y-3 flex-1 overflow-y-auto custom-scroll">{galaxies.map(g => (
                                <div key={g.id} onClick={()=>setActiveGalId(g.id)} className={`p-4 rounded-2xl cursor-pointer border transition-all ${activeGalId===g.id?'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-xl':'bg-slate-800/50 border-transparent text-slate-500'}`}>{g.title} {g.isDeployed && <Check size={14} className="text-emerald-500 ml-auto" />}</div>
                            ))}</div>
                        </div>
                        <div className="flex-1 glass-panel border-slate-800 rounded-[2rem] p-10">
                            {curGal ? (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-8"><input type="text" value={curGal.title} onChange={e=>updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,title:e.target.value}:x))} className="bg-transparent text-2xl font-black text-amber-200 focus:outline-none" /><label className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest"><input type="checkbox" checked={curGal.isDeployed} onChange={e=>updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,isDeployed:e.target.checked}:x))} className="w-4 h-4 rounded bg-slate-800" /> DEPLOY</label></div>
                                    <div className="space-y-4">{curGal.subjects.map((sub, i)=>(
                                        <div key={i} className="flex gap-4 items-center bg-slate-950/50 p-4 rounded-2xl border border-slate-800 relative group">
                                            <input type="text" value={sub.icon} onChange={e=>{const n=[...curGal.subjects];n[i].icon=e.target.value;updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="w-10 bg-slate-900 border-none rounded-xl text-center text-xl h-10"/>
                                            <input type="text" value={sub.title} onChange={e=>{const n=[...curGal.subjects];n[i].title=e.target.value;updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="flex-1 bg-slate-900 border-none rounded-xl p-2.5 text-sm text-white font-bold"/>
                                            <div className="flex gap-2"><div className="flex flex-col"><label className="text-[8px] text-slate-500 mb-1 uppercase tracking-tighter">Angle</label><input type="number" step="0.1" value={sub.angle} onChange={e=>{const n=[...curGal.subjects];n[i].angle=parseFloat(e.target.value);updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="w-16 bg-slate-900 rounded-lg p-1.5 text-[10px] font-mono"/></div><div className="flex flex-col"><label className="text-[8px] text-slate-500 mb-1 uppercase tracking-tighter">Radius</label><input type="number" value={sub.radius} onChange={e=>{const n=[...curGal.subjects];n[i].radius=parseInt(e.target.value);updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="w-16 bg-slate-900 rounded-lg p-1.5 text-[10px] font-mono"/></div></div>
                                            <button onClick={()=>{const n=curGal.subjects.filter((_,idx)=>idx!==i);updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                        </div>
                                    ))}</div>
                                    <button onClick={()=>updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:[...x.subjects,{title:'新星球',icon:'🪐',angle:0,radius:120}]}:x))} className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 font-black uppercase text-xs hover:border-blue-500 hover:text-blue-400 transition-all">+ Add_New_Planet</button>
                                </div>
                            ) : <div className="h-full flex items-center justify-center text-slate-600 font-mono tracking-widest uppercase">Select_Galaxy_To_Forge</div>}
                        </div>
                    </div>
                )}
                {activeTab === 'api' && (
                    <div className="max-w-xl mx-auto glass-panel p-10 rounded-[3.5rem] border-slate-800 animate-[fadeIn_0.3s]">
                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase font-mono tracking-widest"><Cpu size={24}/> Unified_API_Gateway</h3>
                        <div className="space-y-8">
                            <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Master Key</label><input type="password" value={config.apiKey} onChange={e=>saveConfig('apiKey', e.target.value)} className="w-full glass-input rounded-2xl p-4 font-mono text-sm tracking-widest" placeholder="sk-..." /></div>
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Proxy URL</label><input type="text" value={config.apiProxy} onChange={e=>saveConfig('apiProxy', e.target.value)} className="w-full glass-input rounded-2xl p-4 text-xs font-mono" placeholder="https://..." /></div>
                                <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Model Name</label><input type="text" value={config.apiModel} onChange={e=>saveConfig('apiModel', e.target.value)} className="w-full glass-input rounded-2xl p-4 text-xs font-mono text-amber-200" /></div>
                            </div>
                            <button onClick={()=>SwalMock.fire({title:'探测脉冲', text:'链路状态: READY', icon:'success'})} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition active:scale-95">Pulse_Check ↵</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 9. 侧边栏与主入口 (Sidebar & App)
// ==========================================
const Sidebar = ({ currentRoute, navigate, auth }) => {
    const handleNav = (r, isP) => { if (isP) auth.verify(() => navigate(r)); else navigate(r); };
    const NavItem = ({ id, icon: Icon, label, p: isP, activeClass, sub }) => (
        <button onClick={() => handleNav(id, isP)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mb-1 ${currentRoute === id ? activeClass : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <Icon size={18} className={currentRoute === id ? 'text-current' : 'opacity-40'} /> 
            <div className="flex flex-col items-start"><span className="text-xs font-black uppercase tracking-widest">{label}</span>{sub && <span className="text-[8px] opacity-40 font-bold leading-none mt-1 uppercase tracking-tighter">{sub}</span>}</div>
            {isP && <KeyRound size={12} className="ml-auto opacity-30" />}
        </button>
    );
    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-30 shadow-xl relative">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 font-black text-white tracking-widest uppercase text-sm italic"><Rocket className="text-blue-500 mr-3" size={20} /> XuePilot</div>
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scroll">
                <div><div className="text-[9px] text-slate-600 font-black px-2 uppercase tracking-widest mb-3 opacity-50">Master_Control</div><NavItem id="dashboard" icon={LayoutDashboard} label="家控中枢" p activeClass="bg-amber-600/20 text-amber-400 border border-amber-500/30" sub="Archives & Matrix" /></div>
                <div><div className="text-[9px] text-slate-600 font-black px-2 uppercase tracking-widest mb-3 opacity-50">Core</div><NavItem id="classroom" icon={Globe} label="3D星球" activeClass="bg-blue-600/20 text-blue-400 border border-blue-500/30" /><NavItem id="resources" icon={Library} label="教育智库" activeClass="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30" /><NavItem id="reader" icon={BookOpen} label="全息伴读" activeClass="bg-purple-600/20 text-purple-400 border border-purple-500/30" /></div>
                <div><div className="text-[9px] text-slate-600 font-black px-2 uppercase tracking-widest mb-3 opacity-50">Training</div><NavItem id="simulator" icon={Gamepad2} label="危机救援" activeClass="text-rose-400 bg-rose-900/10" /><NavItem id="writing" icon={PenTool} label="启发写作" activeClass="text-indigo-400 bg-indigo-900/10" /><NavItem id="language" icon={Languages} label="双语时光机" activeClass="text-emerald-400 bg-emerald-900/10" /></div>
            </nav>
            <div className="p-4 border-t border-slate-800"><button onClick={() => { sessionStorage.removeItem('xp_user_logged_in'); window.location.reload(); }} className="w-full py-2 text-[10px] font-black text-slate-600 hover:text-rose-500 transition uppercase tracking-[0.2em]">Exit_System</button></div>
        </aside>
    );
};

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('xp_user_logged_in') === 'true');
    const [currentRoute, setCurrentRoute] = useState('classroom');
    const [routeParams, setRouteParams] = useState({});
    const auth = useAuth(); 

    const navigate = (path, params = {}) => { setCurrentRoute(path); setRouteParams(params); };

    if (!isLoggedIn) return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#050505] hacker-grid relative font-sans overflow-hidden">
            <GlobalStyles />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]" />
            <div className="glass-panel p-12 rounded-[3.5rem] w-96 flex flex-col items-center relative z-10 shadow-[0_0_80px_black] border-slate-800/50 animate-[fadeIn_0.6s]">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-4xl shadow-2xl mb-8 shadow-blue-500/20"><Rocket className="text-white" size={40} /></div>
                <h1 className="text-3xl font-black text-white tracking-[0.3em] uppercase mb-1">XuePilot</h1>
                <p className="text-[10px] text-blue-500 font-mono tracking-[0.4em] mb-12 uppercase font-bold">Neural_Link_Gateway</p>
                <button onClick={()=>{sessionStorage.setItem('xp_user_logged_in','true'); setIsLoggedIn(true)}} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95">Engage ↵</button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen w-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans phi-gradient">
            <GlobalStyles />
            <GlobalOverlays />
            <Sidebar currentRoute={currentRoute} navigate={navigate} auth={auth} />
            <main className="flex-1 relative flex flex-col overflow-hidden border-l border-slate-800 shadow-[-20px_0_50px_black]">
                {currentRoute === 'dashboard' && <DashboardView />}
                {currentRoute === 'classroom' && <ClassroomView navigate={navigate} />}
                {currentRoute === 'resources' && <ResourcesView navigate={navigate} />}
                {currentRoute === 'reader' && <ReaderView routeParams={routeParams} navigate={navigate} />}
                {currentRoute === 'simulator' && <SimulatorView />}
                {currentRoute === 'writing' && <WritingView />}
                {currentRoute === 'language' && <LanguageView />}
            </main>
        </div>
    );
}