import {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {modalElementPath, modalPath, modalsPath} from "./routes";
import {nodePath} from "../node/routes";
import {projectPath} from "../project/routes";
import { elementModalEditPath, elementPath } from "../element/routes";

const STORAGE_KEY = 'modalBackPath';

export const useModalRoute = () => {
  let {projectId} = useParams();
  const navigate = useNavigate();


  const goToModalPage = ({modalId, backPath = null}) => {
    // Set the path to go back to so the modal can easily
    // be opened to different places
    if(backPath) {
      localStorage.setItem(STORAGE_KEY, backPath)
    }
    navigate( modalPath({modalId, projectId}) );
    //window.location.href = modalPath({modalId, projectId});
  };

  const goBack = () => {
    const backpath = localStorage.getItem(STORAGE_KEY);
    // Little messy would prefer we use the built in router but no
    // sure it works in the context here needed that requires it to
    // save the full current route when called not call a route
    // function
    if(backpath) {
      navigate(
        backpath
      )
    }
    else {
      navigate(
        modalsPath({projectId})
      )
    }
  }

  return {goToModalPage, goBack}
};

export const useModalElementRoute = () => {
  const {modalElementId, projectId, modalId, interactionId, nodeId} = useParams();

  const navigate = useNavigate();

  const setModalElementId = modalElementId => {
    if(modalId)
      navigate( modalElementPath({modalElementId, projectId, modalId}) );
    else 
      navigate( elementModalEditPath({projectId, nodeId, interactionId, modalElementId}) );
  };

  // Navigates back to the modal  element page
  const back = () => {
    if(modalId)
      navigate(modalPath( {projectId, modalId} ));
    else
      navigate(elementPath( {projectId, nodeId, interactionId} ));
  };

  return [modalElementId, setModalElementId, back]
};