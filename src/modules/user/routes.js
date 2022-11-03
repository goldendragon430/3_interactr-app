/**
 * Admin Paths
 * @param vars
 * @returns {string}
 */

export const adminPagePath = (vars = {modal: null, selectedUser: 0, page: 1, search: ""}) => {
    if (vars.modal) {
        return `/admin?modal=${vars.modal}&selectedUser=${vars.selectedUser}&search=${vars.search}&page=${vars.page}`;
    }

    return '/admin';
};
