// guild-api/server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. API: ดึงรายชื่อนักผจญภัยทั้งหมด
app.get('/api/adventurers', async (req, res) => {
  try {
    const adventurers = await prisma.adventurer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(adventurers);
  } catch (error) {
    res.status(500).json({ error: 'ดึงข้อมูลล้มเหลว' });
  }
});

// 2. API: รับสมัครนักผจญภัยหน้าใหม่
app.post('/api/adventurers', async (req, res) => {
  const { name, adventurerClass, element, rank, bounty } = req.body;
  try {
    const newAdv = await prisma.adventurer.create({
      data: { name, class: adventurerClass, element, rank, bounty: Number(bounty), status: 'กำลังสำรวจ' }
    });
    res.json({ success: true, data: newAdv });
  } catch (error) {
    res.status(500).json({ error: 'บันทึกข้อมูลล้มเหลว' });
  }
});

// 3. API: แก้ไขข้อมูลนักผจญภัย
app.put('/api/adventurers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, adventurerClass, element, rank, bounty, status } = req.body;
  try {
    const updated = await prisma.adventurer.update({
      where: { id },
      data: { name, class: adventurerClass, element, rank, bounty: Number(bounty), status }
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ error: 'อัปเดตล้มเหลว' });
  }
});

// 4. API: ลบรายชื่อนักผจญภัย
app.delete('/api/adventurers/:id', async (req, res) => {
  try {
    await prisma.adventurer.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'ลบล้มเหลว' });
  }
});

// 5. API: ส่งนักผจญภัยไปลุยดันเจี้ยน (อัปเดตสถานะ + บันทึก Log รวดเดียว)
app.post('/api/dungeon/run', async (req, res) => {
  const { adventurerId, adventurerName, dungeonName } = req.body;
  try {
    // ใช้ Transaction เพื่อชัวร์ว่าต้องสำเร็จทั้งคู่ ข้อมูลถึงจะเปลี่ยน
    await prisma.$transaction([
      // บันทึกประวัติการไปลุย
      prisma.dungeonLog.create({
        data: { adventurerId, action: `บุกตะลุยดันเจี้ยน [${dungeonName}]` }
      }),
      // เปลี่ยนสถานะนักผจญภัย
      prisma.adventurer.update({
        where: { id: adventurerId },
        data: { status: 'ออกภารกิจ' }
      })
    ]);
    res.json({ success: true, message: 'ส่งไปลุยดันเจี้ยนสำเร็จ!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในมิติดันเจี้ยน' });
  }
});

// 6. API: ดึงประวัติการลงดันเจี้ยนล่าสุด 5 รายการ
app.get('/api/dungeon/logs', async (req, res) => {
  try {
    const logs = await prisma.dungeonLog.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'ดึง Log ล้มเหลว' });
  }
});
// 7. API: เรียกตัวกลับกิลด์ (เสร็จสิ้นภารกิจ)
app.post('/api/dungeon/complete', async (req, res) => {
  const { adventurerId } = req.body;
  try {
    await prisma.$transaction([
      // บันทึก Log เพิ่มเติมว่ากลับมาแล้ว
      prisma.dungeonLog.create({
        data: { adventurerId, action: `เดินทางกลับมาถึงกิลด์อย่างปลอดภัย 🏰` }
      }),
      // เปลี่ยนสถานะกลับเป็นว่าง (กำลังสำรวจ)
      prisma.adventurer.update({
        where: { id: adventurerId },
        data: { status: 'กำลังสำรวจ' }
      })
    ]);
    res.json({ success: true, message: 'เรียกตัวกลับกิลด์สำเร็จ!' });
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเรียกตัว' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Guild API is running on http://localhost:${PORT}`);
});