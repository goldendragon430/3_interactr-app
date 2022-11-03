import React, {useState} from 'react';
import gql from "graphql-tag";
import {AGENCY_CLUB_CONTENT_PAGE_FRAGMENT, AGENCY_LANDING_PAGE_FRAGMENT} from "../../../graphql/Agency/fragments";
import {useMutation, useQuery} from "@apollo/client";
import {errorAlert} from "../../../utils/alert";
import Button from "../../../components/Buttons/Button";
import Modal from "../../../components/Modal";
import {BooleanInput, Option, TextInput} from "../../../components/PropertyEditor";
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import map from 'lodash/map'
import reverse from 'lodash/reverse';
import DropImageZone from "../../media/components/DropImageZone";

const UPDATE = gql`
    mutation updateAgenctClubDfyContent($input: UpdateAgencyClubDfyContent! ) {
        updateAgenctClubDfyContent(input: $input) {
            ...AgencyClubContentFragment
        }
    }
    ${AGENCY_CLUB_CONTENT_PAGE_FRAGMENT}
`;

const CREATE = gql`
    mutation createAgencyClubDfyContent($input: CreateAgencyClubDfyContentInput! ) {
        createAgencyClubDfyContent(input: $input) {
            ...AgencyClubContentFragment
        }
    }
    ${AGENCY_CLUB_CONTENT_PAGE_FRAGMENT}
`;


const EditDfyContentBlockModal = ({show, close, block, update, query}) => {
  const [loading, setLoading] = useState(false);

  const mutation  = (block.id) ? UPDATE : CREATE;

  const [func] = useMutation(mutation);

  const handleSubmit = async () => {

    setLoading(true);

    try {
      // Need to strip the typename away from the page object as
      // the BE doesn't like it
      const {__typename, ...input} = block;

      // We only need an actual update func if the create function is used
      // so we just pass in a empty func in this case
      const update = (block.id) ? ()=>{} : (cache, {data: {createAgencyClubDfyContent}})=>{

        const data = cache.readQuery({ query });

        cache.writeQuery({
          query,
          data: {
            result: [...data.result, createAgencyClubDfyContent]
          }
        });
      }

      const data = await func({
        variables: {
          input
        },
        update
      });

      close();
      setLoading(false);
    }
    catch(err){
      setLoading(false);

      console.error(err);
      //wording of text doesn't matter much here as it's admin only
      errorAlert({text: 'Unable to create / update block'})

    }
  };

  const handleChange =  (key, value) => {
    update(
      { ...block, ...{ [key]: value} }
    )
  }

  const {niche, landing_pages, projects, image_url} = block;

  return (
    <Modal
      width={700}
      height={800}
      heading={"Content Block"}
      onClose={close}
      show={show}
      submitButton={
        <Button icon="save" loading={loading} primary onClick={handleSubmit}>
          Save
        </Button>
      }
    >
      <div className={'grid mb-2'}>
        <div className={'col6'}>
          <Option
            label="Content Block Name"
            value={niche}
            Component={TextInput}
            onChange={val => handleChange('niche', val)}
          />
        </div>
        <div className={'col6'}>
          <label>Image</label>
          <Image image={image_url}  setImage={({src})=>handleChange("image_url", src)}/>
        </div>
      </div>
      <Tabs>
        <TabList>
          <Tab>Templates</Tab>
          <Tab>Landing Pages</Tab>
        </TabList>
        <TabPanel>
          <div style={{height: 439, overflow: 'scroll'}}>
            <ProjectsListSelect update={handleChange} selected={projects} />
          </div>
        </TabPanel>
        <TabPanel>
          <div style={{height: 439, overflow: 'scroll'}}>
            <LandingPageSelect update={handleChange} selected={landing_pages}  />
          </div>
        </TabPanel>
      </Tabs>
    </Modal>
  )
};
export default EditDfyContentBlockModal;

const PROJECTS_QUERY = gql`
    query dfyTemplates{
        result: dfyTemplates {
            id
            template_name
            template_image_url
        }
    }
`;

const ProjectsListSelect = ({selected, update}) => {
  const {data, loading, error} = useQuery(PROJECTS_QUERY);

  if (loading) return <Icon loading />;

  if(error ) return <ErrorMessage error={error} />;

  const handleSelect = (val, id) => {
    if(val) {
      // handle add to select
      if( ! selected) {
        update("projects", [].concat(id));
      }
      else {
        update("projects", selected.concat(id))
      }
    }
    else {
      // handle remove from select
      update("projects", remove(selected, id))
    }
  };

  return map(data.result , (project) =>  <ProjectListItem project={project} selected={selected} select={handleSelect} />)
}

const ProjectListItem = ({project, selected, select})=>{

  const isSelected = (selected) ? selected.includes(project.id) : false;

  return(
    <div className={'grid'}>
      <div className={'col2'}>
        <img src={project.template_image_url} className={'img-fluid'}/>
      </div>
      <div className={'col-10'}>
        <Option
          label={project.template_name}
          Component={BooleanInput}
          value={isSelected}
          onChange={val => select(val, project.id)}
        />
      </div>
    </div>
  )
}

const LANDING_PAGES_QUERY = gql`
    query agencyClubLandingPages {
        result: agencyClubLandingPages {
            ...AgencyLandingPageFragment
        }
    }
    ${AGENCY_LANDING_PAGE_FRAGMENT}
`;
const LandingPageSelect = ({selected, update}) => {
  const {data, loading, error} = useQuery(LANDING_PAGES_QUERY);
  if (loading) return <Icon loading />;

  if(error ) return <ErrorMessage error={error} />;


  const handleSelect = (val, id) => {
    if(val) {
      // handle add to select
      if( ! selected) {
        update("landing_pages", [].concat(id));
      }
      else {
        update("landing_pages", selected.concat(id))
      }
    }
    else {
      // handle remove from select
      update("landing_pages", remove(selected, id))
    }
  };

  return map(data.result , (page) =>  <LandingPageListItem page={page} selected={selected} select={handleSelect} />)
};

const LandingPageListItem = ({page, selected, select}) => {
  const isSelected = (selected) ? selected.includes(page.id) : false;

  return(
    <div className={'grid'}>
      <div className={'col2'}>
        <img src={page.image_url} className={'img-fluid'}/>
      </div>
      <div className={'col-10'}>
        <Option
          label={page.name}
          Component={BooleanInput}
          value={isSelected}
          onChange={val => select(val, page.id)}
        />
      </div>
    </div>
  )
};

const Image = ({image, setImage}) => {
  if(image) {
    return(
      <div style={{position: 'relative'}}>
        <img src={image} className={'img-fluid'}  style={{maxWidth: 250, float: 'left'}} />
        <Button red small right onClick={()=>setImage('')} style={{position: 'absolute', top: 0, right: 0}}>remove</Button>
      </div>
    )
  }

  return <DropImageZone directory="logos" onSuccess={setImage} src={image} />
}