import React from 'react';
import size from 'lodash/size';

import { SelectInput } from 'components/PropertyEditor/PropertyEditor';
import LinkButton from 'components/Buttons/LinkButton';
import { useAuthUser } from "@/graphql/User/hooks";

/**
 * List sub users list
 * @param users
 * @param props
 * @returns {*}
 * @constructor
 */
export const SelectSubUser = (props) => {
    const user = useAuthUser();
    const subUsers = user.subusers;

    if (! size(subUsers)) {
        return (
            <div>
                No users created.{' '}
                <LinkButton to={'/agency'}>
                    Agency Page
                </LinkButton>
            </div>
        );
    }

    const options = subUsers.reduce((memo, user) => {
        return {...memo, [user.id]: user.name};
    }, {0: 'My Integrations'});

    return (
        <SelectInput
            {...props}
            options={options}
        />
    );
};