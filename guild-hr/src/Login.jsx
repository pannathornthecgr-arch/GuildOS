import { useState } from 'react';
import { Shield, Key, Lock, Loader2, Sparkles, UserPlus } from 'lucide-react';

const MEDIEVAL_BACKDROP_URL = "/bg-castle.jpeg.jpeg";

export default function Login({ onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 🟢 ประกาศตัวแปรรับค่าช่องที่ 3 ครบถ้วน
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    setTimeout(() => {
      if (isRegisterMode) {
        // 🔮 โลจิกสมัครสมาชิกรวดเร็ว
        if (password !== confirmPassword) {
          setError('🛑 รหัสผ่านพันธสัญญาไม่ตรงกัน!');
          setIsLoading(false);
          return;
        }
        setSuccessMsg('✨ จารึกชื่อลงคัมภีร์กิลด์สำเร็จ! โปรดเข้าสู่ระบบ');
        setIsRegisterMode(false);
        setPassword('');
        setConfirmPassword('');
        setIsLoading(false);
      } else {
        // 🔮 โลจิกตรวจสอบสิทธิ์เข้าระบบ
        if ((username === 'ryo' && password === 'admin') || (username === 'test' && password === '1234')) {
          onLoginSuccess(username);
        } else {
          setError('❌ ตราประทับเวทมนตร์ไม่ถูกต้อง หรือท่านคือผู้บุกรุก!');
          setIsLoading(false);
        }
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${MEDIEVAL_BACKDROP_URL})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0a0605] backdrop-blur-sm z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-[#161210]/90 border-2 border-double border-[#8b6b4a] p-8 shadow-[0_0_50px_rgba(0,0,0,1)] animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#241a15] border border-[#d4af37] flex items-center justify-center mb-4 shadow-inner shadow-black/50">
            <Shield className="text-[#d4af37]" size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#d4af37] font-serif tracking-widest uppercase">GuildOS</h1>
          <p className="text-[#a48463] text-xs font-serif tracking-widest mt-2 uppercase">
            {isRegisterMode ? 'จารึกนามสหายใหม่ (Register)' : 'ระบบบริหารสมาคมนักผจญภัย'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-950/50 border border-red-900/50 text-red-400 p-3 text-xs font-serif text-center">{error}</div>}
          {successMsg && <div className="bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 p-3 text-xs font-serif text-center">{successMsg}</div>}

          <div className="space-y-1">
            <label className="text-[10px] text-[#a48463] font-serif uppercase tracking-widest flex items-center gap-2"><Sparkles size={10}/> นามแห่งจอมยุทธ์</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="กรอกชื่อผู้ใช้ (ryo / test)" className="w-full bg-[#0a0807] border border-[#5c4630] text-[#e1d5c1] p-3 text-sm font-mono outline-none focus:border-[#d4af37]" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#a48463] font-serif uppercase tracking-widest flex items-center gap-2"><Key size={10}/> รหัสผ่านพันธสัญญา</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="กรอกรหัสผ่าน (admin / 1234)" className="w-full bg-[#0a0807] border border-[#5c4630] text-[#e1d5c1] p-3 text-sm font-mono outline-none focus:border-[#d4af37]" />
          </div>

          {/* 🟢 ส่วนที่แก้ไขบั๊ก: ล็อกตัวแปรแยกสิทธิ์ช่องใครช่องมันกรอกลื่นไหลไม่ลดแน่นอนครับ */}
          {isRegisterMode && (
            <div className="space-y-1">
              <label className="text-[10px] text-[#a48463] font-serif uppercase tracking-widest flex items-center gap-2"><Lock size={10}/> ยืนยันรหัสผ่านอีกครั้ง</label>
              <input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง" 
                className="w-full bg-[#0a0807] border border-[#5c4630] text-[#e1d5c1] p-3 text-sm font-mono outline-none focus:border-[#d4af37]" 
              />
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full mt-2 bg-gradient-to-r from-[#8b6b4a] to-[#5c4630] text-[#ffd700] py-3 font-bold font-serif tracking-widest uppercase flex justify-center items-center gap-2 border border-[#d4af37]/40 transition-all disabled:opacity-70">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : isRegisterMode ? <UserPlus size={18} /> : <Lock size={18} />}
            {isLoading ? 'กำลังประทับตราเวท...' : isRegisterMode ? 'ส่งสัญญาสมัครสหายศึก' : 'ปลดผนึกเข้าสู่สมาคม'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-[#8b6b4a]/20 pt-4">
          <button type="button" onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); setSuccessMsg(''); setPassword(''); setConfirmPassword(''); }} className="text-xs font-serif text-[#b49b78] hover:text-[#d4af37] underline transition-colors">
            {isRegisterMode ? '🏰 มีตราพันธสัญญาแล้ว? กลับไปเข้าสู่ระบบ' : '📜 ยังไม่มีรายชื่อในกิลด์? ลงทะเบียนสหายใหม่ที่นี่'}
          </button>
        </div>
      </div>
    </div>
  );
}