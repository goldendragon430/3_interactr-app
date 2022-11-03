import React, {useState} from 'react';
import cx from 'classnames';
import Icon from 'components/Icon';
import EditableLabel from 'components/EditableLabel';
import styles from './ProjectGroupItem.module.scss'
import {useDeleteProjectGroup, useSaveProjectGroup} from "../../../graphql/ProjectGroup/hooks";
import {errorAlert} from "../../../utils/alert";
import ReactTooltip from "react-tooltip";
import Swal from "sweetalert2";
import {useProjectGroupRoute} from "../routeHooks";
import {useProjects} from "../../../graphql/Project/hooks";

const ProjectGroupItem = ({folder, dragHandleProps}) => {
    const [folderId, updateProjectsPage, {page, q, orderBy, sortOrder}] = useProjectGroupRoute();
    const [projects, updateProjects, {refetch}] = useProjects({search: q, page: parseInt(page), project_group_id: folderId, orderBy, sortOrder});
    const variables = {search: q, page: parseInt(page), project_group_id: folderId, orderBy, sortOrder};

    const [deleteProjectGroup, {loading, error}] = useDeleteProjectGroup({
        // the way to pass outside necessary vars for updating cache inside hook
        getOuterVars() {
          return {variables, folderProjectIds: folder.projectIds}
        }
    });
    const [saveProjectGroup, {loading: saving}] = useSaveProjectGroup();

    const handleFocusOut = async (title) => {
        try {
            await saveProjectGroup({
                id: folder.id,
                title
            });
        } catch (error) {
            errorAlert({text: error});
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProjectGroup(null, folder.id);
            updateProjectsPage();
            refetch();
        } catch (error) {
            errorAlert({text: error});
        }
    };

    return (
        <div className={cx(styles.groupListItem, 'grid')}>
            <ReactTooltip className="tooltip" />
            <div className={styles.dragHandle} {...dragHandleProps}>
                <Icon name={'arrows-alt'} />
            </div>
            <div className="col11" style={{paddingLeft:'40px', marginTop: '6px'}}>
                <EditableLabel
                    text={folder.title}
                    onFocusOut={handleFocusOut}
                />
            </div>
            <div className={cx('col1', styles.iconCol)}>
                <DeleteGroupIcon onDelete={handleDelete}/>
            </div>
        </div>
    );
};

const DeleteGroupIcon = ({onDelete}) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure? ',
            text: 'Are you sure you want to delete this folder?',
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#ff6961',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if(result.isConfirmed) {
                try {
                    setDeleting(true);
                    await onDelete()
                } catch(err) {
                    console.error(err);
                    errorAlert({text: "Unable to delete element"})
                }
                setDeleting(false);
            }
        });
    };

    return(
        <span className={styles.icon} data-tip={'Delete'} onClick={handleDelete}>
            <Icon loading={deleting} name={'trash-alt'} />
        </span>
    )
};

export default ProjectGroupItem;