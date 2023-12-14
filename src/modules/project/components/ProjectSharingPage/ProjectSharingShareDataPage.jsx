import React, {useEffect, useState} from 'react'
import {useProject, useProjectCommands, useSaveProject} from "../../../../graphql/Project/hooks";
import getAsset from "../../../../utils/getAsset";
import {LargeTextInput, Option, TextInput} from "../../../../components/PropertyEditor";
import styles from "./SharingProjectPage.module.scss";
import ReplaceProjectThumbnailButton from "./ReplaceProjectThumbnailButton";
import RegenerateSocialThumbnailsButton from "./RegenerateSocialThumbnailsButton";
import SharingDataTabs from "./SharingDataTabs";
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../../dashboard/routes";
import {projectsPath} from "../../routes";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import Button from "../../../../components/Buttons/Button";
import {errorAlert} from "../../../../utils/alert";
import previewStyles from './Previews.module.scss'
import Icon from "../../../../components/Icon";
import {sharePageUrl} from "../../utils";
import FacebookSharePreview from "./FacebookSharePreview";
import {useQuery, useReactiveVar} from "@apollo/client";
import {useParams} from "react-router-dom";
import ErrorMessage from "../../../../components/ErrorMessage";
import ContentLoader from "react-content-loader";
import gql from "graphql-tag";
import {getWhitelabel} from "../../../../graphql/LocalState/whitelabel";
import {toast} from 'react-toastify'

const QUERY = gql`
    query project($projectId: ID!) {
        result: project(id: $projectId) {
            id
            title
            description
            storage_path
            image_url
            facebook_image_url
            twitter_image_url
            google_image_url
        }
    }
`;
const ProjectSharingShareDataPage = () => {
  const {projectId} = useParams();

  const {data, loading, error} = useQuery(QUERY, {
    variables: {
      projectId: parseInt(projectId)
    }
  });


  useEffect(()=>{
    setBreadcrumbs([
      {text: 'Dashboard', link: dashboardPath()},
      {text: 'Projects', link: projectsPath()},
      {text: 'Project Share Page Sharing'},
    ]);
  }, [])

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
        {/* Heading */}
        <rect x="0" y="0" rx="3" ry="3" width={650} height={50} />
        {/* Description */}
        <rect x="0" y="75" rx="3" ry="3" width={650} height={300} />
        {/* Save button */}
        <rect x="0" y="400" rx="3" ry="3" width={250} height={50} />

        {/* Thumbnail */}
        <rect x="0" y="475" rx="3" ry="3" width={350} height={200} />

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
export default ProjectSharingShareDataPage;

const Form = ({project}) => {
  const [saving, setSaving] = useState(false)

  const {updateProject, saveProject} = useProjectCommands(project.id)

  const handleSaveProject = async () => {
    try {
      setSaving(true)

      await saveProject({
        variables: {
          input: {
            id: project.id,
            title: project.title,
            description: project.description
          }
        }
      });
      toast.success('Successfully Saved.')
      setSaving(false)
    }catch(err){
      setSaving(false)
      console.error(err)
      errorAlert({text: "Unable to save Project"});
    }
  };

  const projectImageUrl = project.image_url || getAsset('/img/no-thumb.jpg');

  return (
    <div className={'grid'}>
      <div className={'col6'}>
        <Option
          label="Headline"
          Component={TextInput}
          value={project.title}
          onChange={(val) => updateProject('title', val)}
        />
        <Option
          label="Description"
          Component={LargeTextInput}
          rows={8}
          value={project.description}
          onChange={(val) => updateProject('description', val)}
        />

        <div className={'mt-1 clearfix mb-2'}>
          <Button icon={'save'} primary loading={saving} onClick={handleSaveProject}>Save Changes</Button>
        </div>

        <label>Thumbnail</label>
        <img src={projectImageUrl} className={styles.thumbnail} />

        <div className="mt-1">
          <ReplaceProjectThumbnailButton />
        </div>

        <div className="mt-2">
          <label><strong>Auto Generated Thumbnails</strong></label>
          <p>
            The thumbnails below are automatically generated from the thumbnail above due to the fact these three
            platforms require the share images to be different sizes
          </p>
          <p>
            If you find the images don&apos;t match the main thumbnail then you can click &quot;regenerate&quot; to
            recreate the thumbnails.
          </p>
          <p>
            <RegenerateSocialThumbnailsButton project={project} />
          </p>
        </div>

        <div className="pb-2" style={{ minHeight: 400 }}>
          <SharingDataTabs
            projectThumbnail={project.image_url}
            facebookImageUrl={project.facebook_image_url}
            twitterImageUrl={project.twitter_image_url}
            googleImageUrl={project.google_image_url}
          />
        </div>
      </div>
      <div className={'col6'}>
        <SharePreviews project={project} />
      </div>
    </div>
  )
};

const SharePreviews = ({project}) => {
  const [url, setUrl] = useState(false)
  const whitelabel = useReactiveVar(getWhitelabel);

  useEffect(()=>{
    if (project.storage_path) {
      const _whitelabel = (whitelabel) ? whitelabel.domain : false;
      const _url = sharePageUrl(project, _whitelabel);

      setUrl( _url );
    }
  }, [whitelabel])


  return(
    <>
      <h4 className="faded-heading" style={{marginLeft: '75px'}}><Icon icon={['fab', 'facebook']} /> Facebook Preview</h4>
      <FacebookSharePreview
        shareLink={url}
        domain={(whitelabel) ? whitelabel.domain : window.location.host}
        project={project}
      />
      <TwitterSharePreview />
      <LinkedInSharePreview />
    </>
  )
}



const TwitterSharePreview = () => {
  return null;
}

const LinkedInSharePreview = () => {
  return null;
}