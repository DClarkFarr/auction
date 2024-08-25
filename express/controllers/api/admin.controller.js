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
                            image: { ...image, path: "/uploads/" + image.path },
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
            "status",
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

        try {
            const results = await ProductService.getPaginatedProducts({
                status,
                page,
                limit,
                withCategories: true,
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
