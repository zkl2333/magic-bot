-- CreateTable
CREATE TABLE `Assistant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `config` TEXT NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `forkedFromId` INTEGER NULL,
    `lastSyncAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAssistant` (
    `userId` VARCHAR(191) NOT NULL,
    `assistantId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `assistantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Assistant` ADD CONSTRAINT `Assistant_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assistant` ADD CONSTRAINT `Assistant_forkedFromId_fkey` FOREIGN KEY (`forkedFromId`) REFERENCES `Assistant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAssistant` ADD CONSTRAINT `UserAssistant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAssistant` ADD CONSTRAINT `UserAssistant_assistantId_fkey` FOREIGN KEY (`assistantId`) REFERENCES `Assistant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
