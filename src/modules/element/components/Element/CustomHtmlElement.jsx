import React from 'react';
import PositionableElement from './PositionableElement';
import {CUSTOM_HTML_ELEMENT} from 'modules/element/elements';
import PropTypes from "prop-types";
import Icon from "../../../../components/Icon";
import {useCustomHtmlElement, useCustomHtmlElementCommands} from "../../../../graphql/CustomHtmlElement/hooks";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import Element from "./Element";
import StaticElement from "../StaticElement";
import {cache} from "../../../../graphql/client";
import {BUTTON_ELEMENT_FRAGMENT} from "../../../../graphql/ButtonElement/fragments";
import {CUSTOM_HTML_ELEMENT_FRAGMENT} from "../../../../graphql/CustomHtmlElement/fragments";



/**
 * Render a custom html element
 * @param id
 * @returns {null|*}
 * @constructor
 */
const CustomHtmlElement = ({elementId, selected, onSelect, onDelete, animationKey, preview}) => {
  const {updateCustomHtmlElement, saveCustomHtmlElement} = useCustomHtmlElementCommands(elementId);

  const element = cache.readFragment({
    id: `CustomHtmlElement:${elementId}`,
    fragment: CUSTOM_HTML_ELEMENT_FRAGMENT
  });

  const {html} = element;

  // if(preview) {
  //   return(
  //     <StaticElement
  //       element={element}
  //       animationKey={animationKey}
  //       style={{
  //         overflow: 'hidden',
  //         height: '100%'
  //       }}
  //     >
  //       <div dangerouslySetInnerHTML={{__html: html}}/>
  //     </StaticElement>
  //   )
  // }

  return (
    <PositionableElement
      element={element}
      onSelect={onSelect}
      update={updateCustomHtmlElement}
      save={saveCustomHtmlElement}
      onDelete={onDelete}
      animationKey={animationKey}
      style={{
        overflow: 'hidden',
        border: (selected) ? '1px dashed #eee' : null,
        height: '100%'
      }}
      preview={preview}
    >
      <div dangerouslySetInnerHTML={{__html: html}}/>
    </PositionableElement>
  );
};

export default CustomHtmlElement;