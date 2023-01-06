import React from 'react';
import styles from "./sharePage.module.scss";
import Button from "../../../components/Buttons/Button";
import RelativeDate from "../../../components/date/RelativeDate";
import {useNavigate} from "react-router-dom";
import {sharePath} from "../../../routeBuilders";
import {Divider} from "../../../components/Divider";

const MoreVideos = ({project}) => {
    const user = project.user;
    const {logo, name, company_name} = user;
    const headingStyle = logo ? {} : { paddingLeft: 0 };
    let videos = project.otherVideos && project.otherVideos.length ? project.otherVideos : [];

    return (
        <div className={styles.moreVideos}>
           <Divider text="More From" />
            <h3 className={styles.brandText} style={headingStyle}>
                <span className={styles.brandTextContainer}>
                    {logo && <img src={logo} className={styles.brand} />}
                    {company_name || name}
                </span>
            </h3>
            <div className="grid" style={{marginLeft: 0, justifyContent: 'center'}}>
                <VideosList videos={videos} logo={logo} />
            </div>
         </div>
    );
};
export default MoreVideos;

const VideosList  = ({videos, logo}) => {
    const navigate = useNavigate();
    
    const handleViewClicked = (storagePath) => {
        const hash = storagePath.split("/")[1];        
        navigate( '/share/' + hash );
    }
    return videos.length ? (
        videos.map(video => {

            return (
                <div className={styles.videoCard}>
                    <a className={styles.otherVideo} href={videos.published_path} key={video.id}>
                        <div className={styles.otherVideoThumb}>
                            <div className={styles.overlay}>
                                <Button
                                    secondary
                                    icon="eye"
                                    onClick={() => handleViewClicked(video.storage_path)}
                                >
                                    View
                                </Button>
                            </div>
                            <img src={video.image_url} className={styles.videoImage} />
                        </div>
                        <div className={styles.otherVideoMeta}>
                            <h4>{video.title}</h4>
                            <p>
                                <RelativeDate date={video.created_at} />
                            </p>
                            <div className={styles.otherVideoLogo}>{logo && <img src={logo} />}</div>
                        </div>
                    </a>
                </div>
            );
        })
    ) : (
        <p>No Videos</p>
    )
};