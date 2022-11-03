import React from 'react';
import styles from './WhatsNew.module.scss';
import moment from "moment";
import map from 'lodash/map'
import getAsset from "../../../utils/getAsset";
import cx from 'classnames'
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import {useSetState} from "../../../utils/hooks";
import Modal from "../../../components/Modal";
import Button from "../../../components/Buttons/Button";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";


const QUERY = gql`
    query allUserNotifications {
        result: allUserNotifications(limit: 5) {
            id
            title
            details
            launch_date
            modal_height,
            created_at
        }
    }
`;

const WhatsNewSummaryBox = () => {
  const {data, loading, error} = useQuery(QUERY);
  
  const [state, setState] = useSetState({
    show: false,
    activeItem: false
  })

  if (loading) return <div className={styles.wrapper}><Icon loading /></div>;

  if(error ) return <ErrorMessage error={error} />;
  
  // Temp override util we have icons made
  const icon = getAsset('/img/img-what-is-new.png');
  const whatsnew = data.result;
  const {show, activeItem} = state;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={'grid'}>
          <div className={'col8'} style={{margin: 0}}>
            <h3><Icon name={'bell-on'} /> What's New</h3>
            <ul className={styles.listWrapper}>
              {
                map(whatsnew, item => (
                  <li className={cx(styles.listItem, 'ellipsis')}>
                    <span className={styles.check} ><Icon name={'check'} /></span>
                    <span className={styles.hoverItem} onClick={()=>setState({show: true, activeItem: item})}>{item.title}</span>
                    <br/>
                    <small>{moment.utc(item.launch_date).fromNow()}</small>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className={'col4'} style={{marginRight: 0}}>
            <img src={icon} className={styles.icon}/>
          </div>
        </div>
      </div>
      <Modal 
        width={550} 
        height={(activeItem) ? activeItem.modal_height : 500} 
        show={show} 
        onClose={()=>setState({show: false, activeItem: false})}
        heading={
          <>
            <Icon name="bell-on" />
            { activeItem ? activeItem.title : ''}
          </>
        }
      >        
        { activeItem ? (
          <div dangerouslySetInnerHTML={{__html: activeItem.details}} style={{ display: 'inline-block' }} />
        ) : ''}
      </Modal>
    </>
  )
};

export default WhatsNewSummaryBox;