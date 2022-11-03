import React from 'react';
import PropTypes from 'prop-types';
import styles from 'modules/media/components/MediaLibrary.module.scss';
import cx from 'classnames';
// import { mediaLibraryByProjectSelector } from 'modules/media/mediaSelectors';
import Icon from 'components/Icon';
import ElementToolbar from 'modules/interaction/components/ElementToolbar';
import FilterInput from 'components/FilterInput';
// import Nodes from 'modules/node/components/Nodes';
// import Modals from 'modules/node/components/Modals';


const props = {
  onHide: PropTypes.func
};

// @connect(mediaLibraryByProjectSelector, { addModalToElement })
// @connect(nodesAsArraySelector, { addModalToElement })
export default class ElementsPanelContainer extends React.Component {
  render() {

    return (
      <div className={this.props.className}>
        {/*<div className="d-flex justify-between">*/}
        {/*  <div><FilterInput /></div>*/}
        {/*  <Icon name="times" onClick={this.props.onHide} size="2x" />*/}
        {/*</div>*/}
        <div style={{marginLeft: '20px'}}>
            <h5 className="form-heading" style={{marginTop: '30px'}}>To add a new element drag it onto the video</h5>
            <ElementToolbar {...this.props} onSelect={this.handleSelectElement} />
        </div>
      </div>

      // {/* <div className={this.props.className}>
      // <div className={styles.tabHeadings}>
      //   <h3 className={elementHeadingStyles} onClick={()=>this.setState({selectedTab: 'elements'}) }>Elements</h3>
      //   <h3 className={nodeHeadingStyles} onClick={()=>this.setState({selectedTab: 'nodes'}) }>Nodes</h3>
      //   <h3 className={modalHeadingStyles} onClick={()=>this.setState({selectedTab: 'modals'}) }>Popups</h3>
      // </div>
      // {(selectedTab === 'elements') ? <Elements {...this.props} />  : null }
      // {(selectedTab === 'nodes') ? <Nodes {...this.props} />  : null }
      // {(selectedTab === 'modals') ? <Modals {...this.props} />  : null }
      // </div> */}
    );
  }
}

ElementsPanelContainer.propTypes = props;
