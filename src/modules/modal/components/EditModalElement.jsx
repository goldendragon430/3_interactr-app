import React, {useState} from 'react'
import {useModalElementRoute, useModalRoute} from "modules/modal/routeHooks";
import styles from './EditModalElement.module.scss';
import cx from 'classnames';
import Icon from "../../../components/Icon";
import {useModal, useModalCommands, useModalElement, useModalElementCommands} from "../../../graphql/Modal/hooks";
import ErrorMessage from "../../../components/ErrorMessage";
import {ElementSwitch} from "../../element/components/Properties/ElementProperties";
import {MODAL_ELEMENT_FRAGMENT} from "../../../graphql/Modal/fragments";
import {useQuery} from "@apollo/client";
import gql from "graphql-tag";
import {useParams} from 'react-router-dom'
import {getModalElementForSaving, getModalForSaving} from "../../../graphql/Modal/utils";
import {errorAlert} from "../../../utils/alert";
import {SAVE_MODAL_PAGE} from "../../../utils/EventEmitter";
import ContentLoader from "react-content-loader";

const EditModalElement = () => {
  const [modalElementId, _, back] = useModalElementRoute();

  return(
    <div className={cx(styles.wrapper, {[styles.in]: (modalElementId)})}>
      <h3 style={{marginBottom: '0', marginTop: '0'}}>Edit Element</h3>
      <CloseIcon onClick={back} modalElementId={modalElementId} />
      { !!modalElementId && <ElementEditBody id={modalElementId} />}
    </div>
  )
};
export default EditModalElement;

const QUERY = gql`
    query modalElement($id: ID!) {
        modalElement(id: $id){
            ...ModalElementFragment
        }
    }
    ${MODAL_ELEMENT_FRAGMENT}
`;
const ElementEditBody = ({id}) => {
  const {data, loading, error} = useQuery(QUERY, {
    variables: {
      id
    }
  });

  if(loading) return <ElementPropertiesLoader />;

  if(error) return <ErrorMessage error={error} />;

  const {modalElement} = data;

  return <section>
    <ElementSwitch
      element={modalElement.element}
      element_type={modalElement.element_type}
    />
  </section>;
};


const CloseIcon = ({onClick, modalElementId}) => {
  const [saving, setSaving] = useState(false);


  const {saveModalElement} = useModalElementCommands();

  const handleClick = async () => {
    setSaving(true)
    try {
      await saveModalElement({
        variables: {
          input: getModalElementForSaving(modalElementId)
        }
      });
    }catch(err) { 
      console.error(err)
      errorAlert({text: 'Unable to save element'})
    }
    setSaving(false)
    // var event = new CustomEvent(SAVE_MODAL_PAGE);
    // window.dispatchEvent(event);
    onClick();
  };

  return(
    <div onClick={handleClick} className={styles.close}>
      {(saving) ? <>Saving <Icon loading /></> : <>Close <Icon name={'arrow-to-right'} /> </>}
    </div>
  );
};

export const ElementPropertiesLoader = () => {
  return(
    <ContentLoader
      speed={1}
      width={630}
      height={817}
      viewBox={`0 0 ${630} ${817}`}
    >
      {/* Only SVG shapes */}
      <rect x="0" y="0" rx="3" ry="3" width={132} height={817} />
      <rect x="135" y="0" rx="3" ry="3" width={2} height={817} />
      <rect x="140" y="0" rx="3" ry="3" width={430} height={817} />
    </ContentLoader>
  )
};

