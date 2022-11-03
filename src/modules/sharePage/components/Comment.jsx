import React from 'react';
import styles from "./sharePage.module.scss";
import RelativeDate from "../../../components/date/RelativeDate";

/**
 * Render a single comment
 * @param comment
 * @returns {*}
 * @constructor
 */
const Comment = ({comment})=>{
    return (
        <div className={styles.comment} key={comment.id}>
            <div className={styles.commentImage}>
                <img src={comment.image} />
            </div>
            <div className={styles.commentText}>
                <div className={styles.commentName}>{comment.name}</div>
                <div className={comment.commentBody} dangerouslySetInnerHTML={{ __html: comment.text }} />
                <div className={styles.commentDate}>
                    <RelativeDate date={comment.created_at} />
                </div>
            </div>
        </div>
    );
};

export default Comment;