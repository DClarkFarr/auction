import { Label, Spinner } from "flowbite-react";
import { SelectInstance, MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useEffect, useMemo, useRef } from "react";
import { Tag } from "../../types/Product";
import useTagsQuery from "../../hooks/useTagsQuery";

export default function ManageTags({
    onSelectTag,
    onCreateTag,
    tags: currentTags,
}: {
    tags: Tag[] | null;
    onSelectTag: (idTags: number[]) => Promise<void>;
    onCreateTag: (tagLabel: string) => Promise<void>;
}) {
    const { tags, isLoading } = useTagsQuery();

    const ref = useRef<SelectInstance>(null);

    const options = useMemo(() => {
        return tags.map((t) => ({
            label: t.label,
            value: t.id_tag,
        }));
    }, [tags]);

    const defaultValue = useMemo(() => {
        if (!currentTags?.length) {
            return undefined;
        }
        return currentTags.map((tag) => ({
            value: tag.id_tag,
            label: tag.label,
        }));
    }, [currentTags]);

    const handleChange = (
        newValue: MultiValue<{ value: number; label: string }>
    ) => {
        if (newValue) {
            console.log("new value", newValue);
            onSelectTag(newValue.map((v) => v.value));
        }
    };

    const handleCreateTag = (label: string) => {
        onCreateTag(label);
    };

    useEffect(() => {
        if (defaultValue && ref.current) {
            console.log("new value", defaultValue);
            if (defaultValue.length !== ref.current.getValue().length) {
                ref.current.setValue(defaultValue, "deselect-option");
            }
        }
    }, [defaultValue]);

    return (
        <div className="tag-select">
            <Label>Assign Tag(s)</Label>
            {isLoading && (
                <div className="p-4">
                    <Spinner size="lg" />
                </div>
            )}
            {!isLoading && (
                <CreatableSelect
                    ref={ref}
                    defaultValue={defaultValue}
                    options={options}
                    isClearable={false}
                    isMulti={true}
                    isSearchable
                    onChange={(val) =>
                        handleChange(
                            val as MultiValue<{ label: string; value: number }>
                        )
                    }
                    placeholder="Find or create tag"
                    onCreateOption={handleCreateTag}
                />
            )}
        </div>
    );
}
