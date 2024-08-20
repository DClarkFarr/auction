/*
  Warnings:

  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `auctionBatchCount` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `scheduledFor` DATETIME(3) NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('active', 'inactive', 'scheduled', 'archived', 'sold') NOT NULL DEFAULT 'inactive',
    MODIFY `priceCost` DOUBLE NULL,
    MODIFY `priceInitial` DOUBLE NULL,
    MODIFY `priceRetail` DOUBLE NULL,
    MODIFY `description` MEDIUMTEXT NULL,
    MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NULL;
