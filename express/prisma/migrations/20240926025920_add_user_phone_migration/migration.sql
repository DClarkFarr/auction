-- AlterTable
ALTER TABLE `User` ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `subscribedToNewsletter` BOOLEAN NOT NULL DEFAULT false;
