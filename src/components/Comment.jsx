import React, { useState } from 'react';
import RelativeDate from "./date/RelativeDate";
import Button from 'components/Buttons/Button'
import Icon from './Icon';
import styles from 'components/Comment.module.scss';
import { useCommentCommands } from '../graphql/Comment/hooks.js';
import { errorAlert } from '../utils/alert';

const Comment = ({ comment }) => {
  const [loading, setLoading] = useState(false);
  const { deleteComment } = useCommentCommands();

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await deleteComment({
        variables: {
          id: comment.id
        },
      });
      setLoading(false);

    } catch(err) {
      setLoading(false)
      errorAlert({
        title: 'Error',
        text: 'An error occurred trying to delete the comment. Please try again.'
      })
      console.error(err)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={'grid'}>
        <div className={'col3'}>
          <p>
            <strong>Name</strong><br />
            {comment.name}
          </p>
        </div>
        <div className={'col3'}>
          <p>
            <strong>Email</strong><br />
            {comment.email}
          </p>
        </div>
        <div className={'col3'}>
          <p>
            <strong>Submitted</strong><br />
            <em><RelativeDate date={comment.created_at}/></em>
          </p>
        </div>
        <div className={'col3'}>
          <p className={styles.deleteIcon}>
            <Button 
              red
              onClick={handleDelete}
            >
              { (loading) ? <Icon loading /> : <Icon name={'trash-alt'} /> }
              Remove Comment
            </Button>
          </p>
        </div>
        <div className={'col12'}>
          <p>
            <strong>Comment</strong><br />
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Comment;