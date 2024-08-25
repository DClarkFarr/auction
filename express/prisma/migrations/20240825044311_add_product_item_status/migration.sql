-- AlterTable
ALTER TABLE `ProductItem` ADD COLUMN `status` ENUM('active', 'purchased', 'rejected', 'expired', 'canceled') NOT NULL DEFAULT 'active';
