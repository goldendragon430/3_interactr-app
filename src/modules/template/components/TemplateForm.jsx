import React, {Component} from 'react';
import isEmpty from 'lodash/isEmpty';
import {Option, TextInput} from "../../../components/PropertyEditor";
import Button from 'components/Buttons/Button';
import {error} from 'utils/alert';

export default class TemplateForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            englishName: '',
            nativeName: ''
        }
    }

    changeHandler = name => (e, value) => {
        this.setState({ [name]: value });
    };

    reset = () => {
        this.setState({
            englishName: '',
            nativeName: ''
        }, this.props.close);
    };

    handleSave = () => {
        const {englishName, nativeName} = this.state;

        if (isEmpty(englishName) || isEmpty(nativeName)) {
            return error({text: 'Please fill in all fields.'})
        }

        this.props.createLanguage({
            english_name: englishName,
            native_name: nativeName
        });

        this.reset()
    };

    render() {
        const {englishName, nativeName} = this.state;
        return (
            <div>
                <div className="modal-heading">
                    User Management
                </div>
                <div className="modal-body">
                    <Option
                        label="English Name"
                        value={englishName}
                        Component={TextInput}
                        onChange={this.changeHandler('englishName')}
                    />
                    <Option
                        label="Native Name"
                        value={nativeName}
                        Component={TextInput}
                        onChange={this.changeHandler('nativeName')}
                    />
                </div>
                <div className="modal-footer">
                    <Button primary onClick={this.handleSave}>
                        Save
                    </Button>
                    <Button onClick={this.reset}>
                        Back
                    </Button>
                </div>
            </div>
        );
    }
}