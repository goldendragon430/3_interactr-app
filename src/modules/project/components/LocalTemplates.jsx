import React from "react";
import {useProjectTemplates} from "../../../graphql/Project/hooks";
import ProjectTemplateList from "./ProjectTemplateList";

/**
 * Render local templates list
 * @param user
 * @param onSelect
 * @returns {null|*}
 * @constructor
 */
const LocalTemplates = ({user, onSelect}) => {
    const [templatesData, _, {loading, error, refetch}] = useProjectTemplates({local_template: 1});
    if (loading) return null;
    const isLocked = !user.is_local;

    return <ProjectTemplateList
        active="local_template"
        templatesData={templatesData}
        isLocked={isLocked}
        refetchTemplates={refetch}
        onSelect={onSelect}
    />;
};

export default LocalTemplates;