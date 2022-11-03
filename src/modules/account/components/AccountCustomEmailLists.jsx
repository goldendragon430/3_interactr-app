import React from 'react';
import 'components/Table.module.scss';
import Button from 'components/Buttons/Button';
import { Option, TextInput, BooleanInput } from 'components/PropertyEditor';
import { CSVLink } from 'react-csv';
import Icon from 'components/Icon';
import { error } from 'utils/alert';
import PageBody from 'components/PageBody'
import { confirm } from 'utils/alert';

export default class AccountCustomEmailLists extends React.Component {
  constructor() {
    super();

    this.state = {
      customListName: '',
    };
  }

  changeListName = (e, val) => {
    this.setState({customListName: val})
  };

  enterListName = e => {
      e.key === 'Enter' && this.createCustomList();
  };

  createCustomList = () => {
    const { customListName } = this.state;

    if (!customListName.length) {
      return error({ text: 'Please fill the custom list name.' });
    }

    this.props.addCustomList({ customList: customListName });
    this.setState({customListName:''})
  };

  filterEmails = emails => {
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

  renderUpgradeMsg() {
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
                        window.open('https://interactrevolution.com/upgrade/agency-club', '_blank');
                    }}>Upgrade Now</Button>
                </p>
            </div>

        </div>
    )
  }

  onDeleteList = (listId) => () => {
    confirm({
        title: 'Are You Sure!',
        text: 'Are You Sure You Want To Delete This List?',
        confirmButtonText: 'Yes, Delete It!',
        onConfirm:  () => {
          this.props.deleteCustomList(listId)
        }
      })
    
  }

  renderCustomListSection() {
    const { customListName } = this.state;
    const { customLists } = this.props;

    return(

        <div style={{paddingRight: '50px'}}>
            <div className="form-control">
                <div className="grid" style={{alignItems: 'center', paddingTop: '0px'}}>
                   <div className="col7" >
                       <Option
                           label="Create new list"
                           Component={TextInput}
                           name="customListName"
                           value={customListName}
                           onChange={this.changeListName}
                           onKeyPress={this.enterListName}
                           placeholder={'List Name'}
                       />
                   </div>
                    <div className="col3" style={{marginTop : '-5px'}}>
                        <Button primary  onClick={this.createCustomList} >
                            <Icon name="plus" /> Create
                        </Button>
                    </div>
                </div>
            </div>
            <div className="form-control">
                <table>
                    <thead>
                    <tr>
                        <th>List Name</th>
                        <th>Email Count</th>
                        <th>Download</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        customLists.map(list => (
                            <tr key={list.id}>
                                <td>{list.custom_list_name}</td>
                                <td>{list.email_count}</td>
                                <td>
                                    <CSVLink
                                        data={this.filterEmails(list.emails)}
                                        filename={'user-email-lists.csv'}
                                    >
                                        <Icon name="download" />
                                    </CSVLink>
                                    <a onClick={this.onDeleteList(list.id)} style={{marginLeft: '30px'}}>
                                        <Icon name='trash-alt'/>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
  }

  render() {
    const { user } = this.props ;
    return (
        <PageBody
            heading="Your Custom Email Lists"
        >
                <div style={{paddingLeft: '30px'}}>
                    <div className="grid">
                        <div className="col7">
                            {/*<h2 className="form-heading">Custom Email Lists</h2>*/}
                            {(user.is_club || user.is_agency ) ? this.renderCustomListSection() : this.renderUpgradeMsg()}
                        </div>
                        <div className="col5" style={{paddingLeft: '50px', paddingRight: '50px'}}>
                            <h3 className="form-heading"><Icon name="question-circle" /> Using Custom Lists</h3>
                            <p>Custom email lists can be used instead of an Autoresponder such as Active Campaign to collect viewer emails inside your videos</p>
                            <p>First you need to create a new list then when you add a form element you can select the list from the element settings</p>
                            <p>Once you have emails in your lists you can down the lists from this page as a csv file.</p>
                        </div>
                    </div>
                </div>
        </PageBody>
    );
  }
}
