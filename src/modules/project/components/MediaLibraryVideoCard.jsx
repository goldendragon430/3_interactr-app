import React from 'react';
import Card from 'components/Card';

export default class MediaLibraryVideoCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {primaryButton, onSelect, video, ...props } = this.props;

        if (!primaryButton) {
            primaryButton = {
                text: 'Select',
                icon: 'plus',
                action: () => {
                    onSelect && onSelect(video.url, video.thumbnail_url || null, video.name);
                }
            };
        }

        return (
            <Card
                primaryButton={primaryButton}
                video={video}
                title={video.name}
                description={video.description}
                previewButton={false}
                noPreview
                {...props}
            />
        )
    }
}