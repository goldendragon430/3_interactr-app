import React from 'react';
import styles from './SharingOnPlayerTabs.module.scss';
import cx from 'classnames';
import Icon from '../../../../components/Icon';
import { BooleanInput, Option, TextInput } from '../../../../components/PropertyEditor';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";

const SharingOnPlayerTabs = ({ project, updateProject }) => {
  const handleShareDataChange = (val, key) => {
    const { share_data, id } = project;
    const value = typeof val === 'boolean' ? (val ? 1 : 0) : val;

    updateProject({
      id: id,
      share_data: { ...share_data, [key]: value }
    });
  };

  const tabAnimation = {
    animate: {y: 0, opacity: 1},
    initial: {y:25, opacity: 0},
    transition: { type: "spring", duration: 0.2, bounce: 0.5, damping: 15}
  };

  return (
    <div className="grid">
      <div className="col12">
        <Option
          label="Allow Video to be shared?"
          value={project.allow_share}
          Component={BooleanInput}
          onChange={val=>updateProject('allow_share', val)}
          helpText="When enabled a share icon will show in the player controls and users will be able to post the video to social media via the share page"
        />
      </div>

      {
        (!!project.allow_share &&
      <AnimatePresence>
        <motion.div {...tabAnimation}>
              <Tabs defaultTab="facebook"  selectedTabClassName={styles.active}>
                <TabList className={cx('react-tabs__tab-list', styles.tabList)}>
                  <Tab>
                    <h4 >
                      <Icon icon={['fab', 'facebook']} /> Facebook
                    </h4>
                  </Tab>
                  <Tab>
                    <h4>
                      <Icon icon={['fab', 'linkedin-in']} /> LinkedIn
                    </h4>
                  </Tab>
                  <Tab>
                    <h4 >
                      <Icon icon={['fab', 'twitter']} /> Twitter
                    </h4>
                  </Tab>
                  <Tab>
                    <h4 >
                      <Icon icon={['fab', 'pinterest-p']} /> Pinterest
                    </h4>
                  </Tab>
                  <Tab>
                    <h4>
                      <Icon icon={'at'} /> Email
                    </h4>
                  </Tab>
                </TabList>

                <TabPanel>
                  <SharingPlatformOptions
                    project={project}
                    platformName="facebook"
                    onShareDataChange={handleShareDataChange}
                  />
                </TabPanel>

                <TabPanel >
                  <SharingPlatformOptions project={project} platformName="linkedin" onShareDataChange={handleShareDataChange}>
                    <Option
                      label="Title"
                      value={project.share_data.linkedin.title}
                      Component={TextInput}
                      onChange={(e, val) =>
                        handleShareDataChange({ ...getProjectShareData(project, 'linkedin'), title: val }, 'linkedin')
                      }
                    />
                  </SharingPlatformOptions>
                </TabPanel>

                <TabPanel>
                  <SharingPlatformOptions
                    project={project}
                    platformName="twitter"
                    onShareDataChange={handleShareDataChange}
                  />
                </TabPanel>

                <TabPanel>
                  <SharingPlatformOptions
                    project={project}
                    platformName="pinterest"
                    onShareDataChange={handleShareDataChange}
                  />
                </TabPanel>

                <TabPanel>
                  <SharingPlatformOptions project={project} platformName="email" onShareDataChange={handleShareDataChange}>
                    <Option
                      label="Email Subject"
                      value={project.share_data.email.subject}
                      Component={TextInput}
                      onChange={(e, val) =>
                        handleShareDataChange({ ...getProjectShareData(project, 'email'), subject: val }, 'email')
                      }
                    />
                    <Option
                      label="Email Body"
                      value={project.share_data.email.body}
                      Component={TextInput}
                      onChange={(e, val) =>
                        handleShareDataChange({ ...getProjectShareData(project, 'email'), body: val }, 'email')
                      }
                    >
                      <small>Use the shortcut <strong> &#123;share_page_url&#125; </strong> inside the link to automatically inject your share page url</small>
                    </Option>
                  </SharingPlatformOptions>
                </TabPanel>
              </Tabs>
        </motion.div>
      </AnimatePresence>
      )}
    </div>
  );
};

function SharingPlatformOptions({ children, project, platformName, onShareDataChange }) {
  const projectShareData = getProjectShareData(project, platformName) || {};


  const tabAnimation = {
    animate: {y: 0, opacity: 1},
    initial: {y:25, opacity: 0},
    transition: { type: "spring", duration: 0.2, bounce: 0.5, damping: 15}
  };

  return (
    <React.Fragment>
      <AnimatePresence>
        <motion.div {...tabAnimation}>
          <Option
            label={`Allow Share Via ${platformName[0].toUpperCase() + platformName.substr(1)}?`}
            value={projectShareData ? projectShareData.use : false}
            Component={BooleanInput}
            onChange={(val) => onShareDataChange({ ...projectShareData, use: val }, platformName)}
          />
          {
            (projectShareData && !!projectShareData.use &&  <AnimatePresence>
              <motion.div {...tabAnimation}>
                <Option
                  label="Tooltip Text"
                  value={projectShareData ? projectShareData.text : platformName}
                  Component={TextInput}
                  onChange={(val) => onShareDataChange({ ...projectShareData, text: val }, platformName)}
                />
                {children}
              </motion.div>
            </AnimatePresence>)
          }
        </motion.div>
      </AnimatePresence>
    </React.Fragment>
  );
}

function getProjectShareData(project, platformName) {
  if (project && !project.legacy && project.share_data && project.share_data[platformName])
    return project.share_data[platformName];
  else return {};
}

export default SharingOnPlayerTabs;