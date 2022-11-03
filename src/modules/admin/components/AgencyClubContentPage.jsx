import React, {useEffect, useState} from 'react';
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import {AnimatePresence, motion} from "framer-motion";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import {AGENCY_CLUB_CONTENT_PAGE_FRAGMENT} from "../../../graphql/Agency/fragments";
import {usePageLoad} from "../../../utils/hooks";
import gql from "graphql-tag";
import Button from "../../../components/Buttons/Button";
import {useMutation, useQuery} from "@apollo/client";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import map from "lodash/map";
import Swal from "sweetalert2";
import {errorAlert} from "../../../utils/alert";
import EditDfyContentBlockModal from "./EditDfyContentBlockModal";



const QUERY = gql`
    query agencyClubDfyContents {
        result: agencyClubDfyContents {
            ...AgencyClubContentFragment
        }
    }
    ${AGENCY_CLUB_CONTENT_PAGE_FRAGMENT}
`



const DELETE = gql`
    mutation deleteAgencyClubDfyContent($id: ID!){
        deleteAgencyClubDfyContent(id: $id) {
            id
        }
    }
`;


const AgencyClubContentPage = () => {

  usePageLoad(
    'Agency Club Content',
    [
      {text: 'Admin', link: '/admin'},
      {text: 'Agency Club Content'},
    ]
  )

  const [show, setShow]= useState(false);

  const {data, loading, error} = useQuery(QUERY);

  const [selectedContentBlock, setSelectedContentBlock] = useState(false)

  if (loading) return <Icon loading />;

  if(error ) return <ErrorMessage error={error} />;

  const handleEdit = block => {
    setSelectedContentBlock(block);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedContentBlock(false);
  }

  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <div style={{paddingLeft: 30, paddingRight: 30, maxWidth: 1100}}>
          <Button primary className={'mb-3'} onClick={()=>setShow(true)}>New Content Block</Button>

          <PageBody blocks={data.result} handleEdit={handleEdit} />

          <EditDfyContentBlockModal
            show={show}
            close={handleClose}
            block={selectedContentBlock}
            update={setSelectedContentBlock}
            query={QUERY}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
};

export default AgencyClubContentPage;

const PageBody = ({blocks, handleEdit}) => {
  return map(blocks, block => ( <BlockListItem block={block} handleEdit={handleEdit} />) )
};

const BlockListItem = ({block, handleEdit}) => {

  const _handleEdit = ()=>{
    handleEdit(block);
  }

 return (
   <div className={'grid'} style={{borderBottom: '1px solid #f3f6fd', marginBottom: 15, paddingBottom: 15}}>
     <div className={'col2'}>
       <img src={block.image_url} className={'img-fluid'} />
     </div>
     <div className="col10">
       <h2 style={{marginTop: 10}}>
         <span>{block.niche}</span>
         <Button primary small icon={'edit'} right onClick={_handleEdit}>Edit</Button>
         <DeleteButton id={block.id}/>
       </h2>
       <p>
         Templates: { (block.projects) ? block.projects.length : "0" }&nbsp;&nbsp;&nbsp;
         Landing Pages: { (block.landing_pages) ? block.landing_pages.length : "0" }
       </p>
     </div>
   </div>
 )
};

const DeleteButton = ({id}) => {

  const [deleting, setDeleting] = useState(false)

  const [$delete] = useMutation(DELETE, {
    variables:{id},
    update(cache, {data: {deleteAgencyClubDfyContent}}){
      const data = cache.readQuery({ query: QUERY });

      cache.writeQuery({
        query: QUERY,
        data: {
          result: data.result.filter( item => item.id !== id)
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
      title: 'Delete content block',
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

  return <Button red small icon={'trash-alt'} right onClick={handleDelete} loading={deleting}>Delete</Button>;
}