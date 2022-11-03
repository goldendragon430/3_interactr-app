import React, {useState} from 'react';
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import {AnimatePresence, motion} from "framer-motion";
import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/client";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import map from 'lodash/map'
import Button from "../../../components/Buttons/Button";
import {setClientModal} from "../../../graphql/LocalState/clientModal";
import Modal from "../../../components/Modal";
import {Option, TextInput} from "../../../components/PropertyEditor";
import {AGENCY_LANDING_PAGE_FRAGMENT} from "../../../graphql/Agency/fragments";
import {errorAlert} from "../../../utils/alert";
import DropImageZone from "../../media/components/DropImageZone";
import Swal from "sweetalert2";
import {usePageLoad} from "../../../utils/hooks";


const LANDING_PAGES_QUERY = gql`
    query agencyClubLandingPages {
        result: agencyClubLandingPages {
            ...AgencyLandingPageFragment
        }
    }
    ${AGENCY_LANDING_PAGE_FRAGMENT}
`;


const LandingPagesPage = () => {

  usePageLoad(
    'Landing Pages',
    [
      {text: 'Admin', link: '/admin'},
      {text: 'Landing Pages'},
    ]
  )


  const {data, loading, error} = useQuery(LANDING_PAGES_QUERY);

  const [selectedPage, setSelectedPage] = useState(false);

  const [show, setShow] = useState(false);

  if (loading) return <Icon loading />;

  if(error ) return <ErrorMessage error={error} />;

  const handleEdit = (page) => {
    setSelectedPage(page);
    setShow(true);
  };

  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <div style={{paddingLeft: 30, paddingRight: 30, maxWidth: 1100}}>
          <Button primary className={'mb-3'} onClick={()=>setShow(true)}>New Landing Page</Button>
          <PageBody pages={data.result} handleEdit={handleEdit} />

          <EditModal show={show} close={()=>{setSelectedPage(false); setShow(false)}} page={selectedPage} update={setSelectedPage} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
};

export default LandingPagesPage;


const PageBody = ({pages, handleEdit}) => {
  return map(pages, page => <LandingPageListItem page={page} handleEdit={handleEdit} />)
};


const DELETE = gql`
  mutation deleteLandingPage($id: ID!){
      deleteLandingPage(id: $id) {
          id
      }
  }
`;

const LandingPageListItem = ({page, handleEdit}) => {
  const _handleEdit = () => {
    handleEdit(page)
  };

  const [deleting, setDeleting] = useState(false);

  const [$delete] = useMutation(DELETE, {
    variables:{
      id: page.id
    },
    update(cache, {data: {deleteLandingPage}}){
      const data = cache.readQuery({ query: LANDING_PAGES_QUERY });

      cache.writeQuery({
        query: LANDING_PAGES_QUERY,
        data: {
          result: data.result.filter( landingPage => landingPage.id !== page.id)
        }
      });
    }
  });

  const confirmDelete = async () => {
    setDeleting(true);
    try  {
      await $delete();
    }catch(err){
      console.error(err);
      errorAlert({text: 'Unable to delete item'})
    }
    setDeleting(false);
  }

  const handleDelete = () => {
    Swal.fire({
      title: 'Delete landing page',
      text: 'Are you sure you wish to delete this ?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#ff6961',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if(result.isConfirmed) {
        confirmDelete();
      }
    });
  };


  return(
    <div className={'grid'} style={{borderBottom: '1px solid #f3f6fd', marginBottom: 15, paddingBottom: 15}}>
      <div className="col2">
        <img src={page.image_url} className="img-fluid" />
      </div>
      <div className="col10">
        <h2 style={{marginTop: 10}}>
          <span>{page.name}</span>
          <Button primary small icon={'edit'} right onClick={_handleEdit}>Edit</Button>
          <Button red small icon={'trash-alt'} right onClick={handleDelete} loading={deleting}>Delete</Button>
        </h2>
        <p>
          { (page.convertri_url) ? <><a href={page.convertri_url} target="_blank">Convertri Template</a>&nbsp;|&nbsp;</>  : null }
          { (page.clickfunnels_url) ? <> <a href={page.clickfunnels_url} target="_blank">Clickfunnels Template</a>&nbsp;|&nbsp;</>  : null }
          { (page.html_url) ? <><a href={page.html_url} target="_blank">Html Template</a>&nbsp;|&nbsp;</>  : null }
          { (page.preview_url) ? <><a href={page.preview_url} target="_blank">Preview Url</a></>  : null }
        </p>
      </div>
    </div>
  )
}


const UPDATE = gql`
    mutation updateLandingPage($input: UpdateLandingPageInput!){
        updateLandingPage(input: $input) {
            ...AgencyLandingPageFragment
        }
    }
    ${AGENCY_LANDING_PAGE_FRAGMENT}
`;

const CREATE = gql`
    mutation createLandingPage($input: CreateLandingPageInput!){
        createLandingPage(input: $input) {
            ...AgencyLandingPageFragment
        }
    }
    ${AGENCY_LANDING_PAGE_FRAGMENT}
`

const EditModal = ({show, close, page, update})=>{

  const [loading, setLoading] = useState(false);

  const mutation  = (page.id) ? UPDATE : CREATE;

  const [func] = useMutation(mutation);

  const handleSubmit = async  () => {

    if(! page.clickfunnels_url) {
      errorAlert({text: 'Landing Pages must have a clickfunnels url'})
      return;
    }

    if(! page.name) {
      errorAlert({text: 'Landing Pages must have a name'})
      return;
    }

    if(! page.preview_url) {
      errorAlert({text: 'Landing Pages must have a preview url'})
      return;
    }

    if(! page.image_url) {
      errorAlert({text: 'Landing Pages must have a preview image'})
      return;
    }


    setLoading(true);

    // Need to strip the typename away from the page object as
    // the BE doesn't like it
    const {__typename, ...input} = page;

    // We only need an actual update func if the create function is used
    // so we just pass in a empty func in this case
    const update = (page.id) ? ()=>{} : (cache, {data: {createLandingPage}})=>{

      const data = cache.readQuery({ query: LANDING_PAGES_QUERY });

      cache.writeQuery({
        query: LANDING_PAGES_QUERY,
        data: {
          result: [...data.result, createLandingPage]
        }
      });

    }

    try {
      const data = await func({
        variables: {
          input
        },
        update
      });

      setLoading(false);
    }
    catch(err){
      console.error(err);
      //wording of text doesn't matter much here as it's admin only
      errorAlert({text: 'Unable to create / update landing page'})
      setLoading(false);
    }

  };

  const handleChange =  (key, value) => {
    update(
      { ...page, ...{ [key]: value} }
    )
  }

  const {name, convertri_url, html_url, clickfunnels_url, preview_url, image_url} = page;

  const handleImageUpdate = (src) => handleChange('image_url', src);

  return (
    <Modal
      width={700}
      height={775}
      heading={"Landing Page"}
      onClose={close}
      show={show}
      submitButton={
        <Button icon="save" loading={loading} primary onClick={handleSubmit}>
          Save
        </Button>
      }
    >
      <Option
        label="Landing Page Name"
        value={name}
        Component={TextInput}
        onChange={val => handleChange('name', val)}
      />
      <Option
        label="Convertri Template Url"
        value={convertri_url}
        Component={TextInput}
        onChange={val => handleChange('convertri_url', val)}
      />
      <Option
        label="Clickfunnels Template Url"
        value={clickfunnels_url}
        Component={TextInput}
        onChange={val => handleChange('clickfunnels_url', val)}
      />
      <Option
        label="HTML Template Url"
        value={html_url}
        Component={TextInput}
        onChange={val => handleChange('html_url', val)}
      />
      <Option
        label="Preview Url"
        value={preview_url}
        Component={TextInput}
        onChange={val => handleChange('preview_url', val)}
      />
      <label>Preview Image</label>
      <PreviewImage image={image_url}  setImage={({src})=>handleImageUpdate(src)}/>
    </Modal>
  )
};

const PreviewImage = ({image, setImage}) => {

  if(image) {
    return(
      <div >
        <img src={image} className={'img-fluid'}  style={{maxWidth: 250, float: 'left'}} />
        <Button red small right onClick={()=>setImage('')}>remove</Button>
      </div>
    )
  }

  return <DropImageZone directory="logos" onSuccess={setImage} src={image} />
};