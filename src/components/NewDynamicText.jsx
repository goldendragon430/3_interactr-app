import React, {useState} from 'react';
import Icon from "./Icon";
import Modal from 'components/Modal';
import {useElement, useGetActiveElementMeta} from "../graphql/Element/hooks";
import ErrorMessage from "./ErrorMessage";
import Emitter, {INSERT_DYNAMIC_TEXT, TOGGLE_INSERT_DYNAMIC_TEXT_MODAL} from "../utils/EventEmitter";
import {EventListener} from "./EventListener";
import styles from "../modules/element/components/Properties/DynamicTextElementProperties.module.scss";
import {Option, TextInput} from "./PropertyEditor";
import Button from "./Buttons/Button";

const NewDynamicText = ({setShow}) => {
  const {element_id, element_type, loading, error} = useGetActiveElementMeta();

  if(loading) return <Icon loading />;

  if(error) return  null;

  return(
      <NewDynamicTextModal
        setShow={setShow}
        element_id={element_id}
        element_type={element_type}
      />
  )
};
export default NewDynamicText;

const NewDynamicTextModal = ({setShow, element_id, element_type }) => {
  // const [element, updateElement, {loading, error}] = useElement(element_type, element_id);
  //
  // if(loading) return <Icon loading />;
  //
  // if(error) return <ErrorMessage error={error} />;
  // if(! show) return null;
  const [text, setText] = useState("");
  const [defaultValue, setDefaultValue] = useState("");

  const handleSave = async () => {
    Emitter.emit(INSERT_DYNAMIC_TEXT, {name: text});
    setShow(false)
  };

  return(
    <Modal
      width={350}
      height={350}
      show={true}
      onClose={()=>setShow(false)}
      heading={
        <>
          <Icon name="code" />
          Insert New Dynamic Text
        </>
      }
      submitButton={
        <Button primary icon={'code'} onClick={handleSave}>Insert Dynamic Text</Button>
      }
    >
      <div>
        <Option
          label='Enter a name for the dynamic text'
          value={text}
          Component={TextInput}
          onChange={val=>setText(val)}
        />
        <p>
          To find out more about how to use dynamic text read our support article
          <a href="https://support.videosuite.io/article/25-using-dynamic-text-to-personalise-your-interactive-videos" target={'_blank'} style={{color: 'blue'}}> here</a>
        </p>
        {/*<Option*/}
        {/*  label="Give the text a default value"*/}
        {/*  value={defaultValue}*/}
        {/*  Component={TextInput}*/}
        {/*  onChange={val=>setDefaultValue(val)}*/}
        {/*/>*/}
      </div>
    </Modal>
  )
};