import { useState, useEffect } from 'react';
import { ShieldAlert, Landmark, Percent, Gavel, ArrowUpRight, ArrowDownRight, Coins } from 'lucide-react';

export default function GuildGovernance() {
  const [taxRate, setTaxRate] = useState(5); // ภาษีเมืองเริ่มต้น 5%
  const [decree, setDecree] = useState({ title: 'สภาวะปรกติ', desc: 'จักรวรรดิเก็บภาษีตามอัตราปรกติ สมาคมนักผจญภัยรันระบบได้เต็มรูปแบบ' });
  const [governanceLogs, setGovernanceLogs] = useState([]);

  // จำลองการออกประกาศิตจากสภาอาวุโสของเมืองหลวง ขยับทุกๆ 7 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        { title: '🛡️ กฎอัยการศึกมิติปั่นป่วน', desc: 'พบรอยแยกปีศาจใกล้เมืองหลวง จักรวรรดิประกาศขึ้นภาษีสงคราม +3%', rate: 8 },
        { title: '🌾 เทศกาลเฉลิมฉลองประจำปี', desc: 'พระราชาทรงพระเกษมสำราญ ประกาศลดภาษีการค้าเหลือเพียง 2%', rate: 2 },
        { title: '⚖️ พระราชบัญญัติควบคุมอาวุธ', desc: 'สภาอาวุโสเรียกเก็บค่าสัมปทานคลังแสงเพิ่มขึ้น ภาษีขยับเป็น 6%', rate: 6 },
        { title: '💰 ทรัพย์สินหลวงขาดแคลน', desc: 'คลังหลวงโดนลอบโจรกรรม บังคับเก็บภาษีพิเศษสมาคมนักรบเป็น 10%', rate: 10 }
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      setTaxRate(randomEvent.rate);
      setDecree(randomEvent);

      setGovernanceLogs(prev => [{
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        event: randomEvent.title,
        rate: randomEvent.rate
      }, ...prev].slice(0, 5));

    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* 👑 Header สภาบริหารและภาษีเมือง */}
      <header className="relative p-6 border-2 border-[#8b6b4a]/60 bg-[#161210]/90 backdrop-blur-md flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-[#d4af37] font-serif flex items-center gap-3">
            <Landmark className="text-[#d4af37]" size={28} /> หอสภาอาวุโสและภาษีเมือง (Governance)
          </h1>
          <p className="mt-1 text-xs text-[#b49b78] font-serif">
            Imperial Decree • ตรวจสอบกฎหมายบ้านเมือง อัตราภาษีหัก ณ ที่จ่าย และประกาศิตสภาสูง
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ฝั่งซ้าย: แสดงอัตราภาษีปัจจุบันและประกาศราชโองการ */}
        <div className="lg:col-span-2 border-2 border-double border-[#8b6b4a] bg-[#1a1412]/70 backdrop-blur-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-400 font-serif font-bold text-sm mb-4 border-b border-[#5c4630]/40 pb-2">
              <ShieldAlert size={16} /> ประกาศิตจากพระราชาล่าสุด (Current Imperial Decree)
            </div>
            <h2 className="text-xl font-black text-[#ffd700] font-serif mb-2">{decree.title}</h2>
            <p className="text-xs text-[#c7b9a5] font-serif leading-relaxed mb-6">{decree.desc}</p>
          </div>

          {/* แผงแสดงตัวเลขหลอดภาษีขนาดใหญ่ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#5c4630]/40 pt-4">
            <div className="bg-black/50 border border-[#5c4630]/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#241a15] border border-[#d4af37] flex items-center justify-center">
                <Percent className="text-orange-400" size={24} />
              </div>
              <div>
                <div className="text-[10px] text-stone-500 font-serif">อัตราภาษีหัก ณ ที่จ่ายหลวง</div>
                <div className="text-3xl font-black font-mono text-orange-400">{taxRate}%</div>
              </div>
            </div>

            <div className="bg-black/50 border border-[#5c4630]/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#241a15] border border-[#d4af37] flex items-center justify-center">
                <Gavel className="text-amber-500" size={24} />
              </div>
              <div>
                <div className="text-[10px] text-stone-500 font-serif">สถานะการหักลบเงินกิลด์</div>
                <div className="text-xs font-serif text-stone-300 font-bold">อัตโนมัติจากเควสทุก 5 วินาที</div>
              </div>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: ปูมประวัติพงศาวดารการเปลี่ยนภาษี */}
        <div className="border-2 border-[#8b6b4a] bg-[#110d0c]/90 p-5 flex flex-col shadow-lg">
          <h3 className="text-xs font-bold font-serif text-[#d4af37] mb-4 flex items-center gap-2 border-b border-[#5c4630]/40 pb-2 uppercase tracking-widest">
            📜 บันทึกการตรากฎหมายเมือง
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[250px] pr-1custom-scrollbar">
            {governanceLogs.map(log => (
              <div key={log.id} className="text-[11px] p-2.5 bg-[#241a15] border border-[#5c4630]/40 flex justify-between items-center animate-slide-in-right">
                <div>
                  <div className="font-serif font-bold text-[#e1d5c1]">{log.event}</div>
                  <div className="text-[9px] text-stone-500 font-mono mt-0.5">{log.timestamp}</div>
                </div>
                <div className="text-right font-mono font-black text-orange-400">
                  {log.rate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}