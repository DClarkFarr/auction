import { Alert, Button, FileInput, Label, Spinner } from "flowbite-react";
import { Image, Product } from "../../types/Product";
import TrashIcon from "~icons/ic/baseline-delete";
import { ChangeEvent, useState } from "react";
import { uniqueId } from "lodash-es";
import AdminService, {
    isImageUploadSuccess,
} from "../../services/AdminService";
import { uploadedAsset } from "../../utils/asset";

type ImageLoading = {
    file: string | ArrayBuffer | null;
    id: string;
    pending: boolean;
};

export default function ManageImages({
    product,
    images,
    onAddImages,
    onRemoveImage,
}: {
    product: Product;
    images: Image[];
    onAddImages: (toAdd: Image[]) => Promise<void>;
    onRemoveImage: (image: Image) => Promise<void>;
}) {
    const [uploadingImages, setUploadingImages] = useState<ImageLoading[]>([]);
    const [removingIds, setRemovingIds] = useState<Record<number, boolean>>({});

    const handleSelectFiles = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files) {
            const fd = new FormData();

            Array.from(files).forEach((file) => {
                const id = uniqueId("image-");

                fd.append("files[]", file);
                fd.append("ids[]", id);

                if (FileReader && file) {
                    const fr = new FileReader();
                    fr.onload = function () {
                        const result = fr.result;

                        setUploadingImages((prev) => [
                            ...prev,
                            { file: result, id, pending: true },
                        ]);
                    };
                    fr.readAsDataURL(file);
                }
            });

            const uploadResults = await AdminService.uploadProductImages(
                product.id_product,
                fd
            );

            onAddImages(
                uploadResults.reduce((acc, res) => {
                    if (isImageUploadSuccess(res)) {
                        return [...acc, res.image];
                    }

                    return acc;
                }, [] as Image[])
            );

            setUploadingImages((prev) => {
                const imgs = [...prev].reduce((acc, img) => {
                    const found = uploadResults.find((r) => r.id === img.id);

                    if (found?.status) {
                        return acc;
                    }
                    return [...acc, { ...img, pending: false }];
                }, [] as ImageLoading[]);

                return imgs;
            });
        }

        e.target.value = "";
    };

    const onClickRemove = async (image: Image) => {
        setRemovingIds({ ...removingIds, [image.id_image]: true });
        await onRemoveImage(image);
    };

    return (
        <div className="manage-images pt-4">
            {!images.length && (
                <Alert color="info" className="mb-4">
                    No images uploaded yet. Drag them to get started.
                </Alert>
            )}
            <div className="grid admin__product__images__grid gap-4 mb-8">
                {images.map((image) => (
                    <ImageTile
                        image={image}
                        key={image.id_image}
                        onClickRemove={onClickRemove}
                        isRemoving={removingIds[image.id_image]}
                    />
                ))}
                {uploadingImages.map((image) => {
                    return <ImageLoading image={image} key={image.id} />;
                })}
            </div>
            <div className="upload">
                <div className="flex w-full items-center justify-center">
                    <Label
                        htmlFor="dropzone-file"
                        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <svg
                                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                        <FileInput
                            id="dropzone-file"
                            className="hidden"
                            multiple
                            onChange={handleSelectFiles}
                        />
                    </Label>
                </div>
            </div>
        </div>
    );
}

function ImageTile({
    image,
    isRemoving,
    onClickRemove,
}: {
    image: Image;
    isRemoving: boolean;
    onClickRemove: (image: Image) => void;
}) {
    return (
        <div className="image group/image relative w-[150px]">
            <div className="absolute top-1 right-1 animate-opacity opacity-0 -z-[100] group-hover/image:opacity-100 group-hover/image:z-[50]">
                <Button
                    size="xs"
                    color="failure"
                    isProcessing={isRemoving}
                    disabled={isRemoving}
                    onClick={() => onClickRemove(image)}
                >
                    {!isRemoving && <TrashIcon />}
                </Button>
            </div>
            <img src={uploadedAsset(image.path)} />
        </div>
    );
}

function ImageLoading({ image }: { image: ImageLoading }) {
    return (
        <div className="image group/image relative w-[150px]">
            <img src={image.file as string} />
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-black/25 flex justify-center items-center">
                <Spinner />
            </div>
        </div>
    );
}
