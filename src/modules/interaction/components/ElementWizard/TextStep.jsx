import React from 'react';
import PropTypes from 'prop-types';
import TinyMCE from 'react-tinymce';
import NativeListener from 'react-native-listener';
// Stuff
import { BUTTON_ELEMENT, TEXT_ELEMENT } from 'modules/element/elements';
import styles from './ElementWizard.module.scss';
// Components
import { Option, TextInput } from 'components/PropertyEditor';
import ButtonElement from 'modules/element/components/Element/ButtonElement';
import TextElement from 'modules/element/components/Element/TextElement';
import ErrorMessage from 'components/ErrorMessage';

const textStep = {
  /** Called after updating any element data  */
  updateElement: PropTypes.func.isRequired,
  updateInteraction: PropTypes.func.isRequired,
  /** Element data that populates the actions  */
  element: PropTypes.object.isRequired,
  interaction: PropTypes.object
};

const supportingElements = [BUTTON_ELEMENT, TEXT_ELEMENT];

export default function TextStep({ interaction, element, updateElement }) {
  const handleKeyDown = e => {
    e.stopPropagation();
  };

  const handleUpdate = ({ html, width, height, posX, posY }) => {
    // positions shouldn't be updated
    updateElement({ width, height });
    html && updateElement({ html });
    // updateElement({ html: editor.getContent() });
  };

  const noTextSupport = !supportingElements.includes(interaction.element_type);

  return noTextSupport ? (
    <ErrorMessage msg="This Element doesn't support text" />
  ) : (
    <div className={styles.step_wrapper}>
      <h3>Resize or double click to edit text</h3>
      {/* <div style={{ width: '60%' }}>
        <NativeListener onKeyDown={handleKeyDown}>
          <TinyMCE
            content={element.html || 'click to add text '}
            width={100}
            height={50}
            // className={styles.editText}
            onChange={handleChange}
            config={{
              inline: false,
              menubar: false,
              statusbar: false,
              fontsize_formats: '8pt 10pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 20pt 22pt 24pt 26pt',
              theme_advanced_disable: 'formatselect',
              plugins: ['textcolor colorpicker'],
              toolbar:
                ' bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright |'
            }}
          />
        </NativeListener>
      </div> */}
      <div className={styles.element_preview}>
        <ElementPreview
          positionable={false}
          type={interaction.element_type}
          {...element}
          posX={20} 
          posY={20}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}

TextStep.propTypes = textStep;

function ElementPreview({ type, ...props }) {
  switch (type) {
    case BUTTON_ELEMENT:
      return <ButtonElement {...props} />;
    case TEXT_ELEMENT:
      return <TextElement {...props} />;

    default:
      return <p>Preview unavailable</p>;
  }
}
