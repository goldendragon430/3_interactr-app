import React from 'react';
import styles from 'modules/media/components/MediaLibrary.module.scss';
import Icon from 'components/Icon';
import cx from 'classnames';
//import {elements, TEXT_ELEMENT, DYNAMIC_TEXT_ELEMENT} from 'shared/element';
import map from 'lodash/map';
import ElementToolbar from '../../interaction/components/ElementToolbar';
import { addModalElement } from 'modules/modal';

import {
  someElements,
  TEXT_ELEMENT,
  BUTTON_ELEMENT,
  IMAGE_ELEMENT,
  FORM_ELEMENT,
  CUSTOM_HTML_ELEMENT
} from 'modules/element/elements';
const modalSubElements = someElements(TEXT_ELEMENT, BUTTON_ELEMENT, IMAGE_ELEMENT, FORM_ELEMENT, CUSTOM_HTML_ELEMENT);
const interactionLayerSubElements = someElements(TEXT_ELEMENT, BUTTON_ELEMENT, IMAGE_ELEMENT);

export default function ModalElementsToolbar({ modal, ...props }) {
  const dispatch = useDispatch();

  const handleAddElement = (element_type, pos) => {
    dispatch(addModalElement(modal.id, element_type, pos));
  };

  let els = modal && modal.interaction_layer ? interactionLayerSubElements : modalSubElements;
  els = map(els, (el, key) => ({ ...el, type: key }));

  return (
    <div>
      <div className={styles.alert}>
        <p>
          <Icon name="info-circle" /> <small>Drag element onto the video.</small>
        </p>
      </div>

      <div className={cx(styles.grid, styles.noMarginBottom)}>
        <div className={styles.listWrapper}>
          <ElementToolbar {...props} useWizard={false} elementsMeta={els} onAdd={handleAddElement} />
        </div>
      </div>
    </div>
  );
}
