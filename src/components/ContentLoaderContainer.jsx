import React from "react";
import ContentLoader from "react-content-loader";
import PropTypes from 'prop-types';

const _props = {
  // How fast should the svg flash
  speed: PropTypes.number,
  // Ensure the child SVG is passed in
  children: PropTypes.element.isRequired,
  // Height of the wrapper
  height: PropTypes.number.isRequired,
  // width of the wrapper
  width: PropTypes.number.isRequired,
  // Hex ref of the background color
  background: PropTypes.string,
  // Hex ref of the foreground color
  foreground: PropTypes.string,
  // SVG viewbox property
  viewbox: PropTypes.string
};

const _defaults = {
  speed: 2,
  background: "#f3f3f3",
  foreground: "#ecebeb"
};

/**
 * Wrapper for React Content Loader,
 * full documentation here: https://create-content-loader.now.sh/
 * @param speed
 * @param height
 * @param width
 * @returns {*}
 * @constructor
 */
const ContentLoaderContainer = ({speed, height, width, background, foreground, viewbox, children}) => {
  const _viewbox = (viewbox) ? viewbox : `0 0 ${width} ${height}`;

  return (
    <ContentLoader
      speed={speed}
      width={width}
      height={height}
      viewBox={_viewbox}
      backgroundColor={background}
      foregroundColor={foreground}
    >
      {children}
    </ContentLoader>
  )
};
ContentLoaderContainer.propTypes = _props;
ContentLoaderContainer.defaultProps = _defaults;

export default ContentLoaderContainer;