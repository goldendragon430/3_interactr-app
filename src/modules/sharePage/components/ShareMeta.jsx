import React from 'react';
import Helmet from 'react-helmet';

export default class ShareMeta extends React.Component {
  render(){
    return null; // moved this to backend
    // const {title, description, googleImage, facebookImage, twitterImage, url} = this.props;

    // const metaTags = [
    //   { itemprop: 'name', content: title },
    //   { itemprop: 'description', content: description },
    //   { itemprop: 'image', content: googleImage },
    //   { name: 'description', content: description },
    //   { name: 'twitter:card', content: 'summary_large_image' },
    //   { name: 'twitter:title', content: title },
    //   { name: 'twitter:description', content: description },
    //   { name: 'twitter:image:src', content: twitterImage },
    //   { name: 'og:title', content: title },
    //   { name: 'og:type', content: 'article' },
    //   { name: 'og:url', content: url },
    //   { name: 'og:image', content: facebookImage },
    //   { name: 'og:description', content: description },
    //   { name: 'og:site_name', content: title },
    // ];


    // return(
    //   <Helmet
    //     meta={metaTags}
    //   />
    // )

  }
}