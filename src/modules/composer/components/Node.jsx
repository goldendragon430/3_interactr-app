import React, { useEffect, useRef, useState } from 'react';
import styles from './Node.module.scss';
import cx from 'classnames';
import { NODE, dragDataSetter } from 'modules/composer/dragging';
// import { deleteNode, copyNode, updateNode } from 'modules/node/node';
import { useNavigate, useParams } from 'react-router-dom';
import NodeControl from './NodeControl';
import getAsset from 'utils/getAsset';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import {nodePath} from "../../node/routes";
import {useCopyNode, useNodeCommands} from "../../../graphql/Node/hooks";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import {errorAlert} from "../../../utils/alert";
import {copyConfirmed, deleteConfirmed} from "../../../graphql/utils";
import {getNodeFromCache} from "../utils";
import {useReactiveVar} from "@apollo/client";
import {composerVar, useComposerCommands} from "../../../graphql/LocalState/composer";
import { getProjectFromCache, assignProjectStartNode } from "../../project/utils";
import { removeFromCache } from "../../node/utils";

const setNodeData = dragDataSetter(NODE);

export const WIDTH = 142;
export const HEIGHT = 85;
export const TRUE_HEIGHT = HEIGHT + 20 + 20; // this gives us room for the name (20)  + (shadow (20) in firefox)
const NODE_HEIGHT = TRUE_HEIGHT + 35;

function Node({ node }) {
  const {activeNode} = useReactiveVar(composerVar);

  const {updateComposer} = useComposerCommands();

  const {updateStartNode} = useProjectCommands();

  const navigate = useNavigate();

  const { projectId } = useParams();

  const project = getProjectFromCache(projectId);

  const nodeRef = useRef(null);

  const [deleting, setDeleting] = useState(false)

  const [copying, setCopying] = useState(false)

  const {copyNode, deleteNode} = useNodeCommands()

  const { posX: x, posY: y, name, id, background_color, media:mediaItem } = node;

  useEffect(() => {
    setNodeData(nodeRef.current, { id });
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [id]);

  function editNodeName () {
    updateComposer({showEditNodeNameModal: true})
  };

  function handleMouseDown() {
    updateComposer({activeNode: id});
  }

  function handleDoubleClick() {
    goToNode();
  }

  function goToNode() {
    navigate(nodePath({ nodeId: id, projectId }));
  }

  const handleDelete = async () =>  {
    if (activeNode) {
      await deleteConfirmed("Node", async () => {
        setDeleting(true)
        try {

          await deleteNode({
            variables: {id}
          })
          
          // If the start_node_id has changed after deleting the node we need
          // to update the project start node and this in the cache. This happens when the node deleted is
          // the start node of the project
          if(project.start_node_id == id) {
            const newStartNodeId = assignProjectStartNode(project, id);
            await updateStartNode(projectId, newStartNodeId)
          }

          // Finally remove the node from the cache
          removeFromCache(id)

          setDeleting(false)
        }catch(e){
          setDeleting(false)
          console.error(e);
          errorAlert({text: "Unable to delete node"})
        }
      })
    }
  }

  const handleCopy = async () => {

    if (activeNode) {
      await copyConfirmed("Node", async () => {
        setCopying(true)
        try {
          await copyNode({
            variables: {
              input: {
                id: node.id,
                project_id: parseInt(projectId),
                posX: node.posX + 20,
                posY: node.posY + 20
              }
            }
          });
          setCopying(false)
        } catch (e) {
          setCopying(false);
          console.error(e);
          errorAlert({text: "Unable to copy node"});
        }
      });
    }
  };

  function handleKeyDown(e) {
    // Can't do this here because when you press backspace
    // when typing the node name it tries to delete the node
    // will come back to this one day and see if we can rework
    // so it works properly

    // if (['Delete', 'Backspace'].includes(e.key)) {
    //   handleDelete();
    // }
  }

  const classes = cx(styles.Node, {
    [styles.selected]: activeNode === node.id,
  });

  const nodeThumb = (mediaItem && mediaItem.thumbnail_url) ? mediaItem.thumbnail_url : getAsset('/img/no-thumb.jpg')

  let nodeIcon = '';
  if (!mediaItem) {
    nodeIcon = 'pencil-paintbrush';
  } else if (mediaItem.is_image) {
    nodeIcon = 'image';
  } else {
    nodeIcon = 'video';
  }
  const translateToPos = `translate(${x} ${y})`;

  return (
    <foreignObject ref={nodeRef} key="node" width={WIDTH + 10} height={NODE_HEIGHT} transform={translateToPos}>
      <div xmlns="http://www.w3.org/1999/xhtml" className={styles.wrapper}>
        <div className={styles.name} onDoubleClick={() => editNodeName(name, id)}>
          {name}
        </div>
        <Icon name={nodeIcon} className={styles.icon} />
        <div
          style={{ width: WIDTH, height: HEIGHT }}
          className={classes}
          onClick={handleMouseDown}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          {mediaItem && mediaItem.thumbnail_url && (
            <img draggable={false} className={styles.image} src={nodeThumb} />
          )}
          {!mediaItem && (
            <div draggable={false} style={{ height: '75px', width: '132px', background: background_color }} />
          )}
        </div>
        <NodeControl
          id={id}
          selected={activeNode === node.id}
          select={goToNode}
          onEdit={editNodeName}
          onCopy={handleCopy}
          copying={copying}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </div>
    </foreignObject>
  );
}
// Node.propTypes = {
//   node: PropTypes.shape({
//     id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     name: PropTypes.string,
//     posX: PropTypes.number,
//   }).isRequired,
//   editNodeName: PropTypes.func.isRequired,
//   // deleteNode: PropTypes.func.isRequired,
//   // copyNode: PropTypes.func.isRequired,
// };
export default Node;
