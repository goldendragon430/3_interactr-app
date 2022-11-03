import React from 'react';
import { SelectInput } from 'components/PropertyEditor';
import PropTypes from 'prop-types';
import Icon from "../../../components/Icon";
import _size from 'lodash/size';

/**
 * Render integration lists
 * @param lists
 * @param loading
 * @param subUserId
 * @param integrationType
 * @param props
 * @returns {*}
 * @constructor
 */
export const  SelectList = ({lists, loading, errorMessage, ...props}) => {
  if (loading) return <Icon loading />;

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  /** Annoying hack to make aWebber and mailchimp work as the aWebber lists come back as lists.lists[] instead of lists[] */
  const normaliseLists = lists =>  (lists && lists.lists) ? lists.lists : lists;

  let localLists = normaliseLists(lists);

  if (!localLists || ! _size(localLists)) {
    return <div>No lists</div>;
  }

  // the backend could return normalized data but hey it's faster to just fix it here
  const options = localLists.reduce((memo, { list_id, campaignId, id, list_name, name }) => {
    return { ...memo, [list_id || id || campaignId]: list_name || name };
  }, {});

  return <SelectInput {...props} options={{ '': 'Select List', ...options }} />;
};

SelectList.propTypes = {
  lists: PropTypes.array,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
}
