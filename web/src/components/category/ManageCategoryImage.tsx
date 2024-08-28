import { Button, FileInput, Label, Spinner } from "flowbite-react";
import { FullCategory } from "../../types/Product";
import { uploadedAsset } from "../../utils/asset";
import TimesIcon from "~icons/ic/baseline-close";
import { ReactNode, useState } from "react";

export default function ManageCategoryImage({
    category,
    onDelete,
    onUpload,
}: {
    onUpload: (idCategory: number, file: File) => Promise<void>;
    onDelete: (category: FullCategory) => Promise<void>;
    category: FullCategory;
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingResult, setUploadingResult] = useState<
        string | ArrayBuffer | null
    >(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleClickDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(category);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSelectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            setIsUploading(true);

            onUpload(category.id_category, file);

            if (FileReader && file) {
                const fr = new FileReader();
                fr.onload = function () {
                    const result = fr.result;

                    setUploadingResult(result);
                };
                fr.readAsDataURL(file);
            }
        }

        e.target.value = "";
    };

    if (category.image) {
        return (
            <CategoryImageWrapper>
                <div className="flex items-center gap-4">
                    <div>
                        <img src={uploadedAsset(category.image.path)} />
                    </div>
                    <div className="ml-auto">
                        <Button
                            color="failure"
                            isProcessing={isDeleting}
                            onClick={handleClickDelete}
                        >
                            <TimesIcon />
                        </Button>
                    </div>
                </div>
            </CategoryImageWrapper>
        );
    }

    if (isUploading) {
        return (
            <CategoryImageWrapper>
                <div className="flex items-center gap-4">
                    <div>
                        {!uploadingResult && (
                            <img
                                className="w-[150px] max-h-[150px]"
                                src="https://placehold.co/200x120"
                            />
                        )}
                        {uploadingResult && (
                            <div className="relative">
                                <img
                                    className="w-[150px] max-h-[150px]"
                                    src={uploadingResult as string}
                                />
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/25 flex items-center justify-center">
                                    <Spinner />
                                </div>
                            </div>
                        )}
                    </div>
                    <div>Uploading...</div>
                </div>
            </CategoryImageWrapper>
        );
    }

    return (
        <CategoryImageWrapper>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="file-upload" value="Upload file" />
                </div>
                <FileInput id="file-upload" onChange={handleSelectInput} />
            </div>
        </CategoryImageWrapper>
    );
}

function CategoryImageWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="px-4 py-8 bg-slate-100">
            <div className="pb-2">{children}</div>
        </div>
    );
}
