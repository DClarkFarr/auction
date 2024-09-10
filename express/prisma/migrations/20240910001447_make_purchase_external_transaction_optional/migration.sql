/*
  Warnings:

  - You are about to drop the column `id_transaction_extern` on the `Purchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Purchase` DROP COLUMN `id_transaction_extern`,
    ADD COLUMN `id_transaction_external` VARCHAR(191) NULL;
