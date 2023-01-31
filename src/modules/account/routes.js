/**
 * My account page routes
 * @returns {string}
 */

const accountBaseUrl = '/account';
const accountIntegrations = '/integrations';
const accountCustomLists = '/custom-lists';

// Account Home Page
export const accountPath = () => accountBaseUrl;
export const accountRoute = () => accountBaseUrl + '/*';

// Manage users integrations
export const accountIntegrationsPath = () => accountPath() +  accountIntegrations;
export const accountIntegrationsRoute = () => accountIntegrations;

// Manage users custom lists
export const accountCustomListsPath = () => accountPath() +  accountCustomLists;
export const accountCustomListsRoute = () => accountCustomLists;

// Link to our affiliates page
export const accountAffiliatePath = () => 'https://interactrspecial.com/advocates'