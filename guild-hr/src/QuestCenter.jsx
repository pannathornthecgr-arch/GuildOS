import React, { useState, useEffect } from 'react';

export default function QuestCenter() {
  const [quests, setQuests] = useState([]);
  const [title, setTitle] = useState('');
  const [rank, setRank] = useState('C');
  const [reward, setReward] = useState('');
  const [dropItems, setDropItems] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 ดึงเควสจาก Database (เพิ่มตัวกัน Cache)
  const fetchQuests = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/quests?t=${Date.now()}`);
      const data = await res.json();
      setQuests(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching quests:", err);
      setIsLoading(false);
    }
  };

  // ⚡ โหลดข้อมูลครั้งแรก และตั้งเวลารีเฟรชบอร์ดอัตโนมัติทุกๆ 3 วินาที (Live Update!)
  useEffect(() => {
    fetchQuests();
    const interval = setInterval(() => {
      fetchQuests();
    }, 3000);
    return () => clearInterval(interval); // เคลียร์ interval เมื่อปิดหน้านี้
  }, []);

  const handleCreateQuest = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch('http://localhost:3000/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, difficulty: rank, reward: Number(reward) || 0, item: dropItems || "ไม่มีไอเทมดรอป"
        })
      });
      if (res.ok) {
        fetchQuests();
        setTitle(''); setRank('C'); setReward(''); setDropItems('');
      }
    } catch (err) { console.error(err); }
  };

  const handleAssignQuest = async (questId) => {
    try {
      // ดึงรายชื่อคนว่างงาน
      const resAdv = await fetch('http://localhost:3000/api/adventurers');
      let adventurers = await resAdv.json();
      if (adventurers.data) adventurers = adventurers.data; 

      const availableAdvs = adventurers.filter(a => a.status !== 'ออกภารกิจ');
      
      if (availableAdvs.length === 0) {
        alert("❌ ไม่มีนักผจญภัยว่างรับงานเลย! กรุณารอคนกลับมาก่อน");
        return;
      }

      // สุ่มเลือก 1 คน
      const luckyAdv = availableAdvs[Math.floor(Math.random() * availableAdvs.length)];

      const res = await fetch(`http://localhost:3000/api/quests/${questId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: luckyAdv.name }) // 👈 ส่งชื่อไปแทน ID จะได้โชว์สวยๆ
      });

      if (res.ok) {
        fetchQuests();
        alert(`✅ มอบหมายเควสให้ [${luckyAdv.name}] (ยศ ${luckyAdv.rank}) สำเร็จ!`);
      }
    } catch (err) {
      console.error("Error assigning quest:", err);
    }
  };

  // 🎨 ปรับสี Rank ให้เป็นโทนเข้มขลังแบบดาร์กแฟนตาซี
  const getRankStyle = (r) => {
    switch (r) {
      case 'S': return 'bg-[#4a0000]/80 text-[#ff4444] border-[#7a0000]';
      case 'A': return 'bg-[#4a1c00]/80 text-[#ffaa00] border-[#7a2e00]';
      case 'B': return 'bg-[#3a3a00]/80 text-[#ffff44] border-[#5a5a00]';
      case 'C': return 'bg-[#002a00]/80 text-[#44ff44] border-[#004a00]';
      case 'D': return 'bg-[#001c3a]/80 text-[#44aaff] border-[#002e5a]';
      case 'F': return 'bg-[#1a1a1a]/80 text-[#aaaaaa] border-[#3a3a3a]';
      default: return 'bg-[#1a1a1a]/80 text-[#aaaaaa] border-[#3a3a3a]';
    }
  };

  return (
    /* 🌟 แก้ไข 1: เปลี่ยนพื้นหลังหลักเป็นโปร่งใส เพื่อให้ภาพปราสาทจาก App.jsx โชว์ทะลุขึ้นมา */
    <div className="min-h-screen bg-transparent text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b-2 border-double border-[#8b6b4a]/40">
          <div>
            {/* 🌟 แก้ไข 2: ฟอนต์หัวข้อสไตล์ยุคกลาง สีทองขลังๆ */}
            <h1 className="text-3xl font-bold tracking-widest text-[#d4af37] font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              หอประกาศภารกิจ (Quest Center)
            </h1>
            <p className="text-xs text-[#b49b78] mt-2 font-serif tracking-wider">
              บอร์ดลงทะเบียนและบริหารจัดการเควสของสมาคมนักผจญภัย
            </p>
          </div>
          <button onClick={fetchQuests} className="px-4 py-2 bg-[#161210]/80 hover:bg-[#1a1412] text-[#b49b78] rounded-sm shadow-lg shadow-black transition duration-200 border border-[#8b6b4a]/50 flex items-center gap-2 text-xs font-serif">
            <span className="animate-spin-slow">🔄</span> <span>ระบบกำลังดึงข้อมูล Live...</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* กล่องซ้าย: ออกใบประกาศภารกิจ */}
          <section id="quest-form" className="lg:col-span-1">
            {/* 🌟 แก้ไข 3: เปลี่ยนกล่องเป็นแผ่นไม้/กระดาษเก่าขอบทองแดงโปร่งแสง */}
            <div className="bg-[#161210]/70 backdrop-blur-md border-2 border-double border-[#8b6b4a]/60 rounded-sm p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative">
              <h2 className="text-lg font-bold mb-6 text-[#d4af37] font-serif flex items-center gap-2 border-b border-[#8b6b4a]/30 pb-3">
                📜 ออกใบประกาศภารกิจ
              </h2>

              <form onSubmit={handleCreateQuest} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#b49b78] uppercase tracking-widest mb-1.5 font-serif">ชื่อภารกิจ</label>
                  <input type="text" required placeholder="เช่น กำจัดฝูงก็อบลิน" value={title} onChange={(e) => setTitle(e.target.value)} 
                    className="w-full bg-[#0d0a08]/80 border border-[#8b6b4a]/40 rounded-sm px-3 py-2 text-[#e2e8f0] placeholder-[#4a3b2c] focus:outline-none focus:border-[#d4af37] text-sm shadow-inner shadow-black/50" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#b49b78] uppercase tracking-widest mb-1.5 font-serif">ระดับความยาก</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['S', 'A', 'B', 'C', 'D', 'F'].map((r) => (
                      <button key={r} type="button" onClick={() => setRank(r)} 
                        className={`py-1.5 rounded-sm font-bold border transition duration-150 text-xs shadow-black/50 shadow-sm ${
                          rank === r ? 'bg-gradient-to-b from-[#8b6b4a] to-[#5c432a] border-[#d4af37] text-[#1a1412]' : 'bg-[#0d0a08]/80 border-[#8b6b4a]/40 text-[#8b6b4a] hover:border-[#8b6b4a]'
                        }`}>{r}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#b49b78] uppercase tracking-widest mb-1.5 font-serif">เงินรางวัล (Gold)</label>
                  <div className="relative">
                    <input type="number" placeholder="0" value={reward} onChange={(e) => setReward(e.target.value)} 
                      className="w-full bg-[#0d0a08]/80 border border-[#8b6b4a]/40 rounded-sm pl-3 pr-10 py-2 text-[#e2e8f0] placeholder-[#4a3b2c] focus:outline-none focus:border-[#d4af37] text-sm shadow-inner shadow-black/50" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#d4af37] font-bold text-xs font-serif">G</div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#b49b78] uppercase tracking-widest mb-1.5 font-serif">ไอเทมดรอป (ถ้ามี)</label>
                  <input type="text" placeholder="เช่น ดาบผุพัง x1" value={dropItems} onChange={(e) => setDropItems(e.target.value)} 
                    className="w-full bg-[#0d0a08]/80 border border-[#8b6b4a]/40 rounded-sm px-3 py-2 text-[#e2e8f0] placeholder-[#4a3b2c] focus:outline-none focus:border-[#d4af37] text-sm shadow-inner shadow-black/50" />
                </div>
                <button type="submit" 
                  className="w-full mt-6 py-2.5 bg-gradient-to-b from-[#8b6b4a] to-[#5c432a] hover:from-[#a38058] hover:to-[#735435] text-[#1a1412] border border-[#d4af37] font-bold rounded-sm transition duration-200 text-sm shadow-[0_4px_10px_rgba(0,0,0,0.5)] font-serif tracking-wide">
                  📌 ปักหมุดเควสลงกระดาน
                </button>
              </form>
            </div>
          </section>

          {/* กล่องขวา: กระดานรับงาน */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-[#d4af37] flex items-center gap-2 mb-4 font-serif drop-shadow-md">
              ⚔️ กระดานรับงานในสมาคม ({quests.length} เควส)
            </h2>

            {isLoading ? (
              <div className="text-center py-10 text-[#b49b78] text-sm font-serif">กำลังอ่านคัมภีร์ภารกิจจากกิลด์...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests.map((quest) => (
                  /* 🌟 แก้ไข 4: การ์ดเควสเปลี่ยนเป็นทรงแข็งๆ ขอบโลหะเก่า โปร่งแสง */
                  <div key={quest.id} className="bg-[#1a1412]/60 backdrop-blur-sm border border-[#8b6b4a]/50 hover:border-[#d4af37]/80 rounded-sm p-4 shadow-black shadow-lg flex flex-col justify-between transition-all duration-300 group">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`px-2 py-0.5 text-[10px] font-black tracking-widest rounded-sm border ${getRankStyle(quest.difficulty)}`}>RANK {quest.difficulty}</span>
                        {quest.status === 'IN_PROGRESS' ? (
                          <span className="text-[10px] bg-[#3a0000]/60 text-[#ff4444] border border-[#7a0000]/80 px-2 py-0.5 rounded-sm font-bold tracking-widest">ถูกจองแล้ว</span>
                        ) : (
                          <span className="text-[10px] bg-[#002a00]/60 text-[#44ff44] border border-[#004a00]/80 px-2 py-0.5 rounded-sm font-bold tracking-widest animate-pulse">ว่างอยู่</span>
                        )}
                      </div>

                      <h3 className="text-[15px] font-bold text-[#e2e8f0] mb-4 line-clamp-2 leading-snug group-hover:text-[#d4af37] transition duration-200 font-serif">{quest.title}</h3>

                      <div className="space-y-2 border-t border-[#8b6b4a]/30 pt-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[#b49b78]">รางวัลเงินตรา:</span>
                          <span className="font-bold text-[#d4af37] text-sm">{quest.reward?.toLocaleString()} G</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-[#b49b78] shrink-0">ไอเทมสมบัติ:</span>
                          <span className="text-right text-[#94a3b8] truncate max-w-[150px]">{quest.item || 'ไม่มี'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#8b6b4a]/30">
                      {quest.status === 'IN_PROGRESS' ? (
                        <div className="bg-[#0d0a08]/80 rounded-sm px-3 py-2 border border-[#8b6b4a]/30 flex items-center gap-2 shadow-inner shadow-black/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff4444] shadow-[0_0_5px_#ff4444]" />
                          <span className="text-[11px] text-[#b49b78]">รับงานโดย: <strong className="text-[#d4af37] font-serif">{quest.assignedTo}</strong></span>
                        </div>
                      ) : (
                        <button onClick={() => handleAssignQuest(quest.id)} 
                          className="w-full py-2 bg-[#161210] hover:bg-[#2a1f18] text-[#b49b78] hover:text-[#d4af37] text-xs font-bold border border-[#8b6b4a]/50 hover:border-[#d4af37] rounded-sm transition duration-200 font-serif tracking-widest">
                          มอบหมายภารกิจแบบสุ่ม
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(!isLoading && quests.length === 0) && (
              <div className="text-center py-12 bg-[#161210]/60 backdrop-blur-sm border-2 border-dashed border-[#8b6b4a]/40 rounded-sm shadow-black shadow-lg">
                <p className="text-[#b49b78] text-sm font-serif">ยังไม่มีใบประกาศภารกิจค้างอยู่บนกระดานไม้ในขณะนี้...</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}