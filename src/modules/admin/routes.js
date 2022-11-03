/**
 * Admin Paths
 * @returns {string}
 */

// Admin Home Page
export const adminPath = () => '/admin';

export const userNotificationsPath = () => adminPath() + '/user-notifications';
export const activeUsersPath = () => adminPath() + '/active-users-report';
export const templatesUsedPath = () => adminPath() + '/templates-used';
export const landingPagesPath = () => adminPath() + '/landing-pages';
export const agencyClubContentPath = () => adminPath() + '/agency-club-content'
