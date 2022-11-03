import React from "react";
import axios from "axios";

const LikeWidget = ()=>{
  const unlike = () => {
    const url = config.BACKEND.API + 'unlike/' + this.state.projectHash;

    axios
      .get(url)
      .then(response => {
        this.props.updatePageLoadingState(false);
        const data = response.data;
        window.localStorage.removeItem('interactr2-' + this.state.projectHash + '-liked');
        this.setState({ liked: false });
        this.setState({ likes: data.likes });
      })
      .catch(() => {
        this.props.updatePageLoadingState(false);
        error({ text: 'Unable to get data' });
      });
  };

  const like = () => {
    const url = config.BACKEND.API + 'like/' + this.state.projectHash;

    axios
      .get(url)
      .then(response => {
        this.props.updatePageLoadingState(false);
        const data = response.data;
        window.localStorage.setItem('interactr2-' + this.state.projectHash + '-liked', true);
        this.setState({ liked: true });
        this.setState({ likes: data.likes });
      })
      .catch(() => {
        this.props.updatePageLoadingState(false);
        error({ text: 'Unable to get data' });
      });
  };

  const hasLikedThis = () => {
    if (this.state.liked) return true;

    const hasLikedBefore = window.localStorage.getItem('interactr2-' + this.state.projectHash + '-liked');

    return hasLikedBefore;
  };



  return(
    <li data-tip="Likes" style={{cursor:'pointer'}}>
      {this.hasLikedThis() ? (
        <Icon icon={['fas', 'heart']} onClick={() => this.unlikeThis()} />
      ) : (
        <Icon icon='heart' onClick={() => this.likeThis()} />
      )}

      {likes}
    </li>
  );
};
export default LikeWidget;