-- AlterTable
ALTER TABLE `ProductItem` ADD COLUMN `id_user` INTEGER NULL;

-- CreateIndex
CREATE INDEX `ProductItem_id_user_idx` ON `ProductItem`(`id_user`);

-- AddForeignKey
ALTER TABLE `ProductItem` ADD CONSTRAINT `ProductItem_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
