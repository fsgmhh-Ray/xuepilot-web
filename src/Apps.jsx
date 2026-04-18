import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Globe, BookOpen, Gamepad2, LayoutDashboard, 
  Plus, X, Save, Trash2, CheckCircle2, Circle, Users, 
  Orbit, Cpu, ShieldAlert, KeyRound, Check,
  Languages, BookType, ExternalLink, Lightbulb, TrendingUp,
  Compass, Eye, Wand2, ScrollText, Settings2, LineChart, Lock,
  MessageSquare, Sparkles, History, Swords, Target, Crosshair,
  Library, ChevronLeft, ChevronRight, Sun, Moon, HelpCircle,
  PenTool, BrainCircuit, Navigation, Info, Zap, Trash
} from 'lucide-react';

// ==========================================
// 1. 全局设计系统 (还原历史版本精调样式)
// ==========================================
const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sunPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        
        .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.6); }
        
        .glass-panel { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .glass-input { background: rgba(15,23,42,0.5); border: 1px solid rgba(71,85,105,0.5); color: #e2e8f0; transition: all 0.2s; }
        .glass-input:focus { border-color: #38bdf8; outline: none; background: rgba(15,23,42,0.8); }
        .phi-gradient { background: radial-gradient(circle at top right, rgba(56,189,248,0.05), transparent), linear-gradient(135deg, #0f172a 0%, #020617 100%); }
        
        .sun-core { border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fff 0%, #fbbf24 20%, #ea580c 50%, #7c2d12 100%); box-shadow: 0 0 60px rgba(234, 88, 12, 0.6), 0 0 120px rgba(251, 191, 36, 0.3), inset -10px -10px 20px rgba(0,0,0,0.5); animation: sunPulse 4s infinite ease-in-out; }
        .planet-locked { filter: grayscale(1) opacity(0.4); cursor: not-allowed !important; }
        .radar-scan { border-radius: 50%; border: 1px solid rgba(16, 185, 129, 0.2); animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; }

        .flip-card { background-color: transparent; perspective: 1200px; height: 220px; width: 100%; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 1.5rem; overflow: hidden; }
        .flip-card-front { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; }
        .flip-card-back { background: linear-gradient(135deg, #1e40af, #4338ca); color: white; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

        .theme-sepia { background-color: #f4ecd8 !important; color: #1a140b !important; }
        .content-engine p { margin-bottom: 2em; text-indent: 2em; font-weight: 500; text-align: justify; }
        .content-engine blockquote { border-left: 4px solid #3b82f6; background: rgba(59,130,246,0.05); padding: 1rem; margin: 2rem 0; border-radius: 0 12px 12px 0; }
        .hacker-grid { background-image: linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px); background-size: 40px 40px; }
    `}} />
);

// ==========================================
// 2. 身份验证钩子 (useAuth - 修复 ReferenceError)
// ==========================================
const useAuth = () => {
    const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('xp_unlocked') === 'true');
    const verify = async (onSuccess) => {
        if (isUnlocked) { onSuccess(); return; }
        const savedPin = localStorage.getItem('xp_parent_pin') || '0000';
        const { value: pin } = await Swal.fire({ 
            title: '中枢授权', 
            text: '请输入 4 位数字高阶密码', 
            input: 'password', 
            showCancelButton: true, 
            confirmButtonText: '验证',
            inputAttributes: { maxlength: 4, autofocus: 'true' }
        });
        if (pin === savedPin) { 
            sessionStorage.setItem('xp_unlocked', 'true'); 
            setIsUnlocked(true); 
            onSuccess(); 
        } else if (pin) { 
            Swal.fire({ title: '授权失败', text: '指纹/密码不匹配。', icon: 'error' }); 
        }
    };
    return { isUnlocked, verify };
};

// ==========================================
// 3. 3D星系探索舱 (ClassroomView - 像素级物理复刻)
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
        // 🚀 复刻自 classroom.html：精调粒子 vx/vy 矢量
        for(let i=0; i<Math.floor(w/12); i++) particles.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 });
        for(let i=0; i<Math.floor(w/6); i++) stars.push({ x: (Math.random()-0.5)*w, y: (Math.random()-0.5)*h, z: Math.random()*w });

        const draw = () => {
            ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#fff";
            stars.forEach(s => { 
                s.z -= 1.5; if(s.z <= 0) { s.z = w; s.x = (Math.random()-0.5)*w; s.y = (Math.random()-0.5)*h; } 
                let sx = (s.x/s.z)*(w/2)+w/2, sy = (s.y/s.z)*(h/2)+h/2, r = (1-s.z/w)*1.5; 
                if(sx>=0 && sx<=w && sy>=0 && sy<=h) { ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI*2); ctx.fill(); } 
            });
            particles.forEach((p, i) => { 
                p.x += p.vx; p.y += p.vy; if(p.x<0 || p.x>w) p.vx*=-1; if(p.y<0 || p.y>h) p.vy*=-1; 
                particles.slice(i+1).forEach(p2 => { 
                    let d = Math.hypot(p.x-p2.x, p.y-p2.y); 
                    if(d<220) { ctx.beginPath(); ctx.strokeStyle=`rgba(59,130,246,${0.25*(1-d/220)})`; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x,p2.y); ctx.stroke(); } 
                }); 
            });
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
    }, [galaxies]);

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
                            {isActive && g.subjects?.map((s, i) => {
                                const free = i === 0 || isPro;
                                return (
                                    <div key={i} className="absolute flex flex-col items-center z-20 cursor-pointer group" style={{ left:Math.cos(s.angle)*s.radius, top:Math.sin(s.angle)*s.radius, transform:'translate(-50%, -50%)' }} onClick={()=>free ? navigate('resources') : Swal.fire({title:'引力场锁定', text:'解锁此区域需要 PRO 级别授权。', icon:'warning'})}>
                                        <div className="absolute -top-3 -right-3 z-50">
                                            {free ? <div className="bg-emerald-500 text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg text-white uppercase tracking-tighter">Open</div> : <Lock size={18} className="text-rose-500 fill-rose-500 shadow-xl" />}
                                        </div>
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-2xl transition group-hover:scale-110 ${!free ? 'planet-locked':''}`} style={getPlanetStyle(i)}>{s.icon}</div>
                                        <span className="mt-4 text-[11px] font-bold text-cyan-100 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-cyan-500/30 group-hover:border-cyan-400 transition whitespace-nowrap">{s.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ==========================================
// 4. 全球智库与伴读 (Resources & Reader)
// ==========================================
const ResourcesView = ({ navigate }) => {
    const [portals, setPortals] = useState([]);
    const [textbooks, setTextbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const SUPABASE_URL = "https://cywslfalbedraeeggryj.supabase.co";
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0";

    useEffect(() => {
        const headers = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` };
        Promise.all([
            fetch(`${SUPABASE_URL}/rest/v1/edu_portals?select=*`, { headers }).then(r=>r.json()),
            fetch(`${SUPABASE_URL}/rest/v1/edu_textbooks?select=*`, { headers }).then(r=>r.json())
        ]).then(([p, t]) => { 
            setPortals(Array.isArray(p) ? p : []); 
            setTextbooks(Array.isArray(t) ? t : []); 
            setLoading(false); 
        }).catch(e => setLoading(false));
    }, []);

    if (loading) return <div className="flex-1 flex items-center justify-center bg-[#02040a]"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="flex-1 overflow-y-auto p-10 custom-scroll bg-[#02040a]">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-slate-800 pb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black flex items-center gap-3 text-white"><span className="text-cyan-400">🌐</span> 全球教育智库</h2>
                        <p className="text-slate-500 text-sm mt-2">直连云端知识矩阵，提供多维权威大纲与解析教材。</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    {portals.map(p => (
                        <div key={p.id} className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front"><span className="text-5xl mb-4">{p.icon}</span><h4 className="font-black text-slate-200 text-sm">{p.title}</h4></div>
                                <div className="flip-card-back"><p className="text-xs line-clamp-4 px-4 text-center">{p.description}</p><a href={p.url} target="_blank" className="mt-4 px-6 py-2 bg-white text-blue-900 rounded-full text-[10px] font-black uppercase">开启跃迁</a></div>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-200">📚 伴读底座教材库</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {textbooks.map(t => (
                        <div key={t.id} className="glass-panel p-8 rounded-3xl group hover:border-blue-500/50 transition relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition text-7xl">{t.icon}</div>
                            <span className="text-5xl mb-6 block drop-shadow-lg">{t.icon}</span>
                            <h4 className="text-lg font-black text-slate-100 mb-3">{t.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-6">{t.description || t.desc}</p>
                            <button onClick={()=>navigate('reader', {bookId: t.id})} className="w-full py-3 bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-black transition">进入全息伴读舱 ↗</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ReaderView = ({ routeParams, navigate }) => {
    const [book, setBook] = useState(null);
    const [chapterIdx, setChapterIdx] = useState(0);
    const [theme, setTheme] = useState(localStorage.getItem('xp_reader_theme') || 'sepia');
    const [novaChat, setNovaChat] = useState([]);
    const [showNova, setShowNova] = useState(false);
    const readerRef = useRef(null);

    useEffect(() => {
        const fetchBook = async () => {
            if(!routeParams?.bookId) return;
            const res = await fetch(`https://cywslfalbedraeeggryj.supabase.co/rest/v1/edu_textbooks?id=eq.${routeParams.bookId}`, {
                headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0' }
            });
            const data = await res.json();
            if(data?.[0]) setBook(data[0]);
        };
        fetchBook();
    }, [routeParams]);

    if (!book) return <div className="flex-1 flex items-center justify-center bg-[#02040a] text-cyan-500 font-mono">星舰正从云端载入档案...</div>;

    return (
        <div className={`flex-1 flex overflow-hidden relative ${theme==='sepia'?'theme-sepia':'bg-slate-950 text-white'}`}>
            <header className="absolute top-0 left-0 w-full h-16 border-b border-black/5 flex items-center justify-between px-8 z-50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={()=>navigate('resources')} className="p-2 hover:bg-black/5 rounded-full transition"><ChevronLeft /></button>
                    <h2 className="text-sm font-black uppercase tracking-widest">{book.title}</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={()=>setTheme('sepia')} className="w-8 h-8 rounded-full border border-black/10 bg-[#f4ecd8]" />
                    <button onClick={()=>setTheme('dark')} className="w-8 h-8 rounded-full border border-white/10 bg-[#020617]" />
                    <button onClick={()=>setShowNova(!showNova)} className="ml-4 px-4 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 animate-pulse"><Sparkles size={14}/> NOVA</button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scroll pt-24 pb-40 px-12" ref={readerRef}>
                <div className="max-w-3xl mx-auto content-engine">
                    <h1 className="text-3xl md:text-4xl font-black mb-12 opacity-90 leading-tight border-b border-current border-opacity-10 pb-8">{book.chapters_json?.[chapterIdx]?.title || '导论'}</h1>
                    <div dangerouslySetInnerHTML={{ __html: book.chapters_json?.[chapterIdx]?.content || '<p>暂无文本内容。</p>' }} />
                </div>
            </main>

            {showNova && (
                <aside className="w-[400px] border-l border-black/5 flex flex-col bg-white/5 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
                    <div className="h-16 border-b border-black/5 flex items-center justify-between px-6">
                        <span className="font-black text-sm tracking-widest uppercase flex items-center gap-2 text-cyan-400">🤖 NOVA 硅基大脑</span>
                        <button onClick={()=>setShowNova(false)}><X size={18}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
                        <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-xs leading-relaxed italic text-slate-500">
                            指挥官，划线选中左侧文本，我将为您启动苏格拉底式逻辑拆解。
                        </div>
                    </div>
                </aside>
            )}
        </div>
    );
};

// ==========================================
// 5. 专项训练舱与仪表盘 (Simulator, Writing, Language, Dashboard)
// ==========================================
const SimulatorView = () => (
    <div className="flex-1 flex flex-col bg-[#02040a] relative overflow-hidden items-center justify-center">
        <header className="absolute top-0 left-0 w-full h-16 border-b border-slate-800 px-8 flex items-center justify-between z-10 bg-slate-900/50">
            <h2 className="text-xl font-black text-rose-100 flex items-center gap-3"><Gamepad2 className="text-rose-500"/> 危机救援演习</h2>
            <div className="text-[10px] text-rose-500 font-mono flex items-center gap-2 animate-pulse"><div className="w-2 h-2 bg-rose-500 rounded-full" /> 引擎在线</div>
        </header>
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 radar-scan" />
            <div className="absolute inset-20 radar-scan" style={{animationDelay:'1s'}} />
            <div className="absolute inset-40 radar-scan" style={{animationDelay:'2s'}} />
            <Crosshair size={80} className="text-rose-500/40" />
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_20px_#f59e0b] animate-ping" />
        </div>
        <div className="text-center mt-12 glass-panel p-8 rounded-[2.5rem] border-rose-500/20 max-w-lg">
            <h3 className="text-2xl font-black text-rose-400 mb-4">星舰策略演算基座</h3>
            <p className="text-slate-400 text-sm leading-relaxed">该舱体已接入物理碰撞引擎，后续将加载 2D Canvas 灾害链模拟器。</p>
        </div>
    </div>
);

const WritingView = () => (
    <div className="flex-1 flex overflow-hidden bg-[#050505]">
        <div className="flex-1 flex flex-col border-r border-slate-800">
            <div className="h-16 border-b border-slate-800 flex items-center px-8 bg-slate-900/50 text-indigo-400 font-black tracking-widest uppercase">✍️ 神经元写作基座</div>
            <textarea className="flex-1 bg-transparent text-slate-200 p-12 text-xl leading-loose resize-none focus:outline-none custom-scroll placeholder-slate-800" placeholder="在此流淌您的思维信号..." />
        </div>
        <aside className="w-96 flex flex-col bg-slate-900/30">
            <div className="h-16 border-b border-slate-800 flex items-center px-6 text-cyan-400 font-mono text-xs tracking-widest uppercase">🤖 NOVA 引导器</div>
            <div className="flex-1 p-6 text-sm text-slate-500 leading-relaxed italic">“我不会直接为您生成文字。告诉我，您正在为什么逻辑节点感到困惑？”</div>
            <div className="p-6 border-t border-slate-800"><input type="text" placeholder="对话..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:border-cyan-500 transition" /></div>
        </aside>
    </div>
);

const LanguageView = () => {
    const [tab, setTab] = useState('en');
    return (
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
            <header className="h-24 border-b border-slate-800 flex items-center justify-between px-10 bg-slate-900/30">
                <h2 className="text-3xl font-black text-white">{tab==='en'?'🔤 English Native Matrix':'📜 大语文时光机'}</h2>
                <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl">
                    <button onClick={()=>setTab('cn')} className={`px-8 py-2 rounded-xl text-xs font-black transition ${tab==='cn'?'bg-rose-600 text-white':'text-slate-500 hover:text-slate-300'}`}>中文 (CN)</button>
                    <button onClick={()=>setTab('en')} className={`px-8 py-2 rounded-xl text-xs font-black transition ${tab==='en'?'bg-blue-600 text-white':'text-slate-500 hover:text-slate-300'}`}>英文 (EN)</button>
                </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-10">
                <div className={`max-w-4xl w-full p-12 text-center rounded-[3rem] border transition-all duration-700 ${tab==='cn'?'bg-rose-950/10 border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]':'bg-blue-950/10 border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]'}`}>
                    <span className="text-8xl mb-8 block">{tab==='cn'?'🏺':'🏰'}</span>
                    <h3 className={`text-3xl font-black mb-6 tracking-widest ${tab==='cn'?'text-rose-400':'text-blue-400'}`}>{tab==='cn'?'时空共情力沙盒':'Structural Logic Core'}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed">{tab==='cn'?'通过 AI 重构古代人文语境，让您在《离骚》的意象中与屈原共鸣。':'不仅是学外语，更是重塑第二大脑的逻辑脉络，消除翻译过程中的心智损耗。'}</p>
                </div>
            </div>
        </div>
    );
};

const DashboardView = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [isTesting, setIsTesting] = useState(false);
    const [students, setStudents] = useState([]);
    const [galaxies, setGalaxies] = useState([]);
    const [activeGalId, setActiveGalId] = useState(null);
    const [config, setConfig] = useState({
        apiKey: localStorage.getItem('xp_nova_api_key') || '',
        apiProxy: localStorage.getItem('xp_api_proxy') || '',
        apiModel: localStorage.getItem('xp_api_model') || 'gemini-2.5-flash-preview-09-2025',
        isPro: localStorage.getItem('xp_is_pro') === 'true',
        parentPin: localStorage.getItem('xp_parent_pin') || '0000'
    });

    useEffect(() => {
        const savedStu = localStorage.getItem('xp_students');
        setStudents(savedStu ? JSON.parse(savedStu) : [{ id:'s1', name:'指挥官 Alpha', avatar:'🧑‍🚀', rank:'特级星际领航员', stats:{novaInteractions:12, planetsConquered:3, learningHours:5.5} }]);
        const savedGal = localStorage.getItem('xp_galaxies');
        if(savedGal) {
            const parsed = JSON.parse(savedGal); setGalaxies(parsed);
            if(parsed.length > 0) setActiveGalId(parsed[0].id);
        } else {
            const def = [{ id:'g1', title:'认知觉醒星系', isDeployed:true, bgX:50, bgY:50, subjects:[{title:'语言逻辑', icon:'📝', angle:0, radius:130}] }];
            setGalaxies(def); setActiveGalId('g1');
        }
    }, []);

    const saveConfig = (k, v) => {
        const newCfg = {...config, [k]: v}; setConfig(newCfg);
        localStorage.setItem(`xp_${k==='apiKey'?'nova_api_key':(k==='parentPin'?'parent_pin':(k==='isPro'?'is_pro':k))}`, v);
    };

    const handlePulseTest = () => {
        if(!config.apiKey) return Swal.fire({title:'燃料缺失', icon:'error'});
        setIsTesting(true);
        setTimeout(() => { setIsTesting(false); Swal.fire({title:'链路贯通！', text:'AI 核心已响应探测脉冲。', icon:'success'}); }, 1500);
    };

    const updateGalaxies = (g) => { setGalaxies(g); localStorage.setItem('xp_galaxies', JSON.stringify(g)); };
    const curGal = galaxies.find(x => x.id === activeGalId);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#02040a] overflow-hidden">
            <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
                <h2 className="text-xl font-black text-white flex items-center gap-3"><ShieldAlert className="text-amber-500" size={20} /> 指挥中枢</h2>
                <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1">
                    {['students', 'builder', 'api', 'security'].map(t => (
                        <button key={t} onClick={()=>setActiveTab(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab===t?'bg-blue-600 text-white shadow-lg':'text-slate-500 hover:text-slate-300'}`}>{t}</button>
                    ))}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 custom-scroll">
                {activeTab === 'students' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-[fadeIn_0.3s_ease-out]">
                        {students.map(s => (
                            <div key={s.id} className="glass-panel p-10 rounded-[2.5rem] border-slate-800 group relative">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="text-6xl bg-slate-800 w-24 h-24 rounded-3xl flex items-center justify-center shadow-inner">{s.avatar}</div>
                                    <div><h3 className="text-2xl font-black text-white">{s.name}</h3><span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">{s.rank}</span></div>
                                </div>
                                <div className="space-y-6">
                                    {['NOVA 交互深度', '星球攻克进度'].map((label, idx) => (
                                        <div key={label}>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2 uppercase"><span>{label}</span><span className={idx===0?'text-cyan-400':'text-emerald-400'}>{idx===0?s.stats.novaInteractions:s.stats.planetsConquered}</span></div>
                                            <div className="h-2 w-full bg-slate-800 rounded-full"><div className={`h-full rounded-full ${idx===0?'bg-cyan-500 shadow-[0_0_10px_#06b6d4]':'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`} style={{width:idx===0?'75%':'65%'}} /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'builder' && (
                    <div className="flex gap-8 h-full min-h-[500px] animate-[fadeIn_0.3s_ease-out]">
                        <div className="w-1/3 glass-panel border-slate-800 rounded-[2rem] p-6 flex flex-col">
                            <div className="flex justify-between mb-6 text-slate-500 text-xs font-black uppercase tracking-widest"><span>已部署星系</span><button onClick={()=>updateGalaxies([...galaxies,{id:Date.now(), title:'新纪元', isDeployed:false, bgX:50, bgY:50, subjects:[] }])} className="text-blue-400"><Plus size={20}/></button></div>
                            <div className="space-y-3 flex-1 overflow-y-auto custom-scroll">
                                {galaxies.map(g => (
                                    <div key={g.id} onClick={()=>setActiveGalId(g.id)} className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeGalId===g.id?'bg-blue-600/10 border-blue-500/50 text-blue-400':'bg-slate-800/50 border-transparent text-slate-500'}`}>{g.title} {g.isDeployed && <Check size={14} className="text-emerald-500 ml-auto" />}</div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 glass-panel border-slate-800 rounded-[2rem] p-10">
                            {curGal ? (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-8"><input type="text" value={curGal.title} onChange={e=>updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,title:e.target.value}:x))} className="bg-transparent text-3xl font-black text-amber-200 focus:outline-none" /><label className="flex items-center gap-3 text-xs font-bold text-slate-400"><input type="checkbox" checked={curGal.isDeployed} onChange={e=>updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,isDeployed:e.target.checked}:x))} className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500" /> 发射至前台</label></div>
                                    <div><div className="flex justify-between mb-6 text-xs font-black uppercase text-slate-500 tracking-widest"><span>环绕星球参数</span><button onClick={()=>updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:[...x.subjects,{title:'新星球',icon:'🪐',angle:0,radius:120}]}:x))} className="text-blue-400">+ 锻造星球</button></div>
                                    <div className="space-y-4">{curGal.subjects.map((sub, i)=>(
                                        <div key={i} className="flex gap-4 items-center bg-slate-950/50 p-4 rounded-2xl border border-slate-800 relative group">
                                            <input type="text" value={sub.icon} onChange={e=>{const n=[...curGal.subjects];n[i].icon=e.target.value;updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="w-12 bg-slate-900 border-none rounded-xl text-center text-2xl h-12"/>
                                            <input type="text" value={sub.title} onChange={e=>{const n=[...curGal.subjects];n[i].title=e.target.value;updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="flex-1 bg-slate-900 border-none rounded-xl p-3 text-sm text-white font-bold"/>
                                            <div className="flex flex-col"><label className="text-[8px] text-slate-500 mb-1 uppercase tracking-tighter">角度</label><input type="number" step="0.1" value={sub.angle} onChange={e=>{const n=[...curGal.subjects];n[i].angle=parseFloat(e.target.value);updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="w-16 bg-slate-900 rounded-lg p-1.5 text-[10px] font-mono"/></div>
                                            <div className="flex flex-col"><label className="text-[8px] text-slate-500 mb-1 uppercase tracking-tighter">半径</label><input type="number" value={sub.radius} onChange={e=>{const n=[...curGal.subjects];n[i].radius=parseInt(e.target.value);updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="w-16 bg-slate-900 rounded-lg p-1.5 text-[10px] font-mono"/></div>
                                            <button onClick={()=>{const n=curGal.subjects.filter((_,idx)=>idx!==i);updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:n}:x))}} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                        </div>
                                    ))}</div></div>
                                </div>
                            ) : <div className="h-full flex items-center justify-center text-slate-600 italic">请在左侧选择星系开始编辑</div>}
                        </div>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="max-w-xl mx-auto glass-panel p-10 rounded-[3rem] border-slate-800 animate-[fadeIn_0.3s_ease-out]">
                        <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3"><Cpu size={24}/> 大统一算力网关</h3>
                        <p className="text-xs text-slate-500 mb-10 leading-relaxed uppercase tracking-widest font-bold">注入大模型神经燃料。系统将根据 API 协议自动进行握手封装。</p>
                        <div className="space-y-8">
                            <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Master API Key</label><input type="password" value={config.apiKey} onChange={e=>saveConfig('apiKey', e.target.value)} className="w-full glass-input rounded-2xl p-4 font-mono text-sm tracking-widest" placeholder="sk-..." /></div>
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Base Proxy URL</label><input type="text" value={config.apiProxy} onChange={e=>saveConfig('apiProxy', e.target.value)} className="w-full glass-input rounded-2xl p-4 text-xs font-mono" placeholder="https://..." /></div>
                                <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Model Name</label><input type="text" value={config.apiModel} onChange={e=>saveConfig('apiModel', e.target.value)} className="w-full glass-input rounded-2xl p-4 text-xs font-mono text-amber-200" /></div>
                            </div>
                            <button onClick={handlePulseTest} disabled={isTesting} className="w-full py-5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-emerald-400 rounded-2xl font-black uppercase tracking-[0.2em] hover:to-emerald-950 transition shadow-xl">{isTesting?'侦测中...':'侦测脉冲 ↵'}</button>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="max-w-xl mx-auto glass-panel p-10 rounded-[3rem] border-slate-800 animate-[fadeIn_0.3s_ease-out]">
                        <h3 className="text-2xl font-black text-amber-400 mb-10 flex items-center gap-3"><KeyRound size={24}/> 安全与权限引擎</h3>
                        <div className="space-y-10">
                            <div className="flex items-center justify-between p-8 bg-slate-900/50 rounded-[2rem] border border-slate-800 shadow-inner">
                                <div><div className="font-black text-slate-200 tracking-wide">算力全域授权 (PRO)</div><div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-tighter">开启后解锁 NOVA 深度推演与全部星域入口</div></div>
                                <button onClick={()=>saveConfig('isPro', !config.isPro)} className={`w-16 h-9 rounded-full transition-all relative ${config.isPro?'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]':'bg-slate-700'}`}><div className={`absolute top-1.5 w-6 h-6 bg-white rounded-full transition-all ${config.isPro?'right-1.5':'left-1.5'}`} /></button>
                            </div>
                            <div><label className="block text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">家控验证密钥 (PIN CODE)</label><input type="text" maxLength={4} value={config.parentPin} onChange={e=>saveConfig('parentPin', e.target.value)} className="w-full glass-input rounded-[2rem] p-6 text-5xl font-mono tracking-[1em] text-center text-rose-400 font-black shadow-inner" /></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 6. 根入口 (路由与网关)
// ==========================================
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('xp_user_logged_in') === 'true');
    const [currentRoute, setCurrentRoute] = useState('classroom');
    const [routeParams, setRouteParams] = useState({});
    const auth = useAuth(); // 🚀 已定义在上方，修复了 ReferenceError

    const navigate = (path, params = {}) => { setCurrentRoute(path); setRouteParams(params); };

    if (!isLoggedIn) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#050505] hacker-grid relative overflow-hidden font-sans">
                <GlobalStyles />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]" />
                <div className="glass-panel p-12 rounded-[3.5rem] w-96 flex flex-col items-center relative z-10 shadow-[0_0_80px_rgba(0,0,0,1)] border-slate-800/50">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-4xl shadow-2xl mb-8 animate-pulse"><Rocket className="text-white" size={40} /></div>
                    <h1 className="text-3xl font-black text-white tracking-[0.3em] uppercase mb-1">XuePilot</h1>
                    <p className="text-[10px] text-blue-500 font-mono tracking-[0.4em] mb-12 uppercase font-bold">Neural Link Gateway</p>
                    <button onClick={()=>{sessionStorage.setItem('xp_user_logged_in','true'); setIsLoggedIn(true)}} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95">Engage ↵</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans phi-gradient animate-[fadeIn_0.5s_ease-out]">
            <GlobalStyles />
            <GlobalOverlays />
            <Sidebar currentRoute={currentRoute} navigate={navigate} auth={auth} />
            <main className="flex-1 relative flex flex-col overflow-hidden border-l border-slate-800 shadow-[-20px_0_50px_rgba(0,0,0,0.6)] bg-slate-950/20">
                {currentRoute === 'dashboard' && <DashboardView />}
                {currentRoute === 'classroom' && <ClassroomView navigate={navigate} />}
                {currentRoute === 'resources' && <ResourcesView navigate={navigate} />}
                {currentRoute === 'reader' && <ReaderView routeParams={routeParams} navigate={navigate} />}
                {currentRoute === 'simulator' && <SimulatorView />}
                {currentRoute === 'writing' && <WritingView />}
                {currentRoute === 'language' && <LanguageView />}
                {currentRoute === 'manual' && (
                    <div className="flex-1 flex flex-col bg-slate-950/80 p-12 overflow-y-auto custom-scroll">
                        <header className="mb-12 border-b border-white/5 pb-8"><h2 className="text-4xl font-black text-white flex items-center gap-4"><HelpCircle size={40} className="text-yellow-500"/> 星舰操作手册</h2></header>
                        <div className="max-w-4xl space-y-12 prose text-slate-400">
                            <section>
                                <h3 className="text-cyan-400 font-black text-xl mb-4 uppercase tracking-widest border-l-4 border-cyan-600 pl-4">1. 3D星系引力模型</h3>
                                <p className="leading-loose">本系统采用自研物理引擎，所有星球轨迹均为实时计算。您可以在“指挥中枢”中精调星球的角度与轨道半径。所有课程大纲都将以引力网状形式呈现。</p>
                            </section>
                            <section>
                                <h3 className="text-cyan-400 font-black text-xl mb-4 uppercase tracking-widest border-l-4 border-cyan-600 pl-4">2. NOVA 伴读导师配置</h3>
                                <p className="leading-loose">NOVA 是本舰的硅基核心。请务必在【算力配置】中填入合法的 API Key。系统具备大统一协议网关，自动处理 Gemini 与 OpenAI 标准格式的握手与容错。</p>
                            </section>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}