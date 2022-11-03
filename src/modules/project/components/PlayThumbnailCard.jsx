import React, {Component} from "react";
import styles from "modules/media/components/uploadMedia/StockListModalStyles.module.scss";
import LinkButton from "components/Buttons/LinkButton";
import Button from "components/Buttons/Button";

export default class PlayThumbnailCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {thumbnail, user, showSelectThumbnailFromVideoModal, showSelectPlayThumbnail, onSelect} = this.props;

        if (! showSelectThumbnailFromVideoModal && ! showSelectPlayThumbnail) return null;

        return (
            <div className={styles.listItem}>
                <div className={styles.playThumbnailCardlistItemInner}>
                    <div className={styles.videoHolder}>
                        <img
                            src={thumbnail.play_thumbnail_url}
                            alt="thumbnail"
                            style={{width: '100%', height: '100%'}}
                        />
                        <div className={styles.addButton}>
                            {
                                (user.is_club || user.evolution_pro) ?
                                    <Button
                                        primary
                                        noMarginRight={true}
                                        right={true}
                                        small
                                        onClick={() => onSelect({src: thumbnail.play_thumbnail_url})}
                                    >
                                        Select
                                    </Button> :
                                    <LinkButton
                                        primary
                                        noMarginRight={true}
                                        right="true"
                                        small
                                        to="/upgrade"
                                    >
                                        Upgrade
                                    </LinkButton>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}