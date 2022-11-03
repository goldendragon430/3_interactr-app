import React, {Component} from 'react';
import Modal from 'components/Modal';
import Select from 'react-select';
import Button from 'components/Buttons/Button';
import { copyVideoToProject } from 'modules/media/media';

@connect(null, {copyVideoToProject})
export default class CopyVideoModal extends Component {
    state = {
        copyToProject: 0
    };

    handleCopyVideo = async () => {
        const {copyVideoToProject, media: {id}} = this.props;
        const {copyToProject} = this.state;

        await copyVideoToProject(copyToProject, id);

        this.setState(
            { copyToProject: 0 },
            () => this.props.copyVideoDone()
        );
    };

    handleChange = ({ value }) => {
        this.setState({copyToProject: value})
    };

    getProjectOptions = () => {
        return this.props.projects.map(project => ({
            label: project.title,
            value: project.id,
            clearableValue: false
        }));
    };

    render() {
        const {showCopyVideoModal, close} = this.props;
        const {copyToProject} = this.state;

        return (
            <Modal
                show={showCopyVideoModal}
                onClose={close}
                height={300}
                width={300}
                heading={"Copy Video To Project"}
                submitButton={
                    <Button primary onClick={this.handleCopyVideo}>
                        Confirm
                    </Button>
                }
            >
                <div>
                    <p style={{ marginTop: 0 }}>
                        <strong>Select a project:</strong>
                    </p>
                    <Select
                        value={copyToProject}
                        options={this.getProjectOptions()}
                        onChange={this.handleChange}
                        clearable={false}
                        searchable={false}
                    />
                </div>
            </Modal>
        );
    }
}