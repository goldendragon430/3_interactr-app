import React from 'react';
import PropTypes from 'prop-types';

import { SelectInput } from 'components/PropertyEditor/PropertyEditor';
import { useUser } from "@/graphql/User/hooks";
import { useSubUserIntegrations } from "../utils";

export const SelectSubUserIntegration = ({subUserId, ...props}) => {
    const [subUser, _] = useUser(subUserId);
    const [integrations] = useSubUserIntegrations();

    const integrationOptions = () => {
        if(subUser) {
            return integrations.reduce((result, integration)=>{
                if(subUser[integration.key]) return { ...result, [integration.key]: integration.name }
            }, {});
        }

        return null;
    };
    
    const options = integrationOptions();

    if (!options) {
        return (
            <div>
                This user has no integrations set up, you will need to login as this user to setup on their behalf or get the user to login and set this up.
            </div>
        );
    }

    return (
        <SelectInput
            {...props}
            options={ options }
        />
    );
};

SelectSubUserIntegration.propTypes = {
  subUserId: PropTypes.number.isRequired,
}