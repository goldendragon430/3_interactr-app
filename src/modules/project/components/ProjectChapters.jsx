import React, {useEffect} from 'react';
import { AnimatePresence, motion } from "framer-motion";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import styles from './ProjectsPage.module.scss';
import FilterInput from 'components/FilterInput';
import _orderBy from "lodash/orderBy";
import cx from "classnames";
import _find from 'lodash/find';
import _map from 'lodash/map';
import _findIndex from 'lodash/findIndex';
import {browser} from "../../../utils/domUtils";
import {createPortal} from "react-dom";
import {useSetState} from "../../../utils/hooks";
import NodeChapterCard from "../../node/components/NodeChapterCard";
import {useSortingNodes} from "../../../graphql/Node/hooks";
import Icon from "../../../components/Icon";

const preAnimationState = {opacity: 0, x: '50px'};
const animationState = {opacity: 1, x: 0};
const transition = { type: "spring", duration: 0.3, bounce: 0.2, damping: 15};

const pushUseAsChapterToNodes = (project, nodes) => {
    const nodesCollection = _map(nodes, node => {
        const copyNode = {...node};
        const chapterItems = project && project.chapter_items;
        const nodeChapterItem = _find(project.chapter_items, {node_id: copyNode.id});

        copyNode.use_as_chapter = chapterItems && nodeChapterItem !== undefined;

        return copyNode;
    });

    return _orderBy(nodesCollection, ['sort_order'], ['ASC']);
};

/**
 * Render project nodes with Use As Chapter toggle
 * @param project
 * @param updateProject
 * @returns {null|*}
 * @constructor
 */
const ProjectChapters = ({project, updateProject}) => {
    const [state, setState] = useSetState({
        nodes: pushUseAsChapterToNodes(project, project.nodes),
        filteredNodes: project.nodes,
        filtering: false,
        orderBy: '',
        sortOrder: '',
        showEditModal: false
    });
    const [updateNodesSorting, {loading, error}] = useSortingNodes();

    useEffect(() => {
        if (project.nodes) {
            setState({nodes: pushUseAsChapterToNodes(project, project.nodes)});
        }
    }, [project]);

    const {nodes} = state;


    const updateUseAsChapter = (val, nodeId) => {
        const node = _find(nodes, {id: nodeId});
        const copyChapterItems = Array.isArray(project.chapter_items) ? project.chapter_items : [];
        const chapter_items = [...copyChapterItems];

        if (!val) {
            const chapterItemIndex = _findIndex(chapter_items,{node_id: nodeId});
            chapter_items.splice(chapterItemIndex, 1);

            return updateProject({
                id: project.id,
                chapter_items
            });
        }

        updateProject({
            id: project.id,
            chapter_items: [
                ...chapter_items,
                {
                    node_id: nodeId,
                    title: node.name,
                    thumbnail: node.media.thumbnail_url,
                    video_id: node.media.id
                }
            ]
        });
    };

    const updateChapterTitle = (val, nodeId) => {
        const node = nodes.find(node => nodeId === node.id);
        const chapter_items = [...project.chapter_items];

        const updatedChapterItems = _map(chapter_items, chapterItem => {
            if (chapterItem.node_id === node.id){
                return {
                    ...chapterItem,
                    title: val
                }
            }

            return chapterItem;
        });

        updateProject({
            id: project.id,
            chapter_items: updatedChapterItems
        })
    };

    const getPortal = () => {
        // use this in case of browser support!
        const portal = document.createElement("div");
        document.getElementById("appRoot").appendChild(portal);

        return portal;
    };

    const sortBySortOrderNumber = (nodes) => {
        return _map(nodes, (node, index) => {
            return {
                ...node,
                sort_order: ++index
            };
        });
    };

    const reorder = result => {
        const {filteredNodes, nodes, filtering} = state;
        let copiedNodes = filtering ? [...filteredNodes] : [...nodes];

        let startIndex = result.source.index;
        let endIndex = result.destination.index;

        const [removed] = copiedNodes.splice(startIndex, 1);
        copiedNodes.splice(endIndex, 0, removed);

        const sortedNodesData = sortBySortOrderNumber(copiedNodes);

        setState({
            nodes: sortedNodesData
        });
        // send ordering to BE only if node.use_as_chapter === true
        if (removed.use_as_chapter) {
            updateNodesSorting({nodes: sortedNodesData});
        }
    };

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        reorder(result);
    };

    const nodesList = () => {
        const { filteredNodes, nodes: stateNodes, filtering, orderBy, sortOrder } = state;
        /* as videos data can arrive after first mounting we need to update
            list but only when not filtering which would show everything if filter not matched */
        let nodes = filtering ? filteredNodes : stateNodes;

        let disableDragDrop = filtering;

        // if selected sort by option and it's not dragging, disable drag & drop and order by selected option
        if (orderBy && orderBy !== 'dragging' && sortOrder) {
            disableDragDrop = true;
            nodes = _orderBy(nodes, [orderBy], sortOrder);
        }

        return (
            <DragDropContext onDragEnd={onDragEnd} >
                <Droppable droppableId="nodes-droppable" isDropDisabled={disableDragDrop}>
                    {(provided, snapshot) => (
                        <DraggableContent
                            project={project}
                            nodes={nodes}
                            provided={provided}
                            snapshot={snapshot}
                            filtering={disableDragDrop}
                            portal={getPortal}
                            updateChapterTitle={updateChapterTitle}
                            updateUseAsChapter={updateUseAsChapter}
                        />
                    )}
                </Droppable>
            </DragDropContext>
        )
    };

    const handleFilter = ({ filteredData, filtering }) => {
        setState({ filteredNodes: filteredData, filtering });
    };

    const filters = () => {
        const { nodes } = state;

        return (
            <div className={cx(styles.filterRow, 'grid')}>
                <div className={'col6'}>
                    <h3><Icon name={'info-circle'} /> Drag and drop nodes to change the display order</h3>
                </div>
                <div className={'col6'}>
                    <div className={cx(styles.filterRow_sortBy)} style={{marginBottom: '25px'}}>
                        <FilterInput
                          data={nodes}
                          filterKey="name"
                          onFilter={handleFilter}
                          placeholder="Filter Nodes..."
                        />
                    </div>
                </div>
             </div>
        );
    };

    if (!project) {
        return null;
    }

    return (
        <div className="grid">
            <div className="col12">{filters()}</div>
            <div className="col12">
                <div style={{height: '586px', overflowY: 'auto'}}>
                    {nodesList()}
                </div>
            </div>
        </div>
    );
};

function DraggableContent({project, filtering, nodes, provided, portal, updateChapterTitle, updateUseAsChapter}) {
    const getItemStyles = (isDragging, draggableStyle) => ({
        // change background colour if dragging
        background: isDragging ? '#f1f1f1' : '',
        cursor: 'move',
        outline: 'none',
        // styles we need to apply on draggables
        ...draggableStyle,
    });

    return (
        <div
            style={{marginLeft: '30px'}}
            ref={provided.innerRef}
        >
            {_map(nodes, (node, index) => {
                const nodeChapterItem = _find(project.chapter_items, {node_id: node.id});

                return (
                    <Draggable
                        key={'draggable_node_'+node.id}
                        draggableId={node.id.toString()}
                        index={index}
                        isDragDisabled={filtering}
                    >
                        {(provided, snapshot) => {
                            const child = (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyles(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                >
                                    <AnimatePresence>
                                        <motion.section
                                            exit={preAnimationState}
                                            initial={preAnimationState}
                                            animate={animationState}
                                            transition={transition}
                                        >
                                            <NodeChapterCard
                                                key={'node_card_'+node.id}
                                                nodeItem={node}
                                                nodeChapterItem={nodeChapterItem}
                                                updateChapterTitle={updateChapterTitle}
                                                updateUseAsChapter={updateUseAsChapter}
                                            />

                                        </motion.section>
                                    </AnimatePresence>
                                </div>
                            );

                            if (!snapshot.isDragging || browser.name === 'chrome') {
                                return child;
                            }

                            // if dragging - put the item in a portal
                            return createPortal(child, portal);
                        }}
                    </Draggable>
                )
            })}
            {provided.placeholder}
        </div>
    );
}


export default ProjectChapters;