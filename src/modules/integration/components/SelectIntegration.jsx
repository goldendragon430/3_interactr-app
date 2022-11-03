import React from 'react';
import size from 'lodash/size';

import { SelectInput } from 'components/PropertyEditor/PropertyEditor';
import LinkButton from 'components/Buttons/LinkButton';
import { useAuthUser } from "@/graphql/User/hooks";
import { useUserIntegrations } from "../utils";
import { accountIntegrationsPath } from "modules/account/routes";

export const SelectIntegration = (props) => {
    const user = useAuthUser();

    const [integrations] = useUserIntegrations(user);

    if (! size(integrations)) {
      return (
        <div>
          No integrations set up.{' '}
          <LinkButton to={accountIntegrationsPath()}>
            Integration Settings
          </LinkButton>
        </div>
      );
    }

    const options = integrations.reduce((memo, integration) => {
        return {...memo, [integration.key]: integration.name};
    }, {});

    return (
      <SelectInput
        {...props}
        options={options}
      />
    );
};