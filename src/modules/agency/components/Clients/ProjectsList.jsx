import {useQuery} from "@apollo/client";
import {GET_PROJECTS_BY_ID} from "../../../../graphql/Project/queries";
import ProjectsLoading from "../../../project/components/ProjectsLoading";
import {motion} from "framer-motion";
import map from "lodash/map";
import cx from "classnames";
import styles from "../ClientsPage.module.scss";
import ProjectCard from "../../../project/components/ProjectCard";
import React from "react";
import NoProjects from "./NoProjects";

const ProjectsList = ({projectIds, userId}) => {
    const {data, loading, error, refetch} = useQuery(GET_PROJECTS_BY_ID, {
        variables: {
            projectIds
        }
    });

    if (loading) return <ProjectsLoading />;

    if (error) return "Something went wrong";

    const list =  {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -5, scale: 0.7 },
        show: { opacity: 1, x:0, scale: 1, transition: {type: 'ease-in'} }
    };

    const allowedActions = [
        "copy",
        "delete",
        "edit",
        "preview",
        "share"
    ];

    return (
        <motion.div  initial="hidden" animate="show"  variants={list}>
            { map(data.result, (project, index) => (
                <motion.article variants={item} className={cx('cards_card', styles.projectCard)} key={'project_list_article' + project.id}>
                    <ProjectCard
                        project={project}
                        key={project.id}
                        currentImpressions={data[`current_30_impressions_${project.id}`]}
                        currentPlays={data[`current_30_plays_${project.id}`]}
                        last30Impressions={data[`last_30_impressions_${project.id}`]}
                        last30Plays={data[`last_30__plays${project.id}`]}
                        refetchProjects={() => {
                            refetch({});
                        }}
                        allowedActions={allowedActions}
                    />
                </motion.article>
            ))}
            {(data.result.length===0) ? <NoProjects userId={userId} /> : null}
        </motion.div>
    );
};

export default ProjectsList;