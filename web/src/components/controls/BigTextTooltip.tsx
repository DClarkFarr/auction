import { Popover } from "flowbite-react";
import { PropsWithChildren, ReactNode } from "react";

export default function BigTextTooltip({
    content,
    children,
}: PropsWithChildren<{ content: ReactNode }>) {
    return (
        <Popover
            placement="top"
            trigger="hover"
            theme={{
                arrow: {
                    base: "absolute h-2 w-2 z-0 rotate-45 bg-gray-600 border border-gray-800 bg-gray-800",
                },
            }}
            content={
                <div className="p-4 max-w-[250px] text-center bg-gray-800 text-white text-xs">
                    {content}
                </div>
            }
        >
            {children}
        </Popover>
    );
}
