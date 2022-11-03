import React from 'react';
import SidebarItem from 'components/SidebarItem';
import styles from './ComposerSidebar.css';
import {projectPath, projectSettingsPath, publishProjectPath} from "../../project/routes";

class ComposerSidebar extends React.Component {
  render() {
    const {match: {params: {projectId}}} = this.props;

    return (
      <aside className={styles.ComposerSidebar}>
        <ComposerSidebarItem icon="sitemap" link={projectPath({projectId})} />
        <ComposerSidebarItem
          icon="cog"
          link={projectSettingsPath({projectId})}
        />
        <ComposerSidebarItem
          icon="globe"
          link={publishProjectPath({projectId})}
        />
      </aside>
    );
  }
}

export default ComposerSidebar;

export function ComposerSidebarItem(props) {
  return (
    <SidebarItem
      className={styles.ComposerSidebarItem}
      activeClassName={styles.active}
      iconClassName={styles.icon}
      {...props}
    />
  );
}
