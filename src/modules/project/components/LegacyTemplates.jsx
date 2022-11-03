import React from "react";
import {useProjectTemplates} from "../../../graphql/Project/hooks";
import ProjectTemplateList from "./ProjectTemplateList";

/**
 * Render legacy templates list
 * @param user
 * @param onSelect
 * @returns {null|*}
 * @constructor
 */
const LegacyTemplates = ({user, onSelect}) => {
    const [templatesData, _, {loading, error, refetch}] = useProjectTemplates({legacy: 1});
    if (loading) return null;
    const isLocked = !user.evolution_pro;

    return <ProjectTemplateList
        active="legacy"
        templatesData={templatesData}
        refetchTemplates={refetch}
        isLocked={isLocked}
        onSelect={onSelect}
    />;
};

export default LegacyTemplates;