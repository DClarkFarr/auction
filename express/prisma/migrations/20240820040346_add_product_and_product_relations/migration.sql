-- CreateTable
CREATE TABLE `Product` (
    `id_product` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `priceCost` DOUBLE NOT NULL,
    `priceInitial` DOUBLE NOT NULL,
    `priceRetail` DOUBLE NOT NULL,
    `initialQuantity` INTEGER NOT NULL DEFAULT 1,
    `remainingQuantity` INTEGER NOT NULL DEFAULT 1,
    `quality` INTEGER NOT NULL DEFAULT 5,
    `description` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id_tag` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id_tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id_category` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id_category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id_image` INTEGER NOT NULL AUTO_INCREMENT,
    `resourceType` VARCHAR(191) NOT NULL,
    `resourceId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NOT NULL,
    INDEX `type_id`(`resourceType`, `resourceId`),
    PRIMARY KEY (`id_image`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductTags` (
    `productId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,
    PRIMARY KEY (`tagId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCategories` (
    `productId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,
    PRIMARY KEY (`productId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
-- ALTER TABLE `ProductTags` ADD CONSTRAINT `ProductTags_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
-- ALTER TABLE `ProductTags` ADD CONSTRAINT `ProductTags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id_tag`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
-- ALTER TABLE `ProductCategories` ADD CONSTRAINT `ProductCategories_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
-- ALTER TABLE `ProductCategories` ADD CONSTRAINT `ProductCategories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;