import React, { useEffect, useRef, useCallback } from 'react';
import styles from './NodePage.module.scss';
import PageBody from 'components/PageBody';
import Icon from 'components/Icon';
import { Link, useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/client';
import { GET_NODE } from '../../../graphql/Node/queries';
import ErrorMessage from '../../../components/ErrorMessage';
// import { toast, ToastContainer } from 'react-toastify';
import { getNodeForSaving } from '../../../graphql/Node/utils';
import Emitter, {
  NODE_PAGE_SAVE_COMPLETE,
  NODE_PAGE_SAVE_START,
  SAVE_NODE_PAGE,
  // SHOW_SELECT_MODAL_TEMPLATE_MODAL,
} from '../../../utils/EventEmitter';
import { errorAlert } from '../../../utils/alert';
// import { EventListener } from '../../../components/EventListener';
import { useNodeCommands } from '../../../graphql/Node/hooks';
import {usePlayer} from "../../../graphql/LocalState/player";
import NotFoundPage from "../../../components/NotFoundPage";
// import { Slide, Zoom, Flip, Bounce } from 'react-toastify';

/**
 * The main layout for the node page
 * @param children
 * @param actionsComponent
 * @returns {*}
 * @constructor
 */
const NodePageLayout = ({ children, actionsComponent }) => {
  const { nodeId } = useParams();

  useSaveNodeEditorListener(nodeId);

  return (
    <PageBody
      right={actionsComponent}
      heading={<NodeHeader />}
    >
      <div className="pr-1">{children}</div>
    </PageBody>
  );
};
export default NodePageLayout;

/**
 * THe header for the node page, this is the area between
 * the breadcrumb and the top of the node's editable area.
 * @returns {null|*}
 * @constructor
 */
const QUERY = gql`
  query node($id: ID!) {
    node(id: $id) {
      id
      name
      duration
    }
  }
`;
const NodeHeader = () => {
  const { nodeId, projectId } = useParams();
  const {updatePlayer} = usePlayer();


  const { loading, error, data } = useQuery(QUERY, {
    variables: { id: nodeId },
    fetchPolicy: 'cache-only',
  });

  if (loading) return <Icon loading />;

  if (error) return null;

  const { name, duration } = data.node;

  // do we need to set the duration manually
  if(duration) {
    updatePlayer("duration", duration)
  }


  return (
    <div className={styles.header_wrapper}>
      <h2 className={styles.header} >
        <Link to={`/projects/${projectId}`}>
          <Icon name={'chevron-square-left'} />
        </Link>
        {name}
      </h2>
    </div>
  )
};

/**
 * handle the save node event we create a mutation that doesn't
 * return any data this prevent things in the UI jumping around
 * when dragged.
 */
const SAVE_NODE_MUTATION = gql`
    mutation updateNode($input: UpdateNodeInput) {
        updateNode(input: $input) {
            id
        }
    }
`
const useSaveNodeEditorListener = (nodeId) => {
  const [saveNode] = useMutation(SAVE_NODE_MUTATION)

  useEffect(() => {
    const handleSaveEvent = (payload) => {
      // Events emitted here for the UI indication that the
      // page is saving
      Emitter.emit(NODE_PAGE_SAVE_START);
      
      saveNode({
        variables: {
          input: getNodeForSaving(nodeId, payload.detail),
        },
      })
        .then(() => {
          Emitter.emit(NODE_PAGE_SAVE_COMPLETE);
        })
        .catch((err) => {
          console.error(err);
          errorAlert({
            title: 'Unable to save node',
            text:
              'An error occurred when trying to save your node. Please try again. If the problem persists please contact support.',
          });
        });
    };

    window.addEventListener(SAVE_NODE_PAGE, (payload) => handleSaveEvent(payload));
    return window.removeEventListener(SAVE_NODE_PAGE, handleSaveEvent);
  }, [nodeId]);
};
