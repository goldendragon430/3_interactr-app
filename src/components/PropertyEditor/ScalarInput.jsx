import React from 'react';
import styles from './PropertyEditor.module.scss';
import map from 'lodash/map';

export default class ScalarInput extends React.Component {
  changeHandler = axis => e => {
    const {ratio, value, onChange} = this.props;

    const changedVal = parseInt(e.target.value, 10) || 0;

    if (ratio) {
      return onChange(
        e,
        map(value, (val, i) =>
          parseInt(
            i === axis
              ? changedVal
              : i === 0 ? changedVal * ratio : changedVal / ratio
          )
        )
      );
    }

    value[axis] = changedVal;
    onChange(e, value);
  };

  handleDragStart = e => {
    e.dataTransfer.effectAllowed = 'none';
    // Make a 1px transparent image to disable drag effect
    var img = document.createElement('img');
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.setDragImage(null);
  };

  handleDrag = e => {
    console.log(e);
  };

  render() {
    const {labels, value, ratio} = this.props;

    return (
      <div className={styles.ScalarInput}>
        {map(value, (val, i) => (
          <div key={i}>
            <label
              draggable
              onDrag={this.handleDrag}
              onDragStart={this.handleDragStart}
            >
              {labels[i]}
            </label>
            <input onChange={this.changeHandler(i)} value={val || 0} />
          </div>
        ))}
      </div>
    );
  }
}
