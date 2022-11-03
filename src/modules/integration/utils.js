import { useState } from "react";
import { phpApi } from "utils/apis";


export const INTEGRATIONS = [
  {name: 'aWeber', key: 'integration_aweber'},
  {name: 'Zapier', key: 'integration_zapier'},
  {name: 'Sendlane', key: 'integration_sendlane'},
  {name: 'Active Campaign', key: 'integration_activecampaign'},
  {name: 'Mailchimp', key: 'integration_mailchimp'},
  {name: 'Get Response', key: 'integration_getresponse'}
];

export const SUB_USER_INTEGRATIONS = [
  {name: 'Sendlane', key: 'integration_sendlane'},
  {name: 'Active Campaign', key: 'integration_activecampaign'},
  {name: 'Get Response', key: 'integration_getresponse'},
  {name: 'Mailchimp', key: 'integration_mailchimp'}
];

/**
 * Get sib user integrations
 * @returns {[[{name: string, key: string}, {name: string, key: string}, {name: string, key: string}, {name: string, key: string}]]}
 */
export const useSubUserIntegrations = () => {
  return [SUB_USER_INTEGRATIONS];
};

/**
 * Filter user integrations
 * @param user
 * @returns {[({name: string, key: string}|{name: string, key: string}|{name: string, key: string}|{name: string, key: string}|{name: string, key: string}|{config: *})[]]}
 */
export const useUserIntegrations = (user) => {
  const integrations = INTEGRATIONS.map(integration => {
    return {...integration, config: user[integration.key]};
  });

  const filteredUserIntegrations = integrations.filter(integration => integration.config);

  return [filteredUserIntegrations];
};

/**
 * Fetch integration lists by integrationType
 * @returns {[getLists, {lists: {}, error: string, loadingLists: boolean}]}
 */
export const useIntegrationLists = () => {
  const [loadingLists, setListsLoading] = useState(true);
  const [lists, setLists] = useState({});
  const [error, setError] = useState('');

  const fetchLists = (integrationName, queryParams) => {
    phpApi(`${integrationName}/getLists${queryParams}`)
        .then(res => res.json())
        .then((lists)=>{
          setLists(lists);
        })
        .catch((error)=>{
          setError(error?.data?.message);
        })
        .finally(()=>{
          setListsLoading(false);
        });
  };

  const getLists = (integrationType, subUserId) => {
    setListsLoading(true);
    setError('');
    const integrationName = integrationType.replace('integration_', '');
    const queryParams = subUserId ? '?user_id='+subUserId : '';

    fetchLists(integrationName, queryParams);
  };

  return [getLists, {lists, loadingLists, error} ];
};

/**
 * Validate integration keys before saving to use instance
 * @param integrationType
 * @param data
 * @param onSuccess
 * @param onFail
 */
export const validateIntegration = ({integrationType, data, onSuccess, onFail}) => {
    phpApi(`account/integration/${integrationType}/validate`, {
      method: 'POST',
      body: data
    }).then(res => res.json())
      .then(onSuccess)
      .catch(onFail);
};