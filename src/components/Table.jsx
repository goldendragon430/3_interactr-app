import React from 'react';
import map from 'lodash/map';
import cx from 'classnames';
import styles from './Table.module.scss'

export const Table = ({children}) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  )
}

export const TableRow = ({children}) => {
  return <div className={cx(styles.row, 'clearfix')}>{children}</div>
}

export const TableHeading = ({children}) => {
  return <div className={cx(styles.header, 'clearfix')}>{children}</div>
}

export const TableColumn = ({columns = 12, span, children}) => {
  const width = (100 / columns ) * span;

  const style = {
    width: width + '%'
  }

  return <div className={styles.column} style={style}>{children}</div>
}