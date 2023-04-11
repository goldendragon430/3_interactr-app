import React from 'react';
import Icon from "components/Icon";
import ButtonElementProperties from 'modules/element/components/Properties/ButtonElementProperties';
import CustomHtmlElementProperties from 'modules/element/components/Properties/CustomHtmlElementProperties';
import FormElementProperties from 'modules/element/components/Properties/FormElementProperties';
import HotspotElementProperties from 'modules/element/components/Properties/HotspotElementProperties';
import ImageElementProperties from 'modules/element/components/Properties/ImageElementProperties';
import TextElementProperties from 'modules/element/components/Properties/TextElementProperties';
import TriggerElementProperties from 'modules/element/components/Properties/TriggerElementProperties';
import {
  BUTTON_ELEMENT,
  CUSTOM_HTML_ELEMENT,
  FORM_ELEMENT,
  HOTSPOT_ELEMENT,
  IMAGE_ELEMENT,
  TEXT_ELEMENT,
  TRIGGER_ELEMENT
} from 'modules/element/elements';
import { useParams } from 'react-router-dom';
import styles from './ElementProperties.module.scss';
//import { MenuContext } from 'react-flexible-sliding-menu';
import { useQuery } from "@apollo/client";
import cx from 'classnames';
import gql from "graphql-tag";
import ContentLoader from "react-content-loader";
import { useNavigate } from 'react-router-dom';
import ErrorMessage from "../../../../components/ErrorMessage";
import { INTERACTION_FRAGMENT } from "../../../../graphql/Interaction/fragments";
import { SAVE_NODE_PAGE } from "../../../../utils/EventEmitter";
import ElementToolbar from "../../../interaction/components/ElementToolbar";
import { nodePath } from "../../../node/routes";
import { useElementGroupRoute, useElementRoute } from "../../routeHooks";
import ElementGroupProperties from "../ElementGroupProperties";

const ElementPropertiesMenu = () => <ElementProperties />;
export default ElementPropertiesMenu;

const ElementProperties = () => {
  const [interactionId] = useElementRoute();
  const [elementGroupId] = useElementGroupRoute();

  // if(isNaN(interactionId) && isNaN(elementGroupId)) return null;
  const show = !(isNaN(interactionId) && isNaN(elementGroupId));
  return(
    <Wrapper heading={getHeading(interactionId, elementGroupId)} show={show}>
      {show && <Body interactionId={interactionId} elementGroupId={elementGroupId} />}
    </Wrapper>
  )
};

const Wrapper = ({children, heading, show}) => {
  const {nodeId, projectId} = useParams();
  const navigate = useNavigate();

  return(
    <div className={cx(styles.menu, {[styles.slideIn]: (show)})}>
      <div className={styles.header}>
        <div className={styles.close}>
          <a onClick={()=>{
            const event = new CustomEvent(SAVE_NODE_PAGE)
            window.dispatchEvent(event);
            navigate(nodePath({projectId, nodeId}));
          }}><Icon name="arrow-to-right" size="2x"/></a>
        </div>
        {heading}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
};


const Body = ({interactionId, elementGroupId}) => {
  if (parseInt(interactionId) === 0 ) return <NewElement />;

  if(parseInt(elementGroupId)) return <ElementGroupProperties id={elementGroupId}/>;

  return  <Properties id={interactionId}/>;
};


const getHeading = (interactionId, elementGroupId) => {
  if(elementGroupId) return <h2>Edit Element Group</h2>;

  if(interactionId > 0) return <h2>Edit Element</h2>;

  return null;
};

const QUERY = gql`
    query interaction($id: ID!) {
        interaction(id: $id) {
            ...InteractionFragment
        }
    }
    ${INTERACTION_FRAGMENT}
`;

const Properties = ({id}) => {
  const {data, loading, error} = useQuery(QUERY, {variables: {id}});

  if(loading) return <ElementPropertiesLoader />;

  if(error) return <ErrorMessage>{error.message}</ErrorMessage>;

  const {interaction} = data;

  return <ElementSwitch element={interaction.element} element_type={interaction.element_type} />;
};

export const ElementSwitch = ({element, element_type}) => {
  switch (element_type) {
    case BUTTON_ELEMENT:
      return <ButtonElementProperties element={element} />;
    case HOTSPOT_ELEMENT:
      return <HotspotElementProperties element={element} />;
    case IMAGE_ELEMENT:
      return <ImageElementProperties element={element} />;
    case TEXT_ELEMENT:
      return <TextElementProperties element={element} />;
    case CUSTOM_HTML_ELEMENT:
      return <CustomHtmlElementProperties element={element} />;
    case TRIGGER_ELEMENT:
      return <TriggerElementProperties element={element} />;
    case FORM_ELEMENT:
      return <FormElementProperties element={element} />;
  }

  return null;
};


const NewElement = () => {
  return (
    <React.Fragment>
      <div style={{marginTop: '20px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '15px'}}>
        <h3 style={{margin: 0}}>Elements List</h3>
        <p style={{margin: 0}}><small>(Drag icon onto the video to create a new element)</small></p>
      </div>
      {/* Set wizard to false for now, I think it needs more work */}
      <ElementToolbar />
    </React.Fragment>
  )
};


const ElementActions = () => {
  return (
    <div className={styles.actionsIcons}>
      <div className={styles.icon}>
        <Icon name="trash-alt" size="1x"  />
      </div>
      <div className={styles.icon}>
        <Icon name="copy" size="1x" />
      </div>
    </div>
  )
};


export const ElementPropertiesLoader = () => {
  return(
    <ContentLoader
      speed={1}
      width={630}
      height={817}
      viewBox={`0 0 ${630} ${817}`}
    >
      {/* Only SVG shapes */}
      <rect x="0" y="0" rx="3" ry="3" width={132} height={817} />
      <rect x="135" y="0" rx="3" ry="3" width={2} height={817} />
      <rect x="140" y="0" rx="3" ry="3" width={430} height={817} />
    </ContentLoader>
  )
};

