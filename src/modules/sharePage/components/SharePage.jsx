import React, { useEffect } from 'react';
import {useParams, useLocation} from 'react-router-dom';
import {useURLQuery} from "../../../graphql/utils";
import { publishedProjectUrl } from 'modules/project/utils';
import styles from './sharePage.module.scss';
import ReactTooltip from 'react-tooltip';
import ShareMeta from './ShareMeta';
import SharePagePlayer from './SharePagePlayer';
import AppLogo from '../../../components/AppLogo';
import Comments from "./Comments";
import {useSharepage} from "../../../graphql/Project/hooks";
import PageLoader from "../../../components/PageLoader";
import {hexToRgb} from "../../../utils/helpers";
import getAsset from "../../../utils/getAsset";
import MoreVideos from "./MoreVideos";
import ErrorMessage from "../../../components/ErrorMessage";
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../../../graphql/LocalState/whitelabel";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

/**
 * The project share page is a public page for users to share their interactive
 * videos. Users will not be authenticated on this page so use the project hash for authenticating
 * changes against this project instead of any user token
 * @returns {*}
 * @constructor
 */
 const PLAYER_QUERY = gql`
  query playerVersion {
      result: playerVersion {
          id,
          version_id
      }
  }
`;

const SharePage = ()=>{
  const {projectHash} = useParams();
  const location = useLocation();
  const [project, _, {loading, error}] = useSharepage(projectHash);
  // const whitelabel = useWhitelabel();
  const query = useURLQuery();
  const screenshot = query.get('screenshot');
  const whitelabel = useReactiveVar(getWhitelabel);
  const player = useQuery(PLAYER_QUERY);

  if(loading || player.loading) return <PageLoader/>;

  if(error) return <ErrorMessage error={error} />;
  if(player.error) return <ErrorMessage error={player.error} />;
  
  const {title, description, google_image_url, facebook_image_url, twitter_image_url, allow_comments, hide_logo, show_more_videos_on_share_page, image_url, embed_width} = project;

  const projectImageUrl = image_url || getAsset('/img/no-thumb.jpg');

  let background = (whitelabel) ? whitelabel.background_colour : 'rgba(24, 48, 85, 0.95)';

  if(background && background.startsWith('#')) {
    background = hexToRgb(background);
  }

  let customStyles = {
    background: `linear-gradient(${background},${background}), url("${getAsset('/img/home-office.jpg')}") no-repeat center`
  };

  return (
    <div className={styles.pageWrapper}>
      <ShareMeta
        title={title}
        description={description}
        googleImage={google_image_url}
        facebookImage={facebook_image_url}
        twitterImage={twitter_image_url}
        url={location.href}
      />

      <div className={styles.topWrapper} style={customStyles}>
        <img src={getAsset('/img/img-wave-zig.png')} className={styles.divider} />

        {/* TODO may look later at implementing this */}
        {/*<div className="shape shape-style-1 shape-default shape-skew ">*/}
        {/*  <span/>*/}
        {/*  <span/>*/}
        {/*  <span/>*/}
        {/*  <span/>*/}
        {/*  <span/>*/}
        {/*  <span/>*/}
        {/*  <span/>*/}
        {/*  <span/>*/}
        {/*  <span/>*/}
        {/*</div>*/}

        <Logo />

        <StatsSection />

        {screenshot ? (
          <div className={styles.top}>
          <div className={embed_width == "720" ? styles.container : embed_width == "540" ? styles.container43 : styles.container916} style={{ textAlign: 'center', maxHeight: width}}>
            <img src={projectImageUrl} className={styles.thumbnail} />
          </div>
        </div>
        ) : <EmbedCode project={project} player={player.data.result}/>}
        {/* <EmbedCode project={project} /> */}
      </div>


      <div className={styles.bottomWrapper}>
        <div className={styles.bottom}>
          <Meta project={project}/>

          {!!allow_comments && <Comments project={project}/>}

          {!!show_more_videos_on_share_page && <MoreVideos project={project} /> }
        </div>
      </div>
    </div>
  );
};
export default SharePage;

/**
 * Loads in the interactive video embed code
 * @returns {*}
 * @constructor
 */
const EmbedCode = ({project, player})=>{
  //

  // Not sure this is needed will leave here in case of issues
  // let url = publishedProjectUrl(project);
  // const urlSplit = window.location.href.split('/');
  // if (urlSplit[2] === '0.0.0.0:9198') {
  //   // remove the https when local or this wont work
  //   url = url.replace('https', 'http');
  // }
  const { embed_width } = project;

  return (
    <div className={styles.top}>
      <div className={embed_width == "720" ? styles.container : embed_width == "540" ? styles.container43 : styles.container916 }>
        <SharePagePlayer project={project} player={player}/>
      </div>
    </div>
  );
};

/**
 * Renders the appropriate logo at the header of the page, this
 * can be hidden in the users settings or could be a whitelabel
 * logo
 * @returns {*}
 * @constructor
 */
const Logo = () => {
  return(
    <div className={styles.header}>
      <AppLogo />
    </div>
  );
};

/**
 * Display the project headline. User can override this with the
 * share_page_headline, if this doesn't exist we use the project
 * headline.
 * @param project
 * @returns {*}
 * @constructor
 */
const Headline = ({project}) => {
  const headline = project.share_page_headline ?? project.title;

  return(
    <div className={styles.headline}>
      <h1>{headline}</h1>
    </div>
  );
};

/**
 * Render a stat section that allows viewer to like
 *  the video
 * @returns {null|*}
 * @constructor
 */
const StatsSection = () => {
  return null;

  return(
    <div className={styles.stats}>
      {/*<RelativeDate date={created} />*/}
      <ReactTooltip />
      {/*{this.renderShareSection()}*/}
      <ul className={styles.share}>
        {/* <li data-tip="Plays">
                      <Icon icon="play" />
                      <StatItem projectId={projectId} />
                    </li> */}
        {/*<LikeWidget likes={project.likes} />*/}
        {/*{!!allow_comments && <CommentsWidget projectId={project.id} />}*/}
      </ul>
    </div>
  );
};

/**
 * Render the description. User can override the in app project description with
 * the share_page_description prop
 * @param project
 * @returns {null|*}
 * @constructor
 */
const Description = ({project}) => {
  const description = project.share_page_description ?? project.description;

  if(!description) return null;

  return(
    <div className={styles.description}>
      <h3>{description}</h3>
    </div>
  );
};

/**
 * Render the meta section of the page. this has the headline and description of the project
 * @param project
 * @returns {*}
 * @constructor
 */
const Meta = ({project}) => {
  return (
    <div className={styles.meta}>
      <Headline project={project} />
      <Description project={project} />
    </div>
  );
};