import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import ReactTooltip from "react-tooltip";
import {useLazyQuery, useQuery} from "@apollo/client";
import gql from "graphql-tag";
import Icon from "../../../components/Icon";
import client from '../../../graphql/client';
import {nodePath} from "../../node/routes";
import {usePlayer} from "../../../graphql/LocalState/player";


const ClickThrough = ({children, element, action, arg}) => {
  const {nodeId, projectId} = useParams();
  const navigate = useNavigate();
  const { updatePlayer } = usePlayer();

  const clickHandler = () => {
    updatePlayer('playing', false)

    if(! element.actionArg) return null;

    switch(element.action) {
      case('playNode') :
        navigate(
          nodePath({projectId, nodeId: element.actionArg})
        )
        break;
      case('skipToTime') :
        updatePlayer('playedSeconds', element.actionArg)
        break;
      case('openModal') :
        updatePlayer('activeModal', element.actionArg)
        break;
      case('closeModal') :
        updatePlayer('activeModal', false);
        break;
      case('openUrl') :
        window.open(element.actionArg);
        break;
    }
  }

  useEffect(()=>{
    if(element.__typename==='TriggerElement') {
      clickHandler();
    }
  }, [element])

  return (
    <>
      <WrapWithTooltip action={action} arg={arg}>
         <span onClick={clickHandler}>
          {children}
         </span>
      </WrapWithTooltip>
    </>
  )
};
export default ClickThrough;

const WrapWithTooltip = ({action, arg, children}) => {
  
  if(! arg) {
    // Arg has no been defined yet
    return(
      <NoActionTooltip>
        {children}
      </NoActionTooltip>
    )
  }

  switch(action) {
    case('playNode') :
      return (
        <NodeTooltip id={arg}>
          {children}
        </NodeTooltip>
      )
    case('openModal') :
      return (
        <ModalTooltip id={arg}>
          {children}
        </ModalTooltip>
      )
    case('closeModal') :
      return (
        <CloseModalTooltip>
          {children}
        </CloseModalTooltip>
      )
    case('skipToTime') :
      return (
        <SkipToTimeTooltip time={arg}>
          {children}
        </SkipToTimeTooltip>
      )
    case('openUrl') :
      return (
        <OpenUrlTooltip url={arg}>
          {children}
        </OpenUrlTooltip>
      )
    default:
      return (
        <NoActionTooltip>
          {children}
        </NoActionTooltip>
      )
  }
}

const NODE_QUERY = gql`
    query getNode($id: ID!){
        node(id: $id) {
            id
            name
        }
    }
`
const NodeTooltip = ({id, children}) => {
  const {data, loading, error} = useQuery(NODE_QUERY, {
    variables: { id }
  });

  if(loading) return <Icon loading />;

  if(error) {
    console.error(error);
    return null;
  }

  const {name}  = data.node;

  const tooltip = "Play Node: " + name;
  
  return (
    <>
    <ReactTooltip />
    <span data-tip={tooltip}>{children}</span>
    </>
  )
}

const ModalTooltip = ({id, children}) => {
  const name = getModalName(id);
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [name])
  const tooltip = "Open Popup: " + name;
  
  return (
    <>
    <ReactTooltip />
    <span data-tip={tooltip}>{children}</span>
    </>
  )
}

const CloseModalTooltip = ({children}) => {
  const tooltip = "Close Popup";
  
  return (
    <>
    <ReactTooltip />
    <span data-tip={tooltip}>{children}</span>
    </>
  )
}

const SkipToTimeTooltip = ({time, children}) => {
  const tooltip = "Skip to " + time + " Seconds";
  
  return (
    <>
    <ReactTooltip />
    <span data-tip={tooltip}>{children}</span>
    </>
  )
}

const OpenUrlTooltip = ({url, children}) => {
  const tooltip = "Go To Url: " + url;
  
  return (
    <>
    <ReactTooltip />
    <span data-tip={tooltip}>{children}</span>
    </>
  )
}

const NoActionTooltip = ({children}) => {
  // return <span data-tip={"Element has no click action"}>{children}</span>
  return children;
}

const getModalName = (id) => {
  const query = client.readFragment({
    id: "Modal:"+id,
    fragment: gql`
        fragment ModalFragment on Modal {
            id
            name
        }
    `
  })

  return query.name;
}