import React from "react";
import Modal from 'components/Modal';
import Icon from "../../../components/Icon";
import CopyToClipboard from "../../../components/CopyToClipboard";
import {generateEmbedCode} from "../utils";
import Button from "../../../components/Buttons/Button";
import {useQuery, useReactiveVar} from "@apollo/client";
import {getProjectEmbedCode, setProjectEmbedCode} from "../../../graphql/LocalState/projectEmbedCode";
import gql from "graphql-tag";
import ErrorMessage from "../../../components/ErrorMessage";

/**
 * Render popup for single project to generate embed code
 * @param show
 * @param close
 * @param project
 * @returns {*}
 * @constructor
 */
const EmbedCodeModal = () => {
    const {projectId, templateId} = useReactiveVar(getProjectEmbedCode);

    const close = ()=>setProjectEmbedCode({
        projectId: false,
        templateId: false
    });

    return (
        <Modal
            show={projectId || templateId}
            onClose={close}
            height={400}
            width={550}
            heading={
                <>
                    <Icon name="code" /> Embed Code
                </>
            }
        >
            <div>
                {(projectId) ? <ProjectEmbedCode projectId={projectId} /> : null }
                {(templateId) ? <TemplateEmbedCode projectId={templateId} /> : null }
            </div>
        </Modal>
    );
}

export default EmbedCodeModal;

const PROJECT_QUERY = gql`
    query project($projectId: ID!) {
        result: project(id: $projectId) {
            id
            title
            storage_path
            embed_width
            embed_height
            published_path
            image_url
        }
    }
`;

const PLAYER_QUERY = gql`
    query playerVersion {
        result: playerVersion {
            id,
            version_id
        }
    }
`;

const ProjectEmbedCode = ({projectId}) => {
    const project = useQuery(PROJECT_QUERY, {
        variables: {projectId}
    });

    const player = useQuery(PLAYER_QUERY);

    if(project.loading || player.loading) return <Icon loading />;

    if(project.error) return <ErrorMessage error={project.error} />
    if(player.error) return <ErrorMessage error={player.error} />

    return <CopyToClipboard value={generateEmbedCode(project.data.result, player.data.result)} />
}


const TEMPLATE_QUERY = gql`
    query template($projectId: ID!) {
        result: template(id: $projectId) {
            id
            title
            storage_path
            embed_width
            embed_height
            published_path
        }
    }
`
const TemplateEmbedCode = ({projectId}) => {
    const project = useQuery(TEMPLATE_QUERY, {
        variables: {projectId}
    });

    const player = useQuery(PLAYER_QUERY);

    if(project.loading || player.loading) return <Icon loading />;

    if(project.error) return <ErrorMessage error={project.error} />
    if(player.error) return <ErrorMessage error={player.error} />

    return <CopyToClipboard value={generateEmbedCode(project.data.result, player.data.result)} />
}