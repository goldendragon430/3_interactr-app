import React from 'react';
import styles from './nodeControl.module.scss';
import Icon from 'components/Icon';

const NodeControl = ({ selected, onCopy, onDelete, onEdit, deleting, copying }) => {
  /**
   * Is a video selected in the UI, path's
   * can't be copied
   *
   * @returns {boolean}
   */
  const canCopy = () => {
    return true;
  };

  const canEdit = () => {
    return true;
  };

  const renderEditButton = () => {
    return <li onClick={onEdit}>{renderButton(canEdit(), 'text')}</li>;
  };

  const renderCopyButton = () => {
    return <li onClick={onCopy}>{renderButton(canCopy(), 'clone', copying)}</li>;
  };

  const renderDeleteButton = () => {
    // can delete is figured out by the parent which provides onDelete function.
    return <li onClick={onDelete}>{renderButton(true, 'trash-alt', deleting)}</li>;
  };

  /**
   * Receive a bool that controls if the button
   * should be clickable or disabled.
   * @param enabled
   * @param icon
   * @param loading
   * @returns {*}
   */
  const renderButton = (enabled, icon, loading = null) => {
    let classes = !enabled ? 'disabled' : '';

    return (
      <span className={classes}>
        <Icon name={icon} loading={loading} />
      </span>
    );
  };

  /**
   * Check if any of the button can be used (ie a node or path is highlighted).
   * No point in showing the buttons unless one of them can be used
   *
   * @returns {boolean}
   */
  const shouldShow = () => {
    return selected;
  };

  /**
   * Render the HTML
   *
   * @returns {*}
   */
  if (!shouldShow()) return null;
  const inlineStyle = selected ? {opacity: '1', height: '30px'} : {opacity: '1', height: '0px'};

  return (
      <div className={styles.wrapper} style={inlineStyle}>
        <ul>
          {renderEditButton()}
          {renderCopyButton()}
          {renderDeleteButton()}
        </ul>
      </div>
  );
};

export default NodeControl;