import React from "react";
import times from "lodash/times";
import styles from "./sharePage.module.scss";
import ContentLoader from "react-content-loader";

/**
 * Comments list loader
 * @param loaderCardsCount
 * @returns {Array}
 * @constructor
 */
const CommentsLoading = ({loaderCardsCount}) => {
    return times(loaderCardsCount, (i)=>(
        <div className={styles.comment} key={i}>
            <ContentLoader
                speed={2}
                width="100%"
                height={60}
                viewBox="0 0 1600 100"
            />
        </div>
    ));
};

export default CommentsLoading;