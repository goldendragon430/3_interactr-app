import React from 'react';
import SubNav from "../../../components/SubNav";
import {
  projectChaptersPage,
  projectSettingsPath,
  projectSharingPage,
  projectStatsPath,
  publishProjectPath
} from "../routes";


export default class ProjectNav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
    const {active, project} = this.props;

     let  items = [{
                active: (active === 'canvas'),
                text: 'Canvas',
                route: projectCanvasPath({projectId: project.id})
            }];

     if(! project.legacy){
         items.push( {
             active: (active === 'chapters'),
             text: 'Chapters',
             route: projectChaptersPage({projectId: project.id})
         });
     };

     items.push({
         active: (active === 'publishing'),
         text: 'Publishing',
         route: publishProjectPath({projectId: project.id})
     });

     items.push({
         active: (active === 'sharing'),
         text: 'Sharing',
         route: projectSharingPage({projectId: project.id})
     });

     items.push({
         active: (active === 'analytics'),
         text: 'Analytics',
         route: projectStatsPath({projectId: project.id})
     });

     items.push({
         active: (active === 'settings'),
         text: 'Settings',
         route: projectSettingsPath({projectId: project.id})
     });

    return <SubNav items={items} />
  }
}
