import React from 'react';
import { AnimatePresence, motion } from "framer-motion";

import { Integration } from './components';
import { animationState, preAnimationState, transition } from 'components/PageBody';
import getAsset from 'utils/getAsset';
import { useAuthUser } from "@/graphql/User/hooks";
import { setBreadcrumbs } from "@/graphql/LocalState/breadcrumb";
import { accountPath } from "modules/account/routes";
import { setPageHeader } from "@/graphql/LocalState/pageHeading";

/**
 * Show the all integrations for a user to edit their details
 * @returns {*}
 * @constructor
 */
export const IntegrationsPage = () => {
    const user = useAuthUser();

    setBreadcrumbs([
      {text: 'Account', link: accountPath()},
      {text: 'Integrations'},
    ]);

    setPageHeader('Manage Your Integrations')

    return (
      <AnimatePresence>
        <motion.div
          exit={preAnimationState}
          initial={preAnimationState}
          animate={animationState}
          transition={transition}
        >
          <div style={{ paddingLeft: '30px', marginBottom: '50px' }}>
        {/*<Integration*/}
        {/*  user={userData}*/}
        {/*  imageSrc={getAsset("/img/youzign.png")}*/}
        {/*  name="Youzign"*/}
        {/*  fields={{key: 'Public Key', hash: 'Token'}}*/}
        {/*  integrationType="integration_youzign"*/}
        {/*  helpText={*/}
        {/*    <div style={{textAlign: 'left', display:'block', marginTop:'-10px',  marginBottom: '15px', width: '100%',  padding: '15px'}}>*/}
        {/*      <p>*/}
        {/*        <strong>Existing Users</strong><br/>*/}
        {/*        Get your API Keys Here: <a href="https://youzign.com/account/" target="_blank">https://youzign.com/account/</a>*/}
        {/*      </p>*/}
        {/*      <p>*/}
        {/*        <strong>Not a Youzign User? </strong><br/>*/}
        {/*        Grab our special discounted membership <a href="https://jvz7.com/c/474085/286725" target="_blank">here</a>*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  }*/}
        {/*/>*/}
        <Integration
          user={user}
          imageSrc={getAsset("/img/zapier.png")}
          name="Zapier"
          fields={{default_webhook: 'Default zapier webhook'}}
          integrationType="integration_zapier"
          helpText={
            <p>
              This will be used for every form element by default, You can provide different webhooks for form elements from the node editor . <br/><br/> Details on how Zapier integration works with webhooks can be found here: <a href="https://zapier.com/page/webhooks/" target="_blank">https://zapier.com/page/webhooks/</a>.
            </p>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/mailchimp.png")}
          name="Mailchimp"
          fields={{key: 'Key'}}
          integrationType="integration_mailchimp"
          helpText={
            <p>
              Details on how to access your API key can be found here: <a href="https://mailchimp.com/help/about-api-keys/" rel="noreferrer" target="_blank">https://mailchimp.com/help/about-api-keys/</a>
            </p>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/aweber.png")}
          name="Aweber"
          showButton={true}
          buttonText="Authorize App"
          buttonClickURL="https://auth.aweber.com/1.0/oauth/authorize_app/ca3f7afa"
          fields={{token: 'Place the authorization code below.'}}
          integrationType="integration_aweber"
          helpText={
            <p>
              Simple click the authorize button to the left to get started.
            </p>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/sendlane.jpg")}
          name="Sendlane"
          fields={{key: 'API Key', hash: 'Hash Key', domain: 'Domain'}}
          integrationType="integration_sendlane"
          helpText={
            <p>
              Details on how to access your API keys can be found here: <a href="https://help.sendlane.com/article/71-how-to-find-your-api-key-api-hash-key-and-subdomain" rel="noreferrer" target="_blank">
                https://help.sendlane.com/article/71-how-to-find-your-api-key-api-hash-key-and-subdomain
              </a>
            </p>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/activecampaign.png")}
          name="Active Campaign"
          fields={{key: 'Key', url: 'URL'}}
          integrationType="integration_activecampaign"
          helpText={
            <p>
              Details on how to access your API keys can be found here: <a href="https://help.activecampaign.com/hc/en-us/articles/207317590-Getting-started-with-the-API" rel="noreferrer" target="_blank">https://help.activecampaign.com/hc/en-us/articles/207317590-Getting-started-with-the-API</a>
            </p>
          }
        />
        <Integration
          user={user}
          imageSrc={getAsset("/img/getresponse.png")}
          name="Get Response"
          fields={{key: 'Key'}}
          integrationType="integration_getresponse"
          helpText={
            <p>
              Details on how to access your API key can be found here: <a href="https://www.getresponse.com/help/glossary/api-key.html" rel="noreferrer" target="_blank">https://www.getresponse.com/help/glossary/api-key.html</a>
            </p>
          }
        />
          </div>
        </motion.div>
      </AnimatePresence>
    );
}
