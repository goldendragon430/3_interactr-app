import React, { Component } from 'react';
import { Option, BooleanInput, TextInput, LargeTextInput } from 'components/PropertyEditor';
import Button from 'components/Buttons/Button';
import TinyMCE from 'react-tinymce';
import HelpText from 'components/HelpText';
import utilsHelpText from 'utils/helpText';
import { error } from 'utils/alert';
import PageBody from 'components/PageBody';


export default class AccountVideoSettings extends Component {
  constructor({ user }) {
    super(...arguments);

    this.state = {
      ...this.setDefaultValues(user),
      ...{
        should_stream_videos: user.should_stream_videos
      }
    };
  }

  changeHandler = (name, convertBooltoNum = false) => (e, val) => {
    let value = name === 'privacy_policy_text' ? val.getContent() : val,
      newState = {};
    if (name === 'use_custom_url' && !value) {
      newState.privacy_policy_url = this.getDefaultPrivacyPolicyURL;
    }

    newState[name] = convertBooltoNum ? Number(value) : value;

    return this.setState(newState);
  };

  validate = () => {
    return new Promise((resolve, reject) => {
      const { user, agency } = this.props;
      if (user.is_agency) {
        if (!agency) {
          return reject('Something went wrong when we retrieved your agency data, please refresh the page.');
        } else {
          const { gdpr_text, privacy_policy_url, use_custom_url } = this.state;

          if (!gdpr_text && !agency.name) {
            return reject(
              'Please set up your agency details, the Gdpr text will default to containing your agency name'
            );
          }
          if (!privacy_policy_url && use_custom_url && !agency.domain) {
            return reject(
              'Please set up your agency details, the privacy policy url will default to containing your agency domain.'
            );
          }
        }
      }

      return resolve();
    });
  };

  get getDefaultPrivacyPolicyURL() {
    const { user, agency } = this.props;
    const isAgency = user.is_agency && agency;
    let policyUrl = `/privacy-policy/${user.id}`;

    return isAgency && agency.domain ? agency.domain + policyUrl : window.location.origin + policyUrl;
  }

  defaultSettingValue = setting => {
    const { user } = this.props;

    // default values if not set

    if (user[setting]) {
      return user[setting];
    }

    let settingValue;

    switch (setting) {
      case 'gdpr_text':
        settingValue = utilsHelpText.gdprDefaultText;
        break;
      case 'privacy_policy_url':
        settingValue = this.getDefaultPrivacyPolicyURL;
        break;
      case 'privacy_policy_text':
        settingValue = utilsHelpText.privacyPolicyDefaultText;
        break;
      default:
        error({ text: 'Something went wrong setting the default' });
        return;
    }
    return settingValue;
  };

  setDefaultValues = user => {
    const state = {
      should_compress_videos: user.should_compress_videos,
      show_gdpr: user.show_gdpr,
      use_custom_url: user.use_custom_url,
      gdpr_text: user.gdpr_text,
      privacy_policy_url: user.privacy_policy_url,
      privacy_policy_text: user.privacy_policy_text
    };

    if (!state.gdpr_text) {
      state.gdpr_text = this.defaultSettingValue('gdpr_text');
    }

    if (!state.privacy_policy_url || !state.use_custom_url) {
      state.privacy_policy_url = this.defaultSettingValue('privacy_policy_url');
    }

    if (!state.privacy_policy_text) {
      state.privacy_policy_text = this.defaultSettingValue('privacy_policy_text');
    }

    return state;
  };

  handleSave = () => {
    const {
      user: { id },
      updateAccountDetails
    } = this.props;
    let data = { ...this.state };
    const { show_gdpr, gdpr_text, use_custom_url, privacy_policy_url, privacy_policy_text, ...otherSettings } = data;

    // if setting turned off, don't update PP related settings
    if (!show_gdpr) {
      updateAccountDetails(id, { show_gdpr, ...otherSettings }, true);
      return;
    }

    // If toggled use_custom_url true skip the updating privacy_policy_text.
    // Otherwise skip privacy_policy_url.
    if (use_custom_url) {
      delete data.privacy_policy_text;
    } else {
      delete data.privacy_policy_url;
    }

    this.validate()
      .then(() => updateAccountDetails(id, data, true))
      .catch(message => error({ text: message }));
  };

  showPrivacyPolicyContent = () => {
    const { privacy_policy_url } = this.state;
    if (privacy_policy_url) window.open(privacy_policy_url);
    else
      error({
        text: 'No policy url present, save your changes to generate it or input your own policy url then save changes.'
      });
  };

  renderSaveButton = props => {
    return (
      <Button {...props} primary large icon="save" onClick={this.handleSave}>
        Save Changes
      </Button>
    );
  };

  render() {
    const {
      should_compress_videos,
      show_gdpr,
      use_custom_url,
      gdpr_text,
      privacy_policy_text,
      privacy_policy_url,
      should_stream_videos
    } = this.state;

    const {
      user: { is_club }
    } = this.props;

    return (
      <PageBody heading="Video Settings" right={<AccountNav active="video" />}>
          <div style={{ padding: '30px' }}>
            <div className="grid">
              <div className="col8" style={{ position: 'relative', minHeight: 800 }}>
                <h2 className="form-heading" style={{ marginBottom: 40 }}>
                  Video Settings
                </h2>
                <div className="form-control">
                  <p>
                    Here you can change the settings of your published videos. For detailed information head over to our
                    documentation.
                  </p>
                  {is_club ? (
                    <Option
                      label="Stream Videos (Beta)"
                      Component={BooleanInput}
                      value={!!should_stream_videos}
                      onChange={this.changeHandler('should_stream_videos', true)}
                    />
                  ) : null}
                  <Option
                    label="Compress Video"
                    Component={BooleanInput}
                    value={!!should_compress_videos}
                    onChange={this.changeHandler('should_compress_videos', true)}
                  />
                  {/* <Option
                    label="Show GDPR"
                    Component={BooleanInput}
                    value={!!show_gdpr}
                    onChange={this.changeHandler('show_gdpr', true)}
                  /> */}
                  {!!show_gdpr && (
                    <div>
                      <Option
                        label="GDPR text"
                        Component={LargeTextInput}
                        rows={4}
                        value={gdpr_text}
                        placeholder="GDPR message"
                        onChange={this.changeHandler('gdpr_text')}
                      />
                      <Option
                        label="Use a custom privacy policy url"
                        Component={BooleanInput}
                        value={!!use_custom_url}
                        onChange={this.changeHandler('use_custom_url', true)}
                      />
                      {use_custom_url ? (
                        <Option
                          label="Privacy Policy URL"
                          Component={TextInput}
                          value={privacy_policy_url}
                          placeholder="http://policy_url/here"
                          onChange={this.changeHandler('privacy_policy_url')}
                        />
                      ) : (
                        <div className="form-control">
                          <label>Use our template privacy policy (Be sure to add your company name and domains) </label>
                          <TinyMCE
                            content={privacy_policy_text || ''}
                            config={{
                              plugins: 'autolink link image lists print preview',
                              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright'
                            }}
                            onChange={this.changeHandler('privacy_policy_text')}
                          />
                        </div>
                      )}

                      <div className="form-control" style={{ marginTop: '30px' }}>
                        <Button secondary right onClick={this.showPrivacyPolicyContent}>
                          View Policy Page
                        </Button>
                      </div>
                    </div>
                  )}
                  {this.renderSaveButton()}
                </div>
              </div>
            </div>
          </div>
      </PageBody>
    );
  }
}
