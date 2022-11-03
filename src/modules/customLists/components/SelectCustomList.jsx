import React from 'react';
import { SelectInput } from 'components/PropertyEditor';
import Icon from 'components/Icon';

/**
 * The dropdown to select the custom list
 * @param customLists
 * @param loadingCustomLists
 * @param props
 * @returns {*}
 * @constructor
 */
export default function SelectCustomList({ customLists, loadingCustomLists, ...props }) {
    if (loadingCustomLists) return <Icon loading/>;

    if (!customLists) {
        return (
          <div>
            <div style={{ marginBottom: 5 }}>No custom Lists ! &nbsp; </div>
          </div>
        );
    }

    const parsedCustomLists = customLists.reduce(
        (result, list) => ({
          ...result,
          [list.id]: list.custom_list_name,
        }),
        {}
    );

    return <SelectInput {...props} options={{ ...parsedCustomLists }} />;
}
