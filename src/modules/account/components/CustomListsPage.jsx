import React, {useEffect, useState} from 'react';
import 'components/Table.module.scss';
import Button from 'components/Buttons/Button';
import { Option, TextInput, BooleanInput } from 'components/PropertyEditor';
import { CSVLink } from 'react-csv';
import Icon from 'components/Icon';
import { error } from 'utils/alert';
import PageBody, {animationState, preAnimationState, transition} from 'components/PageBody'
import { confirm } from 'utils/alert';
import {useCreateCustomList, useCustomLists, useDeleteCustomList} from "../../../graphql/CustomList/hooks";
import _map from 'lodash/map';
import _size from 'lodash/size';
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {accountPath} from "../routes";
import {AnimatePresence, motion} from "framer-motion";
import {dashboardPath} from "../../dashboard/routes";
import {errorAlert} from "../../../utils/alert";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import cx from "classnames";
import {Table, TableColumn, TableHeading, TableRow} from "../../../components/Table";

/**
 * Render user custom lists page, to create/delete custom list items
 * @returns {*}
 * @constructor
 */
const CustomListsPage = () => {
    const [custom_list_name, setCustomListName] = useState('');
    const [deletingId, setDeletingId] = useState('');
    const [customLists, _, {loading: loadingCustomLists}] = useCustomLists();
    const [createCustomList, {loading: creating}] = useCreateCustomList();
    const [deleteCustomList, {loading: deleting}] = useDeleteCustomList();


    setBreadcrumbs([
        {text: 'Account', link: accountPath()},
        {text: 'Custom Lists'}
    ]);

    setPageHeader('Manage Your Custom Lists')

    if (loadingCustomLists) return <Icon loading />;

    const handleCreateCustomList = async () => {
        if (!custom_list_name) {
            return error({ text: 'Please fill the custom list name.' });
        }

        try {
            await createCustomList({ custom_list_name });
            setCustomListName('');
        } catch (e) {
            errorAlert({text: e});
        }
    };

    const enterListName = e => {
        e.key === 'Enter' && handleCreateCustomList();
    };

    const filterEmails = emails => {
        return emails.map((item, key) => {
            const fields = {
                ID: ++key,
                Email: item.email,
                'Created At': item.created_at
            };
            if (item.name) fields.Name = item.name;
            return fields;
        });
    };

    const renderUpgradeMsg = () => {
        return(
            <div style={{paddingTop: '10px'}}>
                <h3><strong><i className={'fa fa-lock'}></i>Exclusive Feature</strong></h3>
                <div>
                    <p style={{marginTop: '10px'}}>
                        Custom Email lists are a feature exclusively available for club users and agencies. You can upgrade your account <a href="http://special.interactr.io/interactr-club/a.html" target="_blank">here</a> or head over the docs to read more about what you can do with custom lists.
                    </p>
                </div>
                <div>
                    <p>
                        <Button primary onClick={()=>{
                            window.open('http://special.interactr.io/interactr-club/a.html', '_blank');
                        }}>Upgrade Now</Button>
                    </p>
                </div>

            </div>
        )
    };

    const onDeleteList = listId => () => {
        confirm({
            title: 'Are You Sure!',
            text: 'Are You Sure You Want To Delete This List?',
            confirmButtonText: 'Yes, Delete It!',
            onConfirm:  () => {
                setDeletingId(listId);
                try {
                    deleteCustomList(null, parseInt(listId));
                } catch (e) {
                    errorAlert({text: e});
                }
            }
        })
    };

    const renderCustomListSection = () => {
        return(
            <>
                <div className={'grid'} style={{maxWidth: '1460px'}}>
                    <div className={'col11'} style={{marginBottom:'15px'}}>
                        <h1 style={{marginTop: 0}}>Custom Lists</h1>
                        <p style={{maxWidth:'1000px'}}>
                            If you don't want to integrate interactr with an autoresponder but still want to collect emails from your interactive videos
                            you can do this with custom lists.
                            Firstly create a new list below then inside the properties of your email element you can select custom list as the
                            integration type and choose the list you've created.
                            Once you have emails in the list you can down them to import into a CRM or autoresponder by clicking the download link next
                            to the required list.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Option
                              label="Create new list"
                              Component={TextInput}
                              name="customListName"
                              value={custom_list_name}
                              onChange={val => setCustomListName(val)}
                              onKeyPress={enterListName}
                              placeholder='List Name'
                              style={{width: 500, display: 'block'}}
                            />
                            <Button primary icon="plus" loading={creating} onClick={handleCreateCustomList} style={{marginLeft: 20}}>Create</Button>
                        </div>
                    </div>
                </div>
                {
                    customLists.length > 0 ?
                    <div style={{marginLeft: '-15px'}}>
                        <div className={cx('col12')} style={{ marginTop: '10px', maxWidth: '1280px' }}>
                            <Table>
                                <TableHeading>
                                    <TableColumn span={4}>List Name</TableColumn>
                                    <TableColumn span={4}>Email Count</TableColumn>
                                    <TableColumn span={3}>Download</TableColumn>
                                </TableHeading>
                                {_map(customLists, list => (
                                    <TableRow key={list.id}>
                                        <TableColumn span={4}>{list.custom_list_name}</TableColumn>
                                        <TableColumn span={4}>{_size(list.emails)}</TableColumn>
                                        <TableColumn span={3}>
                                            <Button
                                                red
                                                small
                                                icon="trash-alt"
                                                loading={deleting && list.id === deletingId}
                                                onClick={onDeleteList(list.id)}
                                            />
                                            <CSVLink
                                                data={filterEmails(list.emails)}
                                                filename={'user-email-lists.csv'}
                                            >
                                                <Button primary small> Download List</Button>
                                            </CSVLink>
                                        </TableColumn>
                                    </TableRow>
                                ))}
                            </Table>
                        </div>
                    </div>
                    :
                    <div style={{ width: '35%'}}>
                        <div style={{textAlign: 'center', marginTop: 20, display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                            <h1 style={{ marginBottom: 0 }}>
                            <Icon name='exclamation-triangle' size={'lg'} />
                            </h1>
                            <h2>No Custom Lists ...</h2>
                        </div>
                    </div>
                }
            </>
        )
    };

    return (
      <AnimatePresence>
          <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}
          >
              <div style={{paddingLeft: '30px'}}>
                  {renderCustomListSection()}
              </div>
          </motion.div>
      </AnimatePresence>
    );
};

export default CustomListsPage;