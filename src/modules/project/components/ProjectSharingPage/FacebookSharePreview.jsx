import styles from "./FacebookSharePreview.module.scss";
import Icon from "../../../../components/Icon";
import React from "react";
import cx from 'classnames'
import {useAuthUser} from "../../../../graphql/User/hooks";
import ContentLoader from "react-content-loader";
import {avatar} from "../../../../utils/helpers";

const FacebookSharePreview = ({shareLink, domain, project}) => {

  const user  = useAuthUser();

  return(
    <div className={styles.facebook_wrapper}>
      <div className={cx(styles.facebook_header, 'clearfix')}>
        <Avatar  user={user}/>
        <div style={{float: 'left'}}>
          <p className={'m-0 ml'} style={{marginTop: '3px', marginBottom: '2px', textTransform: 'capitalize'}}>{user.name}</p>
          <p className={'m-0 ml'}><small style={{color: 'rgb(176, 179, 184)'}}>6 mins &middot; <Icon name={'lock'} /></small></p>
        </div>
        <div className={styles.ellipsis}>
          <Icon name={'ellipsis-h'} />
        </div>
      </div>
      <div className={styles.url}>
        <a href={shareLink}>{shareLink}</a>
      </div>
      <div style={{marginLeft: '-20px', marginRight: "-20px"}}>
        <img src={project.image_url} className={'img-fluid'}/>
      </div>
      <div className={styles.details}>
        <p style={{textTransform: 'uppercase', color: 'rgb(176, 179, 184)'}}>{domain}</p>
        <p style={{padding:'5px 0', fontSize: '18px'}}>{project.title}</p>
        <p className={styles.facebook_description}>{project.description}</p>
      </div>
      <div className={cx('grid', styles.meta)} style={{textAlign: 'center'}}>
        <div className={'col4'}>
          <Icon name={'thumbs-up'} /> Like
        </div>
        <div className={'col4'}>
          <Icon name={'comment'} /> Comment
        </div>
        <div className={'col4'}>
          <Icon name={'share'} /> Share
        </div>
      </div>
      <div className={'clearfix'} style={{paddingTop: '12px', borderTop: '1px solid #3F4042'}}>
        <div className={styles.facebook_avatar} style={{position: 'absolute', left: '15px'}}>
          <img
            src={avatar(user)}
          />
        </div>
        <div className={styles.comment}>
          Write Comment...
          <div className={styles.comment_icons}>
            <Icon name={'smile'} />
            <Icon name={'camera'} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default FacebookSharePreview;

const Avatar = ({user}) => {
  return(
    <div className={styles.facebook_avatar}>
      <img src={avatar(user)} />
      <div className={styles.online_indicator}>
        &nbsp;
      </div>
    </div>
  )
}