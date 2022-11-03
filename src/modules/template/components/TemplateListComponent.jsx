import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

// utils and other stuff
import styles from './TemplateListComponent.module.scss';

// components
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ErrorMessage from 'components/ErrorMessage';
import TemplateCard from 'modules/template/components/TemplateCard';
import Button from 'components/Buttons/Button';
import _orderBy from 'lodash/orderBy';
import { Link } from 'react-router-dom';
import CopyModalComponent from 'modules/modal/components/CopyModalComponent';
import CopyInteractionLayerComponent from 'modules/modal/components/CopyInteractionLayerComponent';
import Spinner from 'components/Spinner';

export default function TemplateListComponent({
  resource,
  filter,
  title,
  show,
  onClose,
  height,
  width,
  isModal,
  onSelectTemplate,
  offerBlankOption,
  interactionLayerPopup,
}) {
  const [templates, setTemplates] = useState(null);
  const [fetching, setFetching] = useState(false);


  // Fetches the templates
  useEffect(() => {
    async function callTemplatesEndpoint() {
      setFetching(true);
      try {
        const res = await phpApi(`templates/${resource}/${filter || ''}`);
        const fetchedTemplates = await res.json();
        let orderedTemplates = _orderBy(fetchedTemplates, ['evolution_pro_template'], 'asc');
        // @TODO: filter should be in api side

        setTemplates(orderedTemplates);
        setFetching(false);
      } catch (error) {
        setFetching(false);
      }
    }
    callTemplatesEndpoint();
  }, [resource, filter]);

  async function handleTemplateSelected() {
    try {
      setFetching(true);
      onSelectTemplate && (await onSelectTemplate(arguments));
    } finally {
      setFetching(false);
    }
  }

  const renderTemplatesList = (templates) => {
    return !templates.length ? (
      <ErrorMessage icon="exclamation-circle" msg="No templates found for this element type" />
    ) : (
      templates.map((template) => {
        const locked = template.evolution_pro_template && !user.evolution_pro;
        return (
          <div key={template.id} className={styles.template_container}>
            <TemplateCard template={template} locked={locked} noPreview onSelect={handleTemplateSelected} />
          </div>
        );
      })
    );
  };

  function showUpgradeMessage() {
    const show = user && !user.evolution_pro && !user.parent_user_id;

    return (
      show && (
        <div
          style={{
            textAlign: 'center',
            display: 'block',
            marginTop: '5px',
            marginBottom: '5px',
            width: '100%',
            backgroundColor: '#f3f3f3',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
        >
          <p>
            Upgrade to Evolution Pro to access all templates. <Link to="/upgrade">Upgrade Here</Link>
          </p>
        </div>
      )
    );
  }
  function renderContent() {
    return (
      <div className={cx(styles.templates_wrapper)}>
        <div className={styles.templates_list_wrapper}>
          {fetching ? (
            <p className="text-center w-100">
              <Spinner style={{ marginTop: 60 }} />
            </p>
          ) : (
            <React.Fragment>
              {showUpgradeMessage()}

              {Array.isArray(templates) ? (
                renderTemplatesList(templates)
              ) : (
                <ErrorMessage msg="Failed to fetch templates" />
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  if (!isModal) {
    return renderContent();
  }

  return (
    <Modal 
      show={show} 
      onClose={onClose} 
      height={height || 625} 
      width={width || 990}
      heading={title}
      submitButton= {offerBlankOption && (
        <Button
          secondary
          onClick={() => {
            onSelectTemplate && onSelectTemplate(null);
          }}
        >
          <Icon name="plus" /> Create Blank
        </Button>
      )}
    >
      <div className="h-100">
        <Tabs>
          <TabList>
            <Tab>Templates</Tab>
            <Tab>Copy</Tab>
          </TabList>
          <TabPanel>
            <div className={styles.overflow_wrapper}>{renderContent()}</div>
          </TabPanel>
          <TabPanel>
            {interactionLayerPopup ? (
              <CopyInteractionLayerComponent onDone={onClose} />
            ) : (
              <CopyModalComponent onDone={onClose} />
            )}
          </TabPanel>
        </Tabs>
      </div>
    </Modal>
  );
}
TemplateListComponent.propTypes = {
  user: PropTypes.any,
  resource: PropTypes.oneOf(['modals', 'projects', 'form_elements']).isRequired,
  onSelectTemplate: PropTypes.func.isRequired,
  isModal: PropTypes.bool.isRequired,
  filter: PropTypes.string,
  offerBlankOption: PropTypes.bool,
  title: PropTypes.string,
  show: PropTypes.bool, // show and onClose props must be present when is modal is true
  onClose: PropTypes.func, // which is the deafult
  height: PropTypes.number,
  width: PropTypes.number,
};

TemplateListComponent.defaultProps = {
  isModal: true,
  filter: '',
};
