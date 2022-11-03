import React from 'react';
import Styles from './TrainingVideo.module.scss';

export default class TrainingVideo extends React.Component {
  getPlayLink = (link) => {
    const split = link.split('/');
    return 'https://player.vimeo.com/video/'+split[3];
  };

  render(){
    const {video} = this.props;
    const link = this.getPlayLink(video.link);
    const html = `<iframe  src="${link}" controls class="embed-responsive-item" frameborder="0" allow="autoplay *" webkitallowfullscreen mozallowfullscreen allowfullscreen ></iframe>`;
    return(
      <div className={Styles.wrapper}>
        <h3 className="faded-heading">{video.name}</h3>
        <div className="embed-responsive" dangerouslySetInnerHTML={{__html:html}}>
        </div>
        <p>{video.description}</p>
      </div>
    )
  }
}