import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const _proptypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  /** valid icon set prefix supported by fontawesome */
  type: PropTypes.oneOf(['fal', 'far', 'fas', 'fab']).isRequired,
  color: PropTypes.string,
  /** sets the cursor to be a pointer */
  pointer: PropTypes.bool,
  /** primary and secondary colors both default to values currently set from variables.scss */
  primary : PropTypes.bool,
  secondary: PropTypes.bool,
  loading: PropTypes.bool,
  // ...
  // takes all the expected props from @fortawesome/react-fontawesome
};
const _defaultProps = {
  type: 'far'
};
const Icon = ({ icon, name, type, pointer=false, primary, secondary,loading, color, ...props }) => {
  let _icon = icon || name;
  if(loading) {
    _icon = "spinner-third";
    props.spin = true;
  }
  if (!Array.isArray(_icon) && typeof _icon !== 'string') {
    throw TypeError(
      'Icon prop is of invalid type, must be either a valid fontawesome icon name or an Array like [far, icon_name].\nMake sure you add the icon itself to iconsLibrary if not already present'
    );
  }

  // auto add pointer if icon has onClick
  if(typeof props.onClick === 'function' ) {pointer = true}
  
  _icon = Array.isArray(_icon) ? _icon : [type, _icon];
  const style = {

    color: primary ? '#00b382' :  secondary ? '#556aff' :  color ? color : '',
    marginRight: 5,
    cursor: pointer ? 'pointer': 'inherit',
    ...props.style
  };
  return <FontAwesomeIcon icon={_icon} style={style} {...props} />;
};

Icon.propTypes = _proptypes;
Icon.defaultProps = _defaultProps;

export default Icon;
