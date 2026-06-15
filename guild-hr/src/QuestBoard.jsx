// guild-hr/src/QuestBoard.jsx
import { useState, useEffect } from 'react';
import { ScrollText, Plus, Sword, Check, X, Gift } from 'lucide-react';

export default function QuestBoard({ adventurers = [], refreshMainData }) {
  const [quests, setQuests] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAdvId, setSelectedAdvId] = useState('');

  // 📝 State สำหรับฟอร์มสร้างเควส
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('F');
  const [reward, setReward] = useState(1000);
  const [item, setItem] = useState('');

  const fetchQuests = () => {
    fetch('http://localhost:3000/api/quests')
      .then(res => res.json())
      .then(data => setQuests(data));
  };

  useEffect(() => { fetchQuests(); }, []);

  const addQuest = async (e) => {
    e.preventDefault();
    if(!title) return;

    await fetch('http://localhost:3000/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, difficulty, reward, item })
    });
    
    // เคลียร์ฟอร์มหลังสร้างเสร็จ
    setTitle('');
    setItem('');
    setReward(1000);
    setDifficulty('F');
    fetchQuests();
  };

  const handleAssign = async (questId) => {
    if(!selectedAdvId) return alert('❌ โปรดเลือกนักผจญภัยก่อนจ่ายงาน!');
    
    await fetch(`http://localhost:3000/api/quests/${questId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adventurerId: selectedAdvId })
    });
    
    setAssigningId(null);
    setSelectedAdvId('');
    fetchQuests();
    if(refreshMainData) refreshMainData(); 
  };

  const availableAdvs = adventurers.filter(a => a.status === 'กำลังสำรวจ' || a.status === 'ลาพักฟื้น');

  return (
    <div className="bg-[#0f1120] border border-[#1e2240] rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2"><ScrollText /> กระดานภารกิจ (Quest Board)</h2>
      </div>
      
      {/* 🛠️ แผงควบคุมสร้างเควส (Custom Form) */}
      <form onSubmit={addQuest} className="bg-[#15182e] border border-[#1e2240] p-4 rounded-lg mb-6 space-y-3 shadow-inner">
        <div className="flex gap-2">
          <input required className="flex-1 bg-[#0d0f1a] border border-[#2a2f55] p-2.5 rounded-lg text-white outline-none focus:border-purple-500 transition-colors text-sm" value={title} onChange={e => setTitle(e.target.value)} placeholder="🗡️ ชื่อภารกิจที่ต้องการประกาศ..." />
          <button type="submit" className="bg-purple-600 px-6 py-2.5 rounded-lg text-white font-bold flex items-center gap-2 hover:bg-purple-500 transition-all shadow-lg"><Plus size={16}/> ประกาศเควส</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wider">ระดับความยาก</label>
            <select className="w-full bg-[#0d0f1a] border border-[#2a2f55] p-2 rounded-lg text-amber-400 font-bold outline-none text-sm" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="F">แรงค์ F (ผู้เริ่มต้น)</option>
              <option value="D">แรงค์ D (ระดับล่าง)</option>
              <option value="C">แรงค์ C (ระดับกลาง)</option>
              <option value="B">แรงค์ B (ระดับสูง)</option>
              <option value="A">แรงค์ A (แนวหน้า)</option>
              <option value="S">แรงค์ S (ระดับตำนาน)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wider">เงินรางวัล (ทอง)</label>
            <input type="number" min="0" className="w-full bg-[#0d0f1a] border border-[#2a2f55] p-2 rounded-lg text-emerald-400 font-bold outline-none text-sm" value={reward} onChange={e => setReward(e.target.value)} />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wider">ไอเทมพิเศษ (ถ้ามี)</label>
            <input type="text" className="w-full bg-[#0d0f1a] border border-[#2a2f55] p-2 rounded-lg text-cyan-300 outline-none text-sm" value={item} onChange={e => setItem(e.target.value)} placeholder="เช่น: ดาบเวทมนตร์, ยาฟื้นฟู" />
          </div>
        </div>
      </form>

      {/* 📋 รายการเควส */}
      <div className="space-y-3">
        {quests.filter(q => q.status === 'AVAILABLE').length === 0 && <div className="text-xs text-gray-500 text-center py-6 border border-dashed border-[#1e2240] rounded-lg">ยังไม่มีเควสว่างในกระดาน...</div>}
        
        {quests.filter(q => q.status === 'AVAILABLE').map(q => (
          <div key={q.id} className="bg-[#1a1d2e] p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center border border-[#1e2240] hover:border-purple-500/30 transition-colors gap-4">
            <div>
              <div className="text-white font-bold text-sm">{q.title}</div>
              <div className="text-xs text-gray-400 mt-2 flex flex-wrap gap-2">
                <span className="bg-[#0d0f1a] px-2 py-1 rounded border border-[#2a2f55]">ระดับ: <span className="text-amber-400 font-bold">{q.difficulty}</span></span> 
                <span className="bg-[#0d0f1a] px-2 py-1 rounded border border-[#2a2f55]">รางวัล: <span className="text-emerald-400 font-bold">{q.reward.toLocaleString()}</span> ทอง</span>
                {q.item && (
                  <span className="bg-[#0f172a] px-2 py-1 rounded border border-[#1e293b] text-cyan-300 flex items-center gap-1">
                    <Gift size={12}/> {q.item}
                  </span>
                )}
              </div>
            </div>
            
            {assigningId === q.id ? (
              <div className="flex items-center gap-2 animate-fade-in shrink-0">
                <select className="bg-[#12152a] border border-purple-500/50 text-xs p-2.5 rounded-lg text-white outline-none" value={selectedAdvId} onChange={e => setSelectedAdvId(e.target.value)}>
                  <option value="">-- เลือกผู้ทำภารกิจ --</option>
                  {availableAdvs.map(a => <option key={a.id} value={a.id}>[{a.rank}] {a.name}</option>)}
                </select>
                <button onClick={() => handleAssign(q.id)} className="bg-emerald-600 p-2.5 rounded-lg text-white hover:bg-emerald-500 transition-colors shadow-lg"><Check size={16}/></button>
                <button onClick={() => setAssigningId(null)} className="bg-red-600/20 p-2.5 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-colors"><X size={16}/></button>
              </div>
            ) : (
              <button onClick={() => setAssigningId(q.id)} className="text-xs bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-4 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shrink-0">
                <Sword size={14}/> จ่ายงาน
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}