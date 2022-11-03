import React from 'react';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import styles from './GlobalSearch.module.scss';
import {projectPath} from "../modules/project/routes";
import {nodePath} from "../modules/node/routes";

@connect(globalSearchSelector,{})
export default class GlobalSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filteredItems: props.searchables,
			searching: false
		};
	}

	onChange = e => {
		const value = e.target.value.trim();
		const filteredItems = this.props.searchables.filter(item =>
			item.searchable.includes(value)
		);
		this.setState({ filteredItems: filteredItems, searching: !!value });
	};

	renderItem = item => {
        const key = Math.random() * Number(item.id);
		let icon = '', text = '', detail = '', link='';
		switch (item.type) {
			case 'project':
				icon = 'th-large';
                text = item.title;
                link=projectPath({projectId: item.id})
				break;
			case 'node':
				icon = 'cube';
                text = item.name;
				link=nodePath({projectId: item.project_id, nodeId:item.id})
				detail = item.description
				break;
			case 'subUser':
				icon = 'user';
				text = item.name;
                detail = item.email;
                link = '/agency';
				break;
			case 'media':
				icon = 'video';
                text = item.name;
                link = `/videos/${item.id}`
				break;
			default:
				return;
		}
		return (
			<li key={key} className={styles.item}>
				<Link to={link} className={styles.itemInfo} onClick={()=>{this.setState({searching:false})}}>
                    <span className={styles.itemText}>{text}</span>
                    {!!detail && <small>{detail}</small> }
                </Link>
				<Icon name={icon} className={styles.itemIcon} />
			</li>
		);
	};
	render() {
		const { filteredItems, searching } = this.state;
		return (
			<div className={styles.wrapper}>
				<input
					type="text"
					onChange={this.onChange}
                    placeholder="Search For Something ... "
                    className={styles.searchInput}
				/>
				<Icon name="search" className={styles.searchIcon}/>
				{searching && (
					<ul className={styles.list}>{filteredItems.map(this.renderItem)}</ul>
				)}
			</div>
		);
	}
}
