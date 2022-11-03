import React from "react";
import {useProjectTemplates} from "../../../graphql/Project/hooks";
import ProjectTemplateList from "./ProjectTemplateList";
import TemplatesHeader from "./TemplatesHeader";
import {useAddProjectRoute} from "../routeHooks";

/**
 * Render club templates list
 * @param user
 * @param onSelect
 * @param setActiveTab
 * @param activeTab
 * @returns {null|*}
 * @constructor
 */
const AgencyClubTemplates = ({user, onSelect, setActiveTab, activeTab}) => {
    const [{page, title}] = useAddProjectRoute();
    const templateQueryVars = {page, local_template: 0, first: 24, club_template: 1, legacy: 1};
    if (title) templateQueryVars.title = `%${title}%`;

    const [templatesData, _, {loading, error, refetch}] = useProjectTemplates(templateQueryVars);
    if (loading) return null;
    const isLocked = !user.is_club || !user.evolution_club;

    return (
        <>
            <ProjectTemplateList
                templatesData={templatesData}
                refetchTemplates={refetch}
                isLocked={isLocked}
                onSelect={onSelect}
            />
        </>
    );
};

export default AgencyClubTemplates;