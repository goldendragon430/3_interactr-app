import React from 'react';
import orderBy from 'lodash/orderBy';
import styles from 'modules/media/components/MediaLibrary.module.scss';
import Icon from 'components/Icon';
import cx from 'classnames';
import Button from '../../../components/Buttons/Button';
import { Link } from 'react-router-dom';
import {modalPath} from "../../modal/routes";

export default class Modals extends React.Component {
  renderItems = () => {
    const { modals } = this.props;

    if (!modals) {
      return null;
    }

    const sortedModals = orderBy(modals, ['created_at'], ['desc']);

    // Super hacky way to do this but in a rush
    const urlSplit = window.location.href.split('/');
    const nodeId = parseInt(urlSplit[6]);

    return (
      <div className={styles.listWrapper}>
        <ul className={styles.modalsList}>
          <li style={{ height: '40px' }}>
            <Button icon="plus" primary onClick={() => this.handleAddModal()}>
              New Popup
            </Button>
          </li>
          {sortedModals.map(modal => this.renderModalItem(modal, nodeId))}
        </ul>
      </div>
    );
  };

  renderModalItem = (modal, nodeId) => {
    const urlSplit = window.location.href.split('/');
    const style =
      parseInt(urlSplit[8]) === modal.id ? { fontWeight: 'bold' } : {};

    return (
      <li key={modal.id}>
        <Link
          to={modalPath({
            projectId: modal.project_id,
            nodeId,
            modalId: modal.id
          })}
          style={style}
        >
          {modal.name}
        </Link>
      </li>
    );
  };

  handleAddModal = () => {
    const { addModalToElement, project } = this.props;

    addModalToElement(project.id);
  };

  render() {
    return (
      <div className={cx(styles.grid, styles.noMarginBottom)} style={{height:'calc(100vh - 192px)'}}>
        <div className={styles.alert}>
          <p>
            <Icon name="info-circle" /> <small>Click on a popup to edit.</small>
          </p>
        </div>
        {this.renderItems()}
      </div>
    );
  }
}
