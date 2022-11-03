import React from 'react';
import {useProject, useTemplatesById} from "../../../graphql/Project/hooks";
import styles from "./CalendarCard.module.scss";
import ContentLoader from 'react-content-loader'
import getAsset from 'utils/getAsset';
import cx from "classnames";
import ErrorMessage from "../../../components/ErrorMessage";
import ContentLoaderContainer from "../../../components/ContentLoaderContainer";
import Button from "../../../components/Buttons/Button";
import Icon from "../../../components/Icon";


const CalendarCard = ({item}) => {
  return(
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={'clearfix'}  style={{height: '128px', width: '228px'}}>
          {(item.template_id) ? <TemplateImage item={item} /> : <CardImage src={item.image} /> }
        </div>
        <div className={'clearfix'}>
          <p style={{paddingLeft: '10px'}}>{item.title}</p>
          <ActionButtons item={item} />
        </div>

      </div>
    </div>
  );
};
export default CalendarCard;

const TemplateImage = ({item}) => {
  const [templates, _, {error, loading}] = useTemplatesById([item.template_id]);

  if(error) return <ErrorMessage error={error} />;

  if(loading) return <ContentLoaderContainer height={30} width={300}>
    <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
  </ContentLoaderContainer>;

  return <CardImage src={templates[0]?.template_image_url} />
};

const CardImage = ({src}) => {
  return <img src={src} className={'img-fluid'}/>;
};

const LinkCard = () => {
  return (
    <div>
      &nbsp;
    </div>
  );
};



const Template = ({templates, index, loading}) => {
  const template = (loading) ? null : templates[index];

  return(
    <div className={styles.template_row}>
      <TemplateImage loading={loading} template={template} index={index}/>
      <ActionButtons />
    </div>
  )
};


const TemplateName = ({template, loading, index}) => {
  if(loading) {
    return(
      <ContentLoaderContainer height={30} width={300}>
        <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
      </ContentLoaderContainer>
    );
  }

  return(
    <div className={styles.text}>
      <h3>{template?.template_name}</h3>
    </div>
  );
};

const ActionButtons = () => {
  return(
    <div className={styles.buttons}>
      <Button small secondary icon="play">Preview</Button>
      <Button small primary>Select <Icon name="arrow-right"/></Button>
    </div>
  );
};