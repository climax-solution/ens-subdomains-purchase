import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline"
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";

const Pagination = ({ initialPage, totalPages }) => {

    const router = useRouter();
    if (totalPages < 2) {
        return null
    }

    const handleClick = (e) => {
        console.log(router, e)
        if (initialPage != e.selected + 1) router.push(router.route + '?page=' + (e.selected + 1));
    }

    return (
        <div className="flex justify-center w-full">
            <ReactPaginate
                breakLabel="..."
                nextLabel={<ChevronRightIcon className="w-5 h-5"/>}
                onPageChange={handleClick}
                pageRangeDisplayed={3}
                pageCount={totalPages}
                initialPage={initialPage - 1}
                previousLabel={<ChevronLeftIcon className="w-5 h-5"/>}
                renderOnZeroPageCount={null}
                containerClassName="px-1 rounded-full py-2 m-3 items-center bg-gray-500 flex sm:px-6"
                pageClassName="text-white rounded-full hover:bg-indigo-400 relative inline-flex items-center px-4 py-2 text-sm font-medium"
                activeClassName="z-10 bg-indigo-500 rounded-full text-white relative inline-flex items-center px-4 py-2 mx-1 text-sm font-medium"
                breakClassName="text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                previousClassName="relative inline-flex items-center px-2 py-2 rounded-full text-sm font-medium text-white hover:bg-slate-200 hover:text-gray-800"
                nextClassName="relative inline-flex items-center px-2 py-2 rounded-full text-sm font-medium text-white hover:bg-slate-200 hover:text-gray-800"
            />
        </div>
    )
}

export default Pagination;