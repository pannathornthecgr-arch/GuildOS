// guild-api/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 เริ่มอัญเชิญนักผจญภัยเข้าสู่ Database...');

  // ล้างข้อมูลเก่าทิ้งก่อน (เผื่อเผลอกดรันซ้ำ ข้อมูลจะได้ไม่เบิ้ล)
  await prisma.adventurer.deleteMany();
  await prisma.dungeonLog.deleteMany();

  // เสกข้อมูลนักผจญภัยชุดแรก (ข้อมูลเดียวกับหน้า Mockup ของเรา)
  await prisma.adventurer.createMany({
    data: [
      { name: 'นาคเงิน', class: 'นักรบ', element: 'แสงสว่าง', rank: 'S', bounty: 100000, status: 'กำลังสำรวจ' },
      { name: 'งูเงาไวลม', class: 'นักลอบเร้น', element: 'ลม', rank: 'C', bounty: 12000, status: 'ลาพักฟื้น' },
      { name: 'กำแพงเหล็ก', class: 'ผู้พิทักษ์', element: 'น้ำ', rank: 'A', bounty: 47500, status: 'ออกภารกิจ' },
      { name: 'นางฟ้าไฟมรณะ', class: 'จอมเวทย์', element: 'ไฟ', rank: 'B', bounty: 29000, status: 'ลาหยุดพัก' },
    ],
  });

  console.log('✅ อัญเชิญนักผจญภัยทั้ง 4 คนเข้าสู่กิลด์เรียบร้อยแล้ว!');
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาด:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });