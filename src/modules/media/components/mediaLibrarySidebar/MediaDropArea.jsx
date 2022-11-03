import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

import styles from "./MediaDragDropArea.module.scss";

export const MediaDropArea = ({ children, handleDropFile }) => {
    const [dragging, setDragging] = useState(false);
    const dropRef = useRef(null);

    // If there are child elements inside our drag and drop div,
    // the drag events will be fired on those nested elements as well (causing flickering from setState to be called each time),
    // so we want to keep track of the how many elements deep our cursor is,
    // and only set call setDragging(false) once our cursor is all the way out.
    // We will add a counter to do this. We increment it on dragIn, decrement it on dragOut.
    let dragCounter = 0;

    useEffect(() => {
        let div = dropRef.current;

        div.addEventListener('dragenter', handleDragIn);
        div.addEventListener('dragleave', handleDragOut);
        div.addEventListener('dragover', handleDrag);
        div.addEventListener('drop', handleDrop);

        return () => {
            let div = dropRef.current;
            if(div) {
                div.removeEventListener('dragenter', handleDragIn);
                div.removeEventListener('dragleave', handleDragOut);
                div.removeEventListener('dragover', handleDrag);
                div.removeEventListener('drop', handleDrop);
            }
        };
    }, []);

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter++;

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setDragging(true);
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter--;
        if (dragCounter > 0) return;

        setDragging(false);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleDropFile(e.dataTransfer.files);
            e.dataTransfer.clearData();
            dragCounter = 0;
        }
    };

    return (
        <div style={{position: 'relative', display: 'inline-block', height: '100%', width: '100%'}} ref={dropRef}>
            {dragging && (
                <div className={styles.draggingContainer}>
                    <div className={styles.draggingContent}>
                        <div>Drop file to add new media</div>
                    </div>
                </div>
            )}

            {children}
        </div>
    )
};

MediaDropArea.propTypes = {
  children: PropTypes.element.isRequired,
  handleDropFile: PropTypes.func.isRequired
}