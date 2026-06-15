import { useState, useEffect } from 'react';
import { Package, Coins } from 'lucide-react';
import { rarityConfig } from './rarityConfig';

// 🏷️ Component ย่อยสำหรับป้ายแรงค์ไอเทมสไตล์ MMORPG คลาสสิก
function RarityBadge({ rarity, config }) {
  return (
    <div className={`px-2 py-0.5 rounded-none text-[10px] font-black tracking-widest uppercase border backdrop-blur-md ${config.badge}`}>
      RANK {rarity}
    </div>
  );
}

// 💰 1. จุดสร้างฟังก์ชันประเมินมูลค่าศาสตราตามเกรดความหายากจริง (ย้ายมาไว้ตรงนี้เพื่อล็อกราคากลางหน้าบ้าน)
const getItemPrice = (rarity) => {
  switch (rarity) {
    case 'SS': case 'LEGENDARY': return 100000; // มหาตำนานสีแดง
    case 'S': case 'EPIC': return 50000;       // ปืนมังกร Epic ของบอส ราคาพุ่งกระฉูดแน่นอน!
    case 'A': case 'RARE': return 15000;
    case 'B': case 'UNCOMMON': return 2500;    // โล่ฟ้า สลักทองเหลือง
    default: return 150;                       // เศษเหล็ก เกลือทั่วไป
  }
};

export default function GuildArmory() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [treasury, setTreasury] = useState(0);

  const fetchArmoryData = () => {
    fetch(`http://localhost:3000/api/inventory?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => { setItems(data); setIsLoading(false); })
      .catch(err => console.error(err));

    fetch(`http://localhost:3000/api/treasury?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setTreasury(data.totalGold || 0))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchArmoryData();
    const liveInterval = setInterval(() => {
      fetchArmoryData();
    }, 5000);
    return () => clearInterval(liveInterval);
  }, []);

  // 🪙 ฟังก์ชันยิง API ขายยุทธภัณฑ์หลวง หักจำนวนชิ้น + ทองคำเด้งเข้าคลังหลังบ้านจริง!
  const handleSellItem = async (item) => {
    // ดึงราคากลางมาเช็คเพื่อแสดงความขลังก่อนกดยืนยัน
    const price = getItemPrice(item.rarity);
    
    if (!window.confirm(`📜 ท่านต้องการส่งมอบศาสตรา [Rank ${item.rarity}] ${item.itemName} คืนสู่สมาคมเพื่อแลกเปลี่ยนเป็นเงินทองจำนวน ${price.toLocaleString()} G หรือไม่?`)) {
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/inventory/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }) // ยิงไอดีไอเทมไปให้ SQLite จัดการ
      });
      
      if (res.ok) {
        // 🔄 รีเฟรชดึงข้อมูลคลังแสงและยอดเงินคงเหลือใหม่ทันที
        fetchArmoryData(); 
      } else {
        const errorData = await res.json();
        alert(`❌ ศิลาคลังแสงปฏิเสธ: ${errorData.error}`);
      }
    } catch (err) { 
      console.error("ระบบเวทมนตร์แลกเปลี่ยนขัดข้อง:", err); 
    }
  };
  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      
      {/* Header พงศาวดารยุคกลาง */}
      <header className="relative pb-5 border-b-2 border-double border-[#8b6b4a]/40">
        <h1 className="text-3xl font-bold tracking-widest text-[#d4af37] font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
          ⚔️ คลังสรรพาวุธหลวงกิลด์ (Guild Armory)
        </h1>
        <p className="mt-1 text-xs text-[#b49b78] font-serif tracking-wider">
          Royal Treasury of the Guild • บันทึกบัญชีสิ่งประดิษฐ์และศัตราวุธเวทมนตร์ในคลังสมบัติ
        </p>
      </header>

      {/* แผงทองคำในคลัง */}
      <div className="bg-[#161210]/70 backdrop-blur-md border-2 border-[#8b6b4a] p-4 rounded-none inline-flex items-center gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
        <div className="w-10 h-10 bg-[#241a15] border border-[#d4af37] flex items-center justify-center shadow-inner shadow-black/50">
          <Coins className="text-[#d4af37] animate-pulse" size={22} />
        </div>
        <div>
          <div className="text-[10px] text-[#a48463] font-serif font-bold uppercase tracking-widest">ทองคำคงเหลือในคลังมหาสมบัติ</div>
          <div className="text-2xl font-black font-serif text-[#ffd700] tracking-wide">{treasury.toLocaleString()} <span className="text-xs font-normal text-[#8c7159]">G</span></div>
        </div>
      </div>

      {/* ส่วนกระดานตู้โชว์ไอเทม */}
      {isLoading ? (
        <div className="text-center py-12 text-[#b49b78] text-sm font-serif italic">กำลังร่ายเวทเปิดบานประตูกลไกตรวจสอบคลังอาวุธ...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const config = rarityConfig[item.rarity] || rarityConfig['F'];
            
            // 💰 2. เปลี่ยนจุดดักตัวแปรตรงนี้! จากของเดิมที่ดึงไฟล์นอก ให้หันมาคำนวณผ่านฟังก์ชันกลางหน้าบ้านโดยตรง
            const calculatedPrice = getItemPrice(item.rarity);

            return (
              <div 
                key={item.id} 
                className={`group relative overflow-hidden bg-[#1a1412]/60 backdrop-blur-sm border rounded-none p-4 shadow-black shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1`}
                style={{ borderColor: config.border ? '' : 'rgba(139, 107, 74, 0.4)' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/5 via-transparent to-black/30 pointer-events-none transition-all duration-500" />
                <div className={`absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none ${config.glow}`} />

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-10 h-10 rounded-none bg-[#0d0a08]/80 border border-[#8b6b4a]/50 flex items-center justify-center text-2xl shadow-inner shadow-black filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {item.icon || '📦'}
                    </div>
                    <RarityBadge rarity={item.rarity} config={config} />
                  </div>

                  <div className="space-y-1">
                    <h3 className={`text-[15px] font-bold tracking-wide font-serif ${config.text} group-hover:text-[#ffd700] transition-colors duration-200`}>
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-[#c7b9a5] font-serif leading-relaxed line-clamp-2 h-9">
                      {item.description || 'ไร้ซึ่งถ้อยคำจารึกอธิบายที่มาของสิ่งวิเศษโบราณชิ้นนี้...'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#8b6b4a]/30 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-[#b49b78] uppercase font-serif">จำนวนในครอบครอง</div>
                    <div className="text-xs font-bold font-mono text-[#e1d5c1]">x {item.quantity} <span className="text-[10px] text-stone-500">ชิ้น</span></div>
                  </div>
                  
                  {/* ✅ ของใหม่: ส่งอ็อบเจกต์ไอเทมไปตรวจสอบเกรดความหายากแบบละเอียด บรรทัดนี้เลยครับบอส! */}
                  <button 
                    onClick={() => handleSellItem(item)}
                    className="bg-[#161210] hover:bg-[#3d1111]/40 border border-[#8b6b4a]/50 hover:border-red-500/80 text-[#b49b78] hover:text-red-400 px-3 py-2 rounded-none text-xs font-serif font-bold transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-black"
                  >
                    🪙 แลกเปลี่ยน {calculatedPrice.toLocaleString()} G
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}