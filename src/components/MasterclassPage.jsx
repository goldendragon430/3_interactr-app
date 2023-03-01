import Icon from 'components/Icon';
import PageBody from 'components/PageBody';
import TrainingVideo from 'modules/training/components/TrainingVideo';
import React from 'react';
import videos from 'utils/masterclassVideos';
import LinkButton from "./Buttons/LinkButton";


export default class MasterclassPage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const {user} = this.props;

        return(
            <PageBody heading="Interactive Video Masterclass">
                {
                    (user.masterclass === 1) ?
                        <div style={{ padding: '0px' }}>
                            {videos.map(video => (
                                <TrainingVideo video={video} key={video.name} />
                            ))}
                        </div> :
                        <div style={{marginLeft: '30px'}}>
                            <h4><Icon name="lock" /> Content Locked</h4>
                            <p >
                                <LinkButton to={'/upgrade'} small primary><Icon name={'arrow-up'} /> Click Here to Upgrade</LinkButton>
                            </p>
                        </div>
                }

            </PageBody>
        );
    }
}