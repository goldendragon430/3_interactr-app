import React from "react";
import Icon from "../../../components/Icon";
import {Option, SelectInput} from "../../../components/PropertyEditor";
import {recreateSelectOptions} from "../../../utils/domUtils";

/**
 * Project folders dropdown
 * @param onChange
 * @param value
 * @returns {null|*}
 * @constructor
 */
const ProjectGroupsSelect = ({onChange, value, projectGroups}) => {
    return (
        <Option
            Component={SelectInput}
            value={value}
            options={recreateSelectOptions(
                projectGroups,
                { key: 'id', label: 'title' },
                { key: 'noFolder', value: 'No Folder' }
            )
            }
            onChange={onChange}
        />
    )
};

export default ProjectGroupsSelect;