import {sharePath} from "../../routeBuilders";
import Swal from "sweetalert2";
import {errorAlert} from "../../utils/alert";
import {cache} from "../../graphql/client";
import { PROJECT_FRAGMENT } from '@/graphql/Project/fragments';


// Addded some extra input fields so we can call this method without having the project on the share page
export function generateEmbedCode(project) {
  if (!project) return null;

  let wrapperUrl = import.meta.env.VITE_WRAPPER_URL;
  
  let paddingTop = "56.25%";
  if(project.embed_width == "540") paddingTop = "75%";
  else if(project.embed_width == "228") paddingTop = "177.778%";

  if(project.published_path && !project.published_path.startsWith("https://swiftcdn6.global.ssl.fastly.net")) {
    return `<script type="text/javascript" src="${wrapperUrl}" async></script>
            <div class="iv-player_responsive_padding" style="padding:${paddingTop} 0 0 0;position:relative;" data-hash="${project.storage_path?.split('/')[1]}"">
              <div class="iv-player_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;">
                <div class="iv-player_embed iv-player_async_p2z7746nud videoFoam=true" style="height:100%;position:relative;width:100%">
                  <div class="iv-player_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;width:100%;">
                    ${project.image_url ? `<img src="${project.image_url}" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="" aria-hidden="true" />` : ''}
                  </div>
                </div>
              </div>
            </div>`
  } 

  if(project.storage_path) {
    // !!!!!!!! *******  Remember any changes here should be done in the share page too ******** !!!!!!!!!
    wrapperUrl = import.meta.env.VITE_OLD_WRAPPER_URL;
    return `<iframe class="_vs_ictr_player" src="https://swiftcdn6.global.ssl.fastly.net/${project.storage_path}/index.html?cb=${randomString()}" width=${project.embed_width} height=${project.embed_height} frameborder="0" allow="autoplay *" scrolling="no" ></iframe><script src="${wrapperUrl}"></script>`;
  }
  return "Not published yet";
}


export function generateEmbedCodeForPreviewing(project, startNodeId) {

  let apiUrl = import.meta.env.VITE_API_URL;
  let analyticsUrl = import.meta.env.VITE_ANALYTICS_URL;
  
  let paddingTop = "56.25%";
  if(project.embed_width == "540") paddingTop = "75%";
  else if(project.embed_width == "228") paddingTop = "177.778%";

  return `<div 
            class="iv-player_responsive_padding" 
            style="padding:${paddingTop} 0 0 0;position:relative;width:${project.embed_width}px; height:${project.embed_height}px;" 
            project-id="${project.id}" 
            data-hash="" 
            data-context="preview"
            api-url=${apiUrl}
            analytics-url=${analyticsUrl}
            preview-node-id=${startNodeId}
          >
            <div class="iv-player_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;">
              <div class="iv-player_embed iv-player_async_p2z7746nud videoFoam=true" style="height:100%;position:relative;width:100%">
                <div class="iv-player_swatch" style="height:100%;left:0;overflow:hidden;position:absolute;top:0;width:100%;">
                  ${project.image_url ? `<img src="${project.image_url}" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="" aria-hidden="true" />` : ''}
                </div>
              </div>
            </div>
          </div>`;
}

export function publishedProjectUrl(hash) {
  hash = hash.replace(/\?.+/, ''); // strip query params if any 
  const cb = randomString();
  //return config.STORAGE_PATH + `projects/${hash}/index.html?cacheBuster=${cb}`;
  return  `projects/${hash}/index.html?cacheBuster=${cb}`;
}


function randomString(){
  return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getHashFromProject(project) {
  if(project.storage_path) {
    const split = project.storage_path.split('/');
    return split[1];
  }

  return '';
}

export function sharePageUrl(project, whitelabel = false) {
  const root =  (whitelabel) ? 'http://'+ whitelabel : window.location.origin;
  const projectHash = getHashFromProject(project);
  const url = root + sharePath(projectHash);

  return url;
}

export const enableSurveysAlerts = (onChange, saveProject, projectId) => {
  Swal.fire({
    //title: 'Enable Surveys?',
    text: 'This project does not have surveys enabled, do you want to enable surveys on this project?',
    showCancelButton: true,
    confirmButtonColor: '#41c186',
    confirmButtonText: 'Yes, Enable Surveys',
    reverseButtons: true,
    focusConfirm: true,
    showLoaderOnConfirm: true
  }).then(async (result) => {
    // Confirmed
    if(result.isConfirmed) {
      try {
        const req = await saveProject({
          id: projectId,
          enable_surveys: 1
        });
  
        onChange(1)
  
        EnableSurveyAlertsStepTwo();
  
      }catch(err){
        errorAlert(err);
      }
    }
  });
}

export const EnableSurveyAlertsStepTwo = () => {
  Swal.fire({
    title: "Success!",
    html:
      "<p>We've now enabled surveys on this project.</p>" +
      "<p>Please ensure that \"Save Response As Survey\" is checked for all elements you want to include in this surveys charts.</p>\n" +
      "<p>You can enable surveys on any Image, Hotspot or Button Element. You should name the elements appropriately as the name will be used in the surveys chart analysis.</p>",
    icon: 'success',
    confirmButtonColor: '#366fe0',
    confirmButtonText: 'Done',
  });
};

export const getProjectFromCache = (id) => {
  return cache.readFragment({
    id: `Project:${id}`,
    fragment: PROJECT_FRAGMENT,
    fragmentName: 'ProjectFragment',
  });
}

export const getFirstProjectNode = (nodes) => {
  return nodes.reduce((firstNode, node) => {
    if(Date.parse(node.created_at) < Date.parse(firstNode.created_at)) {
      firstNode = node;
    }
    return firstNode;
  }, nodes[0])
}

export const getLatestProjectNode = (nodes) => {
  return nodes.reduce((latestNode, node) => {
    if(Date.parse(node.created_at) > Date.parse(latestNode.created_at)) {
      latestNode = node;
    }
    return latestNode;
  }, nodes[0])
}

export const assignProjectStartNode = (project, nodeId = null) => {
  let newStartNodeId = 0;
            
  let newStartNode = getFirstProjectNode(project.nodes);
  
  if(newStartNode && (newStartNode.id == nodeId)) {
    newStartNode = getLatestProjectNode(project.nodes)
  }

  if(newStartNode && (newStartNode.id != nodeId)) {
    newStartNodeId = newStartNode.id
  }

  return newStartNodeId;
}