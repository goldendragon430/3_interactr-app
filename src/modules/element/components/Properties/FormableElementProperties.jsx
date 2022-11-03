import React from 'react';
import {
    Section,
    Option,
    BooleanInput,
    TextInput,
    SelectInput,
    ColorInput,
    RangeInput
} from 'components/PropertyEditor';
import SelectCustomList from "../../../customLists/components/SelectCustomList";
import AddCustomListModal from "../../../customLists/components/AddCustomListModal";
import { SelectIntegration, SelectList, SelectSubUser, SelectSubUserIntegration } from "modules/integration/components";
import {useAuthUser} from "../../../../graphql/User/hooks";
import {useCustomLists} from "../../../../graphql/CustomList/hooks";
import { useIntegrationLists } from "modules/integration/utils";
import {motion} from "framer-motion";
import {getAcl} from "../../../../graphql/LocalState/acl";
import {useReactiveVar} from "@apollo/client";

/**
 *
 * @param element
 * @param update
 * @param tabAnimation
 * @returns {null|*}
 * @constructor
 */
const FormableElementProperties = ({element, update, tabAnimation}) => {
    if(! element) return null;

    const [customLists, _, {loading: loadingCustomLists}] = useCustomLists();
    const [getLists, {lists, loadingLists, error: fetchListsError}] = useIntegrationLists();

    const acl = useReactiveVar(getAcl);

    const {
        data_handler,
        show_name_field,
        on_one_line,
        padding,
        borderRadius,
        backgroundColour,
        success_text,
        error_text,
        name_placeholder_text,
        email_placeholder_text,
        custom_list_id,
        integration,
        integration_webhook,
        integration_list,
        sub_user
    } = element;



    const useAutoresponders = data_handler === 'autoresponder' || ! acl.canUseCustomLists ;
    // data handler SelectInput options
    const dataHandlerSelectOptions = {autoresponder: 'Autoresponders'};
    if(acl.canUseCustomLists) dataHandlerSelectOptions.custom_list = 'Custom Lists';

    const listIntegrationsBySubUser = id => {
        update('integration', null);
        update('integration_list', null);
        update('sub_user', parseInt(id));
    };

    const renderCustomListOptions = () => {
        const onSuccess = customListId => {
            update('custom_list_id', customListId);
        };

        return ((acl.hasAgency) ? <div className="grid">
            <div className="col10">
                <Option
                    label="Custom List"
                    value={custom_list_id}
                    Component={SelectCustomList}
                    loadingCustomLists={loadingCustomLists}
                    customLists={customLists}
                    onChange={val => update('custom_list_id', val)}
                />
            </div>
            <div className="col2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AddCustomListModal onSuccess={onSuccess} />
            </div>
        </div> : null )
    };

    const renderAutoResponderOptions = () => {
        const isParentUsingSubUserAutoresponder = acl.hasAgency && sub_user ;

        const changeCampaignListHandler = (val) => {
            if (typeof val === 'object' && val.label === 'Select List') return;

            update('integration_list', val);
        };

        const changeAutoResponder = integrationType => {
            getLists(integrationType, sub_user);
            update('integration', integrationType);
        };

        return (
            <div>
                {acl.hasAgency ? (
                    <Option
                        label="Select a User"
                        value={sub_user.toString()}
                        Component={SelectSubUser}
                        onChange={listIntegrationsBySubUser}
                    />
                ) : null}

                <Option
                    label="Autoresponder"
                    style={{marginTop: '20px'}}
                    value={integration}
                    subUserId={sub_user} // gets passed down to selectSubUserIntegration if relevant
                    Component={ isParentUsingSubUserAutoresponder ? SelectSubUserIntegration : SelectIntegration}
                    onChange={changeAutoResponder}
                />

                { integration &&
                (integration === 'integration_zapier' ? (
                    <Option
                        label="Zapier Webhook"
                        style={{marginTop: '20px'}}
                        value={integration_webhook}
                        Component={TextInput}
                        onChange={val => update('integration_webhook', val)}
                        helpText="zapierWebhookProperty"
                        subUserId={sub_user}
                    />
                ) :
                    <Option
                        lists={lists}
                        label="List/Campaign"
                        style={{marginTop: '20px'}}
                        value={integration_list}
                        errorMessage={fetchListsError}
                        Component={SelectList}
                        loading={loadingLists}
                        integrationType={integration}
                        subUserId={isParentUsingSubUserAutoresponder ? sub_user : null }
                        onChange={changeCampaignListHandler}
                    />
                )}
            </div>
        )
    };


    return (
      <motion.div {...tabAnimation}>
            <Section title="Form Behaviour">
                <Option
                    label="Email handler"
                    value={data_handler}
                    Component={SelectInput}
                    options={dataHandlerSelectOptions}
                    onChange={val => update('data_handler', val)}
                />
                {useAutoresponders ?
                    renderAutoResponderOptions() :
                    renderCustomListOptions()
                }
            </Section>

            <Section title="Form Options" >
                <Option
                    label="Show name field"
                    value={show_name_field}
                    Component={BooleanInput}
                    onChange={val => update('show_name_field', val)}
                    helpText="showNameField"
                />
                <Option
                    label="Show form on one line"
                    value={on_one_line}
                    Component={BooleanInput}
                    onChange={val => update('on_one_line', val)}
                    helpText="formOnOneLine"
                />
                <Option
                    label="Email field label"
                    value={email_placeholder_text}
                    Component={TextInput}
                    onChange={val => update('email_placeholder_text', val)}
                />

                {show_name_field > 0 && (
                    <Option
                        label="Name field label"
                        value={name_placeholder_text}
                        Component={TextInput}
                        onChange={val => update('name_placeholder_text', val)}
                    />
                )}
                <Option
                    label="Success Message"
                    value={success_text}
                    Component={TextInput}
                    onChange={val => update('success_text', val)}
                    helpText="successAutoResponderMessage"
                />
                <Option
                    label="Error Message"
                    value={error_text}
                    Component={TextInput}
                    onChange={val => update('error_text', val)}
                    helpText="errorAutoResponderMessage"
                />
            </Section>
      </motion.div>
    );
};

export default FormableElementProperties;