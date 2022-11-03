import React from 'react';
import { AnimatePresence, motion } from "framer-motion";

import { Integration } from './components';
import { animationState, preAnimationState, transition } from 'components/PageBody';
import getAsset from "utils/getAsset";
import { useAuthUser } from "@/graphql/User/hooks";

export const SubUserIntegrationsPage = () => {
  const user = useAuthUser();

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <Integration
          user={user}
          imageSrc={getAsset("/img/zapier.png")}
          name="Zapier"
          fields={{default_webhook: 'Default zapier webhook'}}
          integrationType="integration_zapier"
          helpText={
              <div style={{textAlign: 'left', display:'block', marginTop:'-10px',  marginBottom: '15px', width: '100%', padding: '15px'}}>
                  <p>
                      This will be used for every form element by default, You can provide different webhooks for form elements from the node editor . <br/><br/> Details on how Zapier integration works with webhooks can be found here: <a href="https://zapier.com/page/webhooks/" target="_blank">https://zapier.com/page/webhooks/</a>.
                  </p>
              </div>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/mailchimp.png")}
          name="Mailchimp"
          fields={{ key: 'Key' }}
          integrationType="integration_mailchimp"
          helpText={
              <div
                  style={{
                    textAlign: 'left',
                    display: 'block',
                    marginTop: '-10px',
                    marginBottom: '15px',
                    width: '100%',
                    padding: '15px'
                  }}
              >
                  <p>
                    Details on how to access your API key can be found here:{' '}
                    <a href="https://mailchimp.com/help/about-api-keys/" target="_blank" rel="noreferrer">
                      https://mailchimp.com/help/about-api-keys/
                    </a>
                  </p>
              </div>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/sendlane.jpg")}
          name="Sendlane"
          fields={{ key: 'API Key', hash: 'Hash Key', domain: 'Domain' }}
          integrationType="integration_sendlane"
          helpText={
            <div
              style={{
                textAlign: 'left',
                display: 'block',
                marginTop: '-10px',
                marginBottom: '15px',
                width: '100%',
                padding: '15px'
              }}
            >
              <p>
                Details on how to access your API keys can be found here:{' '}
                <a href="http://help.sendlane.com/knowledgebase/api-key/" target="_blank">
                  http://help.sendlane.com/knowledgebase/api-key/
                </a>
              </p>
            </div>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/activecampaign.png")}
          name="Active Campaign"
          fields={{ key: 'Key', url: 'URL' }}
          integrationType="integration_activecampaign"
          helpText={
            <div
              style={{
                textAlign: 'left',
                display: 'block',
                marginTop: '-10px',
                marginBottom: '15px',
                width: '100%',
                padding: '15px'
              }}
            >
              <p>
                Details on how to access your API keys can be found here:{' '}
                <a
                  href="https://help.activecampaign.com/hc/en-us/articles/207317590-Getting-started-with-the-API"
                  target="_blank" rel="noreferrer"
                >
                  https://help.activecampaign.com/hc/en-us/articles/207317590-Getting-started-with-the-API
                </a>
              </p>
            </div>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/getresponse.png")}
          name="Get Response"
          fields={{ key: 'Key' }}
          integrationType="integration_getresponse"
          helpText={
            <div
              style={{
                textAlign: 'left',
                display: 'block',
                marginTop: '-10px',
                marginBottom: '15px',
                width: '100%',
                padding: '15px'
              }}
            >
              <p>
                Details on how to access your API key can be found here:{' '}
                <a href="https://www.getresponse.com/help/glossary/api-key.html" target="_blank" rel="noreferrer">
                  https://www.getresponse.com/help/glossary/api-key.html
                </a>
              </p>
            </div>
          }
        />
      </motion.div>
    </AnimatePresence>
  );
};