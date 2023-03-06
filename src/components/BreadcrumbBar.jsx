import React from 'react';
import Breadcrumb from './Breadcrumb';
import styles from './BreadcrumbBar.module.scss';

export default class BreadcrumbBar extends React.Component {
  render() {
    const {left, middle, right, breadcrumb} = this.props;
    let leftStyle = {};
    let rightStyle = {};


    return (
      <div className={styles.wrapper} style={leftStyle}>

          { (left || breadcrumb) &&
            <div className={styles.left}>
              <div style={{width:'100%'}}>
                {left}
                <Breadcrumb />
              </div>
            </div>
          }


        {
          middle &&
          <div className={styles.middle}>
            {middle}
          </div>
        }

        {right &&
          <div className={styles.right} style={rightStyle}>
            {right}
          </div>
        }

      </div>
    )
  }
}

