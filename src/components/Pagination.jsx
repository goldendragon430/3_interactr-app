import React from "react";
import styles from './Pagination.module.scss';
import ReactPaginate from "react-paginate";
import Icon from "./Icon";

/**
 * Show pagination angle icons (left/right)
 * @param icon
 * @returns {*}
 * @constructor
 */
const PaginationIcon = ({icon}) => {
    return (
        <div className={styles.paginationIconContainer}>
            <div className={styles.paginationIcon}>
                <Icon icon={icon} size="xs" style={{marginRight: 0}} />
            </div>
        </div>
    )
};

/**
 * For building pagination based on given data info
 *
 * @param pageCount
 * @param onPageChange
 * @param dataCount
 * @param customStyles
 * @param props
 * @returns {null|*}
 * @constructor
 */
const Pagination = ({pageCount, onPageChange, dataCount, customStyles = {}, ...props}) => {
    const paginatorProps = {
        forcePage: --props.forcePage,
        previousLabel: props.previousLabel || <PaginationIcon icon="angle-left" />,
        nextLabel: props.nextLabel || <PaginationIcon icon="angle-right" />,
        breakClassName: props.breakClassName || 'break-me',
        breakLabel: props.breakLabel || '...',
        marginPagesDisplayed: props.marginPagesDisplayed || 2,
        pageRangeDisplayed: props.pageRangeDisplayed || 5,
        subContainerClassName: props.subContainerClassName || 'pages pagination',
        activeClassName: props.activeClassName || 'active',
        pageCount: pageCount,
        onPageChange: ({selected}) => onPageChange(parseInt(++selected))
    };

    const shouldRender = () => dataCount && pageCount > 1;

    if (! shouldRender()) return null;
    
    return (
        <div className={styles.paginationContainer} style={customStyles}>
            <ReactPaginate
                {...paginatorProps}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
            />
        </div>
    );
}

export default Pagination;