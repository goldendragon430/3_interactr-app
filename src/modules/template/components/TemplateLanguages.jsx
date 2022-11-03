import React, {Component} from 'react';
import 'components/Table.module.scss';
import Modal from 'components/Modal';
import Button from 'components/Buttons/Button';
import TemplateForm from "./TemplateForm";
import Icon from "components/Icon";
import { confirm } from 'utils/alert';

class TemplateLanguages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLanguageModal: false
        }
    }

    renderLanguageModal() {
        const {showLanguageModal} = this.state;

        return (
            <Modal
                show={showLanguageModal}
                onClose={()=> this.setState({showLanguageModal: false})}
                height={300}
            >
                <TemplateForm
                    createLanguage={this.props.createLanguage}
                    close={() => this.setState({showLanguageModal: false})}
                />
            </Modal>
        );
    }

    onRemoveLanguage = languageId => () => {
        confirm({
            title: 'Are You Sure!',
            text: 'Are You Sure You Want To Remove This Language?',
            confirmButtonText: 'Yes, Remove It!',
            onConfirm: () => {
                this.props.deleteLanguage(languageId)
            }
        })
    };

    render() {
        const { languages } = this.props;

        return (
            <div style={{width: '570px', float: 'right'}}>
                <h2 className="form-heading">
                    Languages
                    <Button
                        primary
                        onClick={()=>this.setState({showLanguageModal: true})}
                        style={{position:'absolute', top: '0', left: '150px'}}
                    >
                        Create New
                    </Button>
                </h2>
                <div className="form-control">
                    <table>
                        <thead>
                        <tr>
                            <th>Native Name</th>
                            <th>English Name</th>
                            <th>Templates Count(*)</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            languages.map(language => (
                                <tr key={'language_' + language.id}>
                                    <td>{language.nativeName}</td>
                                    <td>{language.englishName}</td>
                                    <td>{language.templatesCount}</td>
                                    <td>
                                        <a onClick={this.onRemoveLanguage(language.id)}>
                                            <Icon name='trash-alt'/>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {this.renderLanguageModal()}
                </div>
            </div>
        );
    }
}


export default TemplateLanguages;