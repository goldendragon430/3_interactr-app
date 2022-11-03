import React from "react";
import Icon from "../../../components/Icon";
import {useProjectCommands, useSaveProject} from "../../../graphql/Project/hooks";
import ErrorMessage from "../../../components/ErrorMessage";
import {useSetState} from "../../../utils/hooks";

/**
 * Render the single project title based on some options like "favourite" / none "favourite" etc.
 * @param project
 * @returns {*}
 * @constructor
 */
const ProjectTitle = ({ project }) => {
    return (
        <>
            <FavouriteProject project={project} />
            <span> {project.title}</span>
        </>
    );
}

export default ProjectTitle;

const FavouriteProject = ({project}) => {
    const {saveProject} = useProjectCommands();

    const [state, setState] = useSetState({
        loading: false,
        error: false
    });

    const {loading, error} = state;

    if(loading) return <Icon loading  size="sm" style={{marginRight: 0}}/>;
    if(error) {
        console.log(error);
        return '-';
    }

    const iconStyles = { cursor: 'pointer' };

    if (project.is_favourite) {
        iconStyles.color = '#FA5A7D';
    }

    const toggleIsFavorite = async  () => {
        setState({loading: true});

        try {
            const res = await saveProject({
                variables: {
                    input: {
                        id: project.id,
                        is_favourite: (project.is_favourite) ? 0 : 1
                    }
                }
            });

            setState({loading: false});

        }catch(error){
            setState({loading: false, error});
        }

    };

    const _icon = (project.is_favourite) ? ['fas', 'heart'] : ['far', 'heart']

    return  <Icon name={_icon} size="sm" style={iconStyles} onClick={toggleIsFavorite} />
}