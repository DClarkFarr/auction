/*
  Warnings:

  - A unique constraint covering the columns `[productId,tagId]` on the table `ProductTags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProductTags_productId_tagId_key` ON `ProductTags`(`productId`, `tagId`);
