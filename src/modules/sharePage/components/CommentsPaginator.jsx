import Pagination from "../../../components/Pagination";
import React from "react";
import {useSharePageRoute} from "../routeHooks";


/**
 * CommentsPaginator gives pagination functionality for comments list
 * @param paginatorInfo
 * @param onChange
 * @returns {*}
 * @constructor
 */
const CommentsPaginator = ({paginatorInfo, onChange}) => {
    const maxPageCount = paginatorInfo.total / paginatorInfo.perPage;
    const [_, __, {page}] = useSharePageRoute();

    return (
        <Pagination
            forcePage={parseInt(page)}
            dataCount={paginatorInfo.count}
            pageCount={maxPageCount}
            onPageChange={onChange}
        />
    )
};

export default CommentsPaginator