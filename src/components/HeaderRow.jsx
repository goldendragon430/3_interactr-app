import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './HeaderRow.module.scss';
import Breadcrumb from './Breadcrumb';
import {motion} from 'framer-motion'
import {useReactiveVar} from "@apollo/client";
import {getBreadcrumbs} from "../graphql/LocalState/breadcrumb";
import {getPageHeader} from "../graphql/LocalState/pageHeading";
import {getWhitelabel} from "../graphql/LocalState/whitelabel";

const _propTypes = {
  /** Heading specific to the route we're on */
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** meta element that shows up under the breadcrumb directly  */
  meta: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** right side of the header row, an element */
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** custom styles that will be applied to the header wrapper */
  headerStyles: PropTypes.object
};

const HeaderRow = ({heading, right, meta, headerStyles , className, subnav}) => {
  const whitelabel = useReactiveVar(getWhitelabel);;

  let customHeaderStyles = {};

  if (headerStyles) {
    customHeaderStyles = {
      ...headerStyles
    }
  }

  if (whitelabel) {
    customHeaderStyles.background = whitelabel.background_colour;
  }

  return (
    <motion.div className={cx(styles.header, className)} style={customHeaderStyles} animate={{opacity: 1}}>
      <div className={styles.container}>
        <div className={cx('flex-0', styles.left)}>
          <Breadcrumb />
          { (!! meta) && <div className={cx(styles.meta, 'clearfix')}>{meta}</div>}
          <PageHeading heading={heading}/>
          { (!!subnav) && <div className={styles.subnav}>{subnav}</div> }
        </div>
        <div className={cx('flex-0', styles.right)}>{right}</div>
      </div>
    </motion.div>
  );
};
HeaderRow.propTypes = _propTypes;
export default HeaderRow;

const PageHeading = ({heading}) => {
  const headingFromState = useReactiveVar(getPageHeader);

  const pageHeading = heading || headingFromState;

  if(pageHeading) return  <div className={styles.page_heading}>{pageHeading}</div>;

  return null;
}

