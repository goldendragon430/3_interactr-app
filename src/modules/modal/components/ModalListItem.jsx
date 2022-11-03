import React, { useState } from 'react';
import Button from "../../../components/Buttons/Button";
import ModalPreview from "./ModalPreview";
import cx from "classnames";
import moment from "moment";
import styles from "./SelectModal/SelectModal.module.scss";
import {getAcl} from "../../../graphql/LocalState/acl";
import {useReactiveVar} from "@apollo/client";
import LinkButton from "../../../components/Buttons/LinkButton";


const ModalListItem = ({ modal, clickHandler, loading, canAccess = true }) => {

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
            <ModalPreview  modal={modal} width={249} height={135} scale={0.33} disabled={true} />
          </div>
          <div style={{padding: '0 10px ' , width: '100%'}}>
            <h3 style={{marginBottom: '5px', marginTop: '10px'}}>{modalName}</h3>
            <div style={{marginBottom: '10px', opacity: 0.8}}>
              <small>Created {moment.utc(modal.created_at).fromNow()}</small>
            </div>
            { !! modal.background_animation ? (<Button icon={'play'} small onClick={handlePreview}>Play</Button>) : null}
            {
              (canAccess) ?
                <Button primary small
                        right
                        rightIcon={true}
                        icon={"arrow-right"}
                        loading={loading}
                        onClick={()=>{
                          clickHandler(modal)
                        }}
                >Select</Button> :
                <LinkButton primary icon={'arrow-up'} to={'/upgrade'} small right>
                  Upgrade
                </LinkButton>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalListItem;