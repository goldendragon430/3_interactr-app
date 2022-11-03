import React, {useRef, useState, useEffect} from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {useOnClickOutside} from 'utils/hooks';
import {nodeAndParents} from 'utils/domUtils';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js';
import styles from './EditableText.module.scss';
// import 'react-quill/dist/quill.bubble.css';
import PropTypes from 'prop-types';
import { useKeyPress } from 'utils/hooks';
import Emitter, {
    INSERT_DYNAMIC_TEXT,
    TOGGLE_INSERT_DYNAMIC_TEXT_MODAL,
    // TOGGLE_MANAGE_DYNAMIC_TEXT_MODAL,
    // VIDEO_SCRUB,
} from '../utils/EventEmitter';
import { SketchPicker } from 'react-color';
import Button from './Buttons/Button';


class DynamicText extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };


  insertDynamicText = () => {
    const { editorState, onChange } = this.props;
    Emitter.emit(TOGGLE_INSERT_DYNAMIC_TEXT_MODAL);
    
    Emitter.on(INSERT_DYNAMIC_TEXT, ({name}) => {
      const contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        ` {${name}} `,
        editorState.getCurrentInlineStyle(),
      );
      onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    });
  }

  render() {
    return (
      <Button icon="code" onClick={this.insertDynamicText}></Button>
    );
  }
}

class ColorPic extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  onChange = (color) => {
    const { onChange } = this.props;
    onChange('color', color.hex);
  }

  renderModal = () => {
    const { color } = this.props.currentState;
    return (
      <div
        style={{position: 'absolute', left: '-62px', top: '42px', zIndex: 9999}}
        onClick={this.stopPropagation}
      >
        <SketchPicker color={color} onChangeComplete={this.onChange} />
      </div>
    );
  };

  render() {
    const { expanded, onExpandEvent } = this.props;
    return (
      <div
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-color-picker"
        style={{position:'relative'}}
      >
        <div
          onClick={onExpandEvent}
          className={'rdw-option-wrapper'}
        >
          <img
            src={'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTQuNDA2LjU4NWExLjk5OCAxLjk5OCAwIDAgMC0yLjgyNSAwbC0uNTQuNTRhLjc0MS43NDEgMCAxIDAtMS4wNDggMS4wNDhsLjE3NS4xNzUtNS44MjYgNS44MjUtMi4wMjIgMi4wMjNhLjkxLjkxIDAgMCAwLS4yNjYuNjAybC0uMDA1LjEwOHYuMDAybC0uMDgxIDEuODI5YS4zMDIuMzAyIDAgMCAwIC4zMDIuMzE2aC4wMTNsLjk3LS4wNDQuNTkyLS4wMjYuMjY4LS4wMTJjLjI5Ny0uMDEzLjU3OS0uMTM3Ljc5LS4zNDdsNy43Ny03Ljc3LjE0Ni4xNDRhLjc0Ljc0IDAgMCAwIDEuMDQ4IDBjLjI5LS4yOS4yOS0uNzU5IDAtMS4wNDhsLjU0LS41NGMuNzgtLjc4Ljc4LTIuMDQ0IDAtMi44MjV6TTguNzk1IDcuMzMzbC0yLjczLjUxNSA0LjQ1Mi00LjQ1MiAxLjEwOCAxLjEwNy0yLjgzIDIuODN6TTIuMDggMTMuNjczYy0xLjE0OCAwLTIuMDguMjk1LTIuMDguNjYgMCAuMzYzLjkzMi42NTggMi4wOC42NTggMS4xNSAwIDIuMDgtLjI5NCAyLjA4LS42NTkgMC0uMzY0LS45My0uNjU5LTIuMDgtLjY1OXoiLz48L2c+PC9zdmc+'}
            alt=""
          />
        </div>
        {expanded ? this.renderModal() : undefined}
      </div>
    );
  }
}


/**
 * Required prop types for the component
 * @type {{onStopEdit: *, onStartEdit: *, update: *, value: *}}
 * @private
 */
const _props = {
    // Func that's called when the value is updated
    update: PropTypes.func.isRequired,
    // Inner html that can be edited
    value: PropTypes.isRequired,
    // Func called when component enters the editing context
    onStartEdit: PropTypes.func.isRequired,
    // Func called when the component leaves the editing context
    onStopEdit: PropTypes.func.isRequired,
};

/*
* Custom toolbar component for quill editor
*/
const toolbarOptions = {
  options: ['inline', 'colorPicker', 'fontSize', 'textAlign', 'emoji', 'history'],
  inline: {
    inDropdown: false,
    options: ['bold', 'italic', 'underline', 'strikethrough'],
  },
  fontSize: {
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
  },
  colorPicker: {
    /*icon: color,*/
    component: ColorPic
  },
  textAlign: {
    inDropdown: false,
    options: ['left', 'center', 'right'],
  },
  emoji: {
    emojis: [
      '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
      '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
      '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
      '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
      '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
      '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
      '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
      '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
      '✅', '❎', '💯',
    ],
  }
}

/**
 * Has text that can be edited as HTML by double clicking on the text
 * @param onStartEdit
 * @param onStopEdit
 * @param update
 * @param value
 * @returns {*}
 * @constructor
 */

const EditableText = ({editing, onStartEdit, onStopEdit, update, value, selected, className, style, vResizeDisabled=false, preview=false, onDelete}) => {
    const editableTextRef = useRef(null);
    const [editorState, setEditorState] = useState();
    const [previousValue, setPreviousValue] = useState(value || 'click to add text ');

    const deleteKeyPressed = useKeyPress('Delete');
    const backspaceKeyPressed = useKeyPress('Backspace');
    
    // IF delete key pressed for the active item we can call the delete func if present
    if (vResizeDisabled && !preview && !editing && ((deleteKeyPressed || backspaceKeyPressed) && selected && onDelete)) {
      onDelete();
    }

    useEffect(() => {
      if (value) {
        const contentBlock = htmlToDraft(value);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState)
      }
    }, [value]);

    const edit = () => {
        onStartEdit();
    };

    const handleStop = () => {
      const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      update('html', htmlContent);
      onStopEdit();
    }

    function handleChange(editorState) {
      setEditorState(editorState);
      const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      setPreviousValue(htmlContent);
    }
    
    return (
      <div ref={editableTextRef} style={!vResizeDisabled ? {cursor: 'pointer', width: '100%', height: '100%'}: {}}>
        {selected ? (
          <div className={`${className} editable-text_editing`}>
            {/* <StopEditingOnClickOutside stopEdit={handleStop} targetRef={editableTextRef} editing={editing} /> */}
            <Editor
              toolbarCustomButtons={[<DynamicText />]}
              toolbarClassName="editor-toolbar"
              wrapperClassName={vResizeDisabled? "editor-wrapper-form" : "editor-wrapper"}
              editorClassName="editor-main"
              editorState={editorState}
              onEditorStateChange={handleChange}
              toolbarOnFocus
              // toolbarHidden={!editing}
              onFocus={() => {onStartEdit()}}
              onBlur={(event, editorState) => { handleStop();}}
              toolbar={toolbarOptions}
            />
          </div>
           ) : (
             <div
               style={ !vResizeDisabled?{
                 width: '100%',
                 padding: 10,
                 margin: 0,
                 position: 'absolute',
                 top: '50%',
                 transform: 'translateY(-50%)',
               }: {
                padding: 10.5,
               }}
               dangerouslySetInnerHTML={{__html: previousValue}}/>
         )}
      </div>     
  );
};

// Created as component for trigerring the hook only when editing vs all the time when 
// Editabletext is rendered

const StopEditingOnClickOutside = (props) => {
    if (props.editing) {
        useOnClickOutside(props.targetRef, (e) => {
            // ignore the editor popup bits including color pickers etc... the .ql-tooltip class seems to be the top
            // class in common between them all and we don't want to trigger clicking outside unless we actually
            // click outside of all the editor related stuff
            if (!!nodeAndParents(e.target).find(node => node.classList.contains('ql-toolbar'))) {
                return;
            }

            // Ignore DynamicText modal input
            if (!!nodeAndParents(e.target).find(node => node.classList.contains('dynamic-text'))) {
              return;
            }
            // console.log('clicked outside')
            props.stopEdit();
        });
    }
    return null;
};

EditableText.propsTypes = _props;
export default EditableText;
