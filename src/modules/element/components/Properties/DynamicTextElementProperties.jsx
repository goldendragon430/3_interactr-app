import React, {Component} from 'react';
import cx from "classnames";
import styles from "./DynamicTextElementProperties.module.scss";
import Icon from "components/Icon";
import {Option, TextInput} from 'components/PropertyEditor';
import PropTypes from 'prop-types';
import IconButton from 'components/Buttons/IconButton';
import Button from 'components/Buttons/Button';

const _props = {
    defaultValues: PropTypes.arrayOf(PropTypes.object).isRequired,
    updateDefaultValues: PropTypes.func.isRequired,
};

class DynamicTextElementProperties extends Component {

  constructor({defaultValues}) {
    super(...arguments);
    defaultValues = defaultValues && defaultValues.length ? defaultValues : [{id: 1, key: '', value: ''}]
    this.state = {
      defaultValues ,
    }
  }

  handleSave = () => {
      this.props.updateDefaultValues(
           this.state.defaultValues
      );
  };

  handleChange = ({property, id}) => (e, val) => {
    this.setState(state => {
      const defaultValues = state.defaultValues.map(defaultValue => {
        if(defaultValue.id === id) {
          defaultValue[property] = val;
        }
        return defaultValue;
      });

      return { defaultValues };
    })
  };

  addDefaultValue = () => {
    const {defaultValues} = this.state;
    let id = !!defaultValues.length && defaultValues.slice(-1).pop().id || 0 ;

    defaultValues.push({
        id: ++id,
        key: '',
        value: ''
    });

    this.setState({ defaultValues });
  };

  removeDefaultValue = defaultValueId => {
    const {defaultValues} = this.state;

    const newCollection = defaultValues.filter(({id}) => id !== defaultValueId);
    this.setState({defaultValues: newCollection})
  };

  renderDefaultValues() {
    const {defaultValues} = this.state;

    return defaultValues.map(({id, key, value}) => (
      <div className={cx(styles.defaultValueItem, 'grid')} key={'defaultValue_'+ id}>
        <div className={cx(styles.defaultValueKey, 'col5')}>
          <Option
            value={key}
            className={styles.defaultValueInput}
            Component={TextInput}
            onChange={this.handleChange({id, property: 'key'})}
          />
        </div>
        <div className="col1">
          <span>
            <Icon name="ellipsis-v"/>
          </span>
        </div>
        <div className={cx(styles.defaultValueValue, 'col5')}>
          <Option
            value={value}
            className={styles.defaultValueInput}
            Component={TextInput}
            onChange={this.handleChange({id, property: 'value'})}
          />
        </div>
        <span className={styles.defaultValueEllipsis}>
          <Icon name="times" className={styles.dynamicIconDelete} onClick={() => this.removeDefaultValue(id)}  />
        </span>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <h4>Parameters Default Values</h4>
        {this.renderDefaultValues()}

        {/* Footer */}
        <div className={cx(styles.defaultValueItem, 'grid')}>
          <div className="col6">
              <Button primary onClick={this.handleSave} small >
                  {this.props.loading ? <Icon name="cog" spin={true}/> : 'Save'}
              </Button>
          </div>
          <div className="col6">
              <IconButton
                  icon="plus"
                  primary
                  small="true"
                  onClick={this.addDefaultValue}
                  buttonStyles={{float: 'right'}}
              />
          </div>
        </div>
      </div>
    );
  }
}

DynamicTextElementProperties.propTypes = _props;
export default DynamicTextElementProperties;