import {makeVar} from "@apollo/client";

/**
 * Modal is used lots of times around the app so to
 * make this easier we have a global preview component. We
 * just need to se the project ID here that we want to preview
 * @type {ReactiveVar<boolean>}
 */
export const getClientModal = makeVar({
    showModal: false,
    clientId: 0
});
export const setClientModal = getClientModal;