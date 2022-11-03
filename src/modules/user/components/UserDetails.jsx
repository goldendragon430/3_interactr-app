import React from 'react';
import Button from 'components/Buttons/Button';
import {useLoginAsUser} from "../../auth/utils";
import {useProjectsById} from "../../../graphql/Project/hooks";
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import size from 'lodash/size';
import Icon from "../../../components/Icon";
import styles from "./UserDetails.module.scss";
import cx from "classnames";
import {TableColumn, TableRow} from "../../../components/Table";
import getAsset from "../../../utils/getAsset";
import {Menu, MenuButton, MenuItem, SubMenu} from "@szhsin/react-menu";
import ReactTooltip from "react-tooltip";

/**
 * The single user item for login or editing settings
 * @param id
 * @param name
 * @param email
 * @param onSelect
 * @param read_only
 * @param isAdminPage
 * @param subUserProjects
 * @returns {*}
 * @constructor
 */
const UserDetails = ({id, name, email, avatar_url, company_name, logo, onSelect, read_only, isAdminPage, projects: subUserProjects}) => {
  const [loginAsUser, {loading, error}] = useLoginAsUser();

    const onLoginAsUser = () => {
    // If logged in user is agency NOT and admin, save the parent user data in local storage to show in logged in sub user account
    const saveOnStorage = ! isAdminPage;

    loginAsUser({
      userId: id,
      saveOnStorage
    })
  };

  const avatar = (avatar_url) ? avatar_url : getAsset('/img/avatar-logo.png')

  return(
    <TableRow>
      <TableColumn span={2}>
        <img src={avatar} className={styles.avatar} />
        <p style={{marginLeft: '50px', marginTop: '2px'}}>
          {name}<br/>
          <small>{email}</small>
        </p>
      </TableColumn>
      <TableColumn span={2}>
        <p>
          {(company_name) ? company_name : '-'}
        </p>
      </TableColumn>
      <TableColumn span={2}>
        <p>
          {(logo) ? <img src={logo} className={'img-fluid'}/> : '-'}
        </p>
      </TableColumn>
      <TableColumn span={2}>
        {read_only ? (
          <div className={cx(styles.label, styles.readOnly)}>
            Read Only
          </div>
        ) : (
          <div className={cx(styles.label, styles.fullAccess)}>
            Full Access
          </div>
        )}

      </TableColumn>
      <TableColumn span={3}>
        {!!subUserProjects && <ProjectThumbnails projectIds={subUserProjects} />}
      </TableColumn>
      <TableColumn span={1}>
        <div style={{float: 'right', marginTop: '3px'}}>
          <Menu menuButton={<MenuButton><Icon name={'ellipsis-v'} style={{marginRight: 0}} /></MenuButton>}>
            <MenuItem onClick={()=> onSelect(id)}>Edit User</MenuItem>
            <MenuItem onClick={onLoginAsUser} >Login As User</MenuItem>
          </Menu>
        </div>
      </TableColumn>
    </TableRow>
    )
};

export default UserDetails;

const ProjectThumbnails = ({projectIds}) => {
  const [projects, {loading, error}] = useProjectsById({projectIds});

  if(loading) return <Icon loading />

  if(error) return null;

  if(! projects || !projects.length) return null;

  return (
    <div className={styles.projectImages}>
      <ReactTooltip className="tooltip" />
      { map(projects, (project, index) => (<ProjectThumb image={project.thumbnails[0]} index={index} name={project.title} />)) }
      <ProjectThumbnailOverflow numberOfProjects={projects.length} />
    </div>
  )
};

const ProjectThumb = ({image, index, name}) => {
  if(index > 9) return null;

  const style = {
    left: (index * 20 ) + 'px',
    zIndex: (100 + index)
  }

  return (
    <div className={styles.projectImage} style={style} data-tip={name}>
      <img src={image || getAsset('/img/no-thumb.jpg')} className={'img-fluid'} />
    </div>
  )
}

// Handle when we have more projects than we can
// show in the table
const ProjectThumbnailOverflow = ({numberOfProjects}) => {
  if (numberOfProjects < 9) return null;

  const additionalProjects = numberOfProjects - 9;

  return <div className={styles.projectThumbOverflow}> + {additionalProjects} <br/> More</div>
};