import React from 'react';
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import Modal from 'components/Modal';
import ProjectChapters from "./ProjectChapters";
import {useSaveProject} from "../../../graphql/Project/hooks";

/**
 * Open popup to set project chapters config
 * @param show
 * @param onClose
 * @param project
 * @param updateProject
 * @returns {*}
 * @constructor
 */
const ProjectChaptersModal = ({show, onClose, project, updateProject}) => {
    const options = {
        onCompleted() {
            onClose();
        }
    };
    const [saveProject, {loading: saving}] = useSaveProject(options);

    const handleSaveProject = () => {
        // skip nodes/modals and update project item
        const {nodes, modals, ...projectData} = project;

        saveProject({
            ...projectData
        })
    };

    return (
        <Modal
            width={1100}
            height={800}
            show={show}
            onClose={onClose}
            heading={<><Icon name="plus" />Project Chapters</>}
            submitButton={<Button primary icon="save" loading={saving} onClick={handleSaveProject} >Save</Button>}
        >
            <ProjectChapters
                project={project}
                updateProject={updateProject}
            />
        </Modal>
    );
};

export default ProjectChaptersModal;