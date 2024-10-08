import { pick } from "lodash-es";
import { hasAccessLevel, hasUser } from "../../middleware/auth.middleware.js";
import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";
import AdminService from "../../services/AdminService.js";
import BaseController from "../_.controller.js";
import ProductService from "../../services/ProductService.js";
import { upload } from "../../middleware/uploadMiddleware.js";
import fs from "fs";
import ProductModel from "../../models/ProductModel.js";
import { toSlug } from "../../utils/slug.js";
import ImageModel from "../../models/ImageModel.js";
import CategoryService from "../../services/CategoryService.js";
import CategoryModel from "../../models/CategoryModel.js";
import SiteService from "../../services/SiteService.js";
import ProductItemModel from "../../models/ProductItemModel.js";

export default class AdminController extends BaseController {
    base = "/admin";

    constructor() {
        super();
    }
    initRoutes() {
        const middleware = [
            webSessionMiddleware,
            hasUser(),
            hasAccessLevel("admin"),
        ];
        this.router.get("/users", middleware, this.route(this.getUsers));

        this.router.get(
            "/categories",
            middleware,
            this.route(this.queryCategories)
        );

        this.router.put(
            "/categories/:id",
            middleware,
            this.route(this.updateCategory)
        );

        this.router.post(
            "/categories/:id/image",
            middleware,
            this.route(this.uploadCategoryImage)
        );
        this.router.delete(
            "/categories/:id/image",
            middleware,
            this.route(this.deleteCategoryImage)
        );

        this.router.post(
            "/products",
            middleware,
            this.route(this.createProduct)
        );

        this.router.get(
            "/products",
            middleware,
            this.route(this.queryProducts)
        );

        this.router.get(
            "/products/:id",
            middleware,
            this.route(this.queryProduct)
        );

        this.router.get(
            "/products/:id/inventory",
            middleware,
            this.route(this.getProductInventory)
        );

        this.router.put(
            "/products/:id",
            middleware,
            this.route(this.updateProduct)
        );

        this.router.post(
            "/products/:id/items",
            middleware,
            this.route(this.updateDetailItems)
        );

        this.router.put(
            "/products/:id/status",
            middleware,
            this.route(this.setProductStatus)
        );

        this.router.post(
            "/products/:id/categories",
            middleware,
            this.route(this.createProductCategory)
        );

        this.router.put(
            "/products/:id/categories",
            middleware,
            this.route(this.setProductCategory)
        );

        this.router.post(
            "/products/:id/tags",
            middleware,
            this.route(this.createProductTag)
        );

        this.router.put(
            "/products/:id/tags",
            middleware,
            this.route(this.setProductTags)
        );

        this.router.post(
            "/products/:id/images",
            middleware,
            this.route(this.uploadProductImages)
        );

        this.router.delete(
            "/products/:id/images/:imageId",
            middleware,
            this.route(this.deleteProductImage)
        );

        this.router.post(
            "/site/setting/:key",
            middleware,
            this.route(this.saveSiteSetting)
        );
    }

    async getProductInventory(req, res) {
        const productId = req.params.id;
        const productItemModel = new ProductItemModel();

        try {
            const items = await productItemModel.table.findMany({
                where: {
                    id_product: Number(productId),
                },
                include: {
                    bids: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            res.json(items);
        } catch (err) {
            console.warn("error saving site setting", err.message);
            res.status(400).json({ message: err.message });
        }
    }

    async saveSiteSetting(req, res) {
        const key = String(req.params.key);
        const value = req.body.value;

        if (!key) {
            return res.status(400).json({ message: "Key must be valid" });
        }
        if (!value || typeof value !== "object") {
            return res.status(400).json({ message: "Value not valid" });
        }

        try {
            const setting = await SiteService.saveSetting(key, value);
            res.json(setting);
        } catch (err) {
            console.warn("error saving site setting", err.message);
            res.status(400).json({ message: err.message });
        }
    }

    async deleteCategoryImage(req, res) {
        const idCategory = Number(req.params.id);

        if (isNaN(idCategory)) {
            return res.status(400).json({ message: "Invalid category id" });
        }

        try {
            const category = await CategoryService.deleteCategoryImage(
                idCategory
            );

            res.json(category);
        } catch (err) {
            console.warn("error deleting category image", err);
            res.status(400).json({ message: err.message });
        }
    }
    async uploadCategoryImage(req, res) {
        upload.single("file")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: "File not uploaded" });
            }

            if (file.size > 2 * 1024 * 1024) {
                return res.status(400).json({ message: "File too large" });
            }

            const idCategory = Number(req.params.id);

            if (isNaN(idCategory)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }

            const imageModel = new ImageModel();
            const categoryModel = new CategoryModel();

            const category = await categoryModel.table.findFirst({
                where: { id_category: idCategory },
            });

            const toFilename = toSlug(category.label) + "--" + file.filename;

            fs.renameSync(
                file.destination + file.filename,
                file.destination + toFilename
            );

            const image = await imageModel.create({
                resourceId: category.id_category,
                resourceType: "category",
                path: toFilename,
                alt: `${category.label} -- Image`,
            });

            category.image = image;

            res.json(category);
        });
    }

    async queryCategories(req, res) {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;

        try {
            const results = await CategoryService.getPaginatedCategories({
                page,
                limit,
                withImage: true,
            });

            res.json(results);
        } catch (err) {
            console.warn("error paginating categories", err);
            res.status(401).json({
                message: "Error loading categories",
                error: err.message,
            });
        }
    }

    async updateCategory(req, res) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const label = req.body.label;

        try {
            const category = await CategoryService.updateCategory(id, {
                label,
            });

            res.json(category);
        } catch (err) {
            console.warn("caught error updating category", err);

            res.status(400).json({ message: err.message });
        }
    }

    async setProductStatus(req, res) {
        const idProduct = parseInt(req.params.id);
        const status = req.body.status;

        if (typeof status !== "string") {
            return res.status(400).json({ message: "Status must be a string" });
        }

        if (typeof idProduct !== "number") {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        try {
            const result = await ProductService.publishProductStatus(
                idProduct,
                status
            );

            res.json(result);
        } catch (err) {
            res.status(401).json({ message: err.message });
        }
    }

    async deleteProductImage(req, res) {
        const idProduct = parseInt(req.params.id);
        const idImage = parseInt(req.params.imageId);

        try {
            await ProductService.deleteProductImage(idProduct, idImage);
            res.json({ deleted: true });
        } catch (err) {
            res.status(401).json({ message: err.message });
        }
    }

    async uploadProductImages(req, res) {
        upload.array("files[]", 10)(req, res, async (err) => {
            const files = req.files || [];
            const ids = req.body.ids || [];
            const uploads = [];
            const idProduct = parseInt(req.params.id);
            const productModel = new ProductModel();
            const imageModel = new ImageModel();

            if (isNaN(idProduct)) {
                return res.status(400).json({ message: "Product ID invalid" });
            }

            const product = await productModel.table.findFirst({
                where: { id_product: idProduct },
            });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const count = await imageModel.table.count({
                where: {
                    resourceId: product.id_product,
                    resourceType: "product",
                },
            });

            // Process each file manually
            await Promise.all(
                files.map(async (file, i) => {
                    if (file.size > 2 * 1024 * 1024) {
                        uploads.push({
                            status: false,
                            id: ids[i],
                            filename: file.originalname,
                            message: "Invalid file",
                        });
                    } else {
                        const toFilename =
                            toSlug(product.name) + "--" + file.filename;

                        fs.renameSync(
                            file.destination + file.filename,
                            file.destination + toFilename
                        );

                        const image = await imageModel.create({
                            resourceId: product.id_product,
                            resourceType: "product",
                            path: toFilename,
                            alt: `${product.name} -- Image ${count + i + 1}`,
                        });

                        uploads.push({
                            status: true,
                            id: ids[i],
                            image,
                        });
                    }
                })
            );

            res.json(uploads);
        });
    }

    async setProductTags(req, res) {
        const idProduct = Number(req.params.id);
        const idTags = req.body?.idTags?.map((v) => Number(v));

        if (idTags.some((v) => isNaN(v))) {
            return res
                .status(400)
                .json({ message: "Tag IDs must be a number" });
        }

        try {
            const tags = await ProductService.setProductTags(idProduct, idTags);

            res.json(tags);
        } catch (err) {
            console.warn("error setting product tags", err);
            res.status(400).json({ message: err.message });
        }
    }

    async createProductTag(req, res) {
        const id = Number(req.params.id);
        const label = req.body.label;

        try {
            const tag = await ProductService.createProductTag(id, label);
            res.json(tag);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async setProductCategory(req, res) {
        const idProduct = Number(req.params.id);
        const idCategory = Number(req.body.idCategory);

        if (isNaN(idCategory)) {
            return res
                .status(400)
                .json({ message: "Category ID must be a number" });
        }

        try {
            const category = await ProductService.setProductCategory(
                idProduct,
                idCategory
            );

            res.json(category);
        } catch (err) {
            console.warn("error setting product category", err);
            res.status(400).json({ message: err.message });
        }
    }

    async createProductCategory(req, res) {
        const id = Number(req.params.id);
        const label = req.body.label;

        try {
            const category = await ProductService.createProductCategory(
                id,
                label
            );
            res.json(category);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateDetailItems(req, res) {
        const id = Number(req.params.id);
        const items = req.body.items || [];

        try {
            await ProductService.updateProductDetails(id, items);

            const product = await ProductService.getProductById(id);

            res.json(product);
        } catch (err) {
            console.warn("Caught error saving product items", err);
            res.status(400).json({ message: err.message });
        }
    }

    async updateProduct(req, res) {
        const id = Number(req.params.id);

        const toSet = pick(req.body, [
            "auctionBatchCount",
            "description",
            "initialQuantity",
            "name",
            "priceCost",
            "priceInitial",
            "priceRetail",
            "quality",
            "remainingQuantity",
            "scheduledFor",
            "sku",
        ]);

        try {
            await ProductService.updateProduct(id, toSet);

            const product = await ProductService.getProductById(id);

            res.json(product);
        } catch (err) {
            console.warn("error updating product", err);

            res.status(400).json({ message: err.message });
        }
    }

    async queryProduct(req, res) {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res
                .status(400)
                .json({ message: "Invalid product id given" });
        }

        try {
            const product = await ProductService.getProductById(id);

            res.json(product);
        } catch (err) {
            console.warn("error saving product", err);
            res.status(401).json({ message: err.message });
        }
    }

    async queryProducts(req, res) {
        const status = Array.isArray(req.query.status) ? req.query.status : [];
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const withImages = String(req.query.withImages) === "true";
        const withCategories =
            String(req.query.withCategories) === "false" ? false : true;

        try {
            const results = await ProductService.getPaginatedProducts({
                status,
                page,
                limit,
                withImages,
                withCategories,
            });

            res.json(results);
        } catch (err) {
            res.status(401).json({
                message: "Error loading products",
                error: err.message,
            });
        }
    }

    async createProduct(req, res) {
        const name = req.body.name?.trim() || "";

        if (name.length < 3) {
            return res.status(401).json({ message: "Name required" });
        }

        try {
            const product = await ProductService.createProduct({ name });

            res.json(product);
        } catch (err) {
            res.status(401).json({ message: err.message });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await AdminService.getUsers();

            res.json(users);
        } catch (err) {
            return res.status(401).json({ message: err.message });
        }
    }
}
