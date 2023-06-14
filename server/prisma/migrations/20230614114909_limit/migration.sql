/*
  Warnings:

  - You are about to drop the column `date` on the `ServiceUsage` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `ServiceUsage` table. All the data in the column will be lost.
  - The primary key for the `SubscriptionServiceLimit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SubscriptionServiceLimit` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `SubscriptionServiceLimit` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceType` to the `ServiceUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ServiceUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `SubscriptionServiceLimit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ServiceUsage` DROP FOREIGN KEY `ServiceUsage_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `SubscriptionServiceLimit` DROP FOREIGN KEY `SubscriptionServiceLimit_serviceId_fkey`;

-- AlterTable
ALTER TABLE `ServiceUsage` DROP COLUMN `date`,
    DROP COLUMN `serviceId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `serviceType` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isDefault` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `price` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `SubscriptionServiceLimit` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `serviceId`,
    ADD COLUMN `serviceType` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`subscriptionId`, `serviceType`);

-- DropTable
DROP TABLE `Service`;
