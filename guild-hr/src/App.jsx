// guild-hr/src/App.jsx
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Shield, Sword, Wand2, Wind, Sun, 
  Droplets, Flame, Moon, Plus, X, Users, Trophy, Coins, ScrollText,
  Target, Heart, Axe, Ghost, Store, Zap, Mountain, Snowflake, Skull, Leaf, Edit, Trash2, Dices
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// ข้อมูลกราฟจำลองความเติบโตของกิลด์
const chartData = [
  { name: 'ก.พ.', wealth: 14200, success: 82, bounty: 9800 },
  { name: 'มี.ค.', wealth: 15800, success: 85, bounty: 10200 },
  { name: 'เม.ย.', wealth: 19258, success: 93.7, bounty: 14500 },
  { name: 'พ.ค.', wealth: 22400, success: 91.2, bounty: 16800 },
  { name: 'มิ.ย.', wealth: 28100, success: 95.4, bounty: 19258 },
];

export default function GuildDashboard() {
  const [adventurers, setAdventurers] = useState([]);
  const [dungeonLogs, setDungeonLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDungeonModal, setShowDungeonModal] = useState(false);
  const [selectedAdv, setSelectedAdv] = useState(null);
  const [selectedDungeon, setSelectedDungeon] = useState('ป่าก็อบลิน'); // ค่าเริ่มต้นสั้นกระชับ
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', adventurerClass: 'นักรบ', element: 'แสงสว่าง', rank: 'C', bounty: 0, status: 'กำลังสำรวจ'
  });

  // ซิงค์ดึงข้อมูลทั้งหมดจากระบบหลังบ้าน
  const fetchData = () => {
    fetch('http://localhost:3000/api/adventurers')
      .then(res => res.json())
      .then(data => setAdventurers(Array.isArray(data) ? data : (data?.data || [])));

    fetch('http://localhost:3000/api/dungeon/logs')
      .then(res => res.json())
      .then(data => {
        setDungeonLogs(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  // เปิดหน้าต่าง Modal สำหรับเพิ่มหรือแก้ไขข้อมูล
  const openModal = (adv = null) => {
    if (adv) {
      setFormData({ name: adv.name, adventurerClass: adv.class, element: adv.element, rank: adv.rank, bounty: adv.bounty, status: adv.status });
      setEditingId(adv.id);
    } else {
      setFormData({ name: '', adventurerClass: 'นักรบ', element: 'แสงสว่าง', rank: 'C', bounty: 0, status: 'กำลังสำรวจ' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  // ส่งข้อมูลลงทะเบียน/อัปเดตไปที่ฐานข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `http://localhost:3000/api/adventurers/${editingId}` : 'http://localhost:3000/api/adventurers';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      if(res.ok) { setShowModal(false); fetchData(); }
    } catch (err) { console.error(err); }
  };

  // ⚔️ ส่งนักผจญภัยออกลุยดันเจี้ยน (พร้อมระบบแจ้งเตือน Alert บั๊กหลุด)
  const handleSendToDungeon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/dungeon/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adventurerId: selectedAdv.id,
          adventurerName: selectedAdv.name,
          dungeonName: selectedDungeon
        })
      });
      if(res.ok) {
        setShowDungeonModal(false);
        fetchData();
        alert(`สั่งการส่ง [${selectedAdv.name}] บุกทะลวง [${selectedDungeon}] สำเร็จ! ⚔️`);
      } else {
        alert('❌ หลังบ้านมีปัญหา: ไม่สามารถทำภารกิจได้');
      }
    } catch (err) { 
      alert('❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้! กรุณาเช็คว่ารัน node server.js หรือยัง');
      console.error(err); 
    }
  };

 // 🏰 เรียกตัวนักผจญภัยกลับมาที่กิลด์
 const handleCompleteMission = async (id, name) => {
  try {
    const res = await fetch('http://localhost:3000/api/dungeon/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adventurerId: id })
    });
    if(res.ok) {
      fetchData();
      alert(`ต้อนรับ [${name}] กลับคืนสู่กิลด์อย่างปลอดภัย! 🏰`);
    } else {
      alert('❌ หลังบ้านมีปัญหา: เรียกตัวกลับไม่ได้ (เช็ค Database ด่วน!)');
    }
  } catch (err) { 
    alert('❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้! กรุณาเช็คว่ารัน node server.js หรือยัง');
    console.error(err); 
  }
};
  // ตั้งค่าสีและไอคอนตามสายอาชีพ
  const getClassConfig = (className) => {
    switch (className) {
      case 'นักเวทย์': case 'จอมเวทย์': return { icon: <Wand2 size={12}/>, color: 'text-purple-400' };
      case 'นักลอบเร้น': return { icon: <Wind size={12}/>, color: 'text-blue-400' };
      case 'ผู้พิทักษ์': return { icon: <Shield size={12}/>, color: 'text-teal-400' };
      case 'นักธนู': return { icon: <Target size={12}/>, color: 'text-green-400' };
      case 'บิชอป': return { icon: <Heart size={12}/>, color: 'text-pink-400' };
      case 'เบอร์เซิร์กเกอร์': return { icon: <Axe size={12}/>, color: 'text-orange-500' };
      case 'เนโครแมนเซอร์': return { icon: <Ghost size={12}/>, color: 'text-zinc-400' };
      case 'พ่อค้า': return { icon: <Store size={12}/>, color: 'text-yellow-500' };
      default: return { icon: <Sword size={12}/>, color: 'text-red-400' }; 
    }
  };

  // ตั้งค่าสีและไอคอนประจำธาตุธาตุ (ชะล้างคำผิดเรียบร้อย)
  const getElementConfig = (element) => {
    switch (element) {
      case 'ไฟ': return { icon: <Flame size={12}/>, bg: 'bg-[#3b0f0a]', text: 'text-red-400' };
      case 'น้ำ': return { icon: <Droplets size={12}/>, bg: 'bg-[#0a1a3b]', text: 'text-blue-400' };
      case 'ลม': return { icon: <Wind size={12}/>, bg: 'bg-[#064e3b]', text: 'text-emerald-400' };
      case 'สายฟ้า': return { icon: <Zap size={12}/>, bg: 'bg-[#2e1065]', text: 'text-purple-300' };
      case 'ความมืด': return { icon: <Skull size={12}/>, bg: 'bg-[#171717]', text: 'text-zinc-400' };
      case 'พระจันทร์': return { icon: <Moon size={12}/>, bg: 'bg-[#1e1b4b]', text: 'text-indigo-300' };
      case 'ดิน': return { icon: <Mountain size={12}/>, bg: 'bg-[#291c10]', text: 'text-amber-500' };
      case 'น้ำแข็ง': return { icon: <Snowflake size={12}/>, bg: 'bg-[#082f49]', text: 'text-cyan-300' };
      case 'พฤกษา': return { icon: <Leaf size={12}/>, bg: 'bg-[#022c22]', text: 'text-green-400' };
      default: return { icon: <Sun size={12}/>, bg: 'bg-[#3b2f0a]', text: 'text-yellow-400' };
    }
  };

  const getRankStyle = (rank) => {
    if (rank.includes('S')) return 'bg-[#78350f] text-yellow-400';
    if (rank.includes('A')) return 'bg-[#4c1d95] text-purple-300';
    if (rank.includes('B')) return 'bg-[#0f4a25] text-emerald-300';
    if (rank.includes('C')) return 'bg-[#1e3a8a] text-blue-300';
    if (rank.includes('D')) return 'bg-[#451a03] text-orange-300';
    return 'bg-[#27272a] text-gray-400'; 
  };

  const getStyles = (adv) => {
    const elConfig = getElementConfig(adv.element);
    const rk = adv.rank || 'C';
    const st = adv.status || 'กำลังสำรวจ';
    return {
      ...getClassConfig(adv.class), elConfig, rankStyle: getRankStyle(rk),
      statusBg: st.includes('สำรวจ') ? 'bg-[#052e16] text-emerald-500 border-[#065f46]' : st.includes('ภารกิจ') ? 'bg-[#7c2d12] text-orange-400 border-[#9a3412]' : 'bg-[#1a1a2e] text-indigo-400 border-[#312e81]',
      isResting: st.includes('ลา')
    };
  };

  return (
    <div className="flex min-h-screen bg-[#0d0f1a] text-slate-200 font-sans text-sm relative">
      
      {/* 🔮 MODAL 1: เพิ่ม/แก้ไขคน */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0f1120] border border-[#1e2240] w-[450px] rounded-xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-[#1e2240] pb-2">
              <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">{editingId ? <Edit size={18} /> : <Plus size={18} />} {editingId ? 'แก้ไขข้อมูล' : 'รับสมัครสมาชิกใหม่'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">ชื่อนักผจญภัย</label>
                <input required type="text" className="w-full bg-[#12152a] border border-[#1e2240] rounded-md p-2 text-white outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">คลาสอาชีพ</label>
                  <select className="w-full bg-[#12152a] border border-[#1e2240] rounded-md p-2 text-white outline-none" value={formData.adventurerClass} onChange={e => setFormData({...formData, adventurerClass: e.target.value})}>
                    <option>นักรบ</option><option>จอมเวทย์</option><option>นักลอบเร้น</option><option>ผู้พิทักษ์</option><option>นักธนู</option><option>บิชอป</option><option>เบอร์เซิร์กเกอร์</option><option>เนโครแมนเซอร์</option><option>พ่อค้า</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">พลังธาตุ</label>
                  <select className="w-full bg-[#12152a] border border-[#1e2240] rounded-md p-2 text-white outline-none" value={formData.element} onChange={e => setFormData({...formData, element: e.target.value})}>
                    <option>แสงสว่าง</option><option>ไฟ</option><option>น้ำ</option><option>ลม</option><option>สายฟ้า</option><option>ความมืด</option><option>พระจันทร์</option><option>ดิน</option><option>น้ำแข็ง</option><option>พฤกษา</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">แรงค์</label>
                  <select className="w-full bg-[#12152a] border border-[#1e2240] rounded-md p-2 text-white outline-none" value={formData.rank} onChange={e => setFormData({...formData, rank: e.target.value})}>
                    <option>S+</option><option>S</option><option>A+</option><option>A</option><option>B+</option><option>B</option><option>C+</option><option>C</option><option>D+</option><option>D</option><option>F+</option><option>F</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ค่าหัว (ทอง)</label>
                  <input type="number" className="w-full bg-[#12152a] border border-[#1e2240] rounded-md p-2 text-white outline-none" value={formData.bounty} onChange={e => setFormData({...formData, bounty: e.target.value})} />
                </div>
                {editingId && (
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">สถานะ</label>
                    <select className="w-full bg-[#12152a] border border-[#1e2240] rounded-md p-2 text-white outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option>กำลังสำรวจ</option><option>ออกภารกิจ</option><option>ลาพักฟื้น</option><option>ลาหยุดพัก</option>
                    </select>
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-purple-600 py-2 rounded-md font-bold mt-2 hover:bg-purple-500 transition-colors">💾 บันทึกข้อมูลข้อมูลกิลด์</button>
            </form>
          </div>
        </div>
      )}

      {/* ⚔️ MODAL 2: ระบบเลือกดันเจี้ยนส่งทำภารกิจ (ปลดล็อกบั๊กคลิกเลือกเรียบร้อย) */}
      {showDungeonModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0f1120] border border-[#1e2240] w-[400px] rounded-xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-orange-400 flex items-center gap-2"><Dices size={18}/> เควสส่งไปลุยดันเจี้ยน</h3>
              <button onClick={() => setShowDungeonModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="mb-3 text-xs text-gray-400">นักผจญภัยที่เลือก: <span className="text-white text-sm font-bold">{selectedAdv?.name}</span> (แรงค์ {selectedAdv?.rank})</div>
            <form onSubmit={handleSendToDungeon} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">เลือกดันเจี้ยนเป้าหมาย</label>
                <select className="w-full bg-[#12152a] border border-[#1e2240] rounded-md p-2.5 text-white outline-none" value={selectedDungeon} onChange={e => setSelectedDungeon(e.target.value)}>
                  <option value="ป่าก็อบลิน">🛡️ ป่าก็อบลินระดับต่ำ (เหมาะสำหรับแรงค์ F-C)</option>
                  <option value="เหมืองแร่เพลิงอเวจี">🌋 เหมืองแร่เพลิงอเวจี (เหมาะสำหรับแรงค์ B-A)</option>
                  <option value="ปราสาทลอยฟ้าเนโครโพลิส">🏯 ปราสาทลอยฟ้าเนโครโพลิส (เหมาะสำหรับแรงค์ A-S)</option>
                  <option value="รังมังกรโบราณ">🐲 รังมังกรโบราณบาฮามุท (แนะนำยศ S+ เท่านั้น!)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 rounded-md font-bold hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg">⚔️ บุกทะลวงมิติดันเจี้ยน!</button>
            </form>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-[230px] bg-[#0a0c16] border-r border-[#1e2240] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#1e2240]"><div className="text-[16px] font-bold text-purple-400 tracking-wide flex items-center gap-2">⚔️ GuildOS</div></div>
        <div className="p-3 px-4 flex items-center gap-3 bg-[#111322]/40 border-b border-[#1e2240]">
          <div className="w-8 h-8 rounded-full bg-indigo-900 border-2 border-purple-600 flex items-center justify-center text-[11px] font-bold text-purple-300">ปม</div>
          <div><div className="text-[13px] font-semibold text-slate-200">ปรมาจารย์กิลด์</div></div>
        </div>
        <div className="py-2 px-2"><div className="flex items-center gap-3 px-3 py-2 text-purple-400 bg-[#12152a] border-l-2 border-purple-600 font-medium rounded-r-md"><LayoutDashboard size={16} /> <span className="text-[13px]">หอประชุมใหญ่</span></div></div>
      </aside>

      {/* MAIN INTERFACE */}
      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <header className="flex justify-between items-center border-b border-[#1e2240] pb-4">
          <div><h1 className="text-xl font-bold text-slate-100">หอประชุมใหญ่</h1><div className="text-xs text-gray-500 mt-1">📜 หน้าหลัก › แดชบอร์ดควบคุมระบบกิลด์อัจฉริยะ</div></div>
          <button onClick={() => openModal()} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-500 transition-all shadow-lg flex items-center gap-1.5"><Plus size={14} /> ลงทะเบียนคนใหม่</button>
        </header>

        {/* STATS PANEL */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0f1120] border border-[#1e2240] p-4 rounded-xl">
            <div className="text-xs text-purple-400 font-medium flex items-center gap-1.5"><Users size={14}/> ประชากรกิลด์สุทธิ</div>
            <div className="text-3xl font-extrabold mt-1">{adventurers.length} <span className="text-xs font-normal text-gray-500">คน</span></div>
          </div>
          <div className="bg-[#0f1120] border border-[#1e2240] p-4 rounded-xl">
            <div className="text-xs text-orange-400 font-medium flex items-center gap-1.5"><Sword size={14}/> กำลังออกลุยภารกิจ</div>
            <div className="text-3xl font-extrabold mt-1 text-orange-400">{adventurers.filter(a => a.status === 'ออกภารกิจ').length} <span className="text-xs font-normal text-gray-500">คน</span></div>
          </div>
          <div className="bg-[#0f1120] border border-[#1e2240] p-4 rounded-xl">
            <div className="text-xs text-amber-400 font-medium flex items-center gap-1.5"><Trophy size={14}/> อัตราเคลียร์ดันเจี้ยน</div>
            <div className="text-3xl font-extrabold mt-1 text-amber-400">93.71%</div>
          </div>
        </div>

        {/* LIVE DUNGEON TRACKER */}
        <div className="bg-[#0f1120] border border-orange-500/20 rounded-xl p-4 shadow-lg bg-gradient-to-r from-[#171212] to-[#0f1120]">
          <h3 className="text-xs font-bold text-orange-400 mb-3 flex items-center gap-2">🔮 คริสตัลบันทึกมิติดันเจี้ยนล่าสุด (Dungeon Logs)</h3>
          <div className="space-y-2">
            {dungeonLogs.length === 0 ? (
              <div className="text-xs text-gray-500 py-1">ยังไม่มีบันทึกการเคลียร์ภารกิจในวันนี้...</div>
            ) : dungeonLogs.map(log => (
              <div key={log.id} className="flex justify-between items-center text-xs bg-[#15121c] p-2 rounded border border-[#2e1d1d]">
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 animate-pulse">●</span>
                  <span className="text-gray-400 font-mono">ID-{log.adventurerId.substring(0,5)}</span>
                  <span className="text-slate-200 font-medium">{log.action}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN LIVE TABLE */}
        <div className="bg-[#0f1120] border border-[#1e2240] rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-bold text-purple-400">📋 รายชื่อสมาชิกกิลด์ทั้งหมด</div>
            <button onClick={fetchData} className="text-xs text-gray-500 hover:text-white">🔄 ซิงค์ฐานข้อมูล</button>
          </div>

          <div className="grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_1.2fr_1.2fr_1fr] gap-2 px-3 py-2 text-[11px] font-bold text-gray-400 bg-[#12152a] rounded-t-lg uppercase">
            <div>นักผจญภัย</div><div>คลาส</div><div>ธาตุ</div><div>ยศ</div><div>ค่าหัว</div><div>สถานะ</div><div className="text-center">สั่งการ</div>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">กำลังเปิดดูคัมภีร์เวทมนตร์...</div>
          ) : adventurers.map((adv) => {
              const st = getStyles(adv);
              return (
                <div key={adv.id} className="grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_1.2fr_1.2fr_1fr] gap-2 px-3 py-2.5 items-center border-b border-[#1e2240]/40 hover:bg-[#15182e] rounded-md group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border border-purple-500/40 text-purple-300 bg-[#141529]">{(adv.name || '??').substring(0, 2)}</div>
                    <div><div className="text-[13px] font-bold text-slate-200">{adv.name}</div><div className="text-[10px] text-gray-500 font-mono">ID: {adv.id?.substring(0,5)}</div></div>
                  </div>
                  <div><div className="bg-[#1e2240] rounded px-2 py-1 text-[11px] inline-flex items-center gap-1.5 text-slate-200"><span className={st.color}>{st.icon}</span> {adv.class}</div></div>
                  <div><div className={`${st.elConfig.bg} ${st.elConfig.text} rounded px-2 py-1 text-[11px] font-bold inline-flex items-center gap-1.5`}>{st.elConfig.icon} {adv.element}</div></div>
                  <div><div className={`w-6 h-6 rounded flex items-center justify-center text-[12px] font-extrabold shadow-sm ${st.rankStyle}`}>{adv.rank}</div></div>
                  <div className="text-[12px] text-amber-400 font-bold">{(adv.bounty || 0).toLocaleString()} <span className="text-[10px] text-gray-500">ทอง</span></div>
                  <div><div className={`${st.statusBg} border rounded-full px-2.5 py-1 text-[11px] inline-flex items-center gap-1.5 font-medium`}>{st.isResting ? <Moon size={11} /> : null} {adv.status}</div></div>
                  
                  {/* ACTIONS PANEL */}
                  <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {adv.status === 'ออกภารกิจ' ? (
                      <button onClick={() => handleCompleteMission(adv.id, adv.name)} className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded transition-colors" title="เรียกตัวกลับกิลด์">
                        🏰
                      </button>
                    ) : (
                      <button onClick={() => { setSelectedAdv(adv); setShowDungeonModal(true); }} className="p-1.5 bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white rounded transition-colors" title="ส่งไปลงดันเจี้ยน">
                        <Sword size={13} />
                      </button>
                    )}
                    <button onClick={() => openModal(adv)} className="p-1.5 bg-[#1e2240] text-blue-400 hover:bg-blue-600 hover:text-white rounded transition-colors"><Edit size={13} /></button>
                    <button onClick={() => handleDelete(adv.id)} className="p-1.5 bg-[#1e2240] text-red-400 hover:bg-red-600 hover:text-white rounded transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              );
          })}
        </div>
      </main>
    </div>
  );
}