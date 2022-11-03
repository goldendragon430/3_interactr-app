import React, {useState} from 'react';
import Button from "../../../components/Buttons/Button";
import Icon from "../../../components/Icon";
import filterInputStyles from "../../../components/FilterInput.module.scss";
import {Option, SelectInput, TextInput} from "../../../components/PropertyEditor";
import {useAddProjectRoute} from "../routeHooks";
import styles from "./ProjectsPage.module.scss";


const filterOptions = [
  {
    label: 'Order By Most Favourites',
    value: 'is_favourite',
    clearableValue: false
  },
  {
    label: 'Order By Name',
    value: 'title',
    clearableValue: false
  },
  {
    label: 'Order By Created Date',
    value: 'created_at',
    clearableValue: false
  }
];

const TemplatesHeader = ({loading}) => {
  const [{activeTab, page, title}, setQueryParams] = useAddProjectRoute();
  const [search, setSearchTerm] = useState(title);

  return(
    <>
      <div className={'col4'}>
        <div className={filterInputStyles.wrapper} style={{maxWidth: '100%'}}>
          <TextInput
            value={search}
            placeholder="Search projects..."
            onChange={setSearchTerm}
            disabled={loading}
            onKeyPress={({key}) => key === 'Enter' ? setQueryParams({tab: activeTab, page, title: search}) : null }
          />
          <Icon name="search" loading={loading} onClick={() => setQueryParams({tab: activeTab, page, title: search})} />
        </div>
      </div>
      <div className={'col2'}>
        <Option
          Component={SelectInput}
          value={""}
          options={filterOptions}
          // disabled={projectsLoading}
          // isLoading={projectsLoading}
          onChange={value => {
            const options = {orderBy: value, sortOrder: "ASC"};

            if (value === 'is_favourite') {
              options.sortOrder = "DESC";
            }

            return updateProjectsList(options);
          }}
          clearable={false}
          searchable={false}
          placeholder="All Niche's"
          className={styles.sortOptions}
        />
      </div>
      <div className={'col2'}>
        <Option
          Component={SelectInput}
          value={""}
          options={filterOptions}
          // disabled={projectsLoading}
          // isLoading={projectsLoading}
          onChange={value => {
            const options = {orderBy: value, sortOrder: "ASC"};

            if (value === 'is_favourite') {
              options.sortOrder = "DESC";
            }

            return updateProjectsList(options);
          }}
          clearable={false}
          searchable={false}
          placeholder="Order By"
          className={styles.sortOptions}
        />
      </div>
    </>
  );
};
export default TemplatesHeader;