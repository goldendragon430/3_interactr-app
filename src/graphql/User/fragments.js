import {gql} from "@apollo/client";

/**
 * Field fragment for the user
 * @type {DocumentNode}
 */
export const USER_FRAGMENT = gql`
    fragment UserFragment on User {
        id
        name
        email
        password
        company_name
        logo
        hide_logo_on_share_page
        avatar_url
        is_club
        is_agency
        read_only
        max_projects
        projects
        is_agency_club
        is_pro
        api_key
        upgraded
        subusers {
            id
            name
            email
            parent_user_id
            projects
            logo
            company_name
            read_only
        }
        integration_youzign
        integration_zapier
        integration_mailchimp
        integration_aweber
        integration_sendlane
        integration_activecampaign
        integration_getresponse
        parent_user_id
        superuser
        parent {
            id
            name
            email
            is_club
            is_agency
            read_only
            is_agency_club
            is_pro
            integration_youzign
            integration_zapier
            integration_mailchimp
            integration_aweber
            integration_sendlane
            integration_activecampaign
            integration_getresponse
        }
    }
`;

/**
 * Field fragment for the user
 * @type {DocumentNode}
 */
export const SUBUSER_FRAGMENT = gql`
    fragment SubUserFragment on User {
        id
        name
        email
        password
        read_only
        logo
        projects
        company_name
        avatar_url
        last_login
    }
`;