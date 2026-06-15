import { useState, useEffect } from 'react';
import { Skull, TrendingUp, Sparkles, Gem, ArrowDownRight, ArrowUpRight, Flame, Dices, Coins } from 'lucide-react';

export default function BlackMarket() {
  const [activeSubTab, setActiveSubTab] = useState('gacha');
  const [marketStocks, setMarketStocks] = useState([
    { id: 1, name: 'ผลึกเวทมนตร์บริสุทธิ์', price: 4500, trend: 'up', change: '+12.5%' },
    { id: 2, name: 'แร่เหล็กทมิฬ (Dark Iron)', price: 1200, trend: 'down', change: '-5.2%' },
    { id: 3, name: 'เกล็ดมังกรเพลิง', price: 18500, trend: 'up', change: '+24.1%' },
    { id: 4, name: 'น้ำตาเอลฟ์ (Elf Tears)', price: 8900, trend: 'down', change: '-2.8%' },
  ]);
  const [isRolling, setIsRolling] = useState(false);
  const [summonResult, setSummonResult] = useState(null);

  // จำลองกราฟราคาหุ้นไอเทมขยับทุกๆ 3 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStocks(prev => prev.map(stock => {
        const isUp = Math.random() > 0.5;
        const changePercent = (Math.random() * 15).toFixed(1);
        const priceChange = stock.price * (changePercent / 100);
        const newPrice = isUp ? stock.price + priceChange : stock.price - priceChange;
        return {
          ...stock,
          price: Math.max(100, Math.floor(newPrice)),
          trend: isUp ? 'up' : 'down',
          change: `${isUp ? '+' : '-'}${changePercent}%`
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
// 🎲 ระบบสุ่มกาชาของจริง! ยิง API ไปหักเงิน 100k G
const handleSummon = async () => {
  setIsRolling(true);
  setSummonResult(null);

  // 1. กำหนดสเปคตัวละคร (เพิ่มการสุ่มตัวเลขรหัส 4 หลัก ให้ชื่อไม่ซ้ำกัน!)
  const isSuperRare = Math.random() > 0.85;
  const randomId = Math.floor(Math.random() * 9000) + 1000; // สุ่มเลข 1000 - 9999
  
  const gachaData = {
    // 🟢 ถ้าเป็นตัวเกลือ ให้เติมรหัสต่อท้าย เช่น "ทหารรับจ้างนิรนาม #4592"
    name: isSuperRare ? 'ลอร์ด อาร์คัส (อัศวินมังกร)' : `ทหารรับจ้างนิรนาม #${randomId}`,
    adventurerClass: isSuperRare ? 'ผู้พิทักษ์' : 'นักรบ',
    element: isSuperRare ? 'แสงสว่าง' : 'ดิน',
    rank: isSuperRare ? 'S+' : 'B'
  };

  try {
    // 2. ยิงคำสั่งไปให้ Node.js หลังบ้านหักเงินและบันทึกลง Database
    const res = await fetch('http://localhost:3000/api/blackmarket/summon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gachaData)
    });
    
    const data = await res.json();

    // 3. หน่วงเวลาโชว์แอนิเมชันลุ้นกาชา 2 วินาที
    setTimeout(() => {
      setIsRolling(false);
      if (res.ok) {
        setSummonResult({
          name: gachaData.name,
          rank: gachaData.rank,
          class: gachaData.adventurerClass,
          color: isSuperRare ? 'text-purple-400 border-purple-500 shadow-purple-500/50' : 'text-stone-400 border-stone-500 shadow-stone-500/50'
        });
      } else {
        alert(`❌ ${data.error}`); // แจ้งเตือนถ้าเงินไม่พอ หรือบังเอิญสุ่มได้ ลอร์ด อาร์คัส ซ้ำรอบสอง!
      }
    }, 2000);

  } catch (err) {
    setIsRolling(false);
    console.error("กระแสเวทกาชาปั่นป่วน:", err); // 🟢 ดึง err มาใช้งานจริงเพื่อดับไฟเตือนสีส้ม
    alert('❌ พลังเวทหลังบ้านขัดข้อง ไม่สามารถเชื่อมต่อ Database ได้');
  }
};

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* 🌑 Header ตลาดมืด */}
      <header className="relative p-6 border-2 border-[#5c1a1a] bg-[#0a0505]/80 backdrop-blur-md flex justify-between items-center overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-widest text-red-500 font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-3">
            <Skull className="text-red-600 animate-pulse" size={32} /> ตลาดมืดใต้ดิน (Black Market)
          </h1>
          <p className="mt-2 text-xs text-red-400/70 font-serif tracking-wider">
            ดินแดนไร้กฎหมาย • ศูนย์รวมกาชา สัญญาจ้างทาส และกระดานเทรดของเถื่อน
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <button onClick={() => setActiveSubTab('gacha')} className={`px-4 py-2 font-serif font-bold text-xs border ${activeSubTab === 'gacha' ? 'bg-red-900/40 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-black/40 border-[#3a1a1a] text-stone-500 hover:text-red-400'}`}>🎲 วิหารอัญเชิญ</button>
          <button onClick={() => setActiveSubTab('trade')} className={`px-4 py-2 font-serif font-bold text-xs border ${activeSubTab === 'trade' ? 'bg-amber-900/40 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-black/40 border-[#3a1a1a] text-stone-500 hover:text-amber-400'}`}>📈 กระดานเทรดสมบัติ</button>
          <button onClick={() => setActiveSubTab('smelt')} className={`px-4 py-2 font-serif font-bold text-xs border ${activeSubTab === 'smelt' ? 'bg-purple-900/40 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-black/40 border-[#3a1a1a] text-stone-500 hover:text-purple-400'}`}>🌋 แท่นหลอมวิญญาณ</button>
        </div>
      </header>

      {/* 🎲 TAB 1: ระบบสุ่มกาชา (Gacha Summon) */}
      {activeSubTab === 'gacha' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="border-2 border-[#5c1a1a] bg-[#0a0505]/80 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
            <Dices size={48} className="text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <h2 className="text-xl font-bold font-serif text-[#e1d5c1] mb-2">อัญเชิญสหายระดับ VIP</h2>
            <p className="text-xs text-stone-400 mb-8 max-w-sm">จ่าย 100,000 G เพื่อสุ่มเรียกนักรบระดับสูง โอกาสได้รับ Rank S+ ขึ้นไป (1.5%) รับประกัน Rank B ขึ้นไป</p>
            
            <button 
              onClick={handleSummon}
              disabled={isRolling}
              className={`relative px-8 py-3 bg-[#1a0505] border border-red-500 text-red-500 font-bold font-serif uppercase tracking-widest hover:bg-red-950 hover:text-white transition-all overflow-hidden group ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRolling ? 'กำลังร่ายเวทอัญเชิญ...' : 'จ่าย 100,000 G เพื่ออัญเชิญ'}
              <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_infinite]" />
            </button>
          </div>

          <div className="border-2 border-dashed border-[#5c1a1a] bg-black/40 backdrop-blur-sm p-8 flex items-center justify-center">
            {isRolling ? (
              <div className="flex flex-col items-center gap-4 animate-pulse">
                <Sparkles size={40} className="text-amber-500 animate-spin" />
                <span className="text-amber-500 font-serif text-sm tracking-widest">วงเวทกำลังทำงาน...</span>
              </div>
            ) : summonResult ? (
              <div className={`flex flex-col items-center gap-3 p-6 border-2 bg-black/80 shadow-2xl animate-bounce-in ${summonResult.color}`}>
                <div className="text-4xl font-black font-serif tracking-widest">{summonResult.rank}</div>
                <div className="text-lg font-bold text-white">{summonResult.name}</div>
                <div className="text-xs uppercase tracking-widest">{summonResult.class}</div>
              </div>
            ) : (
              <div className="text-stone-600 font-serif text-sm italic flex flex-col items-center gap-2">
                <Skull size={30} className="opacity-30" />
                แท่นวางวิญญาณยังว่างเปล่า...
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📈 TAB 2: กระดานเทรดสมบัติ (Trading Floor) */}
      {activeSubTab === 'trade' && (
        <div className="border-2 border-[#5c3a1a] bg-[#0a0705]/80 backdrop-blur-md p-6 animate-fade-in shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          <div className="flex justify-between items-center mb-6 border-b border-[#5c3a1a] pb-3">
            <h2 className="text-lg font-bold font-serif text-amber-500 flex items-center gap-2"><TrendingUp size={20}/> ดัชนีตลาดมืด (Black Market Index)</h2>
            <div className="text-xs text-amber-500/50 font-mono animate-pulse">Live Data Syncing...</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketStocks.map(stock => (
              <div key={stock.id} className="bg-[#1a110a] border border-[#3a2211] p-4 flex justify-between items-center hover:bg-[#2a1a0f] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black flex items-center justify-center border border-[#5c3a1a]">
                    <Gem size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#e1d5c1] font-serif">{stock.name}</div>
                    <div className="text-[10px] text-stone-500">Vol: {Math.floor(Math.random() * 10000)} หน่วย</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-400 font-mono">{stock.price.toLocaleString()} <span className="text-[10px]">G</span></div>
                  <div className={`text-[11px] font-bold flex items-center justify-end gap-1 ${stock.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stock.trend === 'up' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {stock.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🌋 TAB 3: แท่นหลอมวิญญาณ (Smelting) */}
      {activeSubTab === 'smelt' && (
        <div className="border-2 border-purple-900/60 bg-[#07050a]/80 backdrop-blur-md p-8 text-center animate-fade-in shadow-[0_0_30px_rgba(88,28,135,0.4)]">
          <Flame size={50} className="text-purple-500 mx-auto mb-4 animate-pulse drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
          <h2 className="text-2xl font-black font-serif text-purple-400 mb-2 tracking-widest">แท่นหลอมศิลาอาถรรพ์</h2>
          <p className="text-xs text-purple-300/60 mb-8 max-w-md mx-auto">นำไอเทมระดับ F จำนวน 10 ชิ้น มาสังเวยเพื่อสุ่มหลอมรวมเป็นไอเทมระดับสูง</p>
          
          <div className="flex justify-center items-center gap-6">
            <div className="w-24 h-24 border-2 border-dashed border-stone-600 bg-black flex flex-col items-center justify-center text-stone-500 hover:border-purple-500 hover:text-purple-400 cursor-pointer transition-colors">
              <span className="text-3xl">+</span>
              <span className="text-[10px] uppercase tracking-widest mt-1">เลือกวัสดุ</span>
            </div>
            <div className="text-purple-500 font-black text-2xl animate-pulse">»</div>
            <div className="w-24 h-24 border-2 border-purple-500 bg-[#1a0b2e] flex flex-col items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <span className="text-3xl">?</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}