import React, { useState, useEffect } from 'react';
import { createPortal } from "react-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import ProjectGroupItem from "./ProjectGroupItem";
import { browser } from "utils/domUtils";
import { useSaveProjectGroupsSorting } from "@/graphql/ProjectGroup/hooks";

const getRenderItem = (folders) => (provided, snapshot, rubric) => { 

    const getItemStyles = (isDragging, draggableStyle) => ({
        // change background colour if dragging
        background: isDragging ? '#ffffff' : '',
        cursor: 'drag',
        outline: 'none',
        // styles we need to apply on draggables
        ...draggableStyle,
    }); 

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={getItemStyles(
                snapshot.isDragging,
                provided.draggableProps.style
            )}
        >
            <ProjectGroupItem            
                dragHandleProps={provided.dragHandleProps}
                folder={folders[rubric.source.index]}
            />
        </div>
    )
};

export const FoldersList = ({ folders }) => {
    // const [dragging, setDragging] = useState(false);
    // const [folders, setFolders] = useState([...foldersData]);
    const [saveProjectGroupsSorting, ,] = useSaveProjectGroupsSorting();

    // useEffect(() => {
    //     if (!dragging) {
    //         setFolders([...foldersData]);
    //     }
    // }, [foldersData]);

    const sortBySortOrderNumber = () => {
        return folders.reduce((result, folder, index) => {
            result.push({
                id: parseInt(folder.id),
                sort_order_number: ++index
            });
            return result;
        }, []);
    };
    
    const reorder = result => {
        const startIndex = result.source.index,
              endIndex = result.destination.index;

        const [removed] = folders.splice(startIndex, 1);
        folders.splice(endIndex, 0, removed);
        
        // const sortedFoldersData = sortBySortOrderNumber();

        // saveProjectGroupsSorting({
        //     lists: sortedFoldersData
        // });
        // setFolders(sortedFoldersData);

        // Add little delay to for updating 'projectGroups' smoothly without breaking drag&drop list
        // setTimeout(() => {
        //     setDragging(false);
        // }, 2000);
    };

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination || result.destination.index === result.source.index) {
            return;
        }  
    
        reorder(result);
    };
    
    const renderItem = getRenderItem(folders);
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable"
                renderClone={renderItem}
            >
                {(provided, snapshot) => (
                    <DraggableContent
                        folders={folders}
                        provided={provided}
                        snapshot={snapshot}
                        renderItem={renderItem}
                    />
                )}
            </Droppable>
        </DragDropContext>
    );
};

function DraggableContent({folders, provided, snapshot, renderItem}) {   
    return (
        <div ref={provided.innerRef} {...provided.droppableProps}>
            {folders.map((folder, index) => {
                return (
                    <Draggable key={folder.id.toString()} draggableId={folder.id.toString()} index={index}>
                        {renderItem}
                    </Draggable>
                )
            })}
            {provided.placeholder}
        </div>
    );
}