import React, {useState, useEffect} from 'react';
import styles from "./sharePage.module.scss";
import Button from "../../../components/Buttons/Button";
import {Divider} from "../../../components/Divider";
import {useComments, useCreateComment} from "../../../graphql/Comment/hooks";
import Icon from "../../../components/Icon";
import {useSharePageRoute} from "modules/sharePage/routeHooks";
import map from 'lodash/map';
import size from 'lodash/size';
import CommentsPaginator from "./CommentsPaginator";
import Comment from "./Comment";
import NewCommentModal from "./NewCommentModal";
import CommentsLoading from "./CommentsLoading";

/**
 * Render the list of the projects comments
 * @param project
 * @param projectSettingsPage
 * @returns {*}
 * @constructor
 */
const Comments = ({project, projectSettingsPage}) => {
  const project_id = parseInt(project.id);
  const [projectHash, setSharePageParams, {page}] = useSharePageRoute();
  const [commentsData, _, {loading, error, refetch}] = useComments({project_id, page, first: 25});
  const [showNewCommentModal, setShowNewCommentModal] = useState(false);
  const closeModal = () => setShowNewCommentModal(false);
  // set loaders count 5 on first page load
  const [loaderCardsCount, setLoaderCardsCount] = useState(5);

  const paginatorInfo = commentsData?.paginatorInfo;
  const comments = commentsData?.data || [];

  // A little trick to not update comments list in UI until get back response from BE
  useEffect(() => {
    if (commentsData && commentsData?.data) {
        setLoaderCardsCount(commentsData.data.length);
    }
  }, [commentsData]);

  const renderComments = () => {
      return comments && size(comments) ? (
          map(comments, (comment) => (
              <Comment comment={comment} key={comment.id}/>
          ))
      ) : (
          <p>
              {/*<em>You have no comments on your share page yet</em>*/}
          </p>
      )
  };

  return(
    <div>
        {projectSettingsPage ? (
            <h4 className="faded-heading" style={{ marginTop: '15px', marginBottom: '5px' }}>
                Comments
            </h4>
        ) : (
            <Divider text={ "Comments (" + comments.length + ")"}/>
        )}

        {!projectSettingsPage && (
            <Button primary onClick={() => setShowNewCommentModal(true)} className={styles.newCommentBtn}>
                <Icon name="plus" /> Add New Comment
            </Button>
        )}
      <div className="clearfix">
        {loading ? (
            <CommentsLoading loaderCardsCount={loaderCardsCount} />
        ) :
            renderComments()
        }
      </div>

      {paginatorInfo && (
        <div className={styles.paginator}>
          <CommentsPaginator
            paginatorInfo={paginatorInfo || {}}
            onChange={page => setSharePageParams(projectHash, page)}
          />
        </div>
      )}
      {!projectSettingsPage && (
        <NewCommentModal
            project_id={parseInt(project.id)}
            show={showNewCommentModal}
            close={closeModal}
            refetch={refetch}
        />
      )}
    </div>
  );
};
export default Comments;



