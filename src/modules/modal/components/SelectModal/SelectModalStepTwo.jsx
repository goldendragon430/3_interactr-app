import React from 'react';
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_MODALS} from "../../../../graphql/Modal/queries";
import map from "lodash/map";
import cx from "classnames";
import styles from "./SelectModal.module.scss";
import ModalPreview from "../ModalPreview";
import moment from "moment";
import Button from "../../../../components/Buttons/Button";
import gql from "graphql-tag";
import {MODAL_FRAGMENT} from "../../../../graphql/Modal/fragments";
import {useModalCommands} from "../../../../graphql/Modal/hooks";
import Icon from "../../../../components/Icon";
import {errorAlert} from "../../../../utils/alert";
import {useEffect, useState} from "react";

const SelectModalStepTwo = ({setState, state, onChange, setShow}) => {
  const [activeTab, setActiveTab] = useState(null);

  const {context} = state;

  useEffect(()=>{
    setState({
      modalHeight:742,
      modalWidth: 1122
    })
  }, [])

  useEffect(()=>{
    if(context==='users') {
      setActiveTab("modals")
    }
    else if (context === 'templates') {
      setActiveTab('templates')
    }
  }, [context])

  return(
    <>
      <ActiveTab activeTab={activeTab} state={state} setState={setState} onChange={onChange} setShow={setShow}/>
    </>
  )
}
export default SelectModalStepTwo;

const ActiveTab = ({activeTab, setState, onChange, setShow, state}) => {
  switch(activeTab) {
    case("modals") :
      return <ModalsList setState={setState} onChange={onChange} setShow={setShow}/>
    case("templates") :
      return <TemplatesList setState={setState} state={state} />
    default:
      return null;
  }
}

const ModalsList = ({onChange, setShow}) => {
  const {projectId} = useParams();

  const {data, loading, error} = useQuery(GET_MODALS, {
    variables:{
      project_id: parseInt(projectId)
    }
  })

  if(loading || error) return null;

  const clickHandler = async (modal) => {
    await onChange(modal.id);
    setShow(false);
  };

  return (
    <div className={'grid'} style={{height:'575px', overflow:'hidden',overflowY:'scroll'}}>
      {map(data.result, modal => <ModalListItem modal={modal} clickHandler={clickHandler} />)}
    </div>
  )
}

const ModalListItem = ({modal, clickHandler}) => {
  const [loading, setLoading] = useState(false);

  const handlePreview = ()=>{
    var event = new CustomEvent('preview_animation', {'detail': 'Modal:'+modal.id});
    window.dispatchEvent(event);
  }

  const modalName = (modal.is_template) ? modal.template_name : modal.name;

  return(
    <div className={cx('col3')}>
      <div className={styles.modalListItem}>
        <div className={cx('grid')}>
          <div style={{padding: 0}}>
            <ModalPreview  modal={modal} width={249} height={135} scale={0.33}/>
          </div>
          <div style={{padding: '0 10px'}}>
            <h3 style={{marginBottom: '5px', marginTop: '10px'}}>{modalName}</h3>
            <div style={{marginBottom: '10px', opacity: 0.8}}>
              <small>Created {moment.utc(modal.created_at).fromNow()}</small>
            </div>
            <Button icon={'play'} small onClick={handlePreview} tooltip={"Preview Animations (Not all popups will have animations)"} noMarginRight>Preview</Button>
            <Button primary small right rightIcon={true} icon={"arrow-right"} loading={loading}
                    onClick={()=>{
                      setLoading(true)
                      clickHandler(modal)
                    }}
            >Select</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const GET_TEMPLATES = gql`
    query modalTemplates{
        modalTemplates(
            orderBy: [{column: "created_at", order: DESC}]
        ) {
            ...ModalFragment
            template_name
        }
    }
    ${MODAL_FRAGMENT}
`
const TemplatesList = ({setState, state}) => {
  const {data, loading, error} = useQuery(GET_TEMPLATES)
  const {applyTemplate} = useModalCommands();
  const [saving, setSaving] = useState(false);

  if(error) return null;

  if(loading) return <Icon loading />;
  // if(loading) return(
  //   <div className={'grid'} style={{height:'575px', overflow:'hidden',overflowY:'scroll'}}>
  //     {
  //       times(8, (i)=>(
  //         <div className={cx('col3')}>
  //           <ContentLoader
  //             speed={2}
  //             width={240}
  //             height={244}
  //             viewBox="0 0 240 244"
  //           >
  //             {/* Only SVG shapes */}
  //             <rect x="0" y="0" rx="10" ry="10" width="240" height="244" />
  //           </ContentLoader>
  //         </div>
  //       ))
  //     }
  //   </div>
  // )

  const goToStepThree = (modal) => {
    setState({
      activeStep: 3,
      template: modal
    });
  }

  const clickHandler = async  (modal) => {
    setSaving(true);

    // If we have a current modal select we
    // just apply the template to that
    // modal and not create a new one
    // at step 3
    if(state.currentModalId) {
      try {
        const req = await applyTemplate({
          variables: {
            input:{
              modalId: parseInt(state.currentModalId),
              templateId: parseInt(modal.id)
            }
          }
        })
        state.hideModal();

      }catch(err){
        console.error(err);
        errorAlert({text: 'Unable to apply template'})
      }

      setSaving(false);
    }
    else {
      goToStepThree(modal)
    }
  }

  return (
    <div className={'grid'} style={{height:'575px', overflow:'hidden',overflowY:'scroll'}}>
      {map(data.modalTemplates, modal => <ModalListItem modal={modal} clickHandler={(modal)=>clickHandler(modal)}  loading={saving}/>)}
    </div>
  )
}
