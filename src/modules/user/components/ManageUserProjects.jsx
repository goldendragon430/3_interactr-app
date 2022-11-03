import React, {useState} from 'react';
import {BooleanInput, Option, TextInput} from "../../../components/PropertyEditor";
import styles from './ManageUserProjects.module.scss'
import _remove from 'lodash/remove';
import _filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import {useProjects} from "../../../graphql/Project/hooks";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";

const QUERY = gql`
    query allProjects {
        projects: allProjects {
            id
            title
        }
    }
`;

const ManageUserProjects = ({user, changeHandler}) => {
    const [search, setSearch] = useState('');

    const {data, loading, error} = useQuery(QUERY);

    if(loading) return <Icon loading />;

    if(error) return <ErrorMessage error={error} />;

    const {projects} = data;    

    const getFilteredProjects = () => {
        if (!search) return {searching: false, filteredProjects: projects};

        const filteredProjects = _filter(projects, project => project.title.toLowerCase().includes(search.toLowerCase()));
        return {searching: true, filteredProjects: filteredProjects};
    }

    let {searching, filteredProjects} = getFilteredProjects();

    if (!searching && !filteredProjects.length) {
        return (
            <div>
                <label className="mb-1">Projects this user can access</label>
                <div>No Projects</div>
            </div>
        )
    }

    return (
        <div>
            <Option
              label="Projects this user can access"
              value={search}
              Component={TextInput}
              placeholder="Filter by name"
              onChange={val => setSearch(val)}
            />
          <div className={styles.container}>
            <div className="grid">
              {searching && !filteredProjects.length ?
                  <div>No Results</div>
                :
                  <Projects
                      projects={filteredProjects}
                      user={user}
                      changeHandler={changeHandler}
                  />
              }
            </div>
          </div>
        </div>
    )
}

/**
 *
 * @param projects
 * @param selectedProjects
 * @param handleToggle
 * @returns {*}
 * @constructor
 */
const Projects = ({ projects, user, changeHandler}) => {
    const SingleItem = ({user, projectId, projectTitle}) => (
        <div className="grid">
            <div className="col8">{projectTitle}</div>
            <div className="col4 text-right">
                <Option
                    Component={BooleanInput}
                    value={user.projects.includes(projectId)}
                    onChange={handleToggle(projectId)}
                />
            </div>
        </div>
    )

    const handleToggle = (projectId) => (value) => {
        if(value) {
            const updatedProjects = [...user.projects, projectId];
            changeHandler('projects')(updatedProjects);
        } else {
            const updatedProjects = reduce(user.projects, (result, value) =>{
                                        if(value == projectId)
                                            return result;
                                        return result.concat(value);
                                    }, []);
            changeHandler('projects')(updatedProjects);
        }
    }

    return projects.map(project => (
        <SingleItem
            key={'project_item_' + project.id}
            user={user}
            projectId={parseInt(project.id)}
            projectTitle={project.title}
        />
    ))
}

export default ManageUserProjects;