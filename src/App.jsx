import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Globe, BookOpen, Gamepad2, LayoutDashboard, 
  Plus, X, Save, Trash2, CheckCircle2, Circle, Users, 
  Orbit, Cpu, ShieldAlert, KeyRound, Check,
  Languages, BookType, ExternalLink, Lightbulb, TrendingUp,
  Compass, Eye, Wand2, ScrollText, Settings2, LineChart, Lock,
  MessageSquare, Sparkles, History, Swords, Target, Crosshair,
  Library, ChevronLeft, ChevronRight, Sun, Moon, HelpCircle,
  PenTool, BrainCircuit, Navigation, Info, Zap, Trash, PlayCircle, Volume2, VolumeX, Edit3
} from 'lucide-react';

// ==========================================
// 1. 全局设计系统
// ==========================================
function GlobalStyles() {
    return (
        <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes sunPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
            @keyframes criticalShake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }

            .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
            .custom-scroll::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); }
            .custom-scroll::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 4px; }
            .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.6); }
            
            .glass-panel { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.05); }
            .glass-input { background: rgba(15,23,42,0.5); border: 1px solid rgba(71,85,105,0.5); color: #e2e8f0; transition: all 0.2s; }
            .glass-input:focus { border-color: #38bdf8; outline: none; background: rgba(15,23,42,0.8); box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
            .phi-gradient { background: radial-gradient(circle at top right, rgba(56,189,248,0.05), transparent), linear-gradient(135deg, #0f172a 0%, #020617 100%); }
            
            .sun-core { border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fff 0%, #fbbf24 20%, #ea580c 50%, #7c2d12 100%); box-shadow: 0 0 60px rgba(234, 88, 12, 0.6), 0 0 120px rgba(251, 191, 36, 0.3), inset -10px -10px 20px rgba(0,0,0,0.5); animation: sunPulse 4s infinite ease-in-out; }
            .planet-locked { filter: grayscale(1) opacity(0.4); cursor: not-allowed !important; }
            .radar-scan { border-radius: 50%; border: 1px solid rgba(16, 185, 129, 0.2); animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; }

            .tech-panel { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.95) 100%); border-top: 2px solid #06b6d4; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%, 0 15px); }
            .quantum-btn { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(6, 182, 212, 0.4); clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); transition: all 0.3s; }
            .quantum-btn:hover { background: rgba(6, 182, 212, 0.15); border-color: #06b6d4; transform: translateY(-3px); }
            
            .content-engine p { margin-bottom: 2em; text-indent: 2em; line-height: 1.8; text-align: justify; }
            .typing-cursor::after { content: '█'; animation: blink 1s step-start infinite; color: #06b6d4; margin-left: 4px; }
            @keyframes blink { 50% { opacity: 0; } }

            .flip-card { perspective: 1200px; height: 220px; width: 100%; cursor: pointer; }
            .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; }
            .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
            .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 1.5rem; overflow: hidden; }
            .flip-card-front { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; }
            .flip-card-back { background: linear-gradient(135deg, #1e40af, #4338ca); color: white; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

            .critical-error { animation: criticalShake 0.4s ease-in-out; box-shadow: inset 0 0 100px rgba(225, 29, 72, 0.5); border: 2px solid #e11d48 !important; }
            .hacker-grid { background-image: linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px); background-size: 40px 40px; }

            .prose h2 { color: #38bdf8; font-weight: 900; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(56,189,248,0.3); padding-bottom: 0.5rem; }
            .prose h3 { color: #e2e8f0; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; }
            .prose p { color: #94a3b8; margin-bottom: 1rem; line-height: 1.6; font-size: 0.875rem;}
            .prose ul { list-style-type: disc; padding-left: 1.5rem; color: #94a3b8; margin-bottom: 1rem; font-size: 0.875rem;}
            .prose li { margin-bottom: 0.5rem; }
            .prose code { background: rgba(0,0,0,0.5); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; color: #facc15; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.1); }
            
            /* 富文本编辑器定制样式 */
            .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #e2e8f0 !important; background: #f8fafc; border-radius: 0.5rem 0.5rem 0 0; }
            .ql-container.ql-snow { border: none !important; font-size: 1rem; font-family: inherit; }
            .ql-editor { min-height: 300px; color: #0f172a; }
        `}} />
    );
}

// ==========================================
// 2. 原生全息弹窗模拟
// ==========================================
const SwalMock = {
    fire: (options) => new Promise((resolve) => {
        if (options.toast) {
            window.dispatchEvent(new CustomEvent('XP_TOAST', { detail: options }));
            resolve({ isConfirmed: true });
        } else {
            window.dispatchEvent(new CustomEvent('XP_DIALOG', { detail: { ...options, resolve } }));
        }
    })
};

function GlobalOverlays() {
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
                    {toast.icon === 'success' ? <CheckCircle2 className="text-emerald-500" size={20}/> : (toast.icon === 'info' ? <Info className="text-blue-500" size={20}/> : <ShieldAlert className="text-amber-500" size={20}/>)}
                    {toast.title}
                </div>
            )}
            {dialog && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
                        <h2 className="text-xl font-black text-white mb-4 uppercase tracking-widest">{dialog.title}</h2>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed" dangerouslySetInnerHTML={{__html: dialog.text || dialog.html}}></p>
                        {dialog.input === 'password' && (
                            <input type="password" maxLength={4} value={inputValue} onChange={e=>setInputValue(e.target.value)} className="w-full glass-input border border-slate-700 rounded-2xl p-4 text-center text-3xl font-mono tracking-[0.5em] text-white mb-6" autoFocus />
                        )}
                        <div className="flex gap-3 w-full">
                            {dialog.showCancelButton && <button onClick={()=>setDialog(null)} className="flex-1 py-4 rounded-2xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition">取消</button>}
                            <button onClick={handleConfirm} className="flex-1 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition" style={{backgroundColor: dialog.confirmButtonColor}}>{dialog.confirmButtonText || '确定'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ==========================================
// 3. 身份验证核心 (useAuth)
// ==========================================
function useAuth() {
    const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('xp_unlocked') === 'true');
    const verify = async (onSuccess) => {
        if (isUnlocked) { onSuccess(); return; }
        const savedPin = localStorage.getItem('xp_parent_pin') || '0000';
        const res = await SwalMock.fire({ title: '中枢授权', text: '请输入 4 位数字高阶管理密码', input: 'password', showCancelButton: true, confirmButtonText: '接入中枢' });
        if (res.isConfirmed && res.value === savedPin) { sessionStorage.setItem('xp_unlocked', 'true'); setIsUnlocked(true); onSuccess(); } 
        else if (res.isConfirmed) { SwalMock.fire({ title: '拒绝访问', text: '安全密钥校验错误。', icon: 'error' }); }
    };
    return { isUnlocked, verify };
}

// ==========================================
// 4. 星际教室 (ClassroomView - 恢复视觉系统与加强引力)
// ==========================================
function ClassroomView({ navigate }) {
    const [galaxies, setGalaxies] = useState([]);
    const [activeGalaxyId, setActiveGalaxyId] = useState(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const starsRef = useRef([]);
    const particlesRef = useRef([]);
    
    // 持续追踪鼠标的局部坐标系
    const mousePosRef = useRef({ x: -1000, y: -1000 });

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
        if (starsRef.current.length === 0) {
            for(let i=0; i<Math.floor(w/6); i++) starsRef.current.push({ x: (Math.random()-0.5)*w, y: (Math.random()-0.5)*h, z: Math.random()*w });
            for(let i=0; i<Math.floor(w/12); i++) particlesRef.current.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 });
        }

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "#fff";
            
            // 获取最新鼠标位置
            const mx = mousePosRef.current.x;
            const my = mousePosRef.current.y;

            starsRef.current.forEach(s => { 
                s.z -= 1.5; if(s.z <= 0) { s.z = canvas.width; s.x = (Math.random()-0.5)*canvas.width; s.y = (Math.random()-0.5)*canvas.height; } 
                let sx = (s.x/s.z)*(canvas.width/2)+canvas.width/2, sy = (s.y/s.z)*(canvas.height/2)+canvas.height/2;
                let r = (1-s.z/canvas.width)*1.5; 
                if(sx>=0 && sx<=canvas.width && sy>=0 && sy<=canvas.height && r > 0) { 
                    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI*2); ctx.fill(); 
                } 
            });
            
            particlesRef.current.forEach((p, i) => { 
                p.x += p.vx; p.y += p.vy; if(p.x<0 || p.x>canvas.width) p.vx*=-1; if(p.y<0 || p.y>canvas.height) p.vy*=-1; 
                
                // 粒子间连线
                particlesRef.current.slice(i+1).forEach(p2 => { 
                    let d = Math.hypot(p.x-p2.x, p.y-p2.y); 
                    if(d<220) { ctx.beginPath(); ctx.strokeStyle=`rgba(59,130,246,${0.2*(1-d/220)})`; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); } 
                }); 

                // 🚀 核心修改：适当加大鼠标引力距离和跟随力度
                if (mx > 0 && my > 0) {
                    let dm = Math.hypot(p.x - mx, p.y - my);
                    if (dm < 200) { // 引力距离加大到 200
                        // 绘制鼠标连线
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(34,211,238,${0.3 * (1 - dm / 200)})`;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mx, my);
                        ctx.stroke();
                        
                        // 吸引物理：稍微加强跟随拉扯力，但保持平滑衰减
                        const pullForce = 0.015 * (1 - dm / 200); 
                        p.x += (mx - p.x) * pullForce;
                        p.y += (my - p.y) * pullForce;
                    }
                }
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
             onMouseMove={e=>{
                 // 鼠标坐标修正：减去侧边栏的宽度 256px
                 mousePosRef.current = { x: e.clientX - 256, y: e.clientY };
                 if(isDragging) setPan({x:e.clientX-dragStart.x, y:e.clientY-dragStart.y});
             }}
             onMouseLeave={() => { mousePosRef.current = { x: -1000, y: -1000 }; }}
             onMouseUp={()=>setIsDragging(false)}>
            
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0"></canvas>
            
            <div className="absolute inset-0 z-10 select-none">
                {galaxies.map(g => {
                    const isActive = g.id === activeGalaxyId;
                    const style = isActive ? { left:'50%', top:'50%', transform:`translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))` } : { left:`${g.bgX}%`, top:`${g.bgY}%`, transform:'translate(-50%,-50%) scale(0.12)', opacity:0.6 };
                    
                    // 🚀 计算当前星系最大半径，用于渲染势力范围背景
                    const maxRadius = g.subjects?.length > 0 ? Math.max(...g.subjects.map(s => Number(s.radius) || 0)) + 100 : 300;

                    return (
                        <div key={g.id} className="absolute flex items-center justify-center w-0 h-0 transition-all duration-700 ease-out" style={style}>
                            
                            {/* 🚀 1. 恢复：淡淡的球形势力范围 */}
                            {isActive && (
                                <div className="absolute pointer-events-none z-0" style={{ 
                                    width: `${maxRadius * 2}px`, 
                                    height: `${maxRadius * 2}px`, 
                                    borderRadius: '50%', 
                                    background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.03) 40%, transparent 70%)',
                                    transform: 'translate(-50%, -50%)'
                                }}></div>
                            )}

                            {/* 🚀 2. 恢复：极细虚线星轨 & 恒星与行星丝线连接 */}
                            {isActive && (
                                <svg className="absolute overflow-visible pointer-events-none z-10" width="0" height="0">
                                    {g.subjects?.map((s, i) => (
                                        <g key={`svg-${i}`}>
                                            <circle cx="0" cy="0" r={s.radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 6" />
                                            <line x1="0" y1="0" x2={Math.cos(s.angle)*s.radius} y2={Math.sin(s.angle)*s.radius} stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
                                        </g>
                                    ))}
                                </svg>
                            )}

                            <div className="absolute z-30 cursor-pointer group" onClick={()=>setActiveGalaxyId(isActive?null:g.id)}>
                                <div className="sun-core flex flex-col items-center justify-center" style={{width:isActive?'160px':'250px', height:isActive?'160px':'250px'}}>
                                    <span className={isActive?'text-5xl':'text-9xl'}>🔮</span>
                                    {isActive && <div className="text-[10px] font-black text-amber-200 uppercase mt-4 tracking-widest">{g.title}</div>}
                                </div>
                                
                                {/* 🚀 3. 恢复：悬停在远处星系上时浮出放大清晰的名称 */}
                                {!isActive && (
                                    <div className="absolute top-full mt-10 left-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 flex justify-center" style={{ transform: 'translateX(-50%) scale(8.33)', transformOrigin: 'top center' }}>
                                        <span className="text-white text-sm font-black tracking-widest bg-slate-900/90 px-6 py-3 rounded-xl border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.8)] whitespace-nowrap">
                                            {g.title}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* 行星挂载渲染 */}
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
}

// ==========================================
// 5. 全球教育资源 (保持未动)
// ==========================================
function ResourcesView({ navigate }) {
    const [textbooks, setTextbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('全部');

    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0";
    const BASE = "https://cywslfalbedraeeggryj.supabase.co/rest/v1";

    useEffect(() => {
        const headers = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` };
        fetch(`${BASE}/edu_textbooks?select=id,code_id,title,type,provider_type,icon,description,desc`, { headers })
            .then(r=>r.json())
            .then(t => {
                setTextbooks(Array.isArray(t) ? t : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = ['全部', ...new Set(textbooks.map(b => {
        let t = b.type || b.provider_type || '其他编目';
        return t.replace(/[\(（].*?[\)）]/g, '').replace(/\s+[a-zA-Z\s]+$/, '').trim();
    }))];

    const filteredBooks = textbooks.filter(b => {
        let t = b.type || b.provider_type || '其他编目';
        t = t.replace(/[\(（].*?[\)）]/g, '').replace(/\s+[a-zA-Z\s]+$/, '').trim();
        const matchCat = selectedCategory === '全部' || t === selectedCategory;
        const searchStr = (searchQuery || '').toLowerCase();
        const matchSearch = !searchStr || (b.title || '').toLowerCase().includes(searchStr) || (b.description || b.desc || '').toLowerCase().includes(searchStr);
        return matchCat && matchSearch;
    });

    if (loading) return <div className="flex-1 flex items-center justify-center bg-[#02040a]"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scroll bg-[#020617] animate-[fadeIn_0.5s]">
            <div className="max-w-7xl mx-auto pb-20">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 border-b border-slate-800 pb-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
                            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">🏛️</span> 全球教育资源
                        </h2>
                        <p className="text-slate-400 text-xs md:text-sm tracking-wide">支持分类极速检索与封面秒级抽载，点击立即跃迁至教育图书资料舱。</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                    <div className="flex flex-wrap gap-2 w-full pb-2">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${selectedCategory === cat ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72 shrink-0">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 text-sm">🔍</span>
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="搜索书名或摘要..." 
                               className="w-full bg-slate-900/80 border border-slate-700 text-slate-200 text-sm rounded-full py-3 pl-11 pr-4 focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition shadow-inner" />
                    </div>
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-5xl opacity-20 mb-4">📭</div>
                        <p className="text-slate-400 text-sm">未检索到匹配的卷宗，请尝试调整分类或关键字。</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                        <div key={book.id} onClick={() => navigate('reader', {bookId: book.id || book.code_id})} 
                             className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500/50 hover:bg-slate-800/80 cursor-pointer transition shadow-xl group relative overflow-hidden flex flex-col h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="text-5xl mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-transform filter drop-shadow-lg">{book.icon || '📖'}</div>
                            <h3 className="text-lg font-black text-slate-200 mb-2 leading-snug">{book.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed flex-1">{book.description || book.desc || '暂无内容摘要'}</p>
                            
                            <div className="mt-6 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1 text-cyan-500/70 group-hover:text-cyan-400">
                                <span>⚡ 载入教育图书资料 ➔</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 6. 教育图书资料 (保持未动)
// ==========================================
function ReaderView({ routeParams, navigate }) {
    const [viewMode, setViewMode] = useState('library'); 
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('全部');

    const [currentBook, setCurrentBook] = useState(null);
    const [chapterIdx, setChapterIdx] = useState(0);
    const [theme, setTheme] = useState(localStorage.getItem('xp_reader_theme') || 'sepia');
    const [showNova, setShowNova] = useState(false);
    const [selection, setSelection] = useState({ text: '', x: 0, y: 0 });
    const [contentLoading, setContentLoading] = useState(false);

    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg5NjEsImV4cCI6MjA5MTYyNDk2MX0.uZoL3JiHGuw_8XNOHKu4mA4z4tsEH7T9czQCkYrb0x0";
    const BASE = "https://cywslfalbedraeeggryj.supabase.co/rest/v1";

    useEffect(() => {
        fetch(`${BASE}/edu_textbooks?select=id,code_id,title,type,provider_type,icon,description,desc`, {
            headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
        }).then(r=>r.json()).then(data => {
            setBooks(Array.isArray(data) ? data : []);
            setLoading(false);
            if(routeParams?.bookId) {
                openBook(routeParams.bookId);
            }
        }).catch(() => setLoading(false));
    }, [routeParams]);

    useEffect(() => {
        const handleSel = () => {
            if (viewMode !== 'reader') return;
            const s = window.getSelection(); const t = s.toString().trim();
            if (t.length > 3 && t.length < 200) { const r = s.getRangeAt(0).getBoundingClientRect(); setSelection({ text: t, x: r.left + r.width/2, y: r.top }); }
            else setSelection(prev => ({...prev, text: ''}));
        };
        document.addEventListener('selectionchange', handleSel);
        return () => document.removeEventListener('selectionchange', handleSel);
    }, [viewMode]);

    const openBook = async (id) => {
        setContentLoading(true);
        const isNumeric = /^\d+$/.test(id);
        const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
        const filter = (isNumeric || isUUID) ? `id=eq.${id}` : `code_id=eq.${id}`;
        
        try {
            const r = await fetch(`${BASE}/edu_textbooks?select=id,title,chapters_json&${filter}`, {
                headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
            });
            const d = await r.json();
            if (d && d.length > 0) {
                setCurrentBook(d[0]);
                setChapterIdx(0);
                setViewMode('reader');
            }
        } catch (e) { console.error(e); }
        setContentLoading(false);
    };

    const categories = ['全部', ...new Set(books.map(b => {
        let t = b.type || b.provider_type || '其他资源';
        return t.replace(/[\(（].*?[\)）]/g, '').replace(/\s+[a-zA-Z\s]+$/, '').trim();
    }))];

    const filteredBooks = books.filter(b => {
        let t = b.type || b.provider_type || '其他资源';
        t = t.replace(/[\(（].*?[\)）]/g, '').replace(/\s+[a-zA-Z\s]+$/, '').trim();
        const matchCat = selectedCategory === '全部' || t === selectedCategory;
        const searchStr = (searchQuery || '').toLowerCase();
        const matchSearch = !searchStr || (b.title || '').toLowerCase().includes(searchStr) || ((b.description || b.desc) || '').toLowerCase().includes(searchStr);
        return matchCat && matchSearch;
    });

    if (loading) return <div className="flex-1 flex items-center justify-center bg-[#050505] text-cyan-500 font-mono animate-pulse uppercase tracking-[0.3em]">Loading_Reader_Library...</div>;

    if (viewMode === 'library') {
        return (
            <div className="flex-1 overflow-y-auto p-10 custom-scroll bg-[#02040a] animate-[fadeIn_0.5s]">
                <div className="max-w-6xl mx-auto pb-20">
                    <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10 border-b border-slate-800 pb-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
                                <span className="text-purple-500">📖</span> 教育图书资料库
                            </h2>
                            <p className="text-slate-400 text-sm tracking-wide">请在下方检索并载入神经图文流。</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 mb-10 justify-between items-center">
                        <div className="flex flex-wrap gap-2 w-full">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${selectedCategory === cat ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80 shrink-0">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 text-sm">🔍</span>
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="检索书名..." 
                                   className="w-full bg-slate-900/80 border border-slate-700 text-slate-200 text-sm rounded-full py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:bg-slate-800 transition" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredBooks.map(b => (
                            <div key={b.id} onClick={() => openBook(b.id || b.code_id)} 
                                 className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-purple-500/50 hover:bg-slate-800/80 cursor-pointer transition shadow-xl group relative flex flex-col h-full">
                                <div className="text-5xl mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-transform drop-shadow-lg">{b.icon || '📖'}</div>
                                <h3 className="text-lg font-black text-slate-200 mb-2">{b.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed flex-1">{b.description || b.desc || '暂无简介'}</p>
                                <div className="mt-6 text-[10px] font-bold uppercase tracking-widest text-purple-500/70 group-hover:text-purple-400 transition-colors">
                                    载入阅读 ➔
                                </div>
                            </div>
                        ))}
                    </div>

                    {contentLoading && (
                        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-purple-400 font-mono tracking-widest text-sm uppercase">Fetching_Data...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex-1 flex overflow-hidden relative ${theme==='sepia'?'theme-sepia':'bg-slate-950 text-white'}`}>
            <header className="absolute top-0 left-0 w-full h-16 border-b border-black/5 flex items-center justify-between px-8 z-50 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-4"><button onClick={()=>{setViewMode('library'); setCurrentBook(null);}} className="p-2 hover:bg-black/10 rounded-full transition"><ChevronLeft/></button><h2 className="text-sm font-black uppercase truncate max-w-sm">{currentBook?.title}</h2></div>
                <div className="flex gap-4 items-center">
                    <button onClick={()=>setTheme('sepia')} className="w-6 h-6 rounded-full bg-[#f4ecd8] border border-black/10 shadow-inner" /><button onClick={()=>setTheme('dark')} className="w-6 h-6 rounded-full bg-[#020617] border border-white/10 shadow-inner" />
                    <button onClick={()=>setShowNova(!showNova)} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg animate-pulse tracking-widest">💡 Nova</button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto custom-scroll pt-24 pb-40 px-12 animate-[fadeIn_0.6s]">
                <div className="max-w-3xl mx-auto content-engine">
                    <h1 className="text-4xl font-black mb-12 opacity-90 leading-tight border-b border-current border-opacity-10 pb-8">{currentBook?.chapters_json?.[chapterIdx]?.title || '导论'}</h1>
                    <div dangerouslySetInnerHTML={{ __html: currentBook?.chapters_json?.[chapterIdx]?.content || '<p>数据流已断开。</p>' }} />
                </div>
            </main>
            {selection.text && <button style={{ position:'absolute', left: selection.x, top: selection.y, transform: 'translate(-50%, -120%)' }} onClick={()=>setShowNova(true)} className="px-4 py-2 bg-slate-900 text-cyan-400 rounded-xl shadow-2xl border border-cyan-500/50 text-xs font-bold z-[100] animate-bounce">💡 苏格拉底解析</button>}
            {showNova && (
                <aside className="w-[400px] border-l border-black/5 bg-white/5 backdrop-blur-xl flex flex-col p-8 animate-[fadeIn_0.3s]">
                    <div className="flex justify-between border-b border-black/10 pb-4 mb-6"><span className="text-cyan-500 font-black tracking-widest uppercase font-mono">🤖 Mentor_Sync</span><button onClick={()=>setShowNova(false)} className="p-1 hover:bg-black/10 rounded-full"><X size={18}/></button></div>
                    <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[11px] leading-relaxed italic text-slate-500 shadow-inner">
                        {selection.text ? `“${selection.text}”` : "指挥官，请划线选中左侧文本以触发 NOVA 推演。"}
                    </div>
                </aside>
            )}
        </div>
    );
}

// ==========================================
// 7. 危机救援演习 (保持未动)
// ==========================================
function SimulatorView() {
    const [status, setStatus] = useState('lobby'); 
    const [ageGroup, setAgeGroup] = useState('mid');
    const [step, setStep] = useState(1);
    const [showHUD, setShowHUD] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hudAlert, setHudAlert] = useState({ show: false, message: '' });
    const videoRef = useRef(null);

    const scripts = {
        young: {
            1: { phase: "🧠 提问引导 (Step 1)", ai: "小指挥官，前方糖果城堡被陨石挡住了！我们要怎么进去？", options: [{ text: "使用引力光束移开陨石", isCorrect: true }, { text: "用飞船上的大炮轰碎", isCorrect: false, feedback: "糟糕！爆炸的高温会烤化巧克力城堡的。" }] },
            2: { phase: "🧠 路径选择 (Step 2)", ai: "进入城堡后，发现左边是彩虹桥，右边是黑流沙。探测器显示右侧有微弱求救信号，走哪边？", options: [{ text: "开启反重力踏板走黑流沙", isCorrect: true }, { text: "走安全的彩虹桥", isCorrect: false, feedback: "我们不能无视求救信号！星际探索者的第一准则是拯救生命。" }] },
            3: { phase: "🎉 救援成功 (Step 3)", ai: "干得漂亮！我们成功救出了小熊伙伴！本次探索任务圆满完成。", options: [{ text: "返回任务大厅", isCorrect: true, isEnd: true }] }
        },
        mid: {
            1: { phase: "🧠 战术研判 (Step 1)", ai: "指挥官，我们抵近了三角星星港，大门紧闭。第一步指令？", options: [{ text: "分析基地的防卫协议", isCorrect: true }, { text: "强行撞开闸门", isCorrect: false, feedback: "莽撞！物理撞击直接触发了星港的最高级防御矩阵！" }] },
            2: { phase: "⚖️ 破除幻觉 (Step 2)", ai: "遭遇电磁风暴！屏幕全是雪花！AI 副官建议：'关闭维生系统以分配武器电力'。决断是？", options: [{ text: "驳回！保持舱内供氧", isCorrect: true }, { text: "批准！武器最重要", isCorrect: false, feedback: "致命判断！没有氧气，武器再强也无用！" }] },
            3: { phase: "🎉 跃迁成功 (Step 3)", ai: "护盾完好，机密数据已回收！准备超光速跃迁！", options: [{ text: "返回任务大厅", isCorrect: true, isEnd: true }] }
        },
        old: {
            1: { phase: "🧠 资源调度 (Step 1)", ai: "探测到微星系级塌缩，舰队燃料仅剩 30%，如何规划逃生航线？", options: [{ text: "利用木星引力弹弓效应折跃", isCorrect: true }, { text: "直线全速启动引擎冲刺", isCorrect: false, feedback: "警告！燃料将在抵达安全区前耗尽，舰队面临迷航危险！" }] },
            2: { phase: "⚖️ 伦理博弈 (Step 2)", ai: "逃生途中发现民用飞船求救信号，但偏离航线会增加 40% 的塌缩卷入风险。是否救援？", options: [{ text: "分遣无人机群进行牵引评估", isCorrect: true }, { text: "无视信号，全速保全主力舰队", isCorrect: false, feedback: "星际法庭宣告你违背了最高文明伦理，你的舰队士气已崩溃！" }] },
            3: { phase: "🎉 纪元重启 (Step 3)", ai: "完美的推演与决断。指挥官，你拯救了整个星区，成为联邦传奇。", options: [{ text: "返回任务大厅", isCorrect: true, isEnd: true }] }
        }
    };

    const startGame = (age) => {
        setAgeGroup(age);
        setStep(1);
        setStatus('playing');
        setShowHUD(false); 
    };

    const handleVideoEnded = () => {
        setShowHUD(true); 
    };

    useEffect(() => {
        if (showHUD) {
            const currentScene = scripts[ageGroup][step];
            if (currentScene && currentScene.ai) {
                setIsTyping(true);
                setDisplayedText('');
                let i = 0;
                const interval = setInterval(() => {
                    setDisplayedText(prev => prev + currentScene.ai.charAt(i));
                    i++;
                    if (i >= currentScene.ai.length) {
                        clearInterval(interval);
                        setIsTyping(false);
                    }
                }, 40);
                return () => clearInterval(interval);
            }
        }
    }, [showHUD, step, ageGroup]);

    const handleChoice = (opt) => {
        if (!opt.isCorrect) {
            setHudAlert({ show: true, message: opt.feedback });
            setTimeout(() => setHudAlert({ show: false, message: '' }), 4000);
            return;
        }
        if (opt.isEnd) {
            setStatus('lobby');
            setShowHUD(false);
            return;
        }
        
        setStep(s => s + 1);
        setShowHUD(false); 
    };

    const videoUrl = `https://cywslfalbedraeeggryj.supabase.co/storage/v1/object/public/cinematics/${ageGroup}_step${step}.mp4`;

    if (status === 'lobby') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-10 hacker-grid animate-[fadeIn_0.5s]">
                <div className="text-center mb-12">
                    <Globe size={64} className="mx-auto text-cyan-500 mb-4 animate-pulse"/>
                    <h2 className="text-4xl font-black text-white tracking-[0.2em] uppercase">Tactical_Lobby</h2>
                    <p className="text-slate-400 mt-4 text-sm font-mono">选择实战演习的指挥官级别</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                    <button onClick={() => startGame('young')} className="glass-panel p-10 rounded-3xl border border-emerald-500/30 hover:border-emerald-500 transition group text-center shadow-lg hover:shadow-emerald-500/20">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition">🍭</div>
                        <h3 className="text-xl font-bold text-emerald-400 mb-2 uppercase tracking-widest">Candy_Nebula</h3>
                        <p className="text-xs text-slate-500">级别：见习探索者 (6-8岁)</p>
                    </button>
                    <button onClick={() => startGame('mid')} className="glass-panel p-10 rounded-3xl border border-blue-500/30 hover:border-blue-500 transition group text-center shadow-lg hover:shadow-blue-500/20">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition">🛰️</div>
                        <h3 className="text-xl font-bold text-blue-400 mb-2 uppercase tracking-widest">Starport_Breach</h3>
                        <p className="text-xs text-slate-500">级别：特级领航员 (9-12岁)</p>
                    </button>
                    <button onClick={() => startGame('old')} className="glass-panel p-10 rounded-3xl border border-purple-500/30 hover:border-purple-500 transition group text-center shadow-lg hover:shadow-purple-500/20">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition">🌌</div>
                        <h3 className="text-xl font-bold text-purple-400 mb-2 uppercase tracking-widest">Void_Collapse</h3>
                        <p className="text-xs text-slate-500">级别：联邦指挥官 (13岁+)</p>
                    </button>
                </div>
            </div>
        );
    }

    const currentScene = scripts[ageGroup][step];

    return (
        <div className="flex-1 flex flex-col bg-black relative overflow-hidden animate-[fadeIn_0.5s]">
            
            <div className="absolute inset-0 z-0 bg-black">
                <video 
                    ref={videoRef}
                    src={videoUrl}
                    autoPlay 
                    playsInline
                    onEnded={handleVideoEnded}
                    className={`w-full h-full object-cover transition-all duration-1000 ${showHUD ? 'opacity-40 blur-sm scale-105' : 'opacity-100 scale-100'}`}
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10"></div>
            </div>

            <button onClick={() => setStatus('lobby')} className="absolute top-8 left-8 z-40 px-4 py-2 bg-black/50 hover:bg-black/80 border border-white/20 text-white rounded-lg text-xs font-mono uppercase tracking-widest backdrop-blur transition flex items-center gap-2">
                <ChevronLeft size={16}/> 终止任务
            </button>

            <div className={`relative z-30 flex-1 flex flex-col justify-end pb-16 px-10 items-center pointer-events-none transition-opacity duration-700 ${showHUD ? 'opacity-100' : 'opacity-0'}`}>
                
                {hudAlert.show && (
                    <div className="absolute top-20 w-full max-w-2xl bg-rose-950/90 border-2 border-rose-500 p-8 rounded-lg critical-error pointer-events-auto shadow-[0_0_50px_rgba(225,29,72,0.6)]">
                        <h3 className="text-rose-400 font-black mb-1 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={20}/> System_Override_Error</h3>
                        <p className="text-white font-bold leading-relaxed">{hudAlert.message}</p>
                    </div>
                )}
                
                <div className="w-full max-w-4xl tech-panel p-10 pointer-events-auto shadow-2xl backdrop-blur-xl bg-slate-900/80 border border-cyan-500/30">
                    <div className="text-[10px] font-black text-cyan-400 mb-4 tracking-[0.2em] uppercase flex items-center justify-between">
                        <span>{currentScene?.phase || 'SYSTEM_READY'}</span>
                        <span className="text-cyan-500/50">NODE_STEP_0{step}</span>
                    </div>
                    <p className={`text-xl md:text-2xl font-black text-white italic tracking-wide h-20 leading-relaxed ${isTyping ? 'typing-cursor' : ''}`}>
                        {displayedText}
                    </p>
                    
                    {!isTyping && showHUD && (
                        <div className="flex flex-col md:flex-row gap-4 mt-8">
                            {currentScene?.options?.map((opt, i) => (
                                <button key={i} onClick={()=>handleChoice(opt)} className="quantum-btn flex-1 p-6 text-left group bg-slate-800/80 hover:bg-cyan-900/40 border border-slate-600 hover:border-cyan-400 transition-all">
                                    <span className="text-[9px] text-cyan-500/70 block mb-2 uppercase tracking-widest font-mono">Execute_0x0{i+1}</span>
                                    <span className="text-white font-bold group-hover:text-cyan-300 transition-colors text-lg drop-shadow-md">{opt.text}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 8. 写作舱 (保持未动)
// ==========================================
function WritingView() {
    return (
        <div className="flex-1 flex overflow-hidden bg-[#050505] animate-[fadeIn_0.5s]">
            <div className="flex-1 flex flex-col border-r border-slate-800">
                <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900/50">
                    <span className="text-purple-400 font-bold tracking-widest uppercase">✍️ 神经元写作基座</span>
                </div>
                <textarea className="flex-1 bg-transparent text-slate-200 p-8 resize-none focus:outline-none custom-scroll text-lg leading-loose placeholder-slate-700" placeholder="在这里输入您的灵感流..."></textarea>
            </div>
            
            <div className="w-96 flex flex-col bg-slate-900/30">
                <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900/50">
                    <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">🤖 NOVA 苏格拉底导师</span>
                </div>
                <div className="flex-1 p-6 custom-scroll overflow-y-auto text-sm text-slate-400 leading-relaxed">
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl mb-4">
                        <p>我不会直接替您写出大纲，那样会剥夺您的独立思考能力。</p>
                        <p className="mt-2 text-cyan-400">请告诉我，您今天想创作的主题是什么？</p>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-800 bg-[#02040a]">
                    <input type="text" placeholder="回复导师..." className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-cyan-500 transition" />
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 9. 双语伴读舱 (保持未动)
// ==========================================
function LanguageView({ tab, navigate }) {
    return (
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
            <header className="h-24 border-b border-slate-800 flex items-center justify-between px-10 bg-slate-900/50 shrink-0">
                <h2 className="text-3xl font-black text-white">{tab === 'en' ? '🔤 AI英文伴读' : '📜 AI中文伴读'}</h2>
            </header>

            {tab === 'cn' && (
                <div className="flex-1 overflow-y-auto p-10 custom-scroll">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-rose-900/10 border border-rose-500/20 rounded-3xl p-10 text-center shadow-xl backdrop-blur-sm">
                            <span className="text-6xl drop-shadow-md mb-6 inline-block">🏺</span>
                            <h3 className="text-2xl font-bold text-rose-400 mb-4 tracking-widest">大语文共情力沙盒</h3>
                            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">独立的大语文环境，将通过 AI 引导重构历史语境，让学习者穿越时空，与苏轼、屈原直接进行跨维度的神经元对话。</p>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'en' && (
                <div className="flex-1 overflow-y-auto p-10 custom-scroll">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-blue-900/10 border border-blue-500/20 rounded-3xl p-10 text-center shadow-xl backdrop-blur-sm">
                            <span className="text-6xl drop-shadow-md mb-6 inline-block">🏰</span>
                            <h3 className="text-2xl font-bold text-blue-400 mb-4 tracking-widest">English Native Matrix</h3>
                            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">纯净的英文母语级建构舱。摒弃传统的死记硬背，以沉浸式情境引擎重塑对单词与从句的本能级条件反射。</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==========================================
// 10. 家控中枢 (保持未动)
// ==========================================
const DashboardView = () => {
    const [activeTab, setActiveTab] = useState('builder');
    const [viewMode, setViewMode] = useState('list'); 
    
    const [galaxies, setGalaxies] = useState([]);
    const [activeGalId, setActiveGalId] = useState(null);
    
    const [showPlanner, setShowPlanner] = useState(false);
    const [planForm, setPlanForm] = useState({ curr: '义务教育新课标', grade: '三年级', term: '上学期', ragContext: '' });
    const [isGenerating, setIsGenerating] = useState(false);

    const [editGalaxy, setEditGalaxy] = useState(null);
    const [editSubject, setEditSubject] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [curLessonId, setCurLessonId] = useState(null);
    const [isGenLessons, setIsGenLessons] = useState(false);
    const [isGenContent, setIsGenContent] = useState(false);
    
    const quillRef = useRef(null);
    const quillInstance = useRef(null);

    const [config, setConfig] = useState({ 
        apiKey: localStorage.getItem('xp_nova_api_key') || '', 
        apiProxy: localStorage.getItem('xp_api_proxy') || '', 
        apiModel: localStorage.getItem('xp_api_model') || 'gemini-2.5-flash-preview-09-2025', 
        isPro: localStorage.getItem('xp_is_pro') === 'true', 
        parentPin: localStorage.getItem('xp_parent_pin') || '0000' 
    });

    useEffect(() => {
        if (!document.getElementById('quill-css')) {
            const link = document.createElement('link'); link.id = 'quill-css'; link.rel = 'stylesheet'; link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'; document.head.appendChild(link);
        }
        if (!document.getElementById('quill-js')) {
            const script = document.createElement('script'); script.id = 'quill-js'; script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js'; document.head.appendChild(script);
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('xp_galaxies');
        if(saved) { 
            const p = JSON.parse(saved); setGalaxies(p); 
            if(p.length > 0) setActiveGalId(p[0].id); 
        } else { 
            const d = [{ id:'g1', title:'认知觉醒星系', baseStandard: '义务教育新课标', isDeployed:true, bgX:50, bgY:50, subjects:[{id: 's1', title:'语言逻辑', icon:'📝', angle:0, radius:130, lessons: []}] }]; 
            setGalaxies(d); setActiveGalId('g1'); 
        }
    }, []);

    const updateGalaxies = (g) => { setGalaxies(g); localStorage.setItem('xp_galaxies', JSON.stringify(g)); };
    const saveConfig = (k, v) => { setConfig({...config, [k]: v}); localStorage.setItem(`xp_${k==='apiKey'?'nova_api_key':(k==='parentPin'?'parent_pin':(k==='isPro'?'is_pro':k))}`, v); };

    const deleteGalaxy = (id) => {
        SwalMock.fire({ title: '确认销毁该星系？', text: '该操作不可逆转！', showCancelButton: true, confirmButtonColor: '#ef4444' }).then((res) => {
            if (res.isConfirmed) { 
                const newG = galaxies.filter(g => g.id !== id); 
                updateGalaxies(newG); 
                if (activeGalId === id) setActiveGalId(newG.length > 0 ? newG[0].id : null);
            }
        });
    };

    const toggleDeploy = (id) => {
        const newG = galaxies.map(g => g.id === id ? { ...g, isDeployed: !g.isDeployed } : g);
        updateGalaxies(newG);
        const g = newG.find(x => x.id === id);
        SwalMock.fire({toast:true, position:'top-end', icon:'success', title: g.isDeployed ? '已上线同步至前台宇宙' : '已撤回草稿箱', showConfirmButton:false, timer:1500});
    };

    const openPlanner = () => {
        if (config.isPro || galaxies.length < 2) {
            setShowPlanner(true);
        } else {
            SwalMock.fire({ title: '算力空间已满', text: '基础版最多只能同时部署 1 个专属星系。请升级 PRO 解锁无限星系！', icon: 'info' });
        }
    };

    const generateGalaxy = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const ng = { 
                id: 'gal_' + Date.now(), 
                title: `${planForm.grade}${planForm.term}专属星系`, 
                baseStandard: planForm.curr, 
                bgX: Math.random() * 60 + 20, bgY: Math.random() * 60 + 20, 
                isDeployed: false, 
                ragContext: planForm.ragContext,
                subjects: [ 
                    { id: 'sub_' + Date.now() + '1', title: '核心物理探索', icon: '🌍', radius: 240, angle: 0, lessons: [] }, 
                    { id: 'sub_' + Date.now() + '2', title: '星际数学逻辑', icon: '📐', radius: 360, angle: 2.1, lessons: [] }, 
                    { id: 'sub_' + Date.now() + '3', title: 'English Comm', icon: '💬', radius: 480, angle: 4.2, lessons: [] } 
                ] 
            };
            const newG = [ng, ...galaxies];
            updateGalaxies(newG);
            setActiveGalId(ng.id);
            setShowPlanner(false); setIsGenerating(false);
            SwalMock.fire({toast:true, position:'top-end', icon:'success', title:'星系锻造成功', showConfirmButton:false, timer:1500});
        }, 1500);
    };

    const openEditor = (gId) => {
        const g = galaxies.find(x => x.id === gId);
        if(!g || !g.subjects || g.subjects.length === 0) return;
        setEditGalaxy(g); 
        setEditSubject(g.subjects[0]); 
        setLessons(g.subjects[0].lessons || []); 
        setCurLessonId(null);
        setViewMode('editor');
    };

    const selectEditorSubject = (sid, isFree) => {
        if (!isFree) { SwalMock.fire({ title: '体验版限制', text: '跨学科统筹整个知识宇宙需要 PRO 算力！', icon: 'info' }); return; }
        if(curLessonId && quillInstance.current) {
            const currentHtml = quillInstance.current.root.innerHTML;
            setLessons(prev => prev.map(l => l.id === curLessonId ? { ...l, content: currentHtml } : l));
        }
        const s = editGalaxy.subjects.find(x => x.id === sid);
        setEditSubject(s); setLessons(s.lessons || []); setCurLessonId(null);
    };

    const selectLesson = (id) => {
        if(curLessonId && quillInstance.current) {
            const currentHtml = quillInstance.current.root.innerHTML;
            setLessons(prev => prev.map(l => l.id === curLessonId ? { ...l, content: currentHtml } : l));
        }
        setCurLessonId(id);
    };

    const generateLessons = () => {
        setIsGenLessons(true);
        setTimeout(() => {
            const isEnglish = /英语|English/i.test(editSubject.title);
            const newLessons = [ {id: 'l_'+Date.now()+'1', title: isEnglish ? 'Mission 1' : '概念引入', content: ''}, {id: 'l_'+Date.now()+'2', title: isEnglish ? 'Mission 2' : '逻辑提问', content: ''} ];
            setLessons(newLessons);
            setIsGenLessons(false);
        }, 1000);
    };

    const generateLessonContent = () => {
        setIsGenContent(true);
        setTimeout(() => {
            const isEnglish = /英语|English/i.test(editSubject.title);
            const clean = `<h3>1. ${isEnglish ? 'Socratic Inquiry' : '探索提问'}</h3><p>${isEnglish ? 'Socrates once said...' : '苏格拉底曾说：未经审视的知识不值得学习。请思考，这段逻辑的核心矛盾是什么？'}</p>`;
            if (quillInstance.current) { quillInstance.current.root.innerHTML = clean; }
            setLessons(prev => prev.map(l => l.id === curLessonId ? { ...l, content: clean } : l));
            setIsGenContent(false);
        }, 1200);
    };

    const saveCurriculum = () => {
        let finalLessons = [...lessons];
        if (curLessonId && quillInstance.current) {
            finalLessons = finalLessons.map(l => l.id === curLessonId ? { ...l, content: quillInstance.current.root.innerHTML } : l);
            setLessons(finalLessons);
        }
        
        if (editGalaxy && editSubject) {
            const updatedGalaxies = galaxies.map(g => {
                if (g.id === editGalaxy.id) {
                    return { ...g, subjects: g.subjects.map(s => s.id === editSubject.id ? { ...s, lessons: finalLessons } : s) };
                }
                return g;
            });
            updateGalaxies(updatedGalaxies);
        }
        setViewMode('list'); setCurLessonId(null);
        SwalMock.fire({toast:true, position:'top-end', icon:'success', title:'教案已保存', showConfirmButton:false, timer:1500});
    };

    const performSaveConfig = () => {
        localStorage.setItem('xp_nova_api_key', config.apiKey);
        localStorage.setItem('xp_api_proxy', config.apiProxy);
        localStorage.setItem('xp_api_model', config.apiModel);
        SwalMock.fire({toast:true, position:'top-end', icon:'success', title:'全局引擎配置已保存', showConfirmButton:false, timer:2000});
    };

    const performSavePinConfig = () => {
        if (config.parentPin && config.parentPin.length === 4 && /^\d{4}$/.test(config.parentPin)) {
            localStorage.setItem('xp_parent_pin', config.parentPin);
            SwalMock.fire({toast:true, position:'top-end', icon:'success', title:'隔离密钥已更新', showConfirmButton:false, timer:1500});
        } else {
            SwalMock.fire({title: '格式错误', text: '安全密钥必须是 4 位纯数字。', icon: 'error'});
        }
    };

    useEffect(() => {
        if (viewMode === 'editor' && curLessonId && window.Quill && quillRef.current) {
            if (!quillInstance.current) {
                quillInstance.current = new window.Quill(quillRef.current, {
                    theme: 'snow',
                    placeholder: '在此手动录入带有图片和视频的教案，或点击上方魔法按钮让 AI 生成...',
                    modules: { toolbar: [ [{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ] }
                });
                quillInstance.current.on('text-change', () => {
                    if (quillInstance.current.lessonId) {
                        setLessons(prev => prev.map(l => l.id === quillInstance.current.lessonId ? { ...l, content: quillInstance.current.root.innerHTML } : l));
                    }
                });
            }
            if (quillInstance.current.lessonId !== curLessonId) {
                const lesson = lessons.find(l => l.id === curLessonId);
                quillInstance.current.root.innerHTML = lesson?.content || '';
                quillInstance.current.lessonId = curLessonId;
            }
        }
    }, [viewMode, curLessonId, lessons]);

    const curGal = galaxies.find(x => x.id === activeGalId);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#02040a] overflow-hidden">
            <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md shrink-0">
                <h2 className="text-xl font-black text-white uppercase tracking-widest"><ShieldAlert className="text-amber-500" size={20} /> Command_Deck</h2>
                <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1">
                    <button onClick={()=>setActiveTab('builder')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab==='builder'?'bg-blue-600 text-white shadow-lg':'text-slate-500 hover:text-slate-200'}`}>星系锻造与部署中枢</button>
                    <button onClick={()=>setActiveTab('api')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab==='api'?'bg-blue-600 text-white shadow-lg':'text-slate-500 hover:text-slate-200'}`}>算力与系统配置</button>
                </div>
            </header>
            
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'builder' && viewMode === 'list' && (
                    <div className="h-full p-10 overflow-y-auto custom-scroll animate-[fadeIn_0.5s]">
                        <div className="max-w-6xl mx-auto pb-20">
                            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                                <h3 className="text-2xl font-black text-white tracking-widest uppercase">🌌 星系锻造与部署中枢</h3>
                                <button onClick={openPlanner} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transition">
                                    <Sparkles size={16}/> 智能排课
                                </button>
                            </div>
                            <div className="flex gap-8 min-h-[500px]">
                                <div className="w-1/3 flex flex-col bg-transparent">
                                    <div className="space-y-4" id="forge-list">
                                        {galaxies.map(g => (
                                            <div key={g.id} onClick={()=>setActiveGalId(g.id)} className={`glass-panel p-6 rounded-3xl border ${g.isDeployed?'border-emerald-500/30':'border-slate-700'} hover:border-blue-500/50 transition flex flex-col relative group cursor-pointer ${activeGalId===g.id?'ring-2 ring-blue-500 shadow-xl':''}`}>
                                                <button onClick={(e) => { e.stopPropagation(); deleteGalaxy(g.id); }} className="absolute top-4 right-4 text-slate-500 hover:text-rose-500 transition text-lg">✖</button>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className={`w-14 h-14 rounded-full ${g.isDeployed?'bg-emerald-900/50 border border-emerald-500':'bg-slate-800 border border-slate-600'} flex items-center justify-center text-3xl shadow-inner`}>🔮</div>
                                                    <div className="pr-6">
                                                        <h3 className="font-bold text-lg text-white">{g.title}</h3>
                                                        <span className="text-[10px] font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{g.baseStandard || 'Custom'}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 mb-6 flex-1 line-clamp-3">包含 {g.subjects?.length||0} 个核心学科行星。您可以在此修改底层教案，并决定何时发布给学生。</p>
                                                <div className="flex gap-2 mt-auto">
                                                    <button onClick={(e) => { e.stopPropagation(); openEditor(g.id); }} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-600 transition">⚙️ 排课编辑器</button>
                                                    <button onClick={(e) => { e.stopPropagation(); toggleDeploy(g.id); }} className={`flex-1 py-2 rounded-xl text-xs font-bold transition shadow-md ${g.isDeployed ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-900/50 shadow-inner' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500'}`}>
                                                        {g.isDeployed ? '✅ 已部署前台 (点击撤回)' : '🚀 部署至探索舱'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 glass-panel border-slate-800 rounded-[2rem] p-10 flex flex-col items-center justify-center text-slate-500">
                                    <Globe size={64} className="mb-4 opacity-20" />
                                    <p className="font-mono text-sm uppercase tracking-widest">Select a Galaxy from the Forge List</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'builder' && viewMode === 'editor' && editGalaxy && (
                    <div className="absolute inset-0 z-[100] bg-[#02040a] flex flex-col animate-[fadeIn_0.3s]">
                        <div className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={saveCurriculum} className="text-slate-400 hover:text-white flex items-center gap-2 transition"><ChevronLeft size={18}/> 返回星系列表</button>
                                <h3 className="font-bold text-white text-lg tracking-widest">{editGalaxy.title}</h3>
                            </div>
                            <button onClick={saveCurriculum} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transition">
                                <Save size={16}/> 保存教案并返回
                            </button>
                        </div>
                        <div className="flex-1 flex overflow-hidden">
                            <div className="w-64 border-r border-slate-800 bg-slate-900/30 p-4 overflow-y-auto custom-scroll shrink-0">
                                <h4 className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-4">学科行星 (Subjects)</h4>
                                <div id="editor-subject-list">
                                    {editGalaxy.subjects.map((s, i) => {
                                        const isFree = config.isPro || i === 0;
                                        return (
                                            <button key={s.id} onClick={() => selectEditorSubject(s.id, isFree)} className={`w-full px-4 py-3 rounded-xl border text-sm font-bold text-left transition flex items-center shrink-0 mb-2 ${editSubject?.id === s.id ? 'border-blue-500 bg-blue-900/50 text-white' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}>
                                                <span className="mr-3 text-2xl">{s.icon}</span> 
                                                <span className="truncate">{s.title}</span> 
                                                {!isFree && <span className="text-[10px] ml-auto opacity-50">🔒</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="w-72 border-r border-slate-800 bg-slate-900/10 p-4 flex flex-col shrink-0">
                                <h4 className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-4">排课节点 (Lessons)</h4>
                                <button id="btn-gen-lessons" onClick={generateLessons} disabled={isGenLessons} className="w-full py-3 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-400 border border-indigo-500/30 rounded-xl mb-4 font-bold text-sm transition flex items-center justify-center gap-2">
                                    {isGenLessons ? <span className="animate-spin inline-block">↻</span> : <Sparkles size={16}/>}
                                    {isGenLessons ? '挖掘中...' : '✨ AI 获取全量排课节点'}
                                </button>
                                <div className="flex-1 overflow-y-auto custom-scroll space-y-2" id="lesson-list">
                                    {lessons.map(l => (
                                        <div key={l.id} onClick={() => selectLesson(l.id)} className={`p-4 rounded-2xl border transition cursor-pointer flex justify-between items-center ${curLessonId === l.id ? 'border-blue-500 bg-blue-900/30 text-white' : 'border-slate-700 bg-slate-800/40 hover:border-blue-500 text-slate-300'}`}>
                                            <span className="font-bold text-sm truncate pr-2">{l.title}</span>
                                            <span className={`text-lg ${l.content ? 'text-emerald-400' : 'opacity-10'}`}>✓</span>
                                        </div>
                                    ))}
                                    {lessons.length === 0 && <div className="text-center text-xs text-slate-500 mt-10">暂无节点数据。</div>}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col bg-white relative">
                                {!curLessonId ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-950 z-10" id="editor-empty">
                                        <PenTool size={48} className="mb-4 opacity-20" />
                                        <p>请在左侧选择具体的排课节点进行编辑</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full z-0">
                                        <div className="h-14 bg-slate-100 border-b border-slate-300 flex items-center justify-between px-6 shrink-0" id="editor-toolbar-container">
                                            <span className="font-bold text-slate-800 flex items-center gap-2">
                                                <span className="text-blue-500">📝</span> {lessons.find(l=>l.id===curLessonId)?.title}
                                            </span>
                                            <button id="btn-gen-content" onClick={generateLessonContent} disabled={isGenContent} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm">
                                                {isGenContent ? <span className="animate-spin inline-block">↻</span> : <Wand2 size={14}/>}
                                                {isGenContent ? '生成中...' : '✨ 智能生成苏格拉底教案'}
                                            </button>
                                        </div>
                                        <div className="flex-1 relative bg-white">
                                            <div ref={quillRef} id="quill-container" className="absolute inset-0 custom-scroll pb-12 text-slate-800 border-none"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="p-10 overflow-y-auto h-full custom-scroll animate-[fadeIn_0.3s]">
                        <div className="max-w-xl mx-auto space-y-8">
                            <div className="glass-panel p-10 rounded-[3rem] border-slate-800">
                                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase font-mono tracking-widest"><Cpu size={24}/> Unified_API_Gateway</h3>
                                <div className="space-y-8">
                                    <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Master Key</label><input type="password" id="sys-key" value={config.apiKey} onChange={e=>setConfig({...config, apiKey: e.target.value})} className="w-full glass-input rounded-2xl p-4 font-mono text-sm tracking-widest" placeholder="sk-..." /></div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Proxy URL</label><input type="text" id="sys-url" value={config.apiProxy} onChange={e=>setConfig({...config, apiProxy: e.target.value})} className="w-full glass-input rounded-2xl p-4 text-xs font-mono" placeholder="https://..." /></div>
                                        <div><label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Model Name</label><input type="text" id="sys-model" value={config.apiModel} onChange={e=>setConfig({...config, apiModel: e.target.value})} className="w-full glass-input rounded-2xl p-4 text-xs font-mono text-amber-200" /></div>
                                    </div>
                                    <button onClick={performSaveConfig} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition active:scale-95">保存全局引擎配置 ↵</button>
                                </div>
                            </div>

                            <div className="glass-panel p-10 rounded-[3rem] border-rose-500/20">
                                <h3 className="text-2xl font-black text-rose-400 mb-6 flex items-center gap-3 uppercase font-mono tracking-widest"><Lock size={24}/> System_Security</h3>
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">高阶管理密钥 (4位数字)</label>
                                        <input type="text" id="new-pin" maxLength="4" value={config.parentPin} onChange={e=>setConfig({...config, parentPin: e.target.value})} className="w-full glass-input rounded-2xl p-6 text-center text-4xl font-mono tracking-[1em] text-rose-300 border-rose-500/30" placeholder="0000" />
                                    </div>
                                    <button onClick={performSavePinConfig} className="w-full py-5 bg-rose-900/40 hover:bg-rose-800 border border-rose-500/50 text-rose-400 hover:text-white rounded-2xl font-black uppercase tracking-widest transition">更新隔离密钥</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showPlanner && (
                    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-[fadeIn_0.3s]" id="planner-modal">
                        <div className="bg-slate-900 border border-slate-700 p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full relative">
                            <button onClick={()=>setShowPlanner(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={24}/></button>
                            <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3"><Sparkles className="text-blue-500"/> 星系锻造中枢</h3>
                            <p className="text-xs text-blue-400 mb-8 font-mono" id="planner-hint">{config.isPro ? '【PRO权限】：支持多语言输出与真实进度投喂。' : '【基础版权限】：您可以免费体验星系的智能铸造。'}</p>
                            
                            <div className="space-y-6 mb-10">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">对齐课标</label>
                                    <select id="plan-curriculum" value={planForm.curr} onChange={e=>setPlanForm({...planForm, curr: e.target.value})} className="w-full glass-input rounded-xl p-4 text-sm font-bold text-white cursor-pointer">
                                        <option value="义务教育新课标">中国义务教育新课标</option>
                                        <option value="NGSS标准">NGSS 美国科学标准</option>
                                        <option value="CCSS标准">CCSS 美国核心州立标准</option>
                                        <option value="IB国际文凭">IB 国际文凭体系</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">年级</label>
                                        <input type="text" id="plan-grade" value={planForm.grade} onChange={e=>setPlanForm({...planForm, grade: e.target.value})} className="w-full glass-input rounded-xl p-4 text-sm font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">学期</label>
                                        <input type="text" id="plan-term" value={planForm.term} onChange={e=>setPlanForm({...planForm, term: e.target.value})} className="w-full glass-input rounded-xl p-4 text-sm font-bold" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">痛点投喂 (RAG Context)</label>
                                    <textarea id="plan-rag-context" value={planForm.ragContext} onChange={e=>setPlanForm({...planForm, ragContext: e.target.value})} rows="3" placeholder="例如：孩子最近对基础物理概念难以理解..." className="w-full glass-input rounded-xl p-4 text-sm custom-scroll leading-relaxed"></textarea>
                                </div>
                            </div>
                            
                            <button id="plan-btn" onClick={generateGalaxy} disabled={isGenerating} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50">
                                {isGenerating ? <span className="animate-spin inline-block">↻</span> : <Rocket size={18}/>}
                                {isGenerating ? '正在融合重构大纲...' : '🚀 [RAG 协议] 对齐课标并铸造全景星系'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 11. 星舰操作手册 (保持未动)
// ==========================================
function ManualView() {
    const [activeTab, setActiveTab] = useState('intro');

    return (
        <div className="flex-1 flex flex-col z-10 bg-slate-950/80 backdrop-blur-sm relative animate-[fadeIn_0.5s]">
            <header className="h-24 border-b border-slate-800 flex items-center justify-between px-10 bg-slate-900/50 shrink-0">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                    <span className="text-amber-400">💡</span> 联邦指挥官星舰指南
                </h2>
                <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button onClick={() => setActiveTab('intro')} className={`px-5 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'intro' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>舱体说明</button>
                    <button onClick={() => setActiveTab('api')} className={`px-5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1 ${activeTab === 'api' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>⚡ 核心算力 (API) 部署</button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scroll p-10">
                <div className="max-w-4xl mx-auto pb-20 prose">
                    {activeTab === 'intro' && (
                        <div className="animate-[fadeIn_0.3s]">
                            <h2>🌌 XuePilot 核心教育矩阵全景</h2>
                            <p>欢迎登舰，指挥官。XuePilot 抛弃了传统枯燥的平铺式教育，采用了 <strong>微前端 (Micro-Frontend) 舱体解耦架构</strong>。每个舱体互不干扰，各自承载不同的心智训练任务。</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                                    <h3 className="flex items-center gap-2 mt-0"><span className="text-2xl">🌌</span> 星际教室</h3>
                                    <p><strong>功能：</strong>可视化大纲管理中枢。<br/>在这里，家控中枢排布的所有课程大纲将化作引力星系。指挥官可以拖拽星空，直观感受知识点之间的网状联系与层级深度。</p>
                                </div>
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                                    <h3 className="flex items-center gap-2 mt-0"><span className="text-2xl">🌐</span> 全球教育资源</h3>
                                    <p><strong>功能：</strong>教材与数据集散地。<br/>秒级直连云端数据库，囊括国际顶尖开源教材、国家统编数据底座以及前沿站点。是进入阅读舱前的资料跳板。</p>
                                </div>
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                                    <h3 className="flex items-center gap-2 mt-0"><span className="text-2xl">📖</span> 教育图书资料</h3>
                                    <p><strong>功能：</strong>沉浸式高对比度图文流解析。<br/>支持划线触发 <b>NOVA 硅基导师</b>，采用苏格拉底提问法，拒绝灌输，通过连环追问重塑您的逻辑闭环。</p>
                                </div>
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 opacity-60">
                                    <h3 className="flex items-center gap-2 mt-0"><span className="text-2xl">🎮</span> 专项集训营 (建设中)</h3>
                                    <p>包含危机救援模拟器、启发写作舱、中英双语共情力沙盒。底层框架已部署，AI 神经元正在陆续接驳中，敬请期待。</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'api' && (
                        <div className="animate-[fadeIn_0.3s]">
                            <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-2xl mb-8">
                                <h2 className="mt-0 text-blue-400 flex items-center gap-2 border-none"><span>⚡</span> 为什么需要配置 API Key？</h2>
                                <p className="text-slate-300">XuePilot 秉承 <b>Data Sovereignty (数据主权)</b> 与 <b>去中心化</b> 理念。我们不倒卖算力，也不将系统与单一模型绑定。<b>只有配置了 API Key，全息伴读舱里的 NOVA 导师才能真正被唤醒。</b><br/>本系统支持无缝接入全球各大厂商的顶级商业模型与开源模型。</p>
                            </div>

                            <h2>🛠️ 部署步骤与侦测 (仅限 PRO 家长权限)</h2>
                            <p>请前往 <b>【家控中心 (Dashboard)】 -&gt; 【算力燃料配置】</b> 区域，将您获取的 Key 填入对应的输入框内。</p>
                            <div className="bg-slate-800/50 border-l-4 border-emerald-500 p-4 mb-4">
                                <strong className="text-emerald-400 block mb-1">✅ 关键步骤：连通性侦测</strong>
                                <p className="mb-0 text-slate-300">参数填入后，请务必点击配置面板旁的 <b>[测试连接]</b> 按钮。系统会向目标节点发射一次微型侦测脉冲。若返回绿灯并收到 AI 应答，即代表燃料通道已贯通，可放心进入阅读舱！</p>
                            </div>

                            <h2>1. 官方推荐：Google Gemini (全球最强免费多模态)</h2>
                            <p>XuePilot 底层原生完美支持 Gemini 协议运转。对于海外网络环境良好的用户，这是零成本的最佳选择。</p>
                            <ul>
                                <li><b>获取地址：</b> <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Google AI Studio</a></li>
                                <li><b>费用：</b> 免费档 (Free Tier) 极其宽裕，足以支撑每日高频伴读。</li>
                                <li><b>配置方法：</b> 直接将 <code>AIzaSy...</code> 开头的 Key 填入，Base URL 留空即可。系统会自动调用原生路由。</li>
                            </ul>

                            <h2>2. 主流顶配商业模型 (追求极致体验专属)</h2>
                            <p>对于预算充足、追求地表最强推理能力与体验的指挥官，您完全可以接入各大 AI 巨头的付费大模型，如 <b>OpenAI GPT-4o</b>、<b>Anthropic Claude 3.5 Sonnet</b> 或 <b>DeepSeek Pro</b>。</p>
                            <ul>
                                <li><b>适用人群：</b> 愿意为顶级算力付费，希望获得最强逻辑推理深度与全科辅导能力的用户。</li>
                                <li><b>获取方式：</b> 前往各大家官方开放平台充值获取 Key。</li>
                                <li><b>配置说明：</b> 得益于底层的 <b>大统一格式转换网关</b>，您只需贴入对应的 Key 和 Base URL，即可享受与原生协议一样的顺畅体验。</li>
                            </ul>

                            <h2>3. 第三方镜像/中转站 (国内免翻墙首选)</h2>
                            <p>如果无法直连海外网络，无论是 Gemini 还是 GPT-4o，我们强烈建议您使用第三方的 API 中转平台。</p>
                            <ul>
                                <li><b>如何配置：</b> 
                                    <br/>1. 将中转站提供的 Key 填入 <code>API Key</code> 框内。
                                    <br/>2. <b>关键：</b>将中转站提供的服务器地址填入 <code>API Base URL (代理节点)</code> 框内。
                                    <br/><i>* 例如，您可以填入类似于 <code>https://api.yourproxy.com/v1</code>。系统转换网关会自动处理路由参数。</i>
                                </li>
                            </ul>

                            <h2>4. 全球开源/免费算力白嫖指南 (高阶极客)</h2>
                            <p>作为极客平台，XuePilot 支持您利用业界良心平台提供的免费算力接口。借助底层的 <b>大统一网关</b>，兼容变得前所未有的简单。</p>
                            
                            <div className="space-y-4 mt-4">
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                                    <h3 className="mt-0 text-emerald-400 border-none">🔥 Groq (全球最快推理芯片)</h3>
                                    <p>搭载 Llama 3 顶级开源模型，每秒生成 800 字，响应速度能让 NOVA 导师像真人一样秒回。</p>
                                    <p>地址：<a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-cyan-400 underline">console.groq.com</a> (完全免费，直接填入 Key 和 Groq 的兼容 URL 即可)</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                                    <h3 className="mt-0 text-emerald-400 border-none">🇨🇳 硅基流动 (SiliconFlow)</h3>
                                    <p>国内顶级开源算力分发平台。注册即送海量 Token，无需翻墙，极为稳定。</p>
                                    <p>地址：<a href="https://siliconflow.cn/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">siliconflow.cn</a></p>
                                </div>
                            </div>

                            <div className="mt-8 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 p-6 rounded-2xl">
                                <h3 className="mt-0 text-emerald-400 text-lg font-black flex items-center gap-2 border-none"><span>🚀</span> 全新特性上线：大统一格式转换网关</h3>
                                <p className="text-slate-300 mt-2">
                                    架构师已为您解锁真正的模型自由！系统底层现已内置强大的智能路由转换网关。无论您接入的是原生 <b>Gemini 协议</b>，还是通用的 <b>OpenAI 标准协议 (Chat Completions)</b>，系统均会自动识别格式、动态拼装请求载荷，并完成无缝握手。
                                </p>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 12. 侧边栏与主入口 (精确执行重命名指令)
// ==========================================
function Sidebar({ currentRoute, navigate, auth }) {
    const handleNav = (r, isP) => { if (isP) auth.verify(() => navigate(r)); else navigate(r); };
    const NavItem = ({ id, icon: Icon, label, p: isP, activeClass }) => (
        <button onClick={() => handleNav(id, isP)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mb-1 ${currentRoute === id || currentRoute.startsWith(id) ? activeClass : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <Icon size={18} className={currentRoute === id || currentRoute.startsWith(id) ? 'text-current' : 'opacity-40'} /> 
            <div className="flex flex-col items-start"><span className="text-xs font-black uppercase tracking-widest">{label}</span></div>
            {isP && <KeyRound size={12} className="ml-auto opacity-30" />}
        </button>
    );
    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-30 shadow-xl relative">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 font-black text-white tracking-widest uppercase text-sm italic"><Rocket className="text-blue-500 mr-3" size={20} /> XuePilot</div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scroll">
                <div className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-widest mb-2 mt-2">核心宇宙探索</div>
                <NavItem id="classroom" icon={Globe} label="星际教室" activeClass="bg-blue-600/20 text-blue-400 border border-blue-500/30" />
                
                <div className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-widest mb-2 mt-4">全球教育网关</div>
                <NavItem id="resources" icon={Library} label="全球教育资源" activeClass="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30" />
                <NavItem id="reader" icon={BookOpen} label="教育图书资料" activeClass="bg-purple-600/20 text-purple-400 border border-purple-500/30" />
                
                <div className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-widest mb-2 mt-4">专项集训营</div>
                <NavItem id="simulator" icon={Gamepad2} label="危机救援演习" activeClass="text-rose-400 bg-rose-900/10" />
                <NavItem id="writing" icon={PenTool} label="启发写作舱" activeClass="text-indigo-400 bg-indigo-900/10" />
                <NavItem id="language-en" icon={Languages} label="AI英文伴读" activeClass="text-emerald-400 bg-emerald-900/10" />
                <NavItem id="language-cn" icon={ScrollText} label="AI中文伴读" activeClass="text-amber-400 bg-amber-900/10" />

                <div className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-widest mb-2 mt-4">系统支持</div>
                <NavItem id="manual" icon={HelpCircle} label="星舰操作手册" activeClass="text-white border border-dashed border-slate-500" />
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button onClick={() => handleNav('dashboard', true)} className="w-full flex items-center justify-between px-4 py-3 text-slate-500 hover:text-amber-500 transition group">
                    <div className="flex items-center gap-3"><span className="text-xl">🎛️</span><span className="text-xs font-bold">家控中心</span></div>
                    <Lock size={12} className="opacity-50" />
                </button>
            </div>
        </aside>
    );
}

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
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-4xl shadow-2xl mb-8 animate-pulse shadow-blue-500/20"><Rocket className="text-white" size={40} /></div>
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
                {currentRoute === 'dashboard' && <DashboardView />}
                {currentRoute === 'classroom' && <ClassroomView navigate={navigate} />}
                {currentRoute === 'resources' && <ResourcesView navigate={navigate} />}
                {currentRoute === 'reader' && <ReaderView routeParams={routeParams} navigate={navigate} />}
                {currentRoute === 'simulator' && <SimulatorView />}
                {currentRoute === 'writing' && <WritingView />}
                {currentRoute === 'language-en' && <LanguageView tab="en" navigate={navigate} />}
                {currentRoute === 'language-cn' && <LanguageView tab="cn" navigate={navigate} />}
                {currentRoute === 'manual' && <ManualView />}
            </main>
        </div>
    );
}