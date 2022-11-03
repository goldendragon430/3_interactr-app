import React from 'react';
import PositionableElementProperties from './PositionableElementProperties';
import ClickableElementProperties from './ClickableElementProperties';
import DropImageZone from 'modules/media/components/DropImageZone';
import {Section} from 'components/PropertyEditor';
import ImageElementModal from './ImageElementModal';
import YouzignModal from 'components/YouzignModal';
import AnimationElementProperties from "./AnimationElementProperties";
import {useImageElementCommands} from "../../../../graphql/ImageElement/hooks";
import {elements, IMAGE_ELEMENT} from "../../elements";
import ElementPropertiesTabs from "../ElementPropertiesTabs";


const ImageElementProperties = ({element}) => {
  const {updateImageElement, saveImageElement} = useImageElementCommands(element.id);

  const elementMeta = elements[IMAGE_ELEMENT];

  return <ElementPropertiesTabs
    meta={elementMeta}
    element={element}
    update={updateImageElement}
    save={saveImageElement}
    startTab={'clickable'}
  />
};
export default ImageElementProperties;

// export default class ImageElementProperties extends React.Component {
//   handleSuccess = (options) => {
//     this.props.updateElement({
//       src: options.src,
//       height: options.height,
//       width: options.width
//     });
//   };
//
//   render() {}
// }
