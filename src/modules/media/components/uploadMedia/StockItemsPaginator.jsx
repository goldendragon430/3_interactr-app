import React from "react";
import Pagination from "../../../../components/Pagination";

/**
 * Stock videos paginator
 *
 * @param paginatorInfo
 * @param onChange
 * @returns {*}
 * @constructor
 */
const StockItemsPaginator = ({paginatorInfo, onChange}) => {
    const maxPageCount = paginatorInfo.total / paginatorInfo.perPage;

    return (
        <Pagination
            forcePage={parseInt(paginatorInfo.page)}
            dataCount={paginatorInfo.count}
            pageCount={maxPageCount}
            onPageChange={onChange}
            customStyles={{marginTop: '0px', marginBottom: 0}}
        />
    )
};

export default StockItemsPaginator