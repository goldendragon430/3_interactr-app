import React, {useState} from 'react';
import Select from 'react-select';
import _map from 'lodash/map';

const Categories = [
  'fashion', 'nature', 'backgrounds', 'science',
  'education', 'people', 'feelings', 'religion',
  'health', 'places', 'animals', 'industry', 'food',
  'computer', 'sports', 'transportation', 'travel',
  'buildings', 'business', 'music'
];

const StockListCategoryFilter = ({onChange}) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const changeSelectedCategories = ({value}) => {
    setSelectedCategory(value);
    onChange && onChange(value);
  };

  const getOptionsForCategories = () => {
    return _map(Categories, (item => ({
          value: item,
          label: item
    })));
  };

  const customStyles = {
		menu: (provided, state) => ({
			...provided,
			zIndex: 500
		}),

		control: (provided, state) => ({
			...provided,
			borderRadius : 10
		}),
	}

  return (
    <Select
      name="stock-list-select-tag"
      defaultValue={selectedCategory}
      onChange={changeSelectedCategories}
      // clearable={false}
      placeholder="Search by Categories"
      options={getOptionsForCategories()}
      styles={customStyles}
    />
  );
};

export default StockListCategoryFilter