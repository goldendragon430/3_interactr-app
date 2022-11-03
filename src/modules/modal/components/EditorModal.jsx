import React from 'react';
import PropTypes from 'prop-types';

import { selectModalElement } from 'modules/element';

import Icon from 'components/Icon';
import styles from 'modules/node/components/NodePage.module.scss';
import ModalElementEditor from 'modules/element/components/ModalElementEditor';

const EditorModal = ({ modal, grid }) => {
  const dispatch = useDispatch();

  const handleSelectElement = (elementType, elementId) => {
    dispatch(selectModalElement(elementType, elementId));
  };

  const width = 720;
  const height = 405;

  // Custom Modal styles
  let padding = (100 - modal.size) / 2 + '%';
  let modalStyles = {
    top: padding,
    bottom: padding,
    left: padding,
    right: padding,
    borderRadius: modal.border_radius + 'px',
    backgroundColor: modal.backgroundColour
  };

  const closeIconStyle = {
    color: modal.close_icon_color
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%', width: '100%' }}>
      <div style={{ height, width, position: 'relative' }}>
        <div className={styles.modalOverlay}>
          {/* <img src={url} style={{ position: 'absolute', height: '100%', width: '100%' }} /> */}
          {/* Need to make the background colour editable here */}
          <div className={styles.modalInner} style={modalStyles}>
            {modal.show_close_icon ? (
              <div className={styles.modalClose} style={closeIconStyle}>
                <Icon name="times" />
              </div>
            ) : null}

            <ModalElementEditor
              grid={grid}
              className={styles.stacked}
              elementContainers={modal.elements}
              onSelectElement={handleSelectElement}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

EditorModal.propTypes = {};

export default EditorModal;
