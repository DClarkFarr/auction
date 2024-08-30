-- CreateTable
CREATE TABLE `StripeUser` (
    `id_stripe_user` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_external` VARCHAR(191) NOT NULL,
    `id_card` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StripeUser_id_user_key`(`id_user`),
    PRIMARY KEY (`id_stripe_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StripeUser` ADD CONSTRAINT `StripeUser_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
