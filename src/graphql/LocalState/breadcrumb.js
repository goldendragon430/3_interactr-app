import {makeVar} from "@apollo/client";

/**
 * Get or set app breadcrumbs
 * @type {ReactiveVar<*[]>}
 */
export const getBreadcrumbs = makeVar([]);
export const setBreadcrumbs = getBreadcrumbs;
