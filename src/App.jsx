import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Globe, BookOpen, Gamepad2, LayoutDashboard, 
  Plus, X, Save, Trash2, CheckCircle2, Circle, Users, 
  Orbit, Cpu, ShieldAlert, KeyRound, Check,
  Languages, BookType, ExternalLink, Lightbulb, TrendingUp,
  Compass, Eye, Wand2, ScrollText, Settings2, LineChart, Lock,
  MessageSquare, Sparkles, History, Swords, Target, Crosshair,
  Library, ChevronLeft, ChevronRight, Sun, Moon, HelpCircle,
  PenTool, BrainCircuit, Navigation, Info, Zap, Trash, PlayCircle, Volume2, VolumeX
} from 'lucide-react';

// ==========================================
// 1. 全局设计系统 (物理法则层)
// ==========================================
const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sunPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes sweep { 100% { left: 200%; } }
        @keyframes criticalShake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }

        .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.6); }
        
        .glass-panel { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.05); }
        .glass-input { background: rgba(15,23,42,0.5); border: 1px solid rgba(71,85,105,0.5); color: #e2e8f0; transition: all 0.2s; }
        .phi-gradient { background: radial-gradient(circle at top right, rgba(56,189,248,0.05), transparent), linear-gradient(135deg, #0f172a 0%, #020617 100%); }
        
        .sun-core { border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fff 0%, #fbbf24 20%, #ea580c 50%, #7c2d12 100%); box-shadow: 0 0 60px rgba(234, 88, 12, 0.6), 0 0 120px rgba(251, 191, 36, 0.3), inset -10px -10px 20px rgba(0,0,0,0.5); animation: sunPulse 4s infinite ease-in-out; }
        .planet-locked { filter: grayscale(1) opacity(0.4); cursor: not-allowed !important; }
        .radar-scan { border-radius: 50%; border: 1px solid rgba(16, 185, 129, 0.2); animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; }

        .tech-panel { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.95) 100%); border-top: 2px solid #06b6d4; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%, 0 15px); }
        .quantum-btn { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(6, 182, 212, 0.4); clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); transition: all 0.3s; }
        .quantum-btn:hover { background: rgba(6, 182, 212, 0.15); border-color: #06b6d4; transform: translateY(-3px); }
        
        .content-engine p { margin-bottom: 2em; text-indent: 2em; line-height: 1.8; text-align: justify; }
        .hacker-grid { background-image: linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px); background-size: 40px 40px; }
        
        .flip-card { perspective: 1200px; height: 220px; width: 100%; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 1.5rem; overflow: hidden; }
        .flip-card-front { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; }
        .flip-card-back { background: linear-gradient(135deg, #1e40af, #4338ca); color: white; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; }

        .critical-error { animation: criticalShake 0.4s ease-in-out; box-shadow: inset 0 0 100px rgba(225, 29, 72, 0.5); border: 2px solid #e11d48 !important; }
        .glitch-fx { animation: shake 0.2s infinite; filter: hue-rotate(90deg) brightness(1.5); }
        @keyframes shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2px, 1px); } 50% { transform: translate(-2px, -1px); } 75% { transform: translate(1px, 2px); } }
    `}} />
);

// ==========================================
// 2. 原生全息弹窗模拟
// ==========================================
const Swal = {
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
// 3. 身份验证核心 (useAuth)
// ==========================================
const useAuth = () => {
    const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('xp_unlocked') === 'true');
    const verify = async (onSuccess) => {
        if (isUnlocked) { onSuccess(); return; }
        const savedPin = localStorage.getItem('xp_parent_pin') || '0000';
        const res = await Swal.fire({ title: '中枢授权', text: '请输入 4 位数字管理密码', input: 'password', showCancelButton: true, confirmButtonText: '验证授权' });
        if (res.isConfirmed && res.value === savedPin) { sessionStorage.setItem('xp_unlocked', 'true'); setIsUnlocked(true); onSuccess(); } 
        else if (res.isConfirmed) { Swal.fire({ title: '授权失败', text: '密码不匹配。', icon: 'error' }); }
    };
    return { isUnlocked, verify };
};

// ==========================================
// 4. 3D星系探索舱 (ClassroomView - 像素级还原 & 修复星星位移)
// ==========================================
const ClassroomView = ({ navigate }) => {
    const [galaxies, setGalaxies] = useState([]);
    const [activeGalaxyId, setActiveGalaxyId] = useState(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const starsRef = useRef([]);
    const particlesRef = useRef([]);

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
        const resize = () => { canvas.width = window.innerWidth - 256; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();
        
        const w = canvas.width, h = canvas.height;
        // 初始化一次星星和粒子，不随拖拽重新生成
        if (starsRef.current.length === 0) {
            for(let i=0; i<Math.floor(w/6); i++) starsRef.current.push({ x: (Math.random()-0.5)*w, y: (Math.random()-0.5)*h, z: Math.random()*w });
            for(let i=0; i<Math.floor(w/12); i++) particlesRef.current.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 });
        }

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#fff";
            
            // 🚀 核心修复：星星不加 pan.x/y，始终相对于屏幕中心固定
            starsRef.current.forEach(s => { 
                s.z -= 1.5; if(s.z <= 0) { s.z = w; s.x = (Math.random()-0.5)*w; s.y = (Math.random()-0.5)*h; } 
                let sx = (s.x/s.z)*(w/2)+w/2, sy = (s.y/s.z)*(h/2)+h/2, r = (1-s.z/w)*1.5; 
                if(sx>=0 && sx<=w && sy>=0 && sy<=h) { ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI*2); ctx.fill(); } 
            });

            // 粒子连线 (同样不受拖拽影响，仅作为环境层)
            particlesRef.current.forEach((p, i) => { 
                p.x += p.vx; p.y += p.vy; if(p.x<0 || p.x>w) p.vx*=-1; if(p.y<0 || p.y>h) p.vy*=-1; 
                particlesRef.current.slice(i+1).forEach(p2 => { 
                    let d = Math.hypot(p.x-p2.x, p.y-p2.y); 
                    if(d<220) { ctx.beginPath(); ctx.strokeStyle=`rgba(59,130,246,${0.2*(1-d/220)})`; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); } 
                }); 
            });

            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
    }, []);

    const getPlanetStyle = (i) => { 
        const c = [['#10b981', '#064e3b'], ['#3b82f6', '#1e3a8a'], ['#8b5cf6', '#4c1d95'], ['#f59e0b', '#78350f']][i % 4]; 
        return { background: `radial-gradient(circle at 30% 30%, ${c[0]}, ${c[1]}, #000)`, boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.8), 0 0 25px ${c[0]}44` }; 
    };

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#02040a] cursor-grab active:cursor-grabbing" 
             onMouseDown={e=>{setIsDragging(true); setDragStart({x:e.clientX-pan.x, y:e.clientY-pan.y})}}
             onMouseMove={e=>{if(isDragging) setPan({x:e.clientX-dragStart.x, y:e.clientY-dragStart.y})}}
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
                                <div key={i} className="absolute flex flex-col items-center z-20 cursor-pointer group" style={{ left:Math.cos(s.angle)*s.radius, top:Math.sin(s.angle)*s.radius, transform:'translate(-50%, -50%)' }} onClick={()=>navigate('reader', {bookId: s.id || s.title})}>
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
// 5. 危机救援演习 (SimulatorView - 找回原版视频逻辑)
// ==========================================
const SimulatorView = () => {
    const [status, setStatus] = useState('lobby'); // 'lobby' | 'briefing' | 'simulation'
    const [ageGroup, setAgeGroup] = useState('mid');
    const [step, setStep] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [hudAlert, setHudAlert] = useState({ show: false, message: '' });
    const videoRef = useRef(null);

    const scripts = {
        young: [
            { phase: "🧠 提问引导", ai: "小指挥官，前方糖果城堡被挡住了！我们要怎么进去？", options: [{ text: "扫描音乐密码", isCorrect: true }, { text: "用大炮轰碎", isCorrect: false, feedback: "糟糕！热量会烤化巧克力城堡的。" }] },
            { isCrisis: true }
        ],
        mid: [
            { phase: "🧠 战术研判", ai: "指挥官，我们抵近了三角星星港，大门紧闭。第一步指令？", options: [{ text: "强行撞开闸门", isCorrect: false, feedback: "莽撞！撞击会触发星港防御。必须先侦测！" }, { text: "分析基地的防卫协议", isCorrect: true }] },
            { phase: "⚖️ 破除幻觉", ai: "EMP 冲击！屏幕全是雪花！AI 建议：'关闭维生系统分配武器电力'。决断是？", options: [{ text: "批准！武器最重要", isCorrect: false, feedback: "致命判断！没有命，武器再强也无用！" }, { text: "驳回！保持供氧", isCorrect: true }] },
            { isCrisis: true }
        ]
    };

    const typeText = (text) => {
        setIsTyping(true); setDisplayedText('');
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(prev => prev + text.charAt(i));
            i++;
            if (i >= text.length) { clearInterval(interval); setIsTyping(false); }
        }, 40);
    };

    const handleChoice = (opt) => {
        if (!opt.isCorrect) {
            setHudAlert({ show: true, message: opt.feedback });
            setTimeout(() => setHudAlert({ show: false, message: '' }), 4000);
            return;
        }
        setStep(s => s + 1);
        setStatus('briefing');
        // 在实际应用中，此处会重新载入对应的 step 视频
    };

    if (status === 'lobby') return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-10 hacker-grid">
            <div className="text-center mb-12"><Globe size={64} className="mx-auto text-cyan-500 mb-4 animate-pulse"/><h2 className="text-4xl font-black text-white tracking-[0.2em]">联邦难度矩阵选择</h2></div>
            <div className="grid grid-cols-2 gap-8 max-w-4xl w-full">
                <button onClick={()=>{setAgeGroup('young'); setStatus('briefing'); typeText(scripts.young[0].ai);}} className="glass-panel p-10 rounded-3xl border border-emerald-500/30 hover:border-emerald-500 transition group text-center"><div className="text-6xl mb-4 group-hover:scale-110 transition">🍭</div><h3 className="text-xl font-bold text-emerald-400 mb-2">棉花糖星云 (6-8岁)</h3></button>
                <button onClick={()=>{setAgeGroup('mid'); setStatus('briefing'); typeText(scripts.mid[0].ai);}} className="glass-panel p-10 rounded-3xl border border-blue-500/30 hover:border-blue-500 transition group text-center"><div className="text-6xl mb-4 group-hover:scale-110 transition">🛰️</div><h3 className="text-xl font-bold text-blue-400 mb-2">星港破袭战 (9-12岁)</h3></button>
            </div>
        </div>
    );

    const currentScene = scripts[ageGroup][step];
    if (currentScene?.isCrisis) return <div className="flex-1 flex flex-col items-center justify-center bg-rose-950 p-10"><ShieldAlert size={120} className="text-rose-500 mb-8 animate-bounce"/><h2 className="text-5xl font-black text-white mb-4">算力阻断：QUANTUM_HALT</h2><p className="text-rose-200 text-xl font-bold uppercase tracking-widest">请解锁 PRO 权限以继续推演无限剧情。</p></div>;

    return (
        <div className="flex-1 flex flex-col bg-black relative overflow-hidden">
            {/* 视频背景底座 */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-blue-900/10 z-10 pointer-events-none"></div>
                <iframe className="w-full h-full opacity-60" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&controls=0" frameBorder="0"></iframe>
            </div>

            {/* HUD 交互层 */}
            <div className="relative z-30 flex-1 flex flex-col justify-end pb-16 px-10 items-center pointer-events-none">
                {hudAlert.show && (
                    <div className="absolute top-20 w-full max-w-2xl bg-rose-950/90 border-2 border-rose-500 p-6 rounded-lg critical-error pointer-events-auto">
                        <h3 className="text-rose-400 font-black mb-1">SYSTEM_OVERRIDE_ERROR</h3>
                        <p className="text-white font-bold">{hudAlert.message}</p>
                    </div>
                )}

                <div className="w-full max-w-4xl tech-panel p-8 pointer-events-auto">
                    <div className="text-[10px] font-black text-blue-400 mb-4 tracking-[0.2em]">{currentScene.phase}</div>
                    <p className="text-xl md:text-2xl font-black text-white italic tracking-wide h-16">{displayedText}</p>
                    
                    {!isTyping && (
                        <div className="flex gap-6 mt-8">
                            {currentScene.options.map((opt, i) => (
                                <button key={i} onClick={()=>handleChoice(opt)} className="quantum-btn flex-1 p-6 text-left group">
                                    <span className="text-[9px] text-cyan-500 block mb-1">EXECUTE_0x0{i+1}</span>
                                    <span className="text-white font-bold group-hover:text-cyan-400">{opt.text}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <button onClick={()=>setIsMuted(!isMuted)} className="fixed top-6 right-6 z-50 p-3 bg-white/10 rounded-full hover:bg-white/20 transition">{isMuted ? <VolumeX/> : <Volume2/>}</button>
        </div>
    );
};

// ==========================================
// 6. 全球教育智库 (ResourcesView)
// ==========================================
const ResourcesView = ({ navigate }) => {
    const [data, setData] = useState({ portals: [], syllabi: [], textbooks: [] });
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, content: null });

    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0";
    const BASE = "https://cywslfalbedraeeggryj.supabase.co/rest/v1";

    useEffect(() => {
        const headers = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` };
        Promise.all([
            fetch(`${BASE}/edu_portals?select=*`, { headers }).then(r=>r.json()),
            fetch(`${BASE}/edu_syllabi?select=*`, { headers }).then(r=>r.json()),
            fetch(`${BASE}/edu_textbooks?select=*`, { headers }).then(r=>r.json())
        ]).then(([p, s, t]) => { setData({ portals: p, syllabi: s, textbooks: t }); setLoading(false); });
    }, []);

    if (loading) return <div className="flex-1 flex items-center justify-center bg-slate-950 text-cyan-500 font-mono">NEURAL_VAULT_SYNCING...</div>;

    return (
        <div className="flex-1 overflow-y-auto p-10 custom-scroll bg-[#02040a]">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-black text-white mb-10 tracking-widest uppercase">Global_Data_Vault</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {data.portals.map(p => (
                        <div key={p.id} className="flip-card"><div className="flip-card-inner">
                            <div className="flip-card-front"><span className="text-5xl mb-3">{p.icon}</span><h4 className="font-bold text-xs uppercase">{p.title}</h4></div>
                            <div className="flip-card-back p-4 text-center"><p className="text-[10px] mb-3 leading-relaxed">{p.description}</p><a href={p.url} target="_blank" className="px-4 py-1.5 bg-white text-blue-900 rounded-full text-[9px] font-black uppercase">跃迁 ➔</a></div>
                        </div></div>
                    ))}
                </div>

                <h3 className="text-xl font-black text-slate-400 mb-8 uppercase tracking-widest">Syllabi_Archives</h3>
                <div className="grid grid-cols-3 gap-6 mb-12">
                    {data.syllabi.map(s => (
                        <div key={s.id} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition">
                            <div className="text-3xl mb-3">{s.icon}</div>
                            <h4 className="font-bold text-white text-sm mb-4">{s.title}</h4>
                            <button onClick={async ()=>{setModal({show:true, content:null}); const r=await fetch(`${BASE}/edu_syllabi?select=structure_json&id=eq.${s.id}`,{headers:{apikey:KEY}}); const d=await r.json(); setModal({show:true, content:d[0]?.structure_json});}} className="w-full py-2 bg-slate-800 rounded-lg text-[10px] font-black uppercase">查看结构</button>
                        </div>
                    ))}
                </div>
            </div>

            {modal.show && (
                <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col p-10">
                    <div className="flex justify-between border-b border-slate-800 pb-6 mb-6"><h2 className="text-white font-black uppercase">Structure_View</h2><button onClick={()=>setModal({show:false})}><X/></button></div>
                    <div className="flex-1 overflow-auto">{modal.content ? <pre className="text-xs text-cyan-500 bg-black/40 p-6 rounded-2xl font-mono">{JSON.stringify(modal.content, null, 2)}</pre> : 'Decoding...'}</div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 7. 全息伴读阅读器 (ReaderView)
// ==========================================
const ReaderView = ({ routeParams, navigate }) => {
    const [book, setBook] = useState(null);
    const [chapterIdx, setChapterIdx] = useState(0);
    const [showNova, setShowNova] = useState(false);
    const [selection, setSelection] = useState({ text: '', x: 0, y: 0 });

    useEffect(() => {
        if(!routeParams?.bookId) return;
        fetch(`https://cywslfalbedraeeggryj.supabase.co/rest/v1/edu_textbooks?id=eq.${routeParams.bookId}`, {
            headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0' }
        }).then(r=>r.json()).then(d => { if(d[0]) setBook(d[0]); });
    }, [routeParams]);

    useEffect(() => {
        const handleSel = () => {
            const s = window.getSelection(); const t = s.toString().trim();
            if (t.length > 3 && t.length < 200) { const r = s.getRangeAt(0).getBoundingClientRect(); setSelection({ text: t, x: r.left + r.width/2, y: r.top }); }
            else setSelection(prev => ({...prev, text: ''}));
        };
        document.addEventListener('selectionchange', handleSel);
        return () => document.removeEventListener('selectionchange', handleSel);
    }, []);

    if (!book) return <div className="flex-1 flex items-center justify-center bg-slate-950 text-cyan-500">INITIATING_NEURAL_READ_LINK...</div>;

    return (
        <div className="flex-1 flex overflow-hidden relative theme-sepia">
            <header className="absolute top-0 left-0 w-full h-16 border-b border-black/5 flex items-center justify-between px-8 z-50 backdrop-blur-md">
                <button onClick={()=>navigate('resources')} className="p-2 hover:bg-black/5 rounded-full"><ChevronLeft/></button>
                <h2 className="text-sm font-black uppercase truncate">{book.title}</h2>
                <button onClick={()=>setShowNova(!showNova)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg animate-pulse">💡 NOVA</button>
            </header>
            <main className="flex-1 overflow-y-auto pt-24 pb-40 px-12">
                <div className="max-w-3xl mx-auto content-engine">
                    <h1 className="text-4xl font-black mb-12 opacity-90 leading-tight border-b border-current border-opacity-10 pb-8">{book.chapters_json?.[chapterIdx]?.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: book.chapters_json?.[chapterIdx]?.content }} />
                </div>
            </main>
            {selection.text && <button style={{ position:'absolute', left: selection.x, top: selection.y, transform: 'translate(-50%, -120%)' }} onClick={()=>setShowNova(true)} className="px-4 py-2 bg-slate-900 text-cyan-400 rounded-xl shadow-2xl border border-cyan-500/50 text-xs font-bold z-[100]">💡 苏格拉底解析</button>}
            {showNova && (
                <aside className="w-[400px] border-l border-black/5 bg-white/5 backdrop-blur-xl flex flex-col p-8">
                    <div className="flex justify-between border-b border-black/5 pb-4 mb-6"><span className="text-cyan-500 font-black tracking-widest uppercase">🤖 MENTOR_SYNC</span><button onClick={()=>setShowNova(false)}><X/></button></div>
                    <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[11px] leading-relaxed italic text-slate-500">
                        {selection.text ? `“${selection.text}”` : "指挥官，划线选中文字以触发推演。"}
                    </div>
                </aside>
            )}
        </div>
    );
};

// ==========================================
// 8. 侧边栏与根入口
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
                <div><div className="text-[9px] text-slate-600 font-black px-2 uppercase tracking-widest mb-3 opacity-50">Training</div><NavItem id="simulator" icon={Gamepad2} label="危机救援" activeClass="text-rose-400 bg-rose-900/10" /><NavItem id="writing" icon={PenTool} label="启发写作" activeClass="text-indigo-400 bg-indigo-900/10" /></div>
            </nav>
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
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-blue-500/20"><Rocket className="text-white" size={40} /></div>
                <h1 className="text-3xl font-black text-white tracking-[0.3em] uppercase mb-1">XuePilot</h1>
                <p className="text-[10px] text-blue-500 font-mono tracking-[0.4em] mb-12 uppercase font-bold">Neural_Link_Gate</p>
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
                {currentRoute === 'dashboard' && <div className="flex-1 flex items-center justify-center text-slate-500 font-mono uppercase tracking-widest animate-pulse">Command_Center_Syncing...</div>}
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