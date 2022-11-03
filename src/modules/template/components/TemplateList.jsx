import React from 'react';
import TemplateCard from './TemplateCard';
import { viewTemplateList } from 'modules/template/template';
import { templatesSelector } from 'modules/template/templateSelectors';
// import Link from 'components/Buttons/LinkButton';
import cx from 'classnames'

@connect(
  templatesSelector,
  { viewTemplateList }
)
export default class TemplateList extends React.Component {
  componentWillMount() {
    this.props.viewTemplateList(this.props.table);
  }

  /**
   * Simplify the show preview button logic so it's more flexible going forward
   *
   * @param template
   * @param table
   * @returns {boolean}
   */
  showPreviewButton = (template, table) => {
    if (template.template_name === 'Blank') {
      return false;
    }

    return table === 'projects';
  };

  isLocked = template => {
    const { table, user } = this.props;
    // Add some logic here to define is user should have access to the template
    if (table === 'modals' && !this.props.user.is_club) {
      return true;
    }

    if (table === 'projects') {
      if (template.local_template) {
        return (!user.is_local);
      }

      if (template.club_template ){
        if(user.is_club && template.legacy) return false;
        if(user.evolution_club) return false;
        return true;
      }

      if(template.evolution_template){
        return (! user.evolution_pro)
      }

      if(! template.legacy){
        return (! user.evolution)
      }
    }

    return false;
  };

  render() {
    const { loading, onSelect, table, user, showClubTemplates, showLocalTemplates, showEvolutionTemplates, showEvolutionClubTemplates } = this.props;
    let { templates } = this.props;

    if (loading) {
      return <span>Loading</span>;
    }


    let large = false;

    let showUpgradeMessage = true;

    if (user.is_club) {
      showUpgradeMessage = false;
    }

    if (table === 'projects') {
      large = true;
      showUpgradeMessage = false;

      // Show local templates
      if (showLocalTemplates) {
        templates = templates.filter(template => {
          return template.local_template;
        });
      }

      // Show Evolution templates
      else if (showEvolutionTemplates)
      {
        templates = templates.filter(template => {
          return (!   template.club_template  && ! template.legacy);
        });
      }

      // Show Evolution Club templates
      else if (showEvolutionClubTemplates){
        templates = templates.filter(template => {
          return (  template.club_template && ! template.legacy);
        });
      }

      // Show Legacy templates
      else templates = templates.filter(template => {
          if(template.legacy && ! template.local_template ) return true;
          if(template.legacy && ! template.local_template ) return true;
          return false
        });
      }

    return (
      <div className="cards_grid">
        {showUpgradeMessage ? (
          <div
            style={{
              textAlign: 'center',
              display: 'block',
              marginTop: '5px',
              marginLeft: '15px',
              marginRight: '15px',
              marginBottom: '15px',
              width: '100%',
              backgroundColor: '#f3f3f3',
              paddingTop: '5px',
              paddingBottom: '5px'
            }}
          >
            <p>
              Our Popup Templates are only available to Club Members. <a href="/upgrade">Upgrade Here</a>
            </p>
          </div>
        ) : null}
        {templates.map(template => (
          <div className={cx('cards_card')} key={template.id}>
            <TemplateCard
              template={template}
              locked={this.isLocked(template)}
              onSelect={templateId => onSelect(templateId, template.legacy)}
              showPreviewButton={this.showPreviewButton(template, table)}
              large={large}
              userIsClub={user.is_club}
              userIsLocal={user.is_local}
              previewIconColor="indigo"
            />
          </div>
        ))}
      </div>
    );
  }
}
