-- AlterTable
ALTER TABLE `ProductCategories` ADD COLUMN `productItemId_item` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProductItem` ADD COLUMN `claimedAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('active', 'canceled', 'claimed', 'expired', 'purchased', 'rejected') NOT NULL DEFAULT 'active';

-- AddForeignKey
ALTER TABLE `ProductCategories` ADD CONSTRAINT `ProductCategories_productItemId_item_fkey` FOREIGN KEY (`productItemId_item`) REFERENCES `ProductItem`(`id_item`) ON DELETE SET NULL ON UPDATE CASCADE;
