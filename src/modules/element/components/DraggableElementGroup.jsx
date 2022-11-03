import React, {cloneElement} from "react";
import {Draggable, Droppable} from "react-beautiful-dnd";

/**
 * The elements inside element groups that can be drag and reordered inside another groups
 * Or the elements can be reordered inside the same group
 * @param group
 * @param index
 * @param children
 * @param header
 * @returns {*}
 * @constructor
 */
const DraggableElementGroup = ({ group, index, children, header }) => {
    const getItemStyle = (isDragging, draggableStyle) => ({
        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: "#fff"
    });

    return (
        <Draggable key={group.id} draggableId={group.id+"Draggable"} index={index} isDragDisabled={group.id === 'noGroup'}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}
                >
                    {cloneElement(header, {dragHandler: provided.dragHandleProps})}
                    <Droppable droppableId={group.id} type="droppableElementItem">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                // style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {children}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    {provided.placeholder}
                </div>
            )}
        </Draggable>
    );
};


export default DraggableElementGroup;