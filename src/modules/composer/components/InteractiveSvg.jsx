import React, { useState } from 'react';
import Measure from 'react-measure';
import { DraggableCore } from 'react-draggable';
import {COMPOSER_DOM_ID, composerVar, useComposerCommands} from "../../../graphql/LocalState/composer";
import {keepInBounds} from "../../../utils/numberUtils";
import InteractiveSvgDraggableCore from "./InteractiveSvgDraggableCore";
import {useReactiveVar} from "@apollo/client";

const InteractiveSvg = ({children}) => {
  const {updateZoom} = useComposerCommands();

  const {zoom, pan} = useReactiveVar(composerVar);

  const [state, setState] = useState({
    width: '100%',
    height: '100%',
  });

  function _updateState(data) {
    setState({ ...state, ...data });
  }

  function handleMeasure({ width, height }) {
    _updateState({ width, height });
  }

  function _handleResize({ bounds, entry }) {
    return handleMeasure(bounds || entry);
  }

  function _getViewBox() {
    const { width, height } = state;
     //console.log('viewbox calculating ............', { zoom, pan, width, height });
    if (isNaN(width) || isNaN(height)) {
      return;
    }

    return `${pan.x} ${pan.y} ${width / zoom} ${height / zoom}`;
  }

  const handleWheel = (e) => {
    const delta = keepInBounds(-1, 1, e.deltaY / 1000);
    // const delta = Math.max(-1, Math.min(1, e.deltaY / 1000));
    updateZoom(delta);
  };

  return (
    <Measure bounds onResize={_handleResize}>
      {({ measureRef }) => (
        <div
          ref={measureRef}
          style={{
            // Take up available space
            width: '100%',
            height: '100%',

            // Stop from growing
            // maxHeight: height,
            // maxWidth: width,
            overflow: 'hidden',

            // Draggable looks at offset parent
            position: 'relative',
          }}
        >
          <InteractiveSvgDraggableCore >
            <svg id={COMPOSER_DOM_ID} height={state.height} width={state.width} onWheel={handleWheel} viewBox={_getViewBox()}>
              <g>{children}</g>
            </svg>
          </InteractiveSvgDraggableCore>
        </div>
      )}
    </Measure>
  );
}

export default InteractiveSvg;