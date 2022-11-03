import ContentLoader from "react-content-loader";
import React from "react";

const ChartLoader = ({height, width}) => {
  return (
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#f3f6fd"
    >
      {/* Only SVG shapes */}
      <rect x="0" y="0" rx="10" ry="10" width={width} height={height} />
    </ContentLoader>
  )
}
export default ChartLoader;