import React, {useState} from "react";
import Select from "react-select";

/**
 * Dropdown to choose what type of media items need to fetch from Pixabay API
 * Available options: videos/images
 * @param onChange
 * @returns {*}
 * @constructor
 */
const StockListMediaFilter = ({onChange}) => {
    const [selectedType, setSelectedType] = useState(0);

    const changeSelectedCategories = ({value}) => {
        setSelectedType(value);
        onChange && onChange(value);
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
            name="stock-list-select-type"
            defaultValue={selectedType}
            onChange={changeSelectedCategories}
            // clearable={false}
            placeholder="Filter by Type"
            options={[
                {value: 0, label: "Videos"},
                {value: 1, label: "Images"},
            ]}
            styles={customStyles}
            // menuContainerStyle={{'zIndex': 100}}
        />
    );
}

export default StockListMediaFilter;