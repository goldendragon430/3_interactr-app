import {gql}  from '@apollo/client';



/**
 * Fragment for the form element fields
 * @type {DocumentNode}
 */
export const FORM_ELEMENT_FRAGMENTS= gql`
    fragment FormElementFragment on FormElement {
        id
        created_at
        show_name_field
        integration
        integration_list
        sub_user
        action
        actionArg
        open_in_new_tab
        posX
        posY
        width
        height
        on_one_line
        button_html
        button_background
        button_borderRadius
        button_borderWidth
        button_borderColor
        button_borderType
        button_text_color
        input_background
        input_color
        input_borderRadius
        input_borderWidth
        input_borderColor
        input_borderType
        is_template
        template_image_url
        template_name
        name
        padding
        borderRadius
        backgroundColour
        button_paddingSides
        zIndex
        success_text
        error_text
        debug_mode
        email_placeholder_text
        name_placeholder_text
        button_letterSpacing
        integration_webhook
        custom_list_id
        data_handler
        send_facebook_onSubmit_event
        facebook_onSubmit_event_id
        border_width
        border_type
        border_color
        facebook_onSubmit_event_id
        send_facebook_onSubmit_event
    }
`;
