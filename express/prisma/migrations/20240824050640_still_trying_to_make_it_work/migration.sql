-- CreateIndex
CREATE INDEX `ProductCategories_categoryId_fkey` ON `ProductCategories`(`categoryId`);

-- CreateIndex
CREATE INDEX `ProductTags_productId_fkey` ON `ProductTags`(`productId`);

-- AddForeignKey
-- ALTER TABLE `ProductTags` ADD CONSTRAINT `ProductTags_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
-- ALTER TABLE `ProductTags` ADD CONSTRAINT `ProductTags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id_tag`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
-- ALTER TABLE `ProductCategories` ADD CONSTRAINT `ProductCategories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
-- ALTER TABLE `ProductCategories` ADD CONSTRAINT `ProductCategories_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;