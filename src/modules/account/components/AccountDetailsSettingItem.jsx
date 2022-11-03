import React from 'react';
import styles from './AccountDetails.module.scss';
import SimpleForm from "components/SimpleForm";

export default class AccountDetailsSettingItem extends React.Component {
  render() {
    const {icon, title, fieldName, data, saveButtonAction} = this.props;

    return (
      <div className="form-control">
        <SimpleForm
          className={styles.form}
          fields={{[fieldName]: title}}
          data={data}
          onSubmit={saveButtonAction}
        />
      </div>
    );
  }
}
