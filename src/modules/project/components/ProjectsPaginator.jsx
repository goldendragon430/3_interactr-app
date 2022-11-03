import React from "react";
import PropTypes from 'prop-types';

import { Pagination } from "components";
import { useProjectGroupRoute } from "modules/project/routeHooks";

/**
 * ProjectsPaginator gives pagination functionality for projects list
 * @param paginatorInfo
 * @param onChange
 * @returns {*}
 * @constructor
 */
export const ProjectsPaginator = ({paginatorInfo, onChange}) => {
    const maxPageCount = paginatorInfo.total / paginatorInfo.perPage;
    const [_, __, {page}] = useProjectGroupRoute();

    return (
        <Pagination
            forcePage={parseInt(page)}
            dataCount={paginatorInfo.count}
            pageCount={maxPageCount}
            onPageChange={onChange}
        />
    )
};

ProjectsPaginator.propTypes = {
  paginatorInfo: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}