import { PaginatedResults } from "../../types/Paginate";
import { Pagination as FBPagination } from "flowbite-react";

export default function Pagination(
    props: Omit<PaginatedResults<null>, "rows"> & {
        onClick: (page: number) => void;
    }
) {
    return (
        <div className="flex overflow-x-auto sm:justify-center">
            <FBPagination
                currentPage={props.page}
                totalPages={props.pages}
                onPageChange={props.onClick}
            />
        </div>
    );
}
