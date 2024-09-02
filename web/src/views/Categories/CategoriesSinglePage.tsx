// import PaymentMethodWizard from "../components/stripe/PaymentMethodWizard";
import React, { useEffect, useMemo, useState } from "react";
import ProductsSection from "../../components/product/ProductsSection";
import { useIsMaxBreakpoint } from "../../hooks/useWindowBreakpoints";
import { Link, useParams } from "react-router-dom";
import { Alert, Breadcrumb, Spinner } from "flowbite-react";
import SiteService from "../../services/SiteService";
import HomeIcon from "~icons/ic/baseline-house";

export default function ShopPage() {
    const isMobile = useIsMaxBreakpoint("md");

    const drawerRef = React.useRef<HTMLDivElement>(null);

    const params = useParams();

    const categorySlug = params.categorySlug;

    const [category, setCategory] = useState<
        | Awaited<ReturnType<typeof SiteService.getCategory<false, false>>>
        | null
        | false
    >();

    const computedParams = useMemo(() => {
        if (!category) {
            return {};
        }
        return { categoryIds: [category.id_category] };
    }, [category]);

    useEffect(() => {
        const load = async () => {
            setCategory(null);

            try {
                const c = await SiteService.getCategory<false, false>({
                    slug: categorySlug!,
                });
                setCategory(c || false);
            } catch (err) {
                console.warn("error getting category", err);

                setCategory(false);
            }
        };

        if (categorySlug) {
            load();
        }
    }, [categorySlug]);

    if (!categorySlug || category === false) {
        return (
            <Alert>
                <div className="font-bold text-6xl">404</div>
                <div>Category not found. Try another search.</div>
            </Alert>
        );
    }

    if (category === null) {
        return (
            <div className="p-10 flex items-center justify-center">
                <Spinner /> Loading...
            </div>
        );
    }

    return (
        <ProductsSection params={computedParams}>
            <div className="container">
                <div className="shop lg:flex gap-x-4">
                    <ProductsSection.DesktopSidebar teleportMobile={drawerRef}>
                        <ProductsSection.SidebarQualities />
                        <ProductsSection.SidebarPrices />
                    </ProductsSection.DesktopSidebar>
                    <div className="shop__grid grow">
                        <Breadcrumb
                            aria-label="Category single page defaults"
                            className="mb-2"
                        >
                            <Breadcrumb.Item icon={HomeIcon}>
                                <Link
                                    className="text-purple-900 hover:underline"
                                    to="/"
                                >
                                    Home
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link
                                    className="text-purple-900 hover:underline"
                                    to="/shop"
                                >
                                    Shop
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link
                                    className="text-purple-600 hover:text-purple-700 hover:underline"
                                    to="/categories"
                                >
                                    Categories
                                </Link>
                            </Breadcrumb.Item>
                            {category && (
                                <Breadcrumb.Item>
                                    {category.label}
                                </Breadcrumb.Item>
                            )}
                        </Breadcrumb>
                        <ProductsSection.Heading>
                            <div className={`mr-auto ${!isMobile && "hidden"}`}>
                                <ProductsSection.ToggleMobileFilters
                                    visible={isMobile}
                                    ref={drawerRef}
                                />
                            </div>
                        </ProductsSection.Heading>
                        <ProductsSection.Grid />
                        <ProductsSection.EndlessScroller />
                    </div>
                </div>
            </div>
        </ProductsSection>
    );
}
