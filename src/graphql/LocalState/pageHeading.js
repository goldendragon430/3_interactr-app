import {makeVar} from "@apollo/client";

/**
 * Get or set app page headers
 * @type {ReactiveVar<*[]>}
 */
export const getPageHeader = makeVar([]);
export const setPageHeader = getPageHeader;
