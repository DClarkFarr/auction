-- CreateTable
CREATE TABLE `Favorite` (
    `id_favorite` INTEGER NOT NULL AUTO_INCREMENT,
    `id_item` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Favorite_id_user_idx`(`id_user`),
    INDEX `Favorite_id_item_idx`(`id_item`),
    UNIQUE INDEX `Favorite_id_user_id_item_key`(`id_user`, `id_item`),
    PRIMARY KEY (`id_favorite`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
