import React from 'react';
import EmbedSettings from './EmbedSettings';
import PublishButton from 'modules/project/components/PublishButton';
import RelativeDate from 'components/date/RelativeDate';
import styles from './ProjectSettingsPage.module.scss';
// import CardStyles from 'components/Card.module.scss';
import CopyToClipboard from 'components/CopyToClipboard';
import PreviewPageUrl from './PreviewPageUrl';
// import Page from 'components/Page';
import { BooleanInput, Option } from 'components/PropertyEditor/PropertyEditor';
import Comment from 'components/Comment';
import Icon from 'components/Icon';
import Link from 'components/Link';
import Button from 'components/Buttons/Button';
import VideoThumbnailSelector from "./VideoThumbnailSelector";
import ProjectPreview from './ProjectPreview';


export default class PublishProjectPage extends React.Component {
  componentWillMount() {
    if (!this.props.project) {
      this.props.updatePageLoadingState(true);
    }
    this.props.viewProjectSettingsPage(this.props.match.params.projectId);
  }

  updateProject = data => {
    const {
      updateProject,
      project: { id }
    } = this.props;
    updateProject({
      id,
      ...data
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {saveProject, project} = this.props;
    saveProject(project);
  };

  get isPublished() {
    return !!this.props.project.published_at;
  }

  handleBoolChange = (val, key) => {
    const value = val ? 1 : 0;
    this.handleChange(value, key);
  };

  handleChange = (val, key) => {
    this.updateProject({
      [key]: val,
      id: this.props.project.id
    });
  };

  renderLastUpdated() {
    const {
      project: { published_at }
    } = this.props;

    if (!published_at) {
      return <div>This project hasn't been published yet.</div>;
    }

    return (
      <p style={{ marginTop: '-10px' }}>
        <small>
          Last published <RelativeDate date={published_at} />
        </small>
      </p>
    );
  };

  render() {
    const { project, embedCode, updatePageLoadingState, projectGroups } = this.props;

    if (!project) {
      return null;
    }

    if (project) {
      //  Add a little delay here makes the UI nicer and the loade
      setTimeout(() => {
        updatePageLoadingState(false);
      }, 1000);
    }

    return  null;
      // <ProjectPage header={"Publishing"} headerInfo={<Link>Watch the training</Link>} project={project} projectGroups={projectGroups} active="publishing">
      //   <div className="grid" style={{marginLeft:'20px'}}>
      //     <div className="col10" >
      //       <h3  className="form-heading"style={{marginTop: 0}}>Publish Project</h3>
      //       <p>
      //         <strong>{this.renderLastUpdated()}</strong>
      //       </p>
      //       <div className="grid">
      //         <div className="col6">
      //           {this.isPublished ? (
      //               <div className="form-control">
      //                 <h4 className="faded-heading">Embed Code</h4>
      //                 <CopyToClipboard value={embedCode} />
      //               </div>
      //           ) : (
      //               <div className="form-control">
      //                 <p>
      //                   <em>Publish Project To View Your Embed Code</em>
      //                 </p>
      //               </div>
      //           )}
      //           <PublishButton projectId={project.id} isPublished={this.isPublished} unpublishOption={true}>Publish</PublishButton>
      //         </div>
      //         <div className="col6">
      //           <p>
      //             Publishing your project will create a live version of your project that you can view by embedding your{' '}
      //             <u>Embed Code</u> in your website or viewing your <u>Preview Page Url</u>.
      //           </p>
      //           <p>
      //             You can remove the live version of your project by clicking the <u>Unpublish button</u> below.
      //           </p>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </ProjectPage>
    //);
  }
}
