import Button from "../../../../components/Buttons/Button";
import React, {useEffect} from 'react'
import styles from './SelectModal.module.scss'
import cx from 'classnames'
import {useModalCommands} from "../../../../graphql/Modal/hooks";
import ItemSelect from "../../../../components/ItemSelect";
import { getAsset } from "utils";

const SelectModalStepOne = ({setState, state}) => {
  useEffect(()=>{
    setState({
      modalHeight:480,
      modalWidth: 885
    })
  }, [])


  return(
    <div className={'grid'}>
      <div className={'col4'}>
        <ItemSelect
          heading="Create Blank"
          description="Create a new blank popup with no preset elements"
          image={getAsset('/img/img-popup-create-blank.png')}
          onClick={
            ()=>setState({
              activeStep: 3,
              context: 'blank',
              template: null,
              currentModalId: null
            })
          }
        />
      </div>
      <div className={'col4'}>
        <ItemSelect
          heading="My Popups"
          description="Select from one of the popups already created"
          image={getAsset('/img/img-my-popups.png')}
          onClick={
            ()=>setState({activeStep: 2, context: 'users'})
          }
        />
      </div>
      <div className={'col4'}>
        <ItemSelect
          heading="Templates"
          description="Choose one of our pre made popup templates"
          image={getAsset('/img/img-popup-templates')}
          onClick={
            ()=>setState({activeStep: 2, context: 'templates'})
          }
        />
      </div>
    </div>
  )
};
export default SelectModalStepOne;

