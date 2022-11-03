import React from 'react';
import PageBody from 'components/PageBody';
import {getAcl} from "./graphql/LocalState/acl";
import {useReactiveVar} from "@apollo/client";
import {setBreadcrumbs} from "./graphql/LocalState/breadcrumb";
import {setPageHeader} from "./graphql/LocalState/pageHeading";



const UpgradePage = () => {
  const acl = useReactiveVar(getAcl);

  setBreadcrumbs([
    {text: 'Upgrade'},
  ]);

  setPageHeader('Upgrade your account')


  return (
    <PageBody >
      <div className="grid" style={{marginLeft: '30px'}}>
        <div className="w-100">
          <h3>Available Upgrades</h3>
        </div>
        <div className="w-100">
          <div>
            <h4>Interactr Pro Edition</h4>
            {(! acl.canAccessSurveys) ? <a href="https://interactrevolution.com/upgrade/pro">Upgrade Here</a> : <p>You already have Interactr Pro</p>}

            <h4>Interactr Agency Club</h4>
            {(! acl.hasAgency) ? <a href="https://interactrevolution.com/upgrade/agency-club">Upgrade Here</a> : <p>You already have Interactr Agency Club</p>}
          </div>
        </div>
      </div>
    </PageBody>
  );
};
export default UpgradePage;
