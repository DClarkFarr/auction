import { Popover, TooltipProps } from "flowbite-react";
import { PropsWithChildren, ReactNode } from "react";

export default function BigTextTooltip({
    content,
    children,
    placement = "auto",
    className,
}: PropsWithChildren<{
    content: ReactNode;
    placement?: TooltipProps["placement"];
    className?: string;
}>) {
    return (
        <Popover
            placement={placement}
            trigger="hover"
            theme={{
                arrow: {
                    base: "absolute z-[90] h-2 w-2 z-0 rotate-45 bg-gray-600 border border-gray-800 bg-gray-800",
                },
            }}
            content={
                <div
                    className={`p-4 max-w-[250px] text-center bg-gray-800 text-white text-xs ${className}`}
                >
                    {content}
                </div>
            }
        >
            {children}
        </Popover>
    );
}
