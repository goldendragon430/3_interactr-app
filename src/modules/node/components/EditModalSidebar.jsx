import React from 'react';
import styles from 'modules/media/components/MediaLibrary.module.scss';
import {mediaLibraryByProjectSelector} from 'modules/media/mediaSelectors';
import cx from 'classnames';
import Nodes from 'modules/node/components/Nodes';
import Modals from 'modules/node/components/Modals';
import ModalElements from "./ModalElements";


export default class EditNodeSidebar extends React.Component {
  constructor(){
    super();
    this.state ={
      selectedTab: 'elements',
      mediaZoneIn: true
    }
  }

  render() {
    const nodeHeadingStyles = cx({
      [styles.heading]: true,
      [styles.selected] : (this.state.selectedTab === 'nodes')
    });

    const modalHeadingStyles = cx({
      [styles.heading]: true,
      [styles.selected] : (this.state.selectedTab === 'modals')
    });

    const elementHeadingStyles = cx({
      [styles.heading]: true,
      [styles.selected] : (this.state.selectedTab === 'elements')
    });

    const {selectedTab} = this.state;

    return (
      <div className={styles.MediaLibrary}>
        <div className={styles.tabHeadings}>
          <h3 className={elementHeadingStyles} onClick={()=>this.setState({selectedTab: 'elements'}) }>Elements</h3>
          <h3 className={nodeHeadingStyles} onClick={()=>this.setState({selectedTab: 'nodes'}) }>Nodes</h3>
          <h3 className={modalHeadingStyles} onClick={()=>this.setState({selectedTab: 'modals'}) }>Popups</h3>
        </div>
        {(selectedTab === 'elements') ? <ModalElements {...this.props} />  : null }
        {(selectedTab === 'nodes') ? <Nodes {...this.props} />  : null }
        {(selectedTab === 'modals') ? <Modals {...this.props} />  : null }
      </div>
    );
  }
}
