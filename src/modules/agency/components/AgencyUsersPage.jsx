import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import {useAuthUser} from "../../../graphql/User/hooks";
import ErrorMessage from "../../../components/ErrorMessage";
import Icon from 'components/Icon';
import React, {useEffect} from 'react';
import UserManagement from "../../user/components/UserManagement";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../dashboard/routes";
import Button from "../../../components/Buttons/Button";
import CreateUserButton from "../../user/components/CreateUserButton";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";

const AgencyUsersPage  = () => {

  setBreadcrumbs([
    {text: 'Agency', link: '/agency/dashboard'},
    {text: 'Manage Access'}
  ]);

  setPageHeader('Manage Access')

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <AgencyUsersPageBody />
      </motion.div>
    </AnimatePresence>
  )
};
export default AgencyUsersPage;

const AgencyUsersPageBody = ()=>{

  const user = useAuthUser();

    return (
        <div style={{ padding: '0px 30px' }}>
            <div className={'grid'} style={{maxWidth: '1460px'}}>
                <div className={'col11'} style={{marginBottom:'15px'}}>
                  <h1 style={{marginTop: 0}}>Manage Sub User Access</h1>
                  <p style={{maxWidth:'1000px'}}>
                    Manage Sub User access to your Interactr Agency account below. You can create your clients as users
                    to allow them to access there Interactr projects that you create for them. Your sub users can then login the
                    app using your custom branding on your custom domain name. Sub Users can't create there own projects and will only
                    be able to access the projects you assign to them.
                  </p>
                  <CreateUserButton />
                </div>
            </div>

          <div style={{marginLeft: '-15px'}}>
            <UserManagement
              users={user.subusers}
              isAdminPage={false}
              isAgencyPage={true}
              width={700}
              height={650}
            />
          </div>
        </div>
    )
};