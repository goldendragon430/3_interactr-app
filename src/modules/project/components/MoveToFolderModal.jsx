import React from 'react';
import Modal from 'components/Modal';
import Icon from "components/Icon";
import Button from 'components/Buttons/Button';
import {Option, SelectInput} from 'components/PropertyEditor';
import {recreateSelectOptions} from "../../../utils/domUtils";
import {useProjectGroups} from "../../../graphql/ProjectGroup/hooks";
import {useSetState} from "../../../utils/hooks";
import ErrorMessage from "../../../components/ErrorMessage";
import {useSaveProject} from "../../../graphql/Project/hooks";


/**
 * Preview project groups popup for user to move project into folder they need
 * @param project
 * @param folderId
 * @param show
 * @param close
 * @param refetchProjects
 * @returns {*}
 * @constructor
 */
const MoveToFolderModal = ({ project, projectGroupId: folderId, show, close, refetchProjects }) => {
    const [state, setState] = useSetState({
        projectGroupId: folderId
    });
    const [projectGroups, update, {loading, error, refetch: refetchProjectGroups}] = useProjectGroups();
    const options = {
        onCompleted() {
            close();
            refetchProjectGroups();
            refetchProjects()
        }
    }
    const [updateProject, {loading: updateProjectLoading, error: errorProjectLoading}] = useSaveProject(options);

    if(loading || updateProjectLoading) return <Icon loading />;

    if(error || errorProjectLoading) return <ErrorMessage error={error || errorProjectLoading} />;

    const {projectGroupId} = state;

    const handleSave = () => {
        updateProject({
            id: project.id,
            project_group_id: projectGroupId === 'noFolder' ? null : projectGroupId
        });
    }

    const filteredGroups = () => {
        return recreateSelectOptions(
            projectGroups,
            { key: 'id', label: 'title' },
            { key: 'noFolder', value: 'No Folder' }
        );
    }

    return (
        <div>
            <Modal
                show={show}
                onClose={close}
                customStyles={{overflow: 'inherit'}}
                height={260}
                width={460}
                heading={
                    <>
                        <Icon name="plus" /> Move to Folder
                    </>
                }
                submitButton={
                    <Button primary onClick={handleSave} icon={'save'}>
                        Save
                    </Button>
                }
            >
                <div style={{marginTop: '10px'}}>
                    <Option
                        label="Folders"
                        Component={SelectInput}
                        value={projectGroupId}
                        options={filteredGroups()}
                        onChange={val => setState({projectGroupId: val})}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default MoveToFolderModal;