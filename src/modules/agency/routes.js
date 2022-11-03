/**
 * Agency Paths
 * @returns {string}
 */
const baseAgencyPath = '/agency';
const agencyUsers = '/users';
const agencyAppSetup = '/app-setup';
const agencyLeads = '/leads';
const agencyLandingPages = '/landing-pages';
const agencyInteractiveVideos = '/interactive-videos';
const agencyConsultingKit = '/consulting-kit';

// Agency Home Page
export const agencyPath = () => baseAgencyPath;
export const agencyRoute = () => baseAgencyPath + '/*';

// Manage Agency Users
export const agencyUsersPath = (vars = {modal: null, selectedUser: 0}) => {
    if (vars.modal) {
        return agencyPath() + `${agencyUsers}?modal=${vars.modal}&selectedUser=${vars.selectedUser}`;
    }

    return agencyPath() + agencyUsers;
};

export const agencyUsersRoute = (vars = {modal: null, selectedUser: 0}) => {
    if (vars.modal) {
        return `${agencyUsers}?modal=${vars.modal}&selectedUser=${vars.selectedUser}`;
    }

    return agencyUsers;
};

//Agency Templates Page
export const agencyProjectsPath = (vars = {}) => {
    return interactiveVideosPath() + `?search=${vars?.search}&page=${vars?.page}`;
};

// View the user consultant kit
export const agencyConsultingKitPath = () => agencyPath() + agencyConsultingKit;
export const agencyConsultingKitRoute = () => agencyConsultingKit;

// View the agency done for you interactive videos
export const interactiveVideosPath = () => agencyPath() + agencyInteractiveVideos;
export const interactiveVideosRoute = () => agencyInteractiveVideos;

// View the agency landing pages
export const landingPagesPath  = () => agencyPath() + agencyLandingPages;
export const landingPagesRoute  = () => agencyLandingPages;

// Configure the agency app setings
export const AgencyAppSetupPath = () => agencyPath() + agencyAppSetup;
export const agencyAppSetupRoute = () => agencyAppSetup;

// View the app leads
export const leadsPath = () => agencyPath() + agencyLeads;
export const leadsRoute = () => agencyLeads;


// Clients Page
export const AgencyClientsPagePath = (args = {clientId: 0}) => {
    return agencyPath() + `/clients/${args.clientId}`;
};
export const agencyClientsPageRoute = (args = {clientId: 0}) => {
    return `/clients/${args.clientId}`;
};