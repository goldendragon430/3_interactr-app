import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import PropTypes from 'prop-types';

const Image = ({ src, width, height, alt, effect, offset, ...props }) => (
  <LazyLoadImage
    src={src} // use normal <img> attributes as props
    height={height}
    width={width}
    alt={alt}
    effect={effect}
    offset={offset}
    {...props}
  />
);

Image.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default Image;
