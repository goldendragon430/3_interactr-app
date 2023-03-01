import cx from 'classnames';
import Icon from 'components/Icon';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SidebarNav.module.scss';

export default class SidebarNav extends React.Component {
  renderItem(item){
    const wrapperClasses = cx(styles.item, {
      [styles.active]: (item.active > 0),
    });

    const textClasses = cx(styles.text, {
      [styles.shield]: item.icon === 'shield'
    });

    return (
      <li className={wrapperClasses} key={item.text}>
        <Link to={item.to}>
          <div className={styles.icon}>
            <Icon name={item.icon} />
          </div>
          <div className={textClasses}>
            <h4>{item.text}</h4>
            <p><small>{item.summary}</small></p>
          </div>
        </Link>
      </li>
    )
  }

  render() {
    const {items} = this.props;

    return (<ul className={styles.wrapper}>
      {
        items.map(
          (item) => { return this.renderItem(item) }
      )}
    </ul>);
  }
}