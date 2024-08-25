-- CreateTable
CREATE TABLE `ProductItem` (
    `id_item` INTEGER NOT NULL AUTO_INCREMENT,
    `id_product` INTEGER NOT NULL,
    `id_purchase` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `expiredAt` DATETIME(3) NULL,
    `purchasedAt` DATETIME(3) NULL,
    `rejectsAt` DATETIME(3) NULL,
    `rejectedAt` DATETIME(3) NULL,

    INDEX `ProductItem_id_product_idx`(`id_product`),
    PRIMARY KEY (`id_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bid` (
    `id_bid` INTEGER NOT NULL AUTO_INCREMENT,
    `id_product` INTEGER NOT NULL,
    `id_item` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Bid_id_product_idx`(`id_product`),
    INDEX `Bid_id_item_idx`(`id_item`),
    INDEX `Bid_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_bid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductItem` ADD CONSTRAINT `ProductItem_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_id_item_fkey` FOREIGN KEY (`id_item`) REFERENCES `ProductItem`(`id_item`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
