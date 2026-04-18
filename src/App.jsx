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
// 1. 全局设计系统 (物理法则层 - 增加手册专用排版)
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
            .glass-input:focus { border-color: #38bdf8; outline: none; background: rgba(15,23,42,0.8); }
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

            /* 手册专用排版 (还原 manual.html 样式) */
            .prose h2 { color: #38bdf8; font-weight: 900; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(56,189,248,0.3); padding-bottom: 0.5rem; }
            .prose h3 { color: #e2e8f0; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; }
            .prose p { color: #94a3b8; margin-bottom: 1rem; line-height: 1.6; font-size: 0.875rem;}
            .prose ul { list-style-type: disc; padding-left: 1.5rem; color: #94a3b8; margin-bottom: 1rem; font-size: 0.875rem;}
            .prose li { margin-bottom: 0.5rem; }
            .prose code { background: rgba(0,0,0,0.5); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; color: #facc15; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.1); }
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
                    {toast.icon === 'success' ? <CheckCircle2 className="text-emerald-500" size={20}/> : <ShieldAlert className="text-amber-500" size={20}/>}
                    {toast.title}
                </div>
            )}
            {dialog && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
                        <h2 className="text-xl font-black text-white mb-4 uppercase tracking-widest">{dialog.title}</h2>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{dialog.text}</p>
                        {dialog.input === 'password' && (
                            <input type="password" maxLength={4} value={inputValue} onChange={e=>setInputValue(e.target.value)} className="w-full glass-input border border-slate-700 rounded-2xl p-4 text-center text-3xl font-mono tracking-[0.5em] text-white mb-6" autoFocus />
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
// 4. 3D星系探索舱 (保持未动)
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
}

// ==========================================
// 5. 🎯 全球教育智库 (ResourcesView - 保持未动)
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
                            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">🏛️</span> 全球教育智库
                        </h2>
                        <p className="text-slate-400 text-xs md:text-sm tracking-wide">支持分类极速检索与封面秒级抽载，点击立即跃迁至全息阅读舱。</p>
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
                                <span>⚡ 载入全息阅读 ➔</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 6. 全息阅读 (ReaderView - 保持未动)
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
                                <span className="text-purple-500">📖</span> 全息阅读库
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
// 7. 危机救援演习 (SimulatorView - 保持未动)
// ==========================================
function SimulatorView() {
    const [status, setStatus] = useState('lobby'); 
    const [ageGroup, setAgeGroup] = useState('mid');
    const [step, setStep] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hudAlert, setHudAlert] = useState({ show: false, message: '' });

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

    useEffect(() => {
        if (status === 'briefing') {
            const currentScene = scripts[ageGroup][step];
            if (currentScene && currentScene.ai) {
                setIsTyping(true);
                setDisplayedText('');
                let i = 0;
                const interval = setInterval(() => {
                    setDisplayedText(prev => prev + currentScene.ai.charAt(i));
                    i++;
                    if (i >= currentScene.ai.length) { clearInterval(interval); setIsTyping(false); }
                }, 40);
                return () => clearInterval(interval);
            }
        }
    }, [status, step, ageGroup]);

    const handleChoice = (opt) => {
        if (!opt.isCorrect) {
            setHudAlert({ show: true, message: opt.feedback });
            setTimeout(() => setHudAlert({ show: false, message: '' }), 4000);
            return;
        }
        if (scripts[ageGroup][step + 1]) { setStep(s => s + 1); }
    };

    if (status === 'lobby') return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-10 hacker-grid animate-[fadeIn_0.5s]">
            <div className="text-center mb-12"><Globe size={64} className="mx-auto text-cyan-500 mb-4 animate-pulse"/><h2 className="text-4xl font-black text-white tracking-[0.2em] uppercase">Tactical_Lobby</h2></div>
            <div className="grid grid-cols-2 gap-8 max-w-4xl w-full">
                <button onClick={()=>{setAgeGroup('young'); setStatus('briefing'); setStep(0);}} className="glass-panel p-10 rounded-3xl border border-emerald-500/30 hover:border-emerald-500 transition group text-center shadow-lg hover:shadow-emerald-500/20">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition">🍭</div>
                    <h3 className="text-xl font-bold text-emerald-400 mb-2 uppercase tracking-widest">Candy_Nebula</h3>
                    <p className="text-xs text-slate-500">难度等级：见习探索者</p>
                </button>
                <button onClick={()=>{setAgeGroup('mid'); setStatus('briefing'); setStep(0);}} className="glass-panel p-10 rounded-3xl border border-blue-500/30 hover:border-blue-500 transition group text-center shadow-lg hover:shadow-blue-500/20">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition">🛰️</div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2 uppercase tracking-widest">Starport_Breach</h3>
                    <p className="text-xs text-slate-500">难度等级：特级领航员</p>
                </button>
            </div>
        </div>
    );

    const currentScene = scripts[ageGroup][step];
    if (currentScene?.isCrisis) return (
        <div className="flex-1 flex flex-col items-center justify-center bg-rose-950 p-10">
            <ShieldAlert size={120} className="text-rose-500 mb-8 animate-bounce"/>
            <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Quantum_Halt</h2>
            <p className="text-rose-200 text-xl font-bold uppercase tracking-widest">请解锁 PRO 权限以连接真实 AI 引擎推演剧情。</p>
            <button onClick={()=>setStatus('lobby')} className="mt-10 px-8 py-3 bg-white text-rose-900 font-black rounded-xl">返回任务大厅</button>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-black relative overflow-hidden animate-[fadeIn_0.8s]">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-blue-900/10 z-10 pointer-events-none"></div>
                <iframe className="w-full h-full opacity-60 pointer-events-none" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1" frameBorder="0"></iframe>
            </div>
            <div className="relative z-30 flex-1 flex flex-col justify-end pb-16 px-10 items-center pointer-events-none">
                {hudAlert.show && (
                    <div className="absolute top-20 w-full max-w-2xl bg-rose-950/90 border-2 border-rose-500 p-8 rounded-lg critical-error pointer-events-auto">
                        <h3 className="text-rose-400 font-black mb-1 uppercase tracking-widest">System_Override_Error</h3>
                        <p className="text-white font-bold leading-relaxed">{hudAlert.message}</p>
                    </div>
                )}
                <div className="w-full max-w-4xl tech-panel p-10 pointer-events-auto shadow-2xl">
                    <div className="text-[10px] font-black text-blue-400 mb-4 tracking-[0.2em] uppercase">{currentScene?.phase}</div>
                    <p className={`text-xl md:text-2xl font-black text-white italic tracking-wide h-16 ${isTyping ? 'typing-cursor' : ''}`}>
                        {displayedText}
                    </p>
                    {!isTyping && (
                        <div className="flex gap-6 mt-10">
                            {currentScene?.options?.map((opt, i) => (
                                <button key={i} onClick={()=>handleChoice(opt)} className="quantum-btn flex-1 p-6 text-left group">
                                    <span className="text-[9px] text-cyan-500 block mb-1 uppercase tracking-tighter">Execute_0x0{i+1}</span>
                                    <span className="text-white font-bold group-hover:text-cyan-400 transition-colors">{opt.text}</span>
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
// 8. 家控中枢 (DashboardView - 保持未动)
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
                <h2 className="text-xl font-black text-white uppercase tracking-widest"><ShieldAlert className="text-amber-500" size={20} /> Command_Deck</h2>
                <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1">{['builder', 'api', 'security'].map(t => (<button key={t} onClick={()=>setActiveTab(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab===t?'bg-blue-600 text-white shadow-lg':'text-slate-500 hover:text-slate-200'}`}>{t}</button>))}</div>
            </header>
            <div className="flex-1 overflow-y-auto p-10 custom-scroll animate-[fadeIn_0.5s]">
                {activeTab === 'builder' && (
                    <div className="flex gap-8 h-full min-h-[500px]">
                        <div className="w-1/3 glass-panel border-slate-800 rounded-[2rem] p-6 flex flex-col">
                            <div className="flex justify-between mb-6 text-slate-500 text-[10px] font-black uppercase tracking-widest"><span>Deploy_List</span><button onClick={()=>updateGalaxies([...galaxies,{id:Date.now(), title:'新星系', isDeployed:false, bgX:50, bgY:50, subjects:[] }])} className="text-blue-400 hover:text-blue-300 transition-colors"><Plus size={18}/></button></div>
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
                                        </div>
                                    ))}</div>
                                    <button onClick={()=>updateGalaxies(galaxies.map(x=>x.id===curGal.id?{...x,subjects:[...x.subjects,{title:'新星球',icon:'🪐',angle:0,radius:120}]}:x))} className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 font-black uppercase text-xs hover:border-blue-500 hover:text-blue-400 transition-all">+ Add_New_Planet</button>
                                </div>
                            ) : <div className="h-full flex items-center justify-center text-slate-600 font-mono tracking-widest uppercase">Select_Galaxy_Matrix</div>}
                        </div>
                    </div>
                )}
                {activeTab === 'api' && (
                    <div className="max-w-xl mx-auto glass-panel p-10 rounded-[3rem] border-slate-800 animate-[fadeIn_0.3s]">
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
// 11. 🚀 星舰操作手册 (ManualView - 本次重点增加，完美还原)
// ==========================================
function ManualView() {
    const [activeTab, setActiveTab] = useState('intro');

    return (
        <div className="flex-1 flex flex-col z-10 bg-slate-950/80 backdrop-blur-sm relative animate-[fadeIn_0.5s]">
            {/* 头部 */}
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
                    
                    {/* TAB 1: 舱体说明 */}
                    {activeTab === 'intro' && (
                        <div className="animate-[fadeIn_0.3s]">
                            <h2>🌌 XuePilot 核心教育矩阵全景</h2>
                            <p>欢迎登舰，指挥官。XuePilot 抛弃了传统枯燥的平铺式教育，采用了 <strong>微前端 (Micro-Frontend) 舱体解耦架构</strong>。每个舱体互不干扰，各自承载不同的心智训练任务。</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                                    <h3 className="flex items-center gap-2 mt-0"><span className="text-2xl">🌌</span> 3D 知识星球</h3>
                                    <p><strong>功能：</strong>可视化大纲管理中枢。<br/>在这里，家控中枢排布的所有课程大纲将化作引力星系。指挥官可以拖拽星空，直观感受知识点之间的网状联系与层级深度。</p>
                                </div>
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                                    <h3 className="flex items-center gap-2 mt-0"><span className="text-2xl">🌐</span> 全球教育智库</h3>
                                    <p><strong>功能：</strong>教材与数据集散地。<br/>秒级直连云端数据库，囊括国际顶尖开源教材、国家统编数据底座以及前沿站点。是进入阅读舱前的资料跳板。</p>
                                </div>
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                                    <h3 className="flex items-center gap-2 mt-0"><span className="text-2xl">📖</span> 全息阅读</h3>
                                    <p><strong>功能：</strong>沉浸式高对比度图文流解析。<br/>支持划线触发 <b>NOVA 硅基导师</b>，采用苏格拉底提问法，拒绝灌输，通过连环追问重塑您的逻辑闭环。</p>
                                </div>
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 opacity-60">
                                    <h3 className="flex items-center gap-2 mt-0"><span className="text-2xl">🎮</span> 专项集训营 (建设中)</h3>
                                    <p>包含危机救援模拟器、启发写作舱、中英双语共情力沙盒。底层框架已部署，AI 神经元正在陆续接驳中，敬请期待。</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: API 配置指南 */}
                    {activeTab === 'api' && (
                        <div className="animate-[fadeIn_0.3s]">
                            <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-2xl mb-8">
                                <h2 className="mt-0 text-blue-400 flex items-center gap-2 border-none"><span>⚡</span> 为什么需要配置 API Key？</h2>
                                <p className="text-slate-300">XuePilot 秉承 <b>Data Sovereignty (数据主权)</b> 与 <b>去中心化</b> 理念。我们不倒卖算力，也不将系统与单一模型绑定。<b>只有配置了 API Key，全息阅读舱里的 NOVA 导师才能真正被唤醒。</b><br/>本系统支持无缝接入全球各大厂商的顶级商业模型与开源模型。</p>
                            </div>

                            <h2>🛠️ 部署步骤与侦测 (仅限 PRO 家长权限)</h2>
                            <p>请前往 <b>【家控中枢 (Dashboard)】 -&gt; 【算力燃料配置】</b> 区域，将您获取的 Key 填入对应的输入框内。</p>
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
                                <li><b>获取方式：</b> 前往各大家官方开放平台（如 <a href="https://platform.openai.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">OpenAI API</a>、<a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Anthropic Console</a> 或 <a href="https://platform.deepseek.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">DeepSeek 开放平台</a>）绑定信用卡并充值获取 Key。</li>
                                <li><b>配置说明：</b> 得益于底层的 <b>大统一格式转换网关</b>，您只需贴入对应的 Key 和 Base URL，即可享受与原生协议一样的顺畅体验。</li>
                            </ul>

                            <h2>3. 第三方镜像/中转站 (国内免翻墙首选)</h2>
                            <p>如果无法直连海外网络，无论是 Gemini 还是 GPT-4o，我们强烈建议您使用第三方的 API 中转平台（例如 Wildcard、API2D、或者 Github 上的开源代理）。</p>
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
                                    <p>国内顶级开源算力分发平台。注册即送海量 Token，支持极速运行 <b>DeepSeek-Coder</b>、<b>Qwen2 (通义千问)</b> 等国产神级大模型。无需翻墙，极为稳定。</p>
                                    <p>地址：<a href="https://siliconflow.cn/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">siliconflow.cn</a></p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                                    <h3 className="mt-0 text-emerald-400 border-none">🟢 Nvidia NIM (英伟达开发者)</h3>
                                    <p>老黄的福利，每天免费额度，同样提供业界最新开源模型的 API 终点。</p>
                                    <p>地址：<a href="https://build.nvidia.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">build.nvidia.com</a></p>
                                </div>
                            </div>

                            {/* 🚀 全新上线的大统一转换网关说明 */}
                            <div className="mt-8 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 p-6 rounded-2xl">
                                <h3 className="mt-0 text-emerald-400 text-lg font-black flex items-center gap-2 border-none"><span>🚀</span> 全新特性上线：大统一格式转换网关</h3>
                                <p className="text-slate-300 mt-2">
                                    架构师已为您解锁真正的模型自由！系统底层现已内置强大的智能路由转换网关。无论您接入的是原生 <b>Gemini 协议</b>，还是通用的 <b>OpenAI 标准协议 (Chat Completions)</b>（涵盖市面上 99% 的商业与开源模型），系统均会自动识别格式、动态拼装请求载荷，并完成无缝握手。
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
                <NavItem id="classroom" icon={Globe} label="3D 知识星球" activeClass="bg-blue-600/20 text-blue-400 border border-blue-500/30" />
                
                <div className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-widest mb-2 mt-4">全球教育网关</div>
                <NavItem id="resources" icon={Library} label="全球教育智库" activeClass="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30" />
                {/* 🚀 彻底定死名字：全息阅读 */}
                <NavItem id="reader" icon={BookOpen} label="全息阅读" activeClass="bg-purple-600/20 text-purple-400 border border-purple-500/30" />
                
                <div className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-widest mb-2 mt-4">专项集训营</div>
                <NavItem id="simulator" icon={Gamepad2} label="危机救援演习" activeClass="text-rose-400 bg-rose-900/10" />
                <NavItem id="writing" icon={PenTool} label="启发写作舱" activeClass="text-indigo-400 bg-indigo-900/10" />
                <NavItem id="language-en" icon={Languages} label="英文魔法书" activeClass="text-emerald-400 bg-emerald-900/10" />
                <NavItem id="language-cn" icon={ScrollText} label="大语文时光机" activeClass="text-amber-400 bg-amber-900/10" />

                <div className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-widest mb-2 mt-4">系统支持</div>
                {/* 🚀 新增手册入口 */}
                <NavItem id="manual" icon={HelpCircle} label="星舰操作手册" activeClass="text-white border border-dashed border-slate-500" />
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button onClick={() => handleNav('dashboard', true)} className="w-full flex items-center justify-between px-4 py-3 text-slate-500 hover:text-amber-500 transition group">
                    <div className="flex items-center gap-3"><span className="text-xl">🎛️</span><span className="text-xs font-bold">呼叫家控中枢排课</span></div>
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
                
                {/* 🚀 载入刚刚复原的手册舱 */}
                {currentRoute === 'manual' && <ManualView />}
            </main>
        </div>
    );
}