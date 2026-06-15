import { useState, useRef } from 'react';
import { Lock, Key, Sparkles, Box, Unlock, Gem } from 'lucide-react';

const relicPool = [
  { id: 1, name: 'เศษเหล็กขึ้นสนิม', rarity: 'C', color: 'border-stone-500 text-stone-400 bg-stone-900/50', chance: 40 },
  { id: 2, name: 'สนับมือทองเหลือง', rarity: 'B', color: 'border-blue-500 text-blue-400 bg-blue-900/50', chance: 30 },
  { id: 3, name: 'ดาบอัศวินผู้พิทักษ์', rarity: 'A', color: 'border-purple-500 text-purple-400 bg-purple-900/50', chance: 20 },
  { id: 4, name: 'ปืนเวทมนตร์มังกรคำราม', rarity: 'S', color: 'border-pink-500 text-pink-400 bg-pink-900/50', chance: 9 },
  { id: 5, name: '★ มีดสั้นใยแมงมุมเลือด', rarity: 'SS', color: 'border-red-500 text-red-500 bg-red-950/80 shadow-[0_0_15px_rgba(239,68,68,0.8)]', chance: 1 },
];

export default function RelicUnbox({ onBuyKey }) {
  const [keys, setKeys] = useState(5);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState(null);
  const [rouletteItems, setRouletteItems] = useState([]);
  const trackRef = useRef(null);

  const buyKey = () => {
    const keyPrice = 2500;
    if (onBuyKey) {
      onBuyKey(keyPrice);
      setKeys(prev => prev + 1);
    }
  };

  const generateRoulette = () => {
    const items = [];
    for (let i = 0; i < 80; i++) {
      const rand = Math.random() * 100;
      let selected = relicPool[0];
      let cumulative = 0;
      for (const item of relicPool) {
        cumulative += item.chance;
        if (rand <= cumulative) { selected = item; break; }
      }
      items.push({ ...selected, uniqueId: i });
    }
    
    const winningRand = Math.random() * 100;
    let winningItem = relicPool[0];
    let winCum = 0;
    for (const item of relicPool) {
      winCum += item.chance;
      if (winningRand <= winCum) { winningItem = item; break; }
    }
    items[75] = { ...winningItem, uniqueId: 75, isWinner: true };
    setRouletteItems(items);
    return winningItem;
  };

  const handleOpenCase = () => {
    if (keys <= 0 || isOpening) return;
    setKeys(prev => prev - 1);
    setIsOpening(true);
    setWonItem(null);
    
    const winner = generateRoulette();

    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(0px)`;
      void trackRef.current.offsetWidth; 
      
      // 🎯 คำนวณระยะหยุดเป๊ะๆ ไม่เพี้ยนสะสมแล้ว
      const cardWidth = 144; // ขนาดการ์ด w-36 คือ 144px
      const gap = 16;        // ระยะห่าง gap-4 คือ 16px
      const itemWidth = cardWidth + gap; // ใช้พื้นที่ 160px ต่อการ์ด 1 ใบ
      
      const randomOffset = Math.random() * 80 - 40; 
      // ขยับเลื่อนไป 75 ใบ แล้วถอยหลังมาครึ่งใบ เพื่อให้จุดกึ่งกลางของใบที่ 75 ตรงกับเส้นพอดี
      const stopPosition = -(75 * itemWidth) - (cardWidth / 2) + randomOffset;

      trackRef.current.style.transition = 'transform 6s cubic-bezier(0.15, 0.9, 0.15, 1)';
      trackRef.current.style.transform = `translateX(${stopPosition}px)`;
    }

    setTimeout(() => {
      setWonItem(winner);
      setIsOpening(false);
    }, 6200);
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10 flex flex-col items-center w-full">
      <header className="w-full relative p-6 border-2 border-cyan-900/60 bg-[#02050a]/90 backdrop-blur-md flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-3xl font-black tracking-widest text-cyan-400 font-serif flex items-center gap-3"><Box size={32} /> หอสมบัติปริศนา (Mystic Cases)</h1>
          <p className="mt-2 text-xs text-cyan-200/60 font-serif">ไขกุญแจเวทมนตร์เพื่อปลดผนึกหีบสมบัติโบราณ ลุ้นรับอาวุธระดับตำนาน</p>
        </div>
        <div className="flex items-center gap-4 bg-black/50 p-3 border border-cyan-900/50">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-mono"><Key size={18} /> x {keys}</div>
          <button onClick={buyKey} className="px-3 py-1 bg-cyan-950 border border-cyan-500 text-cyan-400 text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-900 transition-colors">+ ซื้อกุญแจ (2,500 G)</button>
        </div>
      </header>

      <div className="w-full max-w-5xl mt-8 mb-4">
        <div className="relative w-full h-48 bg-[#0a0c10] border-y-4 border-cyan-900/80 overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-amber-500 z-20 shadow-[0_0_15px_rgba(245,158,11,1)]" />
          <div className="absolute top-0 bottom-0 left-1/2 w-32 -ml-16 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent z-10 pointer-events-none" />
          
          {/* 🎯 เซ็ต Padding เริ่มต้นไว้ที่ 50% ของกล่อง เพื่อให้การ์ดใบแรกโผล่มาตรงกลางเป๊ะๆ */}
          <div ref={trackRef} className="absolute top-0 left-0 h-full flex items-center gap-4" style={{ paddingLeft: '50%' }}>
            {rouletteItems.map((item, idx) => (
              <div key={idx} className={`w-36 h-36 flex-shrink-0 flex flex-col items-center justify-center border-2 bg-black/80 p-2 text-center relative overflow-hidden ${item.color}`}>
                <div className="text-3xl mb-2">{item.rarity === 'SS' ? '🔪' : item.rarity === 'S' ? '🔫' : '🛡️'}</div>
                <div className="text-[10px] font-bold font-serif leading-tight">{item.name}</div>
                <div className="absolute bottom-1 right-2 text-[8px] opacity-50">{item.rarity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleOpenCase} disabled={isOpening || keys <= 0} className={`px-12 py-4 border-2 font-black font-serif uppercase tracking-widest flex items-center gap-3 transition-all relative overflow-hidden group ${isOpening || keys <= 0 ? 'bg-stone-900 border-stone-700 text-stone-500 cursor-not-allowed' : 'bg-gradient-to-b from-cyan-700 to-blue-900 border-cyan-400 text-white hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]'}`}>
        {isOpening ? <><Sparkles className="animate-spin" size={20} /> กำลังปลดผนึก...</> : keys <= 0 ? <><Lock size={20} /> กุญแจไม่พอ</> : <><Unlock size={20} /> ปลดผนึกกล่องวิเศษ (ใช้ 1 กุญแจ)</>}
      </button>

      {wonItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className={`p-10 border-4 flex flex-col items-center bg-black/90 shadow-2xl ${wonItem.color}`}>
            <h2 className="text-sm font-bold text-stone-400 font-serif tracking-widest mb-4">ท่านได้รับไอเทม</h2>
            <div className="text-6xl mb-6">{wonItem.rarity === 'SS' ? '🔪' : wonItem.rarity === 'S' ? '🔫' : '🛡️'}</div>
            <div className="text-2xl font-black font-serif mb-2">{wonItem.name}</div>
            
            {/* 📦 ปุ่มยิง API เข้า Database จริง */}
            <button 
              onClick={async () => {
                try {
                  const res = await fetch('http://localhost:3000/api/relic/add-to-inventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: wonItem.name, rarity: wonItem.rarity })
                  });
                  
                  if (res.ok) {
                    setWonItem(null); 
                  } else {
                    alert("❌ ศิลาเวทคลังแสงปฏิเสธไอเทมชิ้นนี้");
                  }
                } catch (err) {
                  console.error(err);
                  setWonItem(null);
                }
              }} 
              className="mt-8 px-6 py-2 bg-transparent border border-current hover:bg-white/10 text-xs font-bold transition-all uppercase tracking-widest"
            >
              🔒 บันทึกจารึกเข้าคลังแสงกิลด์จริง
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}