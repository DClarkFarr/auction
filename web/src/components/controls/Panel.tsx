export type PanelProps = React.PropsWithChildren<{
    title: string | React.ReactNode;
}>;

export default function Panel({ title, children }: PanelProps) {
    return (
        <div className="panel mb-8 border border-gray-500 rounded-lg">
            <div className="panel-heading px-6 py-4 bg-gray-100 rounded-t-lg text-lg font-semibold border-b border-b-gray-400">
                {title}
            </div>
            <div className="panel-body py-4 px-6">{children}</div>
        </div>
    );
}
