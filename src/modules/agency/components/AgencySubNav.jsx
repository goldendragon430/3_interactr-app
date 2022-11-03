import React from 'react';
import SubNav from "../../../components/SubNav";
import {
    AgencyAppSetupPath, AgencyClientsPagePath,
    agencyConsultingKitPath,
    agencyPath,
    agencyUsersPath, interactiveVideosPath, landingPagesPath, leadsPath,
} from "../routes";
import {useAuthUser} from "../../../graphql/User/hooks";

const AgencySubNav = () => {
    const authUser = useAuthUser();

    const items = [
        {
            text: 'Agency Dashboard',
            to: agencyPath(),
            icon: 'house-user',
            end: true
        },
        {
            text: 'Clients',
            to: AgencyClientsPagePath({clientId: authUser.subusers.length ? authUser.subusers[0].id : 0}),
            icon:'users'
        },
        // {
        //     text: 'Leads',
        //     to: leadsPath(),
        //     icon:'users'
        // },
        {
            text: 'Interactive Videos',
            to: interactiveVideosPath(),
            icon:'film'
        },
        {
            text: 'Landing Pages',
            to: landingPagesPath(),
            icon:'browser'
        },
        {
            text: 'App Setup',
            to: AgencyAppSetupPath(),
            icon: 'globe',
        },
        {
            text: 'Access',
            to: agencyUsersPath(),
            icon:'key'
        },
        {
            text: 'Consultant Kit',
            to: agencyConsultingKitPath(),
            icon :'suitcase'
        },
    ];

    return <SubNav items={items} />
};

export default AgencySubNav;