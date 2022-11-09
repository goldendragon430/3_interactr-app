import React, {useState} from 'react';
import {phpApi} from "../../../../utils/apis";
import {errorAlert, success} from "../../../../utils/alert";
import {Option, TextInput} from "../../../../components/PropertyEditor";
import Button from "../../../../components/Buttons/Button";
import styles from "./AgencyAppSetupPage.module.scss";
import MessageBox from "../../../../components/MessageBox";
import {cache} from "../../../../graphql/client";
import gql from "graphql-tag";
import {useAgencyCommands} from "../../../../graphql/Agency/hooks";
import Icon from "../../../../components/Icon";

const AgencyCustomDomainSetup = ({id}) => {
  return(
    <div className="grid">
      <div className="col6">
        <CustomDomain id={id}/>
      </div>

      <div className={"col5"}>
        <MessageBox>
          <h3>Step Three - Your Custom Domain Name</h3>
          <p>
            Use your custom domain name to allow your sub users to login and access the app without the interactr branding.
          </p>
          <p>
            Using your custom domain name you can also apply custom branding to your share pages, to access the URL's for these you will need to be logged into the custom domain of your app.
          </p>
          <p>
            To setup your custom domain name Create a <strong>CNAME record</strong> on your webhost from your custom subdomain to <strong>custom.interactrapp.com</strong>
          </p>
          <p>
            Then Enter your subdomain name in the custom domain field. Do not include http or /. Then hit the
            verify button , it'll let you know if you successfully set up the custom domain.
          </p>
        </MessageBox>
      </div>
    </div>
  )
};
export default AgencyCustomDomainSetup;


const CustomDomain = ({id}) => {
  const [loading, setLoading] = useState(false);

  const {saveAgency, updateAgency} = useAgencyCommands(id);

  const agency = cache.readFragment({
    id: `Agency:${id}`,
    fragment: gql`
        fragment AgencyFragment on Agency {
            id
            domain
            domain_verified
        }
    `,
  });


  const {domain, domain_verified } = agency;


  const handleVerifyDomain = async () => {
    setLoading(true);

    try {
      const response = await phpApi('domains/verify', {
        method: 'POST',
        body: {domain}
      });

      const data = await response.json();

      updateAgency('domain_verified', data.agency.domain_verified);
      success({text: 'Domain name is valid!'});
    } catch (error) {
      console.error(error)
      errorAlert({text: "Unable to verify this domain"});
    }

    setLoading(false);
  };

  const handleRemoveDomain = async  () => {
    setLoading(true);

    try {
      // await saveAgency({
      //   variables: {
      //     input: {
      //       id, domain_verified: 0, domain: ""
      //     }
      //   }
      // })
      const response = await phpApi('domains/remove', {
        method: 'POST'
      });

      const data = await response.json();
      if(data.success) {
        updateAgency('domain_verified', data.agency.domain_verified);
        updateAgency('domain', data.agency.domain);
      }
    }
    catch(e){
      console.error(e)
      errorAlert({text: 'Unable to save changes'})
    }

    setLoading(false)
  }

  return (
    <>
      <Option
        label="Custom Domain Name"
        value={domain || ''}
        Component={TextInput}
        placeholder="www.mydomainname.com"
        onChange={val=>updateAgency({domain: val})}
        disabled={domain_verified}
        onEnter={handleVerifyDomain}
      />
      <div className={'form-option clearfix'}>
        <VerificationButtons
          domain_verified={domain_verified}
          handleVerifyDomain={handleVerifyDomain}
          handleRemoveDomain={handleRemoveDomain}
          loading={loading}
        />
      </div>
      <p>
        <em>
          <u>Note: </u> If your getting an unable to load app error this means that the domain name in
          the above field does not match the domain name in the URL bar these need to be the same for it
          to work.
        </em>
      </p>
    </>
  )
}

const VerificationButtons = ({domain_verified, handleVerifyDomain, handleRemoveDomain, loading}) => {

  if(loading) return (
    <div style={{height: '36.9px'}}>
      <Icon loading />
    </div>
  );

  if(domain_verified) return (
    <Button
      icon="times"
      style={{marginTop: '0px'}}
      red
      onClick={handleRemoveDomain}
    >
      Reset Domain
    </Button>
  )

  return (
    <Button
      onClick={handleVerifyDomain}
      style={{marginTop: '0px'}}
      loading={loading}
      primary
    >
      Click to Verify Domain <Icon name={'arrow-right'} />
    </Button>
  )
}