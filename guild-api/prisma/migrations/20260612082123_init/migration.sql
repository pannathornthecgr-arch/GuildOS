-- CreateTable
CREATE TABLE "Adventurer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "bounty" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'กำลังสำรวจ',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DungeonLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adventurerId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
