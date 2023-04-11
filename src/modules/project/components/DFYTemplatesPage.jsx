import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../dashboard/routes";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import {gql, useQuery} from "@apollo/client";
import {PAGINATOR_FIELDS, useURLQuery} from "../../../graphql/utils";
import ProjectTemplateList from "../../project/components/ProjectTemplateList";
import Icon from "../../../components/Icon";
import filterInputStyles from "../../../components/FilterInput.module.scss";
import {TextInput} from "../../../components/PropertyEditor";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import {useAddProjectRoute} from "../routeHooks";
import ProjectsLoading from "../../project/components/ProjectsLoading";
import ErrorMessage from "../../../components/ErrorMessage";
import {usePageLoad} from "../../../utils/hooks";

const GET_PROJECT_TEMPLATES = gql`
    query templates(
        $title: String,
        $first: Int = 50,
        $search: String = "",
        $page: Int = 1,
        $is_template: Int = 1,
        $template_is_dfy: Int = 1,
    ) {
        result: templates(
            template_name: $title,
            first: $first,
            search: $search,
            page: $page,
            is_template: $is_template,
            template_is_dfy: $template_is_dfy
        ) {
            data {
                id
                template_image_url
                template_name
                isAuthUserLike
                templateLikesCount
                templateNodesCount
                template_interactions
                storage_path
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${PAGINATOR_FIELDS}
`;

const DFYTemplatesPage = ({breadcrumb, heading}) => {

  usePageLoad(
    heading,breadcrumb
  )

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <PageWrapper>
          <PageContent />
        </PageWrapper>
      </motion.div>
    </AnimatePresence>
  )
};
export default DFYTemplatesPage;

const PageWrapper = ({children}) => {

  let {activeTab} = useParams();
  const [{page, search: q}, setTab] = useAddProjectRoute();
  const [search, setSearch] = useState(q);
  
  return (
    <div style={{ padding: '0px 30px' }}>
      <div className={'grid'} style={{maxWidth: '1460px'}}>
        <div className={'col10'}>
          <h1 style={{marginTop: 0}}>Done For You Interactive Video Templates</h1>
          <p style={{maxWidth:'1000px'}}>
          Use our premium interactive video templates to jumpstart your agency today. These interactive niche videos have ben created by our in-house production manager, pro videographers, photographers and hired actors. To demo these projects for potential clients, click the menu icon ( <Icon name="ellipsis-v" />) then choose "Get Embed Code" or "Get Share Page".
          </p>
          <p style={{marginBottom: '20px'}}>
            <div className={filterInputStyles.wrapper} >
              <TextInput  
                value={search}
                placeholder="Search Templates..."
                onChange={search => setSearch(search)}
                onKeyPress={({key}) => key === 'Enter' ? setTab({activeTab, search, page}) : null }
              />
              <Icon name="search" onClick={() => setTab({activeTab, search, page})} />
            </div>
          </p>
        </div>
        {/* Messy with the - margin but it just lines up the cards with the content above */}
        <div className={'col12'} style={{marginLeft: '-20px'}}>
          {children}
        </div>
      </div>
    </div>
  )
};

const PageContent = () => {
  const query = useURLQuery();
  const queryParams = {
    search: query.get('search') || '',
    page: parseInt(query.get('page')) || 1
  };

  const {data, loading, error, refetch} = useQuery(GET_PROJECT_TEMPLATES, { variables: queryParams });


  if(loading )  return <div style={{paddingLeft: 15}}><ProjectsLoading /></div>;


  if(error) return <ErrorMessage error={error} />;

  const onSelect = () => {};

  return  <ProjectTemplateList
    templatesData={data.result}
    refetchTemplates={refetch}
    isLocked={false}
    onSelect={onSelect}
  />
};