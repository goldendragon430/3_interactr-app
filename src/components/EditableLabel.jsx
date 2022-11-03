import React, {Component} from "react";
import {error} from 'utils/alert';

export default class EditableLabel extends Component{

    constructor(props) {
        super(props);
        this.state = {
            title: props.text,
            label: true,
            error: false
        }
    }

    triggerInput = () => {
        this.setState({label: false});
    };

    handleInputBlur = () => {
        const {title, error} = this.state;
        const {onFocusOut} = this.props;

        this.setState({label: true, error: false}, () => !error ? onFocusOut(title) : null);
    };

    handleChange = value => {
        const data = {};

        if (value) {
            data.title = value;
        } else {
            data.error = true;
            error({text: 'Please fill the folder title.'})
        }

        this.setState(data);
    };

    render() {
        const {labelClassName, inputClassName, wrapperClassName} = this.props;
        const {title, label} = this.state;

        return (
            <div className={wrapperClassName}>
                {label ? (
                    <label className={labelClassName} onClick={this.triggerInput}>{title}</label>
                ): (
                    <input
                        className={inputClassName}
                        type="text"
                        value={title}
                        onBlur={this.handleInputBlur}
                        onChange={e => this.handleChange(e.target.value)}
                        autoFocus={true}
                    />
                )}
            </div>
        );
    }
}