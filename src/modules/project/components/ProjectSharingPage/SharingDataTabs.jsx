import React from 'react';
import styles from './SharingDataTabs.module.scss';
import Icon from '../../../../components/Icon';
import getAsset from '../../../../utils/getAsset';
import Spinner from '../../../../components/Spinner';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Image from 'components/Image';

export default function SharingDataTabs({
  loading,
  projectThumbnail,
  facebookImageUrl,
  twitterImageUrl,
  googleImageUrl,
}) {
  function SocialMediaImage({ platformImage }) {
    const noThumbImg = getAsset('/img/no-thumb.jpg');

    return (
      <Image
        src={platformImage || noThumbImg}
        width={350}
        height={196} // 350 / 16/9 to keep most used aspect ratio , helps avoid the 
        placeholderSrc={projectThumbnail}
        effect="blur"
        className={styles.thumbnail}
        alt="Project image for social media."
      />
    );
  }

  return (
    <Tabs defaultTab="facebook">
      <TabList>
        <Tab>
          <h4 className="faded-heading">
            <Icon icon={['fab', 'facebook']} /> Facebook
          </h4>
        </Tab>
        <Tab>
          <h4 className="faded-heading">
            <Icon icon={['fab', 'twitter']} /> Twitter
          </h4>
        </Tab>
        <Tab>
          <h4 className="faded-heading">
            <Icon icon={['fab', 'google']} /> Google
          </h4>
        </Tab>
      </TabList>

      <TabPanel>
        <SocialMediaImage platformImage={facebookImageUrl} />
      </TabPanel>
      <TabPanel>
        <SocialMediaImage platformImage={twitterImageUrl} />
      </TabPanel>
      <TabPanel>
        <SocialMediaImage platformImage={googleImageUrl} />
      </TabPanel>
    </Tabs>
  );
}
