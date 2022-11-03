import React from 'react';
import forEach from 'lodash/forEach';
import styles from 'modules/media/components/MediaLibrary.module.scss';
import Icon from 'components/Icon';
import cx from 'classnames';
import MediaItem from '../../media/components/MediaItem';

export default class Nodes extends React.Component {
  getThumbnailForNode = node => {
    const { media } = this.props;
    let thumbnail = '';

    forEach(media, media => {
      if (node.media_id === media.id) {
        thumbnail = media.thumbnail_url;
      }
    });

    return thumbnail;
  };

  renderItems = () => {
    const { nodes } = this.props;
    const urlSplit = window.location.href.split('/');

    // Stop having an active node when on a modal page
    const activeNode = urlSplit.length <= 7 ? parseInt(urlSplit[6]) : 0;

    return (
      <div className={styles.listWrapper}>
        {nodes.map(node => (
          <div className={styles.listItem} key={node.id}>
            <MediaItem
              node={node}
              type="node"
              thumbnail_url={this.getThumbnailForNode(node)}
              active={node.id === activeNode}
            />
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className={cx(styles.grid, )} style={{height:'calc(100vh - 192px)'}}>
        <div className={styles.alert}>
          <p>
            <Icon name="info-circle" /> <small>Click on a node to edit.</small>
          </p>
        </div>
        {this.renderItems()}
      </div>
    );
  }
}
