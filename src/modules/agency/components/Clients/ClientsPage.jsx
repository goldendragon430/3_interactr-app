import { AnimatePresence, motion } from "framer-motion";
import React from 'react';
import { animationState, preAnimationState, transition } from "../../../../components/PageBody";
import { setBreadcrumbs } from "../../../../graphql/LocalState/breadcrumb";
import { setPageHeader } from "../../../../graphql/LocalState/pageHeading";
import PageBody from "./PageBody";

const ClientsPage = () => {
  // Used to disable the form on saving state

  setBreadcrumbs([
    {text: 'Agency', link: '/agency/dashboard'},
    {text: 'Clients'},
  ]);

  setPageHeader('Manage Your Clients');

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <div style={{ padding: '0px 30px' }}>
          <PageBody />
        </div>
      </motion.div>
    </AnimatePresence>
  )
};

export default ClientsPage;
