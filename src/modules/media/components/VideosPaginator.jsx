import React from "react";
import {useVideosPageRoute} from "../routeHooks";
import Pagination from "../../../components/Pagination";

/**
 * Media items paginator
 * @param paginatorInfo
 * @param onChange
 * @returns {*}
 * @constructor
 */
const VideosPaginator = ({paginatorInfo, onChange, page}) => {
    const maxPageCount = paginatorInfo.total / paginatorInfo.perPage;

    return (
        <Pagination
            forcePage={parseInt(page)}
            dataCount={paginatorInfo.count}
            pageCount={maxPageCount}
            onPageChange={onChange}
        />
    )
};

export default VideosPaginator;