/*
  Warnings:

  - You are about to drop the column `membershipId` on the `SubscriptionServiceLimit` table. All the data in the column will be lost.
  - You are about to drop the column `membershipExpirationDate` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `membershipId` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `membershipStartDate` on the `UserSubscription` table. All the data in the column will be lost.
  - Added the required column `subscriptionId` to the `SubscriptionServiceLimit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionId` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `SubscriptionServiceLimit` DROP FOREIGN KEY `SubscriptionServiceLimit_membershipId_fkey`;

-- DropForeignKey
ALTER TABLE `UserSubscription` DROP FOREIGN KEY `UserSubscription_membershipId_fkey`;

-- AlterTable
ALTER TABLE `SubscriptionServiceLimit` DROP COLUMN `membershipId`,
    ADD COLUMN `subscriptionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `UserSubscription` DROP COLUMN `membershipExpirationDate`,
    DROP COLUMN `membershipId`,
    DROP COLUMN `membershipStartDate`,
    ADD COLUMN `expirationDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `subscriptionId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UserSubscription` ADD CONSTRAINT `UserSubscription_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionServiceLimit` ADD CONSTRAINT `SubscriptionServiceLimit_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
