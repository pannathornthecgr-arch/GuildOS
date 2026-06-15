import Login from './Login';
import RelicUnbox from './RelicUnbox';
import GuildGovernance from './GuildGovernance';
import WorldBossRaid from './WorldBossRaid';
import BlackMarket from './BlackMarket';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Shield, Sword, Wand2, Wind, Sun, 
  Droplets, Flame, Moon, Plus, X, Users, Trophy, Coins,
  Target, Heart, Axe, Ghost, Store, Zap, Mountain, Snowflake, Skull, Leaf, Edit, Trash2, Dices, Map, Package, Landmark, Box, TrendingUp, BookText, Sparkles, Activity
} from 'lucide-react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import WorldMap from './WorldMap'; 
import QuestCenter from './QuestCenter';
import GuildArmory from './GuildArmory';

const MEDIEVAL_BACKDROP_URL = "/bg-castle.jpeg.jpeg";

const chartData = [
  { name: 'ก.พ.', wealth: 14200 },
  { name: 'มี.ค.', wealth: 15800 },
  { name: 'เม.ย.', wealth: 19258 },
  { name: 'พ.ค.', wealth: 22400 },
];

function TreasuryLedger({ ledgerData }) {
  const totalIncome = ledgerData
    .filter(item => item.type === 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = ledgerData
    .filter(item => item.type === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#121c15]/50 backdrop-blur-sm border-2 border-emerald-800/60 p-5 rounded-none shadow-lg shadow-black">
          <div className="text-xs text-emerald-400 font-serif font-bold uppercase tracking-widest">▲ บัญชีรับสุทธิ (Income Log)</div>
          <div className="text-3xl font-black mt-1 font-serif text-emerald-400">+{totalIncome.toLocaleString()} <span className="text-xs font-normal text-amber-600/70">เหรียญทอง</span></div>
        </div>
        <div className="bg-[#1c1212]/50 backdrop-blur-sm border-2 border-red-950/60 p-5 rounded-none shadow-lg shadow-black">
          <div className="text-xs text-red-400 font-serif font-bold uppercase tracking-widest">▼ บัญชีจ่ายสุทธิ (Expense Log)</div>
          <div className="text-3xl font-black mt-1 font-serif text-red-500">-{totalExpense.toLocaleString()} <span className="text-xs font-normal text-amber-600/70">เหรียญทอง</span></div>
        </div>
      </div>

      <div className="bg-[#161210]/60 backdrop-blur-md border-2 border-double border-[#8b6b4a]/60 rounded-none p-5 shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
        <h3 className="text-sm font-bold text-[#d4af37] font-serif mb-4 flex items-center gap-2 tracking-wide border-b border-[#5c4630]/40 pb-2">📜 บันทึกตำราการเดินบัญชีกิลด์ล่าสุด (Ledger Chronicles)</h3>
        
        <div className="grid grid-cols-[1.5fr_1fr_4fr_1.5fr] gap-2 px-3 py-2 text-[11px] font-bold text-[#d4af37] bg-[#241a15]/80 border border-[#5c4630]/40 rounded-none uppercase tracking-wider font-serif">
          <div>วันเวลา</div><div>ประเภท</div><div>รายละเอียดบันทึก</div><div className="text-right">จำนวนเงิน</div>
        </div>

        <div className="divide-y divide-[#5c4630]/20 max-h-[400px] overflow-y-auto custom-scrollbar">
          {ledgerData.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs font-serif italic">ไร้ซึ่งประวัติธุรกรรมใดๆ ปรากฏในคัมภีร์เล่มนี้...</div>
          ) : ledgerData.map((item) => (
            <div key={item.id} className="grid grid-cols-[1.5fr_1fr_4fr_1.5fr] gap-2 px-3 py-3.5 items-center hover:bg-[#201612]/60 transition-colors text-xs text-[#e1d5c1]">
              <div className="text-stone-400 font-mono text-[11px]">{new Date(item.timestamp).toLocaleString()}</div>
              <div>
                <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold tracking-wider font-serif ${item.type === 'INCOME' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-red-950/60 text-red-400 border border-red-900/40'}`}>
                  {item.type}
                </span>
              </div>
              <div className="text-[#c7b9a5] pr-4 leading-relaxed font-serif">{item.detail}</div>
              <div className={`text-right font-bold font-mono text-sm ${item.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.type === 'INCOME' ? '+' : '-'}{item.amount.toLocaleString()} G
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GuildDashboard() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('guild_logged_in') === 'true';
  });

  const [adventurers, setAdventurers] = useState([]);
  const [dungeonLogs, setDungeonLogs] = useState([]);
  const [ledger, setLedger] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDungeonModal, setShowDungeonModal] = useState(false);
  const [selectedAdv, setSelectedAdv] = useState(null);
  const [selectedDungeon, setSelectedDungeon] = useState('ป่าก็อบลิน'); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [treasury, setTreasury] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedCity, setSelectedCity] = useState(null); 
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', adventurerClass: 'นักรบ', element: 'แสงสว่าง', rank: 'C', bounty: 0, status: 'กำลังสำรวจ', branch: 'เมืองหลวงแห่งปัญญา'
  });

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => { setToast({ show: false, message: '', type }); }, 3000);
  };

  const fetchData = () => {
    fetch(`http://localhost:3000/api/adventurers?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        const rawData = Array.isArray(data) ? data : (data?.data || []);
        const rankWeight = { 'S+': 1, 'S': 2, 'A+': 3, 'A': 4, 'B+': 5, 'B': 6, 'C+': 7, 'C': 8, 'D+': 9, 'D': 10, 'F+': 11, 'F': 12 };
        const sortedData = [...rawData].sort((a, b) => (rankWeight[a.rank] || 99) - (rankWeight[b.rank] || 99));
        setAdventurers(sortedData);
      })
      .catch(err => console.error(err));

    fetch(`http://localhost:3000/api/dungeon/logs?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => { setDungeonLogs(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));

    fetch(`http://localhost:3000/api/treasury?t=${Date.now()}`)
    .then(res => res.json())
    .then(data => {
      setTreasury(data.totalGold || 0);
    })
    .catch(err => console.error("ระบบดึงคลังสมบัติขัดข้อง:", err));

    fetch(`http://localhost:3000/api/ledger?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setLedger(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openModal = (adv = null) => {
    if (adv) {
      setFormData({ name: adv.name, adventurerClass: adv.class, element: adv.element, rank: adv.rank, bounty: adv.bounty, status: adv.status, branch: adv.branch || 'เมืองหลวงแห่งปัญญา' });
      setEditingId(adv.id);
    } else {
      setFormData({ name: '', adventurerClass: 'นักรบ', element: 'แสงสว่าง', rank: 'C', bounty: 0, status: 'กำลังสำรวจ', branch: 'เมืองหลวงแห่งปัญญา' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `http://localhost:3000/api/adventurers/${editingId}` : 'http://localhost:3000/api/adventurers';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      
      if(res.ok) { 
        setShowModal(false); 
        fetchData(); 
        alert('💾 บันทึกข้อมูลวิถีนักรบสำเร็จ!'); 
      } else {
        alert('❌ สภาอาวุโสปฏิเสธบันทึกฉบับนี้ (ตรวจสอบ API Terminal ฝั่งเซิร์ฟเวอร์ด่วน)'); 
      }
    } catch (err) { 
      console.error(err); 
      alert('❌ สัญญาณจากคริสตัลพิศวงขัดข้อง (เชื่อมต่อเซิร์ฟเวอร์ไม่ได้)');
    }
  };

  const handleSendToDungeon = async (e) => {
    e.preventDefault();
    setAdventurers(prev => prev.map(a => a.id === selectedAdv.id ? { ...a, status: 'ออกภารกิจ' } : a));
    setShowDungeonModal(false);
    showNotification(`⚔️ ส่งกองกำลัง [${selectedAdv.name}] บุกมิติ [${selectedDungeon}] สำเร็จ!`, 'success');

    try {
      const res = await fetch('http://localhost:3000/api/dungeon/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adventurerId: selectedAdv.id, dungeonName: selectedDungeon })
      });
      if(res.ok) fetchData(); 
    } catch (err) { 
      alert('❌ มิติพลังปั่นป่วน! กรุณาตรวจสอบว่าเปิดใช้ Node Server แล้วหรือยัง');
      console.error(err); 
    }
  };

  const handleCompleteMission = async (id, name) => {
    setAdventurers(prev => prev.map(a => a.id === id ? { ...a, status: 'ลาพักฟื้น' } : a));
    showNotification(`🏰 บัญชาการ: [${name}] กลับถึงกิลด์แล้ว! ได้ส่วนแบ่งเข้าคลังสมบัติเพิ่มขึ้น`, 'success');

    try {
      const res = await fetch('http://localhost:3000/api/dungeon/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adventurerId: id })
      });
      if(res.ok) fetchData(); 
    } catch (err) { 
      alert('❌ เทเลพอร์ตขัดข้อง เชื่อมต่อวิหารหลังบ้านไม่ได้!');
      console.error(err); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('ท่านต้องการเนรเทศและขับไล่นักผจญภัยผู้นี้ออกจากกิลด์อย่างถาวรหรือไม่?')) {
      const res = await fetch(`http://localhost:3000/api/adventurers/${id}`, { method: 'DELETE' });
      if(res.ok) fetchData();
    }
  };

  const getClassConfig = (className) => {
    switch (className) {
      case 'นักเวทย์': case 'จอมเวทย์': return { icon: <Wand2 size={12}/>, color: 'text-purple-400' };
      case 'นักลอบเร้น': return { icon: <Wind size={12}/>, color: 'text-blue-400' };
      case 'ผู้พิทักษ์': return { icon: <Shield size={12}/>, color: 'text-teal-400' };
      case 'นักธนู': return { icon: <Target size={12}/>, color: 'text-green-400' };
      case 'บิชอป': return { icon: <Heart size={12}/>, color: 'text-pink-400' };
      case 'เบอร์เซิร์กเกอร์': return { icon: <Axe size={12}/>, color: 'text-orange-500' };
      case 'เนโครแมนเซอร์': return { icon: <Ghost size={12}/>, color: 'text-stone-400' };
      case 'พ่อค้า': return { icon: <Store size={12}/>, color: 'text-yellow-500' };
      default: return { icon: <Sword size={12}/>, color: 'text-red-400' }; 
    }
  };

  const getElementConfig = (element) => {
    switch (element) {
      case 'ไฟ': return { icon: <Flame size={12}/>, bg: 'bg-[#3b0f0a]', text: 'text-red-400' };
      case 'น้ำ': return { icon: <Droplets size={12}/>, bg: 'bg-[#0a1a3b]', text: 'text-blue-400' };
      case 'ลม': return { icon: <Wind size={12}/>, bg: 'bg-[#022c22]', text: 'text-emerald-400' };
      case 'สายฟ้า': return { icon: <Zap size={12}/>, bg: 'bg-[#211035]', text: 'text-purple-300' };
      case 'ความมืด': return { icon: <Skull size={12}/>, bg: 'bg-[#121212]', text: 'text-stone-400' };
      case 'พระจันทร์': return { icon: <Moon size={12}/>, bg: 'bg-[#0d1527]', text: 'text-indigo-300' };
      case 'ดิน': return { icon: <Mountain size={12}/>, bg: 'bg-[#291a10]', text: 'text-amber-600' };
      case 'น้ำแข็ง': return { icon: <Snowflake size={12}/>, bg: 'bg-[#0c1f30]', text: 'text-cyan-300' };
      case 'พฤกษา': return { icon: <Leaf size={12}/>, bg: 'bg-[#0d2215]', text: 'text-green-500' };
      default: return { icon: <Sun size={12}/>, bg: 'bg-[#332205]', text: 'text-yellow-500' };
    }
  };

  const getRankStyle = (rank) => {
    if (rank.includes('S')) return 'bg-[#5c2a18] text-[#ffd700] border border-[#a67c00]';
    if (rank.includes('A')) return 'bg-[#2b104a] text-[#c084fc] border border-[#581c87]';
    if (rank.includes('B')) return 'bg-[#022c22] text-[#34d399] border border-[#064e3b]';
    if (rank.includes('C')) return 'bg-[#1e293b] text-[#38bdf8] border border-[#0f172a]';
    if (rank.includes('D')) return 'bg-[#451a03] text-[#f97316] border border-[#3b0764]/20';
    return 'bg-[#18181b] text-stone-400 border border-stone-800'; 
  };

  const getStyles = (adv) => {
    const elConfig = getElementConfig(adv.element);
    const rk = adv.rank || 'C';
    const st = adv.status || 'กำลังสำรวจ';
    return {
      ...getClassConfig(adv.class), elConfig, rankStyle: getRankStyle(rk),
      statusBg: st.includes('สำรวจ') ? 'bg-[#062410] text-[#10b981] border-[#065f46]' : st.includes('ภารกิจ') ? 'bg-[#401305] text-[#f97316] border-[#9a3412]' : 'bg-[#0a0f1d] text-[#818cf8] border-[#312e81]',
      isResting: st.includes('ลา')
    };
  };
  
  if (!isLoggedIn) {
    return (
      <Login 
        onLoginSuccess={() => {
          localStorage.setItem('guild_logged_in', 'true');
          setIsLoggedIn(true);
        }} 
      />
    );
  }

  // 🟢 1. เติมคำสั่ง return ( ตรงนี้! เพื่อให้มันวาดหน้าจอ
  return (
    <div 
      className="flex min-h-screen bg-cover bg-center bg-no-repeat text-[#e1d5c1] font-sans text-sm relative"
      style={{ backgroundImage: `url(${MEDIEVAL_BACKDROP_URL})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75 backdrop-blur-[1px] pointer-events-none z-0 filter brightness-125 saturate-150"></div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-[#161210] border-4 border-double border-[#8b6b4a] w-[450px] rounded-none p-6 shadow-[0_20px_50px_rgba(0,0,0,1)] relative z-50">
            <div className="flex justify-between items-center mb-4 border-b border-[#5c4630] pb-2">
              <h3 className="text-base font-serif font-bold text-[#d4af37] flex items-center gap-2 tracking-widest">{editingId ? <Edit size={18} /> : <Plus size={18} />} {editingId ? 'จารึกชะตากรรมนักสู้' : 'รับพันธสัญญานักรบใหม่'}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#a48463] hover:text-[#ffd700] transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif text-[#a48463] tracking-wider mb-1">นามแห่งอัศวิน/นักเดินทาง</label>
                <input required type="text" className="w-full bg-[#201915] border border-[#5c4630] rounded-none p-2 text-[#e1d5c1] outline-none focus:border-[#d4af37]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif text-[#a48463] tracking-wider mb-1">วิชาชีพติดตัว (Class)</label>
                  <select className="w-full bg-[#201915] border border-[#5c4630] rounded-none p-2 text-[#e1d5c1] outline-none focus:border-[#d4af37]" value={formData.adventurerClass} onChange={e => setFormData({...formData, adventurerClass: e.target.value})}>
                    <option>นักรบ</option><option>จอมเวทย์</option><option>นักลอบเร้น</option><option>ผู้พิทักษ์</option><option>นักธนู</option><option>บิชอป</option><option>เบอร์เซิร์กเกอร์</option><option>เนโครแมนเซอร์</option><option>พ่อค้า</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-serif text-[#a48463] tracking-wider mb-1">ธาตุแห่งวิญญาณ</label>
                  <select className="w-full bg-[#201915] border border-[#5c4630] rounded-none p-2 text-[#e1d5c1] outline-none focus:border-[#d4af37]" value={formData.element} onChange={e => setFormData({...formData, element: e.target.value})}>
                    <option>แสงสว่าง</option><option>ไฟ</option><option>น้ำ</option><option>ลม</option><option>สายฟ้า</option><option>ความมืด</option><option>พระจันทร์</option><option>ดิน</option><option>น้ำแข็ง</option><option>พฤกษา</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-serif text-[#a48463] tracking-wider mb-1">ระดับเกียรติยศ (Rank)</label>
                  <select className="w-full bg-[#201915] border border-[#5c4630] rounded-none p-2 text-[#e1d5c1] outline-none focus:border-[#d4af37]" value={formData.rank} onChange={e => setFormData({...formData, rank: e.target.value})}>
                    <option>S+</option><option>S</option><option>A+</option><option>A</option><option>B+</option><option>B</option><option>C+</option><option>C</option><option>D+</option><option>D</option><option>F+</option><option>F</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-serif text-[#a48463] tracking-wider mb-1">ค่าหัวประกาศจับ (G)</label>
                  <input type="number" className="w-full bg-[#201915] border border-[#5c4630] rounded-none p-2 text-[#e1d5c1] outline-none focus:border-[#d4af37]" value={formData.bounty} onChange={e => setFormData({...formData, bounty: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-[#d4af37] font-serif font-bold mb-1">สังกัดสาขาดินแดน (Branch)</label>
                  <select className="w-full bg-[#1b1511] border border-[#8b6b4a] rounded-none p-2 text-[#d4af37] outline-none" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}>
                    <option value="เมืองหลวงแห่งปัญญา">เมืองหลวงแห่งปัญญา</option>
                    <option value="หอคอยพฤกษา">หอคอยพฤกษา</option>
                    <option value="โรงหลอมภาพมายา">โรงหลอมภาพมายา</option>
                    <option value="หุบเขาศิลปิน">หุบเขาศิลปิน</option>
                    <option value="นครการค้า">นครการค้า</option>
                    <option value="ป้อมปราการเหล็ก">ป้อมปราการเหล็ก</option>
                  </select>
                </div>
                {editingId && (
                  <div className="col-span-2">
                    <label className="block text-xs font-serif text-[#a48463] mb-1">สภาวะปัจจุบัน</label>
                    <select className="w-full bg-[#201915] border border-[#5c4630] rounded-none p-2 text-[#e1d5c1] outline-none focus:border-[#d4af37]" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option>กำลังสำรวจ</option><option>ออกภารกิจ</option><option>ลาพักฟื้น</option><option>ลาหยุดพัก</option>
                    </select>
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#8b6b4a] to-[#5c4630] text-[#ffd700] hover:from-[#a07c57] hover:to-[#6f5439] py-2.5 rounded-none font-serif font-bold mt-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-[#d4af37]/30 transition-all">💾 บันทึกจารึกแห่งกิลด์</button>
            </form>
          </div>
        </div>
      )}

      {showDungeonModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-[#161210] border-4 border-double border-[#8b6b4a] w-[400px] rounded-none p-6 shadow-[0_20px_50px_rgba(0,0,0,1)] relative z-50">
            <div className="flex justify-between items-center mb-4 border-b border-[#5c4630] pb-2">
              <h3 className="text-base font-serif font-bold text-[#f97316] flex items-center gap-2"><Dices size={18}/> ประกาศิตส่งหน่วยรบทะลวงดันเจี้ยน</h3>
              <button onClick={() => setShowDungeonModal(false)} className="text-[#a48463] hover:text-[#ffd700] transition-colors"><X size={18} /></button>
            </div>
            <div className="mb-3 text-xs font-serif text-[#a48463]">นักรบผู้ถูกเลือก: <span className="text-[#e1d5c1] text-sm font-bold block mt-1">{selectedAdv?.name} (ยศเกียรติยศ {selectedAdv?.rank})</span></div>
            <form onSubmit={handleSendToDungeon} className="space-y-4">
              <div>
                <label className="block text-xs font-serif text-[#a48463] mb-1">ระบุดันเจี้ยนเป้าหมาย</label>
                <select className="w-full bg-[#201915] border border-[#5c4630] rounded-none p-2.5 text-[#e1d5c1] outline-none focus:border-[#d4af37]" value={selectedDungeon} onChange={e => setSelectedDungeon(e.target.value)}>
                  <option value="ป่าก็อบลิน">🛡️ ป่าก็อบลินระดับต่ำ (เหมาะสำหรับแรงค์ F-C)</option>
                  <option value="เหมืองแร่เพลิงอเวจี">🌋 เหมืองแร่เพลิงอเวจี (เหมาะสำหรับแรงค์ B-A)</option>
                  <option value="ปราสาทลอยฟ้าเนโครโพลิส">🏯 ปราสาทลอยฟ้าเนโครโพลิส (เหมาะสำหรับแรงค์ A-S)</option>
                  <option value="รังมังกรโบราณ">🐲 รังมังกรโบราณบาฮามุท (แนะนำยศ S+ เท่านั้น!)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#b45309] to-[#78350f] text-[#ffd700] py-2.5 rounded-none font-serif font-bold hover:from-[#d97706] hover:to-[#b45309] transition-all border border-[#f59e0b]/30 shadow-lg">⚔️ บุกทะลวงมิติดันเจี้ยน!</button>
            </form>
          </div>
        </div>
      )}

      <aside className="w-[230px] bg-[#110d0c] border-r-2 border-[#8b6b4a] flex flex-col shrink-0 relative z-10 shadow-[5px_0_15px_rgba(0,0,0,0.8)]">
        <div className="p-4 border-b border-[#5c4630]">
          <div className="text-[18px] font-bold text-[#d4af37] font-serif tracking-widest flex items-center gap-2">⚔️ GuildOS</div>
        </div>
        <div className="p-3 px-4 flex items-center gap-3 bg-[#171210] border-b border-[#5c4630]">
          <div className="w-8 h-8 rounded-none bg-[#3b2f27] border border-[#d4af37] flex items-center justify-center text-[11px] font-serif font-bold text-[#d4af37]">ปม</div>
          <div><div className="text-[13px] font-serif font-semibold text-[#e1d5c1]">ปรมาจารย์กิลด์</div></div>
        </div>

        <div className="py-2 px-1 space-y-1">
          <div onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'dashboard' ? 'text-[#ffd700] bg-[#241a15] border-l-4 border-[#8b6b4a] font-bold' : 'text-[#9d8167] hover:text-[#e1d5c1] hover:bg-[#1c1512]'}`}>
            <LayoutDashboard size={16} /> <span className="text-[13px] tracking-wide">หอประชุมใหญ่</span>
          </div>
          <div onClick={() => setActiveTab('map')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'map' ? 'text-[#ffd700] bg-[#241a15] border-l-4 border-[#8b6b4a] font-bold' : 'text-[#9d8167] hover:text-[#e1d5c1] hover:bg-[#1c1512]'}`}>
            <Map size={16} /> <span className="text-[13px] tracking-wide">เครือข่ายสาขากิลด์</span>
          </div>
          <div onClick={() => setActiveTab('quests')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'quests' ? 'text-[#ffd700] bg-[#241a15] border-l-4 border-[#8b6b4a] font-bold' : 'text-[#9d8167] hover:text-[#e1d5c1] hover:bg-[#1c1512]'}`}>
            <Target size={16} /> <span className="text-[13px] tracking-wide">หอจัดการภารกิจ</span>
          </div>
          <div onClick={() => setActiveTab('armory')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'armory' ? 'text-[#ffd700] bg-[#241a15] border-l-4 border-[#8b6b4a] font-bold' : 'text-[#9d8167] hover:text-[#e1d5c1] hover:bg-[#1c1512]'}`}>
            <Package size={16} /> <span className="text-[13px] tracking-wide">คลังแสงกิลด์</span>
          </div>
          <div onClick={() => setActiveTab('ledger')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'ledger' ? 'text-[#ffd700] bg-[#241a15] border-l-4 border-[#8b6b4a] font-bold' : 'text-[#9d8167] hover:text-[#e1d5c1] hover:bg-[#1c1512]'}`}>
            <BookText size={16} /> <span className="text-[13px] tracking-wide">สมุดบัญชีทองคำ</span>
          </div>
          <div onClick={() => setActiveTab('bossraid')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'bossraid' ? 'text-orange-500 bg-[#2a100a] border-l-4 border-orange-600 font-bold' : 'text-[#9d8167] hover:text-orange-400 hover:bg-[#1c1512]'}`}>
            <Flame size={16} /> <span className="text-[13px] tracking-wide">มหาสงครามล่าบอส</span>
          </div>
          <div onClick={() => setActiveTab('relicbox')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'relicbox' ? 'text-cyan-400 bg-[#05111a] border-l-4 border-cyan-500 font-bold' : 'text-[#9d8167] hover:text-cyan-400 hover:bg-[#1c1512]'}`}>
            <Box size={16} /> <span className="text-[13px] tracking-wide">หอสมบัติปริศนา</span>
          </div>
          <div onClick={() => setActiveTab('governance')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'governance' ? 'text-[#ffd700] bg-[#241a15] border-l-4 border-[#8b6b4a] font-bold' : 'text-[#9d8167] hover:text-[#e1d5c1] hover:bg-[#1c1512]'}`}>
            <Landmark size={16} /> <span className="text-[13px] tracking-wide">หอสภาและภาษีเมือง</span>
          </div>
          <div onClick={() => setActiveTab('blackmarket')} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer font-serif font-medium rounded-none transition-all ${activeTab === 'blackmarket' ? 'text-red-500 bg-[#2a0a0a] border-l-4 border-red-600 font-bold' : 'text-[#9d8167] hover:text-red-400 hover:bg-[#1c1512]'}`}>
            <Skull size={16} /> <span className="text-[13px] tracking-wide">ตลาดมืดใต้ดิน</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        <header className="flex justify-between items-center pb-6 border-b border-[#8b6b4a]/30 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-widest text-[#d4af37] font-serif uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {activeTab === 'dashboard' && 'หอประชุมใหญ่ (Grand Hall)'}
              {activeTab === 'governance' && 'หอสภาและภาษีเมือง'}
              {activeTab === 'relicbox' && 'หอสมบัติปริศนา'}
              {activeTab === 'blackmarket' && 'ตลาดมืดใต้ดิน'}
            </h1>
            <p className="text-xs text-[#b49b78] font-serif tracking-wider mt-1">
              สมาคมนักผจญภัยส่วนกลาง • แผงควบคุมระบบเวทมนตร์กิลด์
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#1c1512]/80 border border-[#8b6b4a]/40 px-4 py-2 text-right shadow-md">
              <div>
                <div className="text-[9px] text-[#a48463] font-serif uppercase tracking-widest font-bold">คลังมหาสมบัติกิลด์</div>
                <div className="text-lg font-black font-serif text-[#ffd700] tracking-wide">
                  {treasury.toLocaleString()} <span className="text-[10px] font-normal text-[#8c7159]">G</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                localStorage.removeItem('guild_logged_in');
                setIsLoggedIn(false);
              }}
              className="px-4 py-3 bg-[#3d1111]/60 hover:bg-red-950 border border-red-900/50 text-red-400 hover:text-red-300 text-xs font-serif font-black tracking-widest uppercase transition-all shadow-md active:translate-y-0.5 h-full flex items-center justify-center rounded-none"
            >
              🚪 ออกจากระบบ
            </button>
          </div>
        </header>

        {activeTab === 'quests' && <div className="animate-fade-in"><QuestCenter /></div>}
        {activeTab === 'blackmarket' && <div className="animate-fade-in"><BlackMarket /></div>}
        {activeTab === 'armory' && <div className="animate-fade-in"><GuildArmory /></div>}
        {activeTab === 'ledger' && <div className="animate-fade-in"><TreasuryLedger ledgerData={ledger} /></div>}
        {activeTab === 'bossraid' && <div className="animate-fade-in"><WorldBossRaid /></div>}
        {activeTab === 'governance' && <div className="animate-fade-in"><GuildGovernance /></div>}
        
        {activeTab === 'relicbox' && (
          <div className="animate-fade-in">
            <RelicUnbox 
              onBuyKey={(price) => {
                setTreasury(prev => Math.max(0, prev - price));
                setDungeonLogs(prev => [{
                  id: Date.now(),
                  timestamp: new Date().toISOString(),
                  type: 'EXPENSE',
                  detail: '📜 จ่ายค่าธรรมเนียมสมาคม แลกเปลี่ยนกุญแจเวทมนตร์อัญเชิญ',
                  amount: price
                }, ...prev]);
              }} 
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="animate-fade-in">
            <WorldMap 
              selectedCity={selectedCity} 
              onSelectCity={(city) => { 
                setSelectedCity(city); 
                if (city) setActiveTab('dashboard'); 
              }} 
            /> 
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative bg-[#161210]/70 backdrop-blur-sm border-2 border-[#8b6b4a] p-4 rounded-none shadow-[0_10px_20px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="text-xs text-[#a48463] font-serif font-bold flex items-center gap-1.5 tracking-wider uppercase"><Users size={14}/> กำลังพลสุทธิ</div>
                <div className="text-3xl font-extrabold mt-1 font-serif text-[#ffd700]">{adventurers.length} <span className="text-xs font-normal text-[#8c7159]">สหาย</span></div>
                <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-[#8b6b4a]/70 via-[#5c4630]/30 to-transparent rounded-none"></div>
              </div>
              <div className="relative bg-[#161210]/70 backdrop-blur-sm border-2 border-[#8b6b4a] p-4 rounded-none shadow-[0_10px_20px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="text-xs text-[#a48463] font-serif font-bold flex items-center gap-1.5 tracking-wider uppercase"><Sword size={14}/> ออกลุยสมรภูมิ</div>
                <div className="text-3xl font-extrabold mt-1 font-serif text-orange-500">{adventurers.filter(a => a.status === 'ออกภารกิจ').length} <span className="text-xs font-normal text-[#8c7159]">สหาย</span></div>
                <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-orange-800/70 via-[#5c4630]/30 to-transparent rounded-none"></div>
              </div>
              <div className="relative bg-[#161210]/70 backdrop-blur-sm border-2 border-[#8b6b4a] p-4 rounded-none shadow-[0_10px_20px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="text-xs text-[#a48463] font-serif font-bold flex items-center gap-1.5 tracking-wider uppercase"><Trophy size={14}/> สถิติชัยชนะ</div>
                <div className="text-3xl font-extrabold mt-1 font-serif text-emerald-400">93.71%</div>
                <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-emerald-800/70 via-[#5c4630]/30 to-transparent rounded-none"></div>
              </div>
              <div className="relative bg-[#161210]/70 backdrop-blur-sm border-2 border-[#8b6b4a] p-4 rounded-none shadow-[0_10px_20px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="text-xs text-[#a48463] font-serif font-bold flex items-center gap-1.5 tracking-wider uppercase"><Coins size={14}/> ทรัพย์สินกิลด์</div>
                <div className="text-3xl font-extrabold mt-1 font-serif text-[#ffd700]">{treasury.toLocaleString()} <span className="text-xs font-normal text-[#8c7159]">เหรียญ</span></div>
                <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-[#d4af37]/70 via-[#5c4630]/30 to-transparent rounded-none"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 relative bg-[#161210]/70 backdrop-blur-sm border-2 border-double border-[#8b6b4a] rounded-none p-5 shadow-[0_10px_25px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-4 border-b border-[#5c4630] pb-2">
                  <h3 className="text-xs font-serif font-bold text-[#d4af37] flex items-center gap-2 tracking-widest uppercase"><TrendingUp size={16} /> พัฒนาการแห่งความมั่งคั่ง (Treasury Chronicles)</h3>
                  <div className="text-[10px] text-[#a48463] bg-[#221a16] border border-[#5c4630] px-2.5 py-1 rounded-none flex items-center gap-1"><Activity size={10} className="text-[#d4af37]"/> ลมปราณฐานข้อมูล: ปัจจุบัน</div>
                </div>
                <div className="relative flex-1 min-h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      ...chartData.slice(0, 4),
                      { name: 'ปัจจุบัน', wealth: treasury > 0 ? treasury : 32500 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4a382c" vertical={false} />
                      <XAxis dataKey="name" stroke="#8c7159" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#8c7159" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} dx={-10} />
                      <Tooltip contentStyle={{ backgroundColor: '#1b1412', borderColor: '#8b6b4a', borderRadius: '0px', fontSize: '12px' }} itemStyle={{ color: '#ffd700', fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="wealth" name="เหรียญทองคลัง" stroke="#d4af37" strokeWidth={3} dot={{ r: 4, fill: '#ffd700', stroke: '#110d0c', strokeWidth: 2 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="relative bg-[#161210]/70 backdrop-blur-sm border-2 border-double border-[#8b6b4a] rounded-none p-5 shadow-[0_10px_25px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
                <h3 className="text-xs font-serif font-bold text-[#d4af37] mb-4 flex items-center gap-2 tracking-widest uppercase border-b border-[#5c4630] pb-2"><Sparkles size={14}/> ม้วนคัมภีร์พงศาวดารมิติ (Logs)</h3>
                <div className="relative space-y-2.5 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                  {dungeonLogs.length === 0 ? (
                    <div className="text-xs text-stone-500 py-4 text-center border border-dashed border-[#5c4630] rounded-none font-serif italic">ยังไม่มีวิญญาณใดขยับเคลื่อนไหวในมิตินี้...</div>
                  ) : dungeonLogs.map(log => (
                    <div key={log.id} className="flex flex-col gap-1 text-xs bg-[#241a15] p-2.5 rounded-none border border-[#5c4630] hover:border-[#8b6b4a] hover:shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-[#d4af37]">⚔️</span>
                        <span className="text-[#c7b9a5] font-serif leading-relaxed">{log.action || log.detail}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono ml-5">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative bg-[#161210]/70 backdrop-blur-sm border-2 border-double border-[#8b6b4a] rounded-none p-4 shadow-[0_15px_30px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="relative flex justify-between items-center mb-4">
                <div className="text-sm font-serif font-bold text-[#d4af37] flex items-center gap-2 tracking-wide">
                  📋 สมุดประวัติทะเบียนกองกำลังกิลด์ทั้งหมด
                  {selectedCity && (
                    <span className="bg-[#2a1d17] text-[#ffd700] px-2 py-0.5 rounded-none text-xs border border-[#8b6b4a]/60 flex items-center gap-1 font-serif">
                      <Map size={12}/> ดินแดนสาขา: {selectedCity}
                      <button onClick={() => setSelectedCity(null)} className="hover:text-red-400 ml-1"><X size={12}/></button>
                    </span>
                  )}
                </div>
                
                {/* 🟢 ปุ่มพิเศษสำหรับบอส: เพิ่มคนรับจ้างเข้ากิลด์ได้ตรงๆ ไม่ต้องรอกาชา */}
                <div className="flex gap-2">
                  <button onClick={fetchData} className="text-xs text-[#a48463] hover:text-[#ffd700] font-serif transition-colors px-2 py-1 border border-transparent hover:border-[#8b6b4a]">🔄 เขย่าผลึกฐานข้อมูล</button>
                  <button onClick={() => openModal(null)} className="text-xs bg-[#3d271d] hover:bg-[#5c3e2a] text-[#ffd700] font-serif transition-colors px-3 py-1 border border-[#8b6b4a] flex items-center gap-1 shadow-md">
                    <Plus size={12} /> จารึกนักผจญภัยใหม่
                  </button>
                </div>
              </div>

              <div className="relative grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_1.2fr_1.2fr_1fr] gap-2 px-3 py-2 text-[11px] font-bold text-[#d4af37] bg-[#241a15] border border-[#5c4630] rounded-none uppercase tracking-wider font-serif">
                <div>นักผจญภัย</div><div>คลาสอาชีพ</div><div>ธาตุพลัง</div><div>ยศ</div><div>ค่าหัวผู้กล้า</div><div>สถานะสัจจะ</div><div className="text-center">สั่งการบัญชา</div>
              </div>

              {isLoading ? (
                <div className="relative text-center py-10 text-stone-500 font-serif italic">กำลังร่ายเวทเปิดอ่านสารบบ...</div>
              ) : adventurers.filter(adv => !selectedCity || adv.branch === selectedCity).map((adv) => {
                  const st = getStyles(adv);
                  return (
                    <div key={adv.id} className="relative grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_1.2fr_1.2fr_1fr] gap-2 px-3 py-3 items-center border-b border-[#5c4630]/40 hover:bg-[#201612] rounded-none group transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-none border-2 border-[#8b6b4a]/70 shadow-md shadow-black relative overflow-hidden flex-shrink-0 bg-[#333] flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#15110e]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <div className="absolute inset-0 border border-black/40 pointer-events-none" />
                        </div>
                        <div>
                          <div className="text-[13px] font-serif font-bold text-[#e1d5c1]">{adv.name}</div>
                          <div className="text-[10px] text-stone-500 font-mono">ID: {adv.id?.substring(0,5)}</div>
                        </div>
                      </div>
                      <div>
                        <div className="bg-[#241a15] border border-[#5c4630] rounded-none px-2 py-1 text-[11px] inline-flex items-center gap-1.5 text-[#e1d5c1] font-serif">
                          <span className={st.color}>{st.icon}</span> {adv.class}
                        </div>
                      </div>
                      <div>
                        <div className={`${st.elConfig.bg} ${st.elConfig.text} rounded-none px-2 py-1 text-[11px] font-serif font-bold inline-flex items-center gap-1.5 border border-[#5c4630]/30`}>
                          {st.elConfig.icon} {adv.element}
                        </div>
                      </div>
                      <div>
                        <div className={`w-6 h-6 rounded-none flex items-center justify-center text-[12px] font-serif font-extrabold shadow-md ${st.rankStyle}`}>{adv.rank}</div>
                      </div>
                      <div className="text-[12px] text-[#ffd700] font-serif font-bold">
                        {(adv.bounty || 0).toLocaleString()} <span className="text-[10px] text-[#a48463]">ทอง</span>
                      </div>
                      <div>
                        <div className="flex flex-col gap-1.5 min-w-[110px]">
                          <div className="flex justify-between items-center text-[10px] font-serif">
                            <span className={`font-bold ${adv.status?.includes('สำรวจ') ? 'text-emerald-400' : adv.status?.includes('ภารกิจ') ? 'text-orange-400' : 'text-indigo-400'}`}>
                              {adv.status?.includes('ลา') ? '💤 พักฟื้นวิญญาณ' : adv.status?.includes('ภารกิจ') ? '⚔️ ออกศึกใหญ่' : '👁️ สำรวจมิติ'}
                            </span>
                            <span className="text-stone-400 font-mono text-[9px]">
                              {adv.status?.includes('ลา') ? '45%' : adv.status?.includes('ภารกิจ') ? '82%' : '100%'}
                            </span>
                          </div>
                          <div className="w-full bg-stone-900 border border-[#5c4630]/60 h-2.5 rounded-none p-[1px] relative overflow-hidden shadow-inner shadow-black">
                            <div 
                              className={`h-full rounded-none transition-all duration-500 relative ${
                                adv.status?.includes('ลา') ? 'bg-gradient-to-r from-amber-600 to-orange-500'
                                : adv.status?.includes('ภารกิจ') ? 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                              }`}
                              style={{ width: adv.status?.includes('ลา') ? '45%' : adv.status?.includes('ภารกิจ') ? '82%' : '100%' }}
                            >
                              <div className="absolute inset-0 bg-white/20 skew-x-12 animate-[pulse_2s_infinite]" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {adv.status === 'ออกภารกิจ' ? (
                          <button onClick={() => handleCompleteMission(adv.id, adv.name)} className="p-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 hover:bg-emerald-800 hover:text-white rounded-none transition-colors" title="บัญชาการเรียกตัวกลับกิลด์">
                            🏰
                          </button>
                        ) : (
                          <button onClick={() => { setSelectedAdv(adv); setShowDungeonModal(true); }} className="p-1.5 bg-[#402010] border border-[#8b6b4a] text-[#ffd700] hover:bg-[#8b6b4a] hover:text-black rounded-none transition-colors" title="ตีตราส่งไปลุยศึก">
                            <Sword size={13} />
                          </button>
                        )}
                        <button onClick={() => openModal(adv)} className="p-1.5 bg-[#201915] border border-[#5c4630] text-blue-400 hover:bg-blue-850 hover:text-white rounded-none transition-colors"><Edit size={13} /></button>
                        <button onClick={() => handleDelete(adv.id)} className="p-1.5 bg-[#201915] border border-red-900/60 text-red-500 hover:bg-red-950 hover:text-white rounded-none transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        )}
      </main>

      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#161210] border-2 border-[#8b6b4a] text-[#e1d5c1] px-5 py-3.5 rounded-none shadow-[0_10px_35px_rgba(0,0,0,1)] flex items-center gap-3 animate-slide-in-up">
          <div className="w-6 h-6 rounded-none bg-[#241a15] flex items-center justify-center border border-[#8b6b4a] text-xs text-[#ffd700]">🔔</div>
          <div className="flex flex-col">
            <span className="text-[11px] font-serif font-bold text-[#d4af37] uppercase tracking-widest">สารเตือนภัยกิลด์</span>
            <span className="text-[12px] font-serif font-medium mt-0.5 text-[#e1d5c1]">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}