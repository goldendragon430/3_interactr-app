import React from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import PropTypes from 'prop-types';
import styles from './HorizontalScroller.module.scss';

import Icon from 'components/Icon';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
  selected: PropTypes.any,
  onSelect: PropTypes.function
  // plus all supported props from 
  // https://github.com/asmyshlyaev177/react-horizontal-scrolling-menu#properties-and-callbacks
};

function createArrow(side) {
  return <Icon icon={`chevron-${side}`} size="lg" />;
}

const HorizontalScroller = ({ items, ...props }) => {
  return (
    <ScrollMenu
      data={items}
      arrowLeft={createArrow('left')}
      arrowRight={createArrow('right')}
      wrapperClass={styles.wrapper_menu}
      arrowClass={styles.scroll_menu_arrow}
      itemClass={styles.menu_item_wrapper}
      // itemActiveClass={styles.menu_item_wrapper__active}
      translate={10}
      {...props}
    />
  );
};

HorizontalScroller.propTypes = propTypes;

export default HorizontalScroller;
