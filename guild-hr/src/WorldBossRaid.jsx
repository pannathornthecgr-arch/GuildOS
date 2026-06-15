import { useState, useEffect } from 'react';
import { Skull, Flame, Sword, Zap, ShieldAlert, Crosshair, Crown } from 'lucide-react';

export default function WorldBossRaid() {
  const BOSS_MAX_HP = 10000000; // เลือดบอส 10 ล้าน
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
  const [combatLogs, setCombatLogs] = useState([]);
  const [isCastingUltimate, setIsCastingUltimate] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState(null);

  // จำลองสหายกิลด์ระดับแนวหน้าที่กำลังรุมตีบอส
  const activeSquad = [
    { name: 'ลอร์ด อาร์คัส', class: 'อัศวินมังกร', dps: 45000, color: 'text-purple-400' },
    { name: 'เซเลสเต้', class: 'จอมเวทย์', dps: 62000, color: 'text-blue-400' },
    { name: 'บัลทาซาร์', class: 'เบอร์เซิร์กเกอร์', dps: 58000, color: 'text-red-400' }
  ];

  // ลูประบบต่อสู้อัตโนมัติ (ตีทุกๆ 1.5 วินาที)
  useEffect(() => {
    if (bossHp <= 0) return;

    const battleInterval = setInterval(() => {
      let totalTickDamage = 0;
      let newLogs = [];

      activeSquad.forEach(hero => {
        // สุ่มความแกว่งของดาเมจและโอกาสคริติคอล
        const isCrit = Math.random() > 0.7;
        const damage = Math.floor(hero.dps * (isCrit ? 2.5 : 1) * (0.8 + Math.random() * 0.4));
        totalTickDamage += damage;
        
        newLogs.unshift({
          id: Date.now() + Math.random(),
          hero: hero.name,
          color: hero.color,
          damage: damage,
          isCrit: isCrit
        });
      });

      setBossHp(prev => Math.max(0, prev - totalTickDamage));
      
      // เก็บ Log แค่ 10 บรรทัดล่าสุดกันเว็บค้าง
      setCombatLogs(prev => [...newLogs, ...prev].slice(0, 10));
      
    }, 1500);

    return () => clearInterval(battleInterval);
  }, [bossHp]);

  // ท่าไม้ตายกิลด์มาสเตอร์ (ผู้เล่นกดเอง)
  const handleUltimate = () => {
    if (isCastingUltimate || bossHp <= 0) return;
    
    setIsCastingUltimate(true);
    const ultimateDamage = Math.floor(Math.random() * 500000) + 1000000; // ดาเมจ 1M - 1.5M
    
    setFloatingDamage(ultimateDamage);
    setBossHp(prev => Math.max(0, prev - ultimateDamage));

    setCombatLogs(prev => [{
      id: Date.now(),
      hero: 'ปรมาจารย์กิลด์ (ท่าน)',
      color: 'text-amber-400',
      damage: ultimateDamage,
      isCrit: true,
      isUltimate: true
    }, ...prev].slice(0, 10));

    setTimeout(() => {
      setIsCastingUltimate(false);
      setFloatingDamage(null);
    }, 2000); // คูลดาวน์ปุ่ม 2 วินาที
  };

  const hpPercent = (bossHp / BOSS_MAX_HP) * 100;

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* 🌑 Header เรดบอส */}
      <header className="relative p-6 border-2 border-orange-900/60 bg-[#0a0202]/90 backdrop-blur-md flex justify-between items-center shadow-[0_15px_40px_rgba(0,0,0,1)] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-red-950 text-red-500 border border-red-800 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-none">Calamity Level</span>
            <span className="text-orange-400 text-xs font-mono animate-pulse">WORLD BOSS EVENT</span>
          </div>
          <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-3">
            <Flame className="text-orange-500 animate-bounce" size={36} /> ราชาเพลิงกัลป์ บาฮามุท (Bahamut)
          </h1>
        </div>
      </header>

      {/* 🐉 พื้นที่สู้รบหลัก (Main Battle Arena) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ฝั่งซ้าย: โชว์บอสและหลอดเลือด (กินพื้นที่ 2 ส่วน) */}
        <div className="lg:col-span-2 border-2 border-[#5c1a1a] bg-[#0a0202]/80 backdrop-blur-md p-8 relative flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 to-transparent pointer-events-none" />
          
          {/* เอฟเฟกต์ตัวเลขดาเมจลอย (Floating Damage) */}
          {floatingDamage && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black font-serif text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,1)] z-50 animate-slide-in-up pointer-events-none">
              -{floatingDamage.toLocaleString()}!
            </div>
          )}

          {/* ไอคอนบอสขนาดยักษ์ */}
          <div className={`relative z-10 mb-10 p-8 rounded-full border-4 ${bossHp > 0 ? 'border-orange-500/50 bg-black/50 shadow-[0_0_50px_rgba(234,88,12,0.3)] animate-[pulse_3s_infinite]' : 'border-stone-800 bg-stone-900 grayscale'}`}>
            <Skull size={120} className={`${bossHp > 0 ? 'text-orange-500' : 'text-stone-700'}`} />
            {bossHp > 0 && <Flame size={60} className="absolute -top-4 -right-4 text-red-500 animate-bounce" />}
          </div>

          {/* หลอดเลือดมหาประลัย (Mega HP Bar) */}
          <div className="w-full max-w-2xl relative z-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-red-500 font-black font-serif text-lg tracking-widest drop-shadow-md">HP</span>
              <span className="text-white font-mono font-bold text-xl drop-shadow-md">{bossHp.toLocaleString()} / {BOSS_MAX_HP.toLocaleString()}</span>
            </div>
            <div className="w-full h-6 bg-[#1a0505] border-2 border-red-900 rounded-none overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,0.8)]">
              {/* แถบสีแดงกะพริบเวลาเลือดลด */}
              <div 
                className="h-full bg-gradient-to-r from-red-800 via-red-500 to-orange-500 transition-all duration-300 relative"
                style={{ width: `${hpPercent}%` }}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30 animate-[slide_2s_linear_infinite]" />
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-orange-400/80 font-mono font-bold">
              {hpPercent.toFixed(2)}% REMAINING
            </div>
          </div>

          {bossHp <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 animate-fade-in">
              <h2 className="text-6xl font-black text-amber-500 font-serif uppercase tracking-[0.3em] drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]">
                Victory!
              </h2>
            </div>
          )}
        </div>

        {/* ฝั่งขวา: แผงควบคุมและ Combat Log */}
        <div className="flex flex-col gap-6">
          
          {/* ปุ่มคำสั่งกิลด์มาสเตอร์ */}
          <div className="border-2 border-amber-900/60 bg-[#150a05]/90 p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
            <Crown size={32} className="text-amber-500 mb-3" />
            <h3 className="text-lg font-bold font-serif text-amber-400 mb-1">คำสั่งศักดิ์สิทธิ์</h3>
            <p className="text-[10px] text-amber-200/60 mb-5 max-w-[200px]">ปลดปล่อยพลังเวททำลายล้างสูงสุด สนับสนุนกองกำลังแนวหน้า</p>
            
            <button 
              onClick={handleUltimate}
              disabled={isCastingUltimate || bossHp <= 0}
              className={`w-full py-4 border-2 font-black font-serif uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden group
                ${isCastingUltimate || bossHp <= 0 
                  ? 'bg-stone-900 border-stone-700 text-stone-500 cursor-not-allowed' 
                  : 'bg-gradient-to-b from-amber-600 to-orange-700 border-amber-400 text-white hover:from-amber-500 hover:to-orange-600 hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]'
                }`}
            >
              {isCastingUltimate ? 'กำลังร่ายมหาเวท...' : <><Zap size={18} /> ลงทัณฑ์สวรรค์ (1M DMG)</>}
              {(!isCastingUltimate && bossHp > 0) && <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shine_1s_infinite]" />}
            </button>
          </div>

          {/* หน้าต่างรายงานความเสียหาย (Combat Log) */}
          <div className="flex-1 border-2 border-[#3a1a1a] bg-[#0a0505]/90 p-5 flex flex-col shadow-lg overflow-hidden">
            <h3 className="text-xs font-bold font-serif text-stone-400 mb-4 flex items-center gap-2 border-b border-[#3a1a1a] pb-2 uppercase tracking-widest">
              <Crosshair size={14} /> รายงานสมรภูมิรบ
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {combatLogs.length === 0 ? (
                <div className="text-center text-xs text-stone-600 font-serif italic mt-10">กองกำลังกำลังเข้าปะทะ...</div>
              ) : combatLogs.map(log => (
                <div key={log.id} className={`text-[11px] p-2 border-l-2 bg-black/40 animate-slide-in-right ${log.isUltimate ? 'border-amber-500 bg-amber-950/30' : log.isCrit ? 'border-red-500' : 'border-stone-700'}`}>
                  <div className="flex justify-between items-start">
                    <span className={`font-serif font-bold ${log.color}`}>{log.hero}</span>
                    <span className={`font-mono font-bold ${log.isUltimate ? 'text-amber-400 text-[13px]' : log.isCrit ? 'text-red-400 text-[12px]' : 'text-stone-300'}`}>
                      {log.isCrit && !log.isUltimate && <span className="text-[9px] text-red-500 mr-1">CRIT!</span>}
                      -{log.damage.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}