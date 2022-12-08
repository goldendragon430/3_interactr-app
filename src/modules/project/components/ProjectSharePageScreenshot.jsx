import {phpApi} from "../../../utils/apis";
import React, {useEffect, useState} from "react";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import ContentLoader from "react-content-loader";

const ProjectSharePageScreenshot = ({project}) => {
  return (
    <>
      <h4 className="faded-heading" style={{ marginBottom: '5px' }}>
        PREVIEW
      </h4>
      <Screenshot project={project} />
    </>
  )
};
export default ProjectSharePageScreenshot;

const Screenshot = ({project}) => {

  const {getSharePageUrl, updateProject} = useProjectCommands(project.id);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const generateScreenshot = async () => {
    try {
      const sharePageUrl = getSharePageUrl(project);

      if (sharePageUrl) {
        const response = await phpApi('share-page/screenshot?screenshot', {
          method: 'POST',
          body: {
            project_id: project.id,
            share_page_url: sharePageUrl
          }
        });

        const data = await response.json();

        updateProject({
          share_page_screenshot: data.project.share_page_screenshot
        })
      }

      setLoading(false)

    } catch (e) {
      console.error(e);
      setError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    if ( project.storage_path && ! project.share_page_screenshot ) {
     generateScreenshot();
    } else {
      setLoading(false)
    }
  }, []);

  if(loading) {
    return(
      <ContentLoader
        speed={3}
        width={500}
        height={600}
        viewBox={`0 0 500 600`}
        backgroundColor="#f3f6fd"
      >
        <rect x="0" y="0" rx="3" ry="3" width={500} height={600} />
      </ContentLoader>
    )
 }

  if(error) {
    return null;
  }

  if(! project.share_page_screenshot) {
    return 'Please publish project';
  }

  return <img alt={'Share Page Screenshot'} src={project.share_page_screenshot} width="500px" height="600px"  style={{borderRadius: '10px', boxShadow: 'rgb(0 0 0 / 6%) 0px 2px 20px'}} />
};