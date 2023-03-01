import PropTypes from 'prop-types';
import React from 'react';
import Player from 'react-player';

const props = {
	url: PropTypes.string,
	videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	imageURL: PropTypes.string,
	// ... and all the supported react-player props https://github.com/CookPete/react-player
};
export default function VideoPlayer({
	videoId,
	url,
	imageURL,
	controls,
	...restOfProps
}) {
	// getVimeoUrl(url) {
	//   const split = url.split('/');
	//   return 'https://player.vimeo.com/video/' + split[3];
	// }
	return (
		<div className='embed-responsive'>
			<div className='embed-responsive-item'>
				{imageURL ? (
					<img src={imageURL} className={'img-fluid'} />
				) : (
					<Player
						key={videoId}
						// ref={(ref) => (this.videoNode = ref)}
						width={'100%'}
						height={'100%'}
						controls={controls}
						playsInline
						url={url}
						config={{
							youtube: { preload: true, playerVars: { modestbranding: 1 } },
							vimeo: { preload: true },
							file: { attributes: { download: false } },
						}}
						{...restOfProps}
					/>
				)}
			</div>
		</div>
	);
}
VideoPlayer.propTypes = props;
