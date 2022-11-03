import React from 'react';
import { TextInput } from 'components/PropertyEditor';
import PropTypes from 'prop-types';
import styles from './FilterInput.module.scss';
import Icon from 'components/Icon';

const _props = {
  /** Data to be filtered , must be an array of objects */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** key to be filtered with on the data objects */
  filterKey: PropTypes.string.isRequired,
  /** Gets called onChange with an object
   * @param {Object} data
   * @param {Array} data.filteredData
   * @param {Boolean} data.filtering
   */
  onFilter: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

function onChange(value, props) {
    const { data, filterKey, onFilter } = props;
	const term = value.toLowerCase().trim();
	const filteredData = data.filter(item => item[filterKey].toLowerCase().includes(term));
	!!onFilter && onFilter({ filteredData, filtering: !!term });
}

function FilterInput(props) {
  const { placeholder = 'Filter...' } = props;
  return (
    <div className={styles.wrapper}>
      <TextInput
          placeholder={placeholder}
          onChange={value => onChange(value, props)}
          onEnter={value => onChange(value, props)}
      />
      <Icon name="search" />
    </div>
  );
}
FilterInput.propTypes = _props;
export default FilterInput;