const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// =========================================================
// 🎁 Drop Table — ไอเทมสุ่มดรอปแยกตาม Rank ของเควส
// =========================================================
const dropTable = {
  S: [
    { itemName: "ดาบผ่าสุริยะ (Solaris Cleaver)", category: "WEAPON", rarity: "S", description: "ดาบในตำนานที่ปลดปล่อยพลังแสงอาทิตย์เมื่อฟาดฟัน", icon: "⚔️" },
    { itemName: "หัวใจมังกรโบราณ (Ancient Dragon Heart)", category: "MATERIAL", rarity: "S", description: "หัวใจของมังกรโบราณ เปี่ยมล้นด้วยพลังธาตุไฟบริสุทธิ์", icon: "❤️‍🔥" }
  ],
  A: [
    { itemName: "คันธนูพฤกษามายา (Elven Mirage Bow)", category: "WEAPON", rarity: "A", description: "คันธนูเอลฟ์ที่สร้างภาพลวงตาเพื่อพรางศัตรู", icon: "🏹" },
    { itemName: "ผลึกมานาบริสุทธิ์ (Pure Mana Crystal)", category: "MATERIAL", rarity: "A", description: "ผลึกมานาเข้มข้น ใช้ตีบวกอุปกรณ์เวทระดับสูง", icon: "💎" }
  ],
  B: [
    { itemName: "โล่พิทักษ์ปฐพี (Aegis Earth Shield)", category: "ARMOR", rarity: "B", description: "โล่หินศักดิ์สิทธิ์ที่ปกป้องผู้ถือจากแรงกระแทกของแผ่นดิน", icon: "🛡️" },
    { itemName: "ดวงตาบาซิลิสก์ (Basilisk Eye)", category: "MATERIAL", rarity: "B", description: "ดวงตาของบาซิลิสก์ ใช้ในพิธีกรรมเวทมนตร์ชั้นกลาง", icon: "👁️" }
  ],
  C: [
    { itemName: "ดาบสั้นสลักอักขระ (Runed Dagger)", category: "WEAPON", rarity: "C", description: "กริชสั้นสลักอักขระเวทย์ เพิ่มความเร็วในการโจมตี", icon: "🗡️" },
    { itemName: "น้ำยาฟื้นฟูพลังเวทมนตร์ขั้นสูง (Greater Mana Potion)", category: "CONSUMABLE", rarity: "C", description: "ยาฟื้นฟูมานาปริมาณมาก ใช้ดื่มได้ทันทีระหว่างผจญภัย", icon: "🧪" }
  ],
  D: [
    { itemName: "ดาบเหล็กกล้ากิลด์ (Guild Iron Sword)", category: "WEAPON", rarity: "D", description: "ดาบมาตรฐานของกิลด์ ผลิตจากเหล็กกล้าคุณภาพดี", icon: "⚔️" },
    { itemName: "สมุนไพรรักษาแผลเกรดดี (High-Grade Healing Herb)", category: "CONSUMABLE", rarity: "D", description: "สมุนไพรเกรดดี ใช้รักษาแผลสดได้ทันที", icon: "🌿" }
  ],
  F: [
    { itemName: "กิ่งไม้แห้งเปี่ยมมานา (Mana-infused Twig)", category: "MATERIAL", rarity: "F", description: "กิ่งไม้แห้งที่มีมานาหลงเหลืออยู่เล็กน้อย", icon: "🪵" },
    { itemName: "เศษเหล็กขึ้นสนิม (Rusty Scrap Metal)", category: "MATERIAL", rarity: "F", description: "เศษเหล็กเก่าขึ้นสนิม นำไปหลอมใหม่ได้", icon: "🔧" }
  ]
};

// 💰 ตารางราคากลางรับซื้อไอเทมของกิลด์ ตามเกรดความหายาก
const itemPriceTable = { 'S': 25000, 'A': 10000, 'B': 5000, 'C': 1200, 'D': 500, 'F': 150 };

// สุ่มไอเทม 1 ชิ้นจาก dropTable ตาม rank ของเควส
function rollDropItem(difficulty) {
  const pool = dropTable[difficulty] || dropTable.F;
  return pool[Math.floor(Math.random() * pool.length)];
}

// โพสต์คำร้องเรียนจากชาวบ้าน
const villagerComplaints = [
  { title: "ช่วยด้วย! มีฝูงหมูป่าขนเหล็กบุกทำลายแปลงหัวไชเท้าท้ายหมู่บ้าน", difficulty: "F", reward: 250, item: "หัวไชเท้ายักษ์ x5" },
  { title: "คุณยายสมพรลืมไม้เท้าเวทมนตร์ไว้ในถ้ำสไลม์ ช่วยไปเก็บให้ที", difficulty: "D", reward: 600, item: "น้ำยาโพชั่นฟื้นฟู" },
  { title: "มีเสียงร้องโหยหวนประหลาดดังมาจากสุสานเก่าตอนเที่ยงคืน ฝากตรวจสอบหน่อย", difficulty: "C", reward: 1500, item: "ผ้าคลุมวิญญาณผุพัง" },
  { title: "กองคาราวานพ่อค้าถูกกลุ่มโจรป่าดักซุ่มโจมตีที่หุบเขาไร้เสียง!", difficulty: "B", reward: 4500, item: "ดาบเหล็กกล้าชั้นดี" },
  { title: "จดหมายรักของลูกสาวผู้ใหญ่บ้านปลิวเข้าไปในเขตแดนของฝูงเซนทอร์คลั่ง", difficulty: "F", reward: 350, item: "เกือกม้าโชคดี" },
  { title: "ตามล่า 'แรคคูนตาเดียว' ที่แอบมาขโมยเหล้าองุ่นในโกดังเสบียงของเมือง", difficulty: "D", reward: 800, item: "เหล้าองุ่นหมักร้อยปี" },
  { title: "พบรอยแยกมิติสีดำทมิฬปล่อยไอปีศาจขยายตัวอยู่กลางป่าลึก", difficulty: "A", reward: 12000, item: "ผลึกมิติมืด" },
  { title: "มังกรโบราณตื่นจากการจำศีลและเริ่มพ่นไฟเผาหมู่บ้านชายแดนกิลด์!", difficulty: "S", reward: 250000, item: "เกล็ดมังกรโบราณ" }
];

// =========================================================
// 🏛️ CORE LOGIC FUNCTIONS (ฟังก์ชันส่วนกลางตามแผนของมิกะ)
// =========================================================

// ฟังก์ชันระบุเวลาออกภารกิจตามระดับความยาก
function getRequiredDuration(difficulty) {
  switch ((difficulty || '').toUpperCase()) {
    case 'S':
    case 'A': return 60;
    case 'B':
    case 'C': return 30;
    default: return 15;
  }
}

// ฟังก์ชันประมวลผลการจบเควสตัวเดี่ยว (ย้ายลอจิกบัญชีและการเงินมารวมไว้ที่นี่ทั้งหมด)
async function completeQuest(adventurerId) {
  const adv = await prisma.adventurer.findUnique({ where: { id: adventurerId } });
  if (!adv) throw new Error('ไม่พบนักผจญภัย');

  const activeQuest = await prisma.quest.findFirst({
    where: { assignedTo: adv.name, status: 'IN_PROGRESS' }
  });

  let totalReward = 0;
  let droppedItem = null;
  let logMessage = '';

  if (activeQuest) {
    totalReward = activeQuest.reward;
    droppedItem = rollDropItem(activeQuest.difficulty);
    await prisma.quest.update({ where: { id: activeQuest.id }, data: { status: 'COMPLETED' } });
    logMessage = `จบภารกิจ [${activeQuest.title}] สำเร็จ! 💰 รับ ${totalReward} ทอง`;
    logMessage += ` และได้ดรอปไอเทม ${droppedItem.icon} ${droppedItem.itemName}`;
  } else {
    totalReward = Math.floor(Math.random() * 500) + 100;
    logMessage = `กลับจากการลาดตระเวน 💰 เก็บเศษเงินได้ ${totalReward} ทอง`;
  }

  // 💰 คำนวณภาษีคลังกิลด์ 5% และส่วนแบ่งกิลด์ 30% ตามกลไก Gold Sink
  const guildCut = Math.floor(totalReward * 0.30);
  const taxCut = Math.floor(totalReward * 0.05);
  const advCut = totalReward - guildCut - taxCut;

  // อัปเดตสถานะนักผจญภัยและประทับเวลาเพื่อส่งเข้าลูป Auto Recovery
  await prisma.adventurer.update({
    where: { id: adventurerId },
    data: {
      status: 'ลาพักฟื้น',
      bounty: adv.bounty + advCut,
      recoveredAt: new Date()
    }
  });

  // บันทึกเงินเข้าคลังสมาคม 30%
  if (guildCut > 0) {
    const treasury = await prisma.guildTreasury.findFirst();
    if (treasury) await prisma.guildTreasury.update({ where: { id: treasury.id }, data: { totalGold: treasury.totalGold + guildCut } });
    else await prisma.guildTreasury.create({ data: { totalGold: guildCut } });
    await prisma.ledger.create({ data: { type: 'INCOME', amount: guildCut, detail: `ส่วนแบ่งกิลด์ 30% จาก [${adv.name}]: ${logMessage}` } });
  }

  // บันทึกภาษีหัก ณ ที่จ่าย 5%
  if (taxCut > 0) {
    await prisma.ledger.create({ data: { type: "INCOME", amount: taxCut, detail: `ภาษีหัก ณ ที่จ่าย 5% จากภารกิจของ ${adv.name}` } });
    const treasury = await prisma.guildTreasury.findFirst();
    if (treasury) await prisma.guildTreasury.update({ where: { id: treasury.id }, data: { totalGold: treasury.totalGold + taxCut } });
    else await prisma.guildTreasury.create({ data: { totalGold: taxCut } });
  }

  // สุ่มดรอปไอเทมลง Inventory คลังแสงกิลด์
  if (droppedItem) {
    const existingItem = await prisma.inventory.findFirst({ where: { itemName: droppedItem.itemName } });
    if (existingItem) {
      await prisma.inventory.update({ where: { id: existingItem.id }, data: { quantity: existingItem.quantity + 1 } });
    } else {
      await prisma.inventory.create({
        data: { itemName: droppedItem.itemName, category: droppedItem.category, rarity: droppedItem.rarity, quantity: 1, description: droppedItem.description, icon: droppedItem.icon }
      });
    }
  }

  await prisma.dungeonLog.create({ data: { adventurerId: adventurerId, action: `${logMessage} (เข้ากิลด์ ${guildCut} ทอง)` } });
  return { success: true };
}

// =========================================================
// 🔄 IDLE AUTOMATION LOOP (ตัวจักรบริหารกิลด์ 24 ชม. ของมิกะ)
// =========================================================
setInterval(async () => {
  try {
    // 🤖 1. ชาวบ้านสร้างเควสอัตโนมัติ
    const randomComplaint = villagerComplaints[Math.floor(Math.random() * villagerComplaints.length)];
    const existingQuest = await prisma.quest.findFirst({ where: { title: randomComplaint.title, status: 'AVAILABLE' } });

    if (!existingQuest) {
      await prisma.quest.create({
        data: { title: randomComplaint.title, difficulty: randomComplaint.difficulty, reward: randomComplaint.reward, item: randomComplaint.item, status: 'AVAILABLE' }
      });
    }

    // ⚔️ 2. Auto Assign: แจกจ่ายงานให้คนว่างงานทันที
    const quests = await prisma.quest.findMany({ where: { status: 'AVAILABLE' }, orderBy: { createdAt: 'asc' } });
    const workers = await prisma.adventurer.findMany({ where: { status: 'กำลังสำรวจ' } });
    const count = Math.min(quests.length, workers.length);

    for (let i = 0; i < count; i++) {
      const quest = quests[i];
      const adv = workers[i];

      await prisma.$transaction([
        prisma.quest.update({ where: { id: quest.id }, data: { status: 'IN_PROGRESS', assignedTo: adv.name, startedAt: new Date() } }),
        prisma.adventurer.update({ where: { id: adv.id }, data: { status: 'ออกภารกิจ' } })
      ]);
    }

    // 🕒 3. Auto Complete: ตรวจสอบและจบเควสตามเงื่อนไขเวลาจริงของ Rank
    const activeQuests = await prisma.quest.findMany({ where: { status: 'IN_PROGRESS' } });
    for (const quest of activeQuests) {
      if (!quest.startedAt) continue;

      const elapsed = (Date.now() - new Date(quest.startedAt).getTime()) / 1000;
      const required = getRequiredDuration(quest.difficulty);

      if (elapsed >= required) {
        const adv = await prisma.adventurer.findFirst({ where: { name: quest.assignedTo } });
        if (adv) await completeQuest(adv.id);
      }
    }

    // 💚 4. Auto Recovery: โรงหมอฟื้นฟูเลือดอัตโนมัติ 15 วินาที
    const recovering = await prisma.adventurer.findMany({ where: { status: 'ลาพักฟื้น' } });
    for (const adv of recovering) {
      if (!adv.recoveredAt) continue;

      const elapsed = (Date.now() - new Date(adv.recoveredAt).getTime()) / 1000;
      if (elapsed >= 15) {
        await prisma.adventurer.update({
          where: { id: adv.id },
          data: { status: 'กำลังสำรวจ', recoveredAt: null }
        });
      }
    }

    // 🧹 5. Cleanup ภารโรงทำความสะอาดบอร์ดเควส
    await prisma.quest.deleteMany({ where: { status: 'COMPLETED' } });

  } catch (error) {
    console.error('❌ Auto-System Error:', error);
  }
}, 15000);

// ==========================================
// 🚀 API ROUTES ZONE
// ==========================================

app.get('/api/adventurers', async (req, res) => {
  try {
    const adventurers = await prisma.adventurer.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(adventurers);
  } catch (error) { res.status(500).json({ error: 'ดึงข้อมูลล้มเหลว' }); }
});

app.post('/api/adventurers', async (req, res) => {
  const { name, adventurerClass, element, rank, bounty, status, branch } = req.body;
  try {
    const adv = await prisma.adventurer.create({
      data: { name, class: adventurerClass || 'นักรบ', element: element || 'แสงสว่าง', rank: rank || 'C', bounty: parseInt(bounty) || 0, status: status || 'กำลังสำรวจ', branch: branch || 'เมืองหลวงแห่งปัญญา' }
    });
    res.json(adv);
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.put('/api/adventurers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, adventurerClass, element, rank, bounty, status, branch } = req.body;
  try {
    const adv = await prisma.adventurer.update({
      where: { id },
      data: { name, class: adventurerClass, element, rank, bounty: parseInt(bounty) || 0, status: status || 'กำลังสำรวจ', branch: branch || 'เมืองหลวงแห่งปัญญา' }
    });
    res.json(adv);
  } catch (error) { res.status(500).json({ error: 'Failed to update database' }); }
});

// =========================================================
// 📦 [POST] API ส่งไอเทมจากกล่องสุ่ม เข้าตาราง Inventory กิลด์ของจริง!
// =========================================================
app.post('/api/relic/add-to-inventory', async (req, res) => {
  const { name, rarity } = req.body;

  // แปลงระดับความหายากให้ตรงกับ Default ตัวใหญ่ใน schema.prisma ของบอส
  let dbRarity = "COMMON";
  if (rarity === "S" || rarity === "SS") dbRarity = "EPIC"; // ปรับตามสเปคเกมบอส
  if (rarity === "A" || rarity === "B") dbRarity = "UNCOMMON";

  try {
    // 🛡️ เช็คก่อนว่าในคลังแสงกิลด์เคยมีไอเทมชิ้นนี้อยู่แล้วหรือไม่ (ถ้ามีให้บวก Quantity เพิ่ม)
    const existingItem = await prisma.inventory.findUnique({
      where: { itemName: name }
    });

    if (existingItem) {
      // 🔄 มีของเดิมอยู่แล้ว สั่งเพิ่มจำนวน (Quantity) อัปเดตตารางโบราณ
      const updated = await prisma.inventory.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: 1 } }
      });
      return res.json({ message: '🔄 เพิ่มจำนวนไอเทมในคลังสำเร็จ!', item: updated });
    }

    // 🆕 เจอยุทธภัณฑ์ชิ้นใหม่แกะกล่อง เสกแถวใหม่ลงตาราง Inventory ตรงๆ
    const newItem = await prisma.inventory.create({
      data: {
        itemName: name,
        category: "ยุทธภัณฑ์",
        rarity: dbRarity,
        quantity: 1,
        description: `⚔️ อาวุธระดับเวทมนตร์ที่อัญเชิญมาจากหอสมบัติปริศนาสมาคม`,
        icon: rarity === "SS" ? "🔪" : rarity === "S" ? "🔫" : "🛡️"
      }
    });

    res.json({ message: '📦 บันทึกศาสตราใหม่เข้าคลังแสงสำเร็จ!', item: newItem });
  } catch (err) {
    console.error("ระบบคลังแสงกิลด์ระเบิดเพราะ: ", err);
    res.status(500).json({ error: 'ระบบเวทมนตร์คลังแสงหลังบ้านขัดข้อง' });
  }
});

app.delete('/api/adventurers/:id', async (req, res) => {
  try {
    await prisma.adventurer.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'ลบล้มเหลว' }); }
});
// =========================================================
// 🎲 [POST] API สำหรับระบบสุ่มกาชาตลาดมืด -> หักเงินจริง + บันทึกลงฐานข้อมูลถาวร
// =========================================================
// =========================================================
// 🎲 [POST] API อัญเชิญกาชาตลาดมืด -> ลิงก์ฐานข้อมูลตรงสเปคบอส 100%
// =========================================================
// =========================================================
// 🎲 [POST] API อัญเชิญกาชาตลาดมืด -> เวอร์ชันอัปเกรดระบบดักตัวซ้ำ (Anti-Duplicate)
// =========================================================
app.post('/api/blackmarket/summon', async (req, res) => {
  const SUMMON_COST = 100000;
  const { rank, name, adventurerClass, element } = req.body;

  try {
    // 1. 🛡️ [เพิ่มใหม่] สแกนเช็คในฐานข้อมูลก่อนว่า สหายคนนี้เคยมีอยู่แล้วหรือไม่
    const existingAdventurer = await prisma.adventurer.findFirst({
      where: { name: name }
    });

    if (existingAdventurer) {
      // ถ้าสุ่มเจอตัวซ้ำ ระบบจะทำการ "คืนเงินก้อน" หรือแจ้งสภาปฏิเสธทันทีเพื่อป้องกันตัวเบิ้ล
      return res.status(400).json({ 
        error: `🔮 มิติปั่นป่วน! สหาย [${name}] มีตัวตนอยู่ในกิลด์นี้แล้ว ไม่สามารถอัญเชิญซ้ำซ้อนได้!` 
      });
    }

    // 2. ตรวจสอบทองคำในคลังกิลด์ตามปกติ
    const currentTreasury = await prisma.guildTreasury.findFirst();
    if (!currentTreasury || currentTreasury.totalGold < SUMMON_COST) {
      return res.status(400).json({ error: '❌ ทองคำในคลังกิลด์มีไม่เพียงพอสำหรับการอัญเชิญ!' });
    }

    // 3. เริ่มลอจิกหักเงิน บันทึกคน และประวัติบัญชี
    const result = await prisma.$transaction([
      prisma.guildTreasury.update({
        where: { id: currentTreasury.id },
        data: { totalGold: { decrement: SUMMON_COST } }
      }),
      prisma.adventurer.create({
        data: {
          name: name,
          class: adventurerClass,
          element: element,
          rank: rank,
          bounty: Math.floor(Math.random() * 50000) + 10000,
          status: 'กำลังสำรวจ',
          branch: 'เมืองหลวงแห่งปัญญา'
        }
      }),
      prisma.ledger.create({
        data: {
          type: 'EXPENSE',
          amount: SUMMON_COST,
          detail: `🎲 จ่ายสินจ้างสัญญาเวทมนตร์อัญเชิญสหายศึก [Rank ${rank}] ${name}`
        }
      })
    ]);

    res.json({ message: '🔮 อัญเชิญถาวรสำเร็จ!', adventurer: result[1] });
  } catch (err) {
    console.error("ระบบกาชาระเบิดเพราะ: ", err);
    res.status(500).json({ error: 'ระบบเวทหลังบ้านขัดข้อง' });
  }
});

// =========================================================
// 🔑 [POST] API สำหรับซื้อกุญแจหอสมบัติ -> หักเงินคลังจริง 2,500 G
// =========================================================
app.post('/api/relic/buy-key', async (req, res) => {
  const KEY_PRICE = 2500;
  try {
    // 🟢 แก้เป็น prisma.guildTreasury
    const currentTreasury = await prisma.guildTreasury.findFirst();
    if (!currentTreasury || currentTreasury.totalGold < KEY_PRICE) {
      return res.status(400).json({ error: 'ทองคำไม่พอซื้อกุญแจ' });
    }

    await prisma.$transaction([
      prisma.guildTreasury.update({
        where: { id: currentTreasury.id },
        data: { totalGold: { decrement: KEY_PRICE } }
      }),
      prisma.ledger.create({
        data: {
          type: 'EXPENSE',
          amount: KEY_PRICE,
          detail: '🔑 ซื้อกุญแจเวทมนตร์ปลดผนึกหอสมบัติสมาคม'
        }
      })
    ]);
    res.json({ message: 'ซื้อกุญแจสำเร็จ' });
  } catch (err) {
    console.error("ซื้อกุญแจระเบิดเพราะ: ", err);
    res.status(500).json({ error: 'ระบบการเงินขัดข้อง' });
  }
});

// =========================================================
// 🔑 [POST] API สำหรับซื้อกุญแจหอสมบัติปริศนา -> หักคลังจริง 2,500 G
// =========================================================
app.post('/api/relic/buy-key', async (req, res) => {
  const KEY_PRICE = 2500;
  try {
    const currentTreasury = await prisma.treasury.findFirst();
    if (!currentTreasury || currentTreasury.totalGold < KEY_PRICE) {
      return res.status(400).json({ error: 'ทองคำไม่พอซื้อกุญแจ' });
    }

    await prisma.$transaction([
      prisma.treasury.update({
        where: { id: currentTreasury.id },
        data: { totalGold: { decrement: KEY_PRICE } }
      }),
      prisma.ledger.create({
        data: {
          timestamp: new Date(),
          type: 'EXPENSE',
          detail: '🔑 ซื้อกุญแจเวทมนตร์ปลดผนึกหอสมบัติสมาคม',
          amount: KEY_PRICE
        }
      })
    ]);
    res.json({ message: 'ซื้อกุญแจสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'ระบบการเงินขัดข้อง' });
  }
});

app.post('/api/dungeon/run', async (req, res) => {
  const { adventurerId, dungeonName } = req.body;
  try {
    await prisma.$transaction([
      prisma.dungeonLog.create({ data: { adventurerId, action: `บุกตะลุยดันเจี้ยน [${dungeonName}]` } }),
      prisma.adventurer.update({ where: { id: adventurerId }, data: { status: 'ออกภารกิจ' } })
    ]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'เกิดข้อผิดพลาด' }); }
});

app.get('/api/dungeon/logs', async (req, res) => {
  try {
    const logs = await prisma.dungeonLog.findMany({ take: 5, orderBy: { timestamp: 'desc' } });
    res.json(logs);
  } catch (error) { res.status(500).json({ error: 'ดึง Log ล้มเหลว' }); }
});

// =========================================================
// 🏰 [POST] API เคลียร์ภารกิจดันเจี้ยน -> อัปเกรดระบบหักภาษี ณ ที่จ่ายส่งเข้าสภาเมืองหลวง
// =========================================================
app.post('/api/dungeon/complete', async (req, res) => {
  const { adventurerId } = req.body;

  try {
    // 1. ค้นหาข้อมูลนักผจญภัยที่ออกไปรบเพื่อดูระดับ Rank และคำนวณรางวัล
    const adventurer = await prisma.adventurer.findUnique({
      where: { id: adventurerId }
    });

    if (!adventurer || adventurer.status !== 'ออกภารกิจ') {
      return res.status(400).json({ error: 'ไม่พบนักผจญภัยที่อยู่ระหว่างออกศึก' });
    }

    // 2. ลอจิกคำนวณเงินรางวัลดิบ (Raw Reward) ตามระดับ Rank ของผู้กล้า
    let rawReward = 5000; // ค่าเริ่มต้นแรงค์ปรกติ
    if (adventurer.rank.includes('S')) rawReward = 50000;
    if (adventurer.rank.includes('A')) rawReward = 25000;
    if (adventurer.rank.includes('B')) rawReward = 12000;

    // 3. ⚖️ [ดึงค่าจริง] ดึงอัตราภาษีปัจจุบันที่ประกาศไว้ในสภาเมือง (ถ้าไม่มีให้ยึด Standard 5%)
    // สมมติบอสเก็บค่า Tax ไว้ในตารางกิลด์ หรือ Window State รอบนี้ดึงยอด Dynamic
    const activeTaxRate = 5; // สามารถผูกตัวแปร Global หรือ Query จากตารางสภาเมืองของบอสได้ตรงนี้เลยครับ
    
    const taxDeduction = Math.floor(rawReward * (activeTaxRate / 100)); // ยอดเงินที่โดนสภาเมืองยึด
    const finalNetGold = rawReward - taxDeduction; // ยอดทองคำสุทธิที่จะเด้งเข้าคลังกิลด์บอสจริง

    const currentTreasury = await prisma.guildTreasury.findFirst();

    // 4. รวบตึง Transaction บันทึกข้อมูลวิถีนักรบ
    await prisma.$transaction([
      // A. ปรับสถานะคนกลับมาลาพักฟื้นเพื่อเติมพลังเลือด
      prisma.adventurer.update({
        where: { id: adventurerId },
        data: { status: 'ลาพักฟื้น' }
      }),
      // B. บวกทองคำเข้าคลังกิลด์ "เฉพาะยอดสุทธิหลังหักภาษีแล้ว" เท่านั้น!
      prisma.guildTreasury.update({
        where: { id: currentTreasury.id },
        data: { totalGold: { increment: finalNetGold } }
      }),
      // C. สลักสมุดบัญชีทองคำว่าได้รายรับเข้ากิลด์พร้อมระบุยอดภาษีที่จ่ายให้สภาเมืองหลวง
      prisma.ledger.create({
        data: {
          type: 'INCOME',
          amount: finalNetGold,
          detail: `💰 [${adventurer.name}] เคลียร์ดันเจี้ยนสำเร็จ! รายได้ดิบ ${rawReward.toLocaleString()} G (หักภาษีสภาเมือง ${activeTaxRate}% เข้าหลวงเรียบร้อย)`
        }
      }),
      // D. บันทึกปูมพงศาวดารมิติ (Dungeon Log)
      prisma.dungeonLog.create({
        data: {
          adventurerId: adventurerId,
          action: `🏰 บัญชาการ: [${adventurer.name}] ทะลวงมิติสำเร็จ นำทองคำสุทธิ ${finalNetGold.toLocaleString()} G กลับคืนสู่คลังกิลด์`
        }
      })
    ]);

    res.json({ message: '⚔️ เคลียร์ภารกิจและตัดจ่ายภาษีสำเร็จ!', earnedGold: finalNetGold });
  } catch (err) {
    console.error("ระบบเคลียร์ดันเจี้ยนระเบิดเพราะ: ", err);
    res.status(500).json({ error: 'ระบบคำนวณส่วนแบ่งหลังบ้านขัดข้อง' });
  }
});

app.get('/api/treasury', async (req, res) => {
  try {
    const treasury = await prisma.guildTreasury.findFirst();
    res.json({ totalGold: treasury ? treasury.totalGold : 0 });
  } catch (error) { res.json({ totalGold: 0 }); }
});

app.get('/api/quests', async (req, res) => {
  try {
    const quests = await prisma.quest.findMany({ where: { status: { not: 'COMPLETED' } }, orderBy: { createdAt: 'desc' } });
    res.json(quests);
  } catch (error) { res.status(500).json({ error: 'ดึงข้อมูลเควสไม่ได้' }); }
});

app.post('/api/quests', async (req, res) => {
  const { title, difficulty, reward, item } = req.body;
  try {
    const newQuest = await prisma.quest.create({
      data: { title, difficulty: difficulty || 'F', reward: parseInt(reward) || 0, item: item || null, status: 'AVAILABLE' }
    });
    res.json(newQuest);
  } catch (error) { res.status(500).json({ error: 'สร้างเควสไม่ได้' }); }
});

// จุดจ่ายงานผ่านหน้าเว็บ (อัปเดตให้ปั๊มตราประทับ startedAt เพื่อเปิดโอกาสให้บอตออโต้มาตรวจนับเวลาได้)
app.put('/api/quests/:id/assign', async (req, res) => {
  const questId = req.params.id;
  const { assignedTo } = req.body; 
  try {
    await prisma.quest.update({ where: { id: questId }, data: { status: 'IN_PROGRESS', assignedTo: assignedTo, startedAt: new Date() } });
    await prisma.adventurer.updateMany({ where: { name: assignedTo }, data: { status: 'ออกภารกิจ' } });
    res.json({ message: 'จ่ายงานสำเร็จ!' });
  } catch (error) { res.status(500).json({ error: 'ระบบแจกงานขัดข้อง' }); }
});

app.get('/api/ledger', async (req, res) => {
  try {
    const ledger = await prisma.ledger.findMany({ orderBy: { timestamp: 'desc' } });
    res.json(ledger);
  } catch (error) { res.status(500).json({ error: 'ดึงข้อมูลบัญชีไม่ได้' }); }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const items = await prisma.inventory.findMany({ orderBy: { rarity: 'asc' } });
    res.json(items);
  } catch (error) { res.status(500).json({ error: 'Error fetching inventory' }); }
});

app.post('/api/inventory/sell', async (req, res) => {
  try {
    const { itemId } = req.body;
    
    const item = await prisma.inventory.findUnique({ where: { id: itemId } });
    if (!item) return res.status(404).json({ error: 'ไม่พบไอเทมในคลัง' });

    const treasury = await prisma.guildTreasury.findFirst();
    const basePrice = itemPriceTable[(item.rarity || 'F').toUpperCase()] || itemPriceTable.F;
    const listingFee = 50;
    const payout = Math.max(0, basePrice - listingFee);

    if (item.quantity > 1) {
      await prisma.inventory.update({ where: { id: item.id }, data: { quantity: item.quantity - 1 } });
    } else {
      await prisma.inventory.delete({ where: { id: item.id } });
    }

    // ระบบกิลด์ปล่อยของออกนอกเพื่อโกยทองเข้าคลังสมาคม
    await prisma.guildTreasury.update({ 
      where: { id: treasury.id }, 
      data: { totalGold: treasury.totalGold + basePrice + listingFee } 
    });

    await prisma.ledger.create({
      data: { type: "INCOME", amount: payout, detail: `กิลด์ปล่อยขายไอเทม [${item.icon || '📦'} ${item.itemName}] เกรด ${item.rarity} สู่ตลาดนอก ราคา ${basePrice.toLocaleString()} ทอง` }
    });

    await prisma.ledger.create({
      data: { type: "INCOME", amount: listingFee, detail: `ค่าธรรมเนียมอำนวยความสะดวกการขนส่งไอเทม [${item.itemName}]` }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ขายไอเทมไม่ได้' });
  }
});

// ==========================================
// 👥📦 ฟังก์ชันกู้ชีพกิลด์: ฉีดพนักงานใหม่ 12 คน
// ==========================================
async function rebuildGuildData() {
  try {
    const advCount = await prisma.adventurer.count();
    if (advCount === 0) {
      console.log("⏳ กำลังร่ายมนตร์เรียกตัวนักผจญภัยระดับเทพ 12 คนเข้าสู่กิลด์...");
      const newAdventurers = [
        { name: "อาเธอร์ แบล็คฮาร์ต", class: "นักรบ", element: "ไฟ", rank: "A", bounty: 45000, status: "กำลังสำรวจ", branch: "ป้อมปราการเหล็ก" },
        { name: "เซเลสเต้ มาร์แชล", class: "จอมเวทย์", element: "แสงสว่าง", rank: "S", bounty: 120000, status: "กำลังสำรวจ", branch: "เมืองหลวงแห่งปัญญา" },
        { name: "คาราสึ เงามายา", class: "นักลอบเร้น", element: "ความมืด", rank: "A+", bounty: 85000, status: "กำลังสำรวจ", branch: "โรงหลอมภาพมายา" },
        { name: "กอร์ดอน ศิลาแกร่ง", class: "ผู้พิทักษ์", element: "ดิน", rank: "B", bounty: 25000, status: "กำลังสำรวจ", branch: "ป้อมปราการเหล็ก" },
        { name: "ลูน่า วินด์วอล์กเกอร์", class: "นักธนู", element: "ลม", rank: "B+", bounty: 38000, status: "กำลังสำรวจ", branch: "หุบเขาศิลปิน" },
        { name: "เอลเลน่า ผู้เมตตา", class: "บิชอป", element: "พระจันทร์", rank: "A", bounty: 50000, status: "กำลังสำรวจ", branch: "เมืองหลวงแห่งปัญญา" },
        { name: "บัลทาซาร์ บ้าเลือด", class: "เบอร์เซิร์กเกอร์", element: "ไฟ", rank: "S+", bounty: 250000, status: "กำลังสำรวจ", branch: "ป้อมปราการเหล็ก" },
        { name: "มอร์กาน่า ผู้ปลุกศพ", class: "เนโครแมนเซอร์", element: "ความมืด", rank: "S", bounty: 140000, status: "กำลังสำรวจ", branch: "หอคอยพฤกษา" },
        { name: "มาร์โก้ ถุงทอง", class: "พ่อค้า", element: "สายฟ้า", rank: "C", bounty: 12000, status: "กำลังสำรวจ", branch: "นครการค้า" },
        { name: "ฟรอสต์ อาร์คเมจ", class: "จอมเวทย์", element: "น้ำแข็ง", rank: "A+", bounty: 92000, status: "กำลังสำรวจ", branch: "โรงหลอมภาพมายา" },
        { name: "ซิลเวีย พฤกษาเวท", class: "นักเวทย์", element: "พฤกษา", rank: "B", bounty: 22000, status: "กำลังสำรวจ", branch: "หอคอยพฤกษา" },
        { name: "ไคท์ วารีพิฆาต", class: "นักรบ", element: "น้ำ", rank: "C+", bounty: 18000, status: "กำลังสำรวจ", branch: "นครการค้า" }
      ];

      for (const adv of newAdventurers) {
        await prisma.adventurer.create({ data: adv });
      }
      console.log("✅ สมาชิกใหม่ 12 คนลงทะเบียนเข้ากิลด์สำเร็จ!");
    }

    const ledgerCount = await prisma.ledger.count();
    if (ledgerCount === 0) {
      console.log("⏳ กำลังฟื้นฟูประวัติสมุดบัญชีทองคำ...");
      const ledgerEntries = [
        { type: "INCOME", amount: 150000, detail: "ส่วนแบ่งภาษีเควสล่าบีฮีมอธคลั่งในป่าหมอกลวงตา (หักค่าธรรมเนียมสมาคม 10% แล้ว)", timestamp: new Date("2026-06-10T08:30:00Z") },
        { type: "EXPENSE", amount: 45000, detail: "ว่าจ้างนักบวชนอกรีตทำพิธีสะเดาะเคราะห์และชำระล้างคำสาปโลหิตบนชุดเกราะระดับ S ของหัวหน้าหน่วยที่ 1", timestamp: new Date("2026-06-11T14:15:00Z") },
        { type: "INCOME", amount: 85000, detail: "เงินมัดจำค่าประมูลดวงตาบาซิลิสก์โบราณจากสมาคมนักเล่นแร่แปรธาตุลับแห่งราตรี", timestamp: new Date("2026-06-12T21:00:00Z") },
        { type: "EXPENSE", amount: 30000, detail: "เงินชดเชยและค่าทำศพให้ครอบครัวทหารรับจ้างระดับ C ณ สุสานใต้ดินกริมฮอลล์", timestamp: new Date("2026-06-13T09:45:00Z") },
        { type: "INCOME", amount: 60000, detail: "ค่าธรรมเนียมคุ้มกันขบวนสินค้าค้าของเถื่อนผ่านหุบเขาเงาทมิฬ", timestamp: new Date("2026-06-14T03:20:00Z") }
      ];

      for (const entry of ledgerEntries) {
        await prisma.ledger.create({ data: entry });
      }
      
      const treasury = await prisma.guildTreasury.findFirst();
      if (!treasury) {
        await prisma.guildTreasury.create({ data: { totalGold: 50000 } });
      }
      console.log("✅ ฟื้นฟูระบบสมุดบัญชีและเงินคลังสำเร็จ!");
    }
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการกู้ระบบ:", err);
  }
}

rebuildGuildData();

app.listen(3000, () => {
  console.log('🚀 Guild API is running on http://localhost:3000');
});

// =========================================================
// 🪙 [POST] API แลกเปลี่ยนไอเทมเป็นทองคำ -> หักจำนวนชิ้นในคลัง + บวกเงินเข้าคลังกิลด์จริง!
// =========================================================
app.post('/api/inventory/sell', async (req, res) => {
  const { itemId } = req.body;

  // ฟังก์ชันคำนวณราคากลางฝั่งหลังบ้าน (ล็อกราคาให้ตรงกับหน้าจอของบอส 100%)
  const getItemPrice = (rarity) => {
    switch (rarity) {
      case 'SS': case 'LEGENDARY': return 100000;
      case 'S': case 'EPIC': return 50000;
      case 'A': case 'RARE': return 15000;
      case 'B': case 'UNCOMMON': return 2500;
      default: return 150;
    }
  };

  try {
    // 1. ค้นหาไอเทมชิ้นที่บอสต้องการจะขายในฐานข้อมูล
    const item = await prisma.inventory.findUnique({
      where: { id: itemId }
    });

    if (!item || item.quantity <= 0) {
      return res.status(400).json({ error: '❌ ไร้ซึ่งยุทธภัณฑ์ชิ้นนี้ปรากฏอยู่ในคลังแสง!' });
    }

    const currentTreasury = await prisma.guildTreasury.findFirst();
    const sellPrice = getItemPrice(item.rarity); // ประเมินมูลค่าทองคำที่ควรได้รับ

    // 2. ใช้ระบบ Transaction ป้องกันข้อมูลเพี้ยนเวลากดรัวๆ
    await prisma.$transaction(async (tx) => {
      
      // A. ลอจิกหักจำนวนไอเทม: ถ้าเหลือชิ้นสุดท้ายให้ลบแถวทิ้ง ถ้าเหลือเยอะให้ decrement ลดจำนวนลง 1
      if (item.quantity === 1) {
        await tx.inventory.delete({ where: { id: itemId } });
      } else {
        await tx.inventory.update({
          where: { id: itemId },
          data: { quantity: { decrement: 1 } }
        });
      }

      // B. บวกเงินทองคำเข้าสู่คลังกิลด์ของจริง
      await tx.guildTreasury.update({
        where: { id: currentTreasury.id },
        data: { totalGold: { increment: sellPrice } }
      });

      // C. สลักป้ายสีเขียวบันทึกรายรับลงสมุดคัมภีร์บัญชีทองคำ (Ledger)
      await tx.ledger.create({
        data: {
          type: 'INCOME',
          amount: sellPrice,
          detail: `🪙 แลกเปลี่ยนสมบัติหลวง [Rank ${item.rarity}] ${item.itemName} คืนสู่สมาคม`
        }
      });
    });

    res.json({ message: '🪙 แลกเปลี่ยนเปลี่ยนเป็นเงินตราสำเร็จ!', receivedGold: sellPrice });
  } catch (err) {
    console.error("ระบบขายสมบัติระเบิดเนื่องจาก: ", err);
    res.status(500).json({ error: 'ระบบศิลาคลังแสงหลังบ้านขัดข้อง' });
  }
});