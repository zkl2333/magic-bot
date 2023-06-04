/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_accountId_fkey`;

-- DropTable
DROP TABLE `Account`;

-- DropTable
DROP TABLE `Transaction`;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `pointsPurchased` INTEGER NOT NULL,
    `paymentAmount` DECIMAL(65, 30) NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL,
    `updateStatus` VARCHAR(191) NOT NULL,
    `retries` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `payType` VARCHAR(191) NOT NULL,
    `notifyUrl` VARCHAR(191) NOT NULL,
    `paymentTime` DATETIME(3) NULL,
    `aoid` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
