/*
  Warnings:

  - You are about to alter the column `resourceType` on the `Image` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Image` MODIFY `resourceType` ENUM('product') NOT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `detailItems` JSON NOT NULL;
