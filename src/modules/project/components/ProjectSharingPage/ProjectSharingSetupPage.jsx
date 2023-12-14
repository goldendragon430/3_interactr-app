import React, {useState, useEffect} from 'react'
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../../dashboard/routes";
import {projectsPath} from "../../routes";
import {useProjectCommands} from "../../../../graphql/Project/hooks";
import {BooleanInput, Option} from "../../../../components/PropertyEditor";
import Button from "../../../../components/Buttons/Button";
import {errorAlert} from "../../../../utils/alert";
import ErrorMessage from "../../../../components/ErrorMessage";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import ContentLoader from "react-content-loader";
import {useParams} from "react-router-dom";
import ProjectSharePageScreenshot from "../ProjectSharePageScreenshot";
import PreviewPageUrl from "../PreviewPageUrl";
import {toast} from 'react-toastify'

const QUERY = gql`
    query project($projectId: ID!) {
        result: project(id: $projectId) {
            id
            published_at
            share_data
            is_public
            show_more_videos_on_share_page
            allow_comments
            share_page_screenshot
            storage_path
        }
    }
`
const ProjectSharingSetupPage = () => {

  useEffect(()=>{
    setBreadcrumbs([
      {text: 'Dashboard', link: dashboardPath()},
      {text: 'Projects', link: projectsPath()},
      {text: 'Project Share Page Setup'},
    ]);
  }, [])

  const {projectId} = useParams();

  const {data, loading, error} = useQuery(QUERY, {
    variables: {
      projectId: parseInt(projectId)
    }
  });

  if(error) {
    return <ErrorMessage error={error} />
  }

  if(loading) {
    return(
      <ContentLoader
        speed={3}
        width={1190}
        height={800}
        viewBox={`0 0 1190 800`}
        backgroundColor="#f3f6fd"
      >
        {/* Share page url */}
        <rect x="0" y="0" rx="3" ry="3" width={600} height={50} />
        <rect x="0" y="60" rx="3" ry="3" width={100} height={30} />

        {/* Text INput */}
        <rect x="0" y="125" rx="3" ry="3" width={600} height={50} />
        <rect x="0" y="185" rx="3" ry="3" width={50} height={30} />

        {/* Text INput */}
        <rect x="0" y="225" rx="3" ry="3" width={600} height={50} />
        <rect x="0" y="285" rx="3" ry="3" width={50} height={30} />


        {/* Text INput */}
        <rect x="0" y="325" rx="3" ry="3" width={600} height={50} />
        <rect x="0" y="385" rx="3" ry="3" width={50} height={30} />

        {/* Save button */}
        <rect x="0" y="450" rx="3" ry="3" width={250} height={50} />


        {/* Facebook Preview */}
        <rect x="725" y="0" rx="3" ry="3" width={400} height={475} />
      </ContentLoader>
    )
  }

  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
        style={{paddingLeft: '30px'}}
      >
        <section>
          <Form project={data.result} />
        </section>
      </motion.div>
    </AnimatePresence>
  )
}
export default ProjectSharingSetupPage;

const Form = ({project}) => {
  const [saving, setSaving] = useState(false);
  const {updateProject, saveProject} = useProjectCommands(project.id);
  const [previewState,setPreviewState] = useState(0)
  
  const handleSaveProject = async () => {
    setSaving(true)

    try {
      await saveProject({
        variables: {
          input: {
            id: project.id,
            is_public: project.is_public,
            show_more_videos_on_share_page: project.show_more_videos_on_share_page,
            allow_comments: project.allow_comments
          }
        }
      });
      toast.success("Success")
      setPreviewState(previewState => (previewState + 1))
      setSaving(false)
    }
    catch(err){
      console.error(err)
      errorAlert({text: "Unable to save Project"});
      setSaving(false)
    }
  };

  return (
    <div className={'grid'}>
      <div className={'col6'}>
        <PreviewPageUrl project={project}  />

        <h4 className="faded-heading" style={{ marginTop: '15px', marginBottom: '5px' }}>
          Other Videos
        </h4>
        <Option
          label="Show this video on other share pages"
          value={project.is_public}
          Component={BooleanInput}
          onChange={(val) => updateProject({'is_public': val})}
          helpText="When your project is inside a folder this video will only show on other projects share pages in the same folder."
        />

        <Option
          label="Show other videos on this share page"
          value={project.show_more_videos_on_share_page}
          Component={BooleanInput}
          onChange={(val) => updateProject({'show_more_videos_on_share_page': val})}
          helpText=" When your project is inside a folder only other projects in that folder will be shown on the share page."
        />

        <Option
          label="Allow Comments?"
          value={project.allow_comments}
          Component={BooleanInput}
          onChange={(val) => updateProject({'allow_comments': val})}
        />

        <Button icon={'save'} primary loading={saving} onClick={handleSaveProject}>Save Changes</Button>
      </div>
      <div className={'col6'}>
        <ProjectSharePageScreenshot project={project} previewState = {previewState} />
      </div>
    </div>
  )
};
