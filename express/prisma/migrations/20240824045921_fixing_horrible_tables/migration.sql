/*
  Warnings:

  - The primary key for the `ProductCategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductTags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `relId` to the `ProductCategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relId` to the `ProductTags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductCategories` DROP PRIMARY KEY,
    ADD COLUMN `relId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`relId`);

-- AlterTable
ALTER TABLE `ProductTags` DROP PRIMARY KEY,
    ADD COLUMN `relId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`relId`);

-- CreateIndex
CREATE INDEX `ProductCategories_productId_idx` ON `ProductCategories`(`productId`);

-- CreateIndex
CREATE INDEX `ProductTags_tagId_idx` ON `ProductTags`(`tagId`);
