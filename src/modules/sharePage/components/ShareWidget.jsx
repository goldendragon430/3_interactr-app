import {generateShareIcon, ShareButtons, ShareCounts} from "react-share";
import styles from "./sharePage.module.scss";
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const LinkedinIcon = generateShareIcon('linkedin');
const RedditIcon = generateShareIcon('reddit');
const EmailIcon = generateShareIcon('email');


const ShareWidget = () => {
  const {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    RedditShareButton,
    EmailShareButton
  } = ShareButtons;

  const { FacebookShareCount, LinkedinShareCount, RedditShareCount } = ShareCounts;

  const { projectName } = this.props;
  const getCurrentDomainName = () => {
    return window.host;
  };

  return (
    <div style={{ float: 'left' }}>
      <ul className={styles.social}>
        <li style={{ height: '22px' }}>
            <span className={styles.shareCounter}>
              <strong>Share:</strong>
            </span>
        </li>
        <li>
          <FacebookShareButton url={window.location.href} quote={projectName} hastag={'#InteractiveVideo'}>
              <span className={styles.shareIcon}>
                <FacebookIcon size={25} round={true} />
              </span>
            <span className={styles.shareCounter}>
                <FacebookShareCount url={window.location.href} />
              </span>
          </FacebookShareButton>
        </li>
        <li>
          <TwitterShareButton
            url={window.location.href}
            title={projectName}
            via={this.getCurrentDomainName()}
            hastags={['#InteractiveVideo']}
          >
              <span className={styles.shareIcon}>
                <TwitterIcon size={25} round={true} />
              </span>
          </TwitterShareButton>
        </li>
        <li>
          <LinkedinShareButton url={window.location.href} title={projectName} description="Interactive Video">
              <span className={styles.shareIcon}>
                <LinkedinIcon size={25} round={true} />
              </span>
            <span className={styles.shareCounter}>
                <LinkedinShareCount url={window.location.href} />
              </span>
          </LinkedinShareButton>
        </li>
        <li>
          <RedditShareButton url={window.location.href} title={projectName}>
              <span className={styles.shareIcon}>
                <RedditIcon size={25} round={true} />
              </span>
            <span className={styles.shareCounter}>
                <RedditShareCount url={window.location.href} />
              </span>
          </RedditShareButton>
        </li>
        <li>
          <EmailShareButton url={window.location.href} subject={projectName} body="Interactive Video">
              <span className={styles.shareIcon}>
                <EmailIcon size={25} round={true} />
              </span>
          </EmailShareButton>
        </li>
      </ul>
    </div>
  );
};