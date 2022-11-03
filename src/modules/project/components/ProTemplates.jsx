import React, {useState} from "react";
import {useParams} from "react-router-dom";
import ProjectTemplateList from "./ProjectTemplateList";
import {useAddProjectRoute} from "../routeHooks";
import {PAGINATOR_FIELDS, useURLQuery} from "../../../graphql/utils";
import {useProjectTemplates} from "../../../graphql/Project/hooks";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import Icon from "../../../components/Icon";
import filterInputStyles from "../../../components/FilterInput.module.scss";
import {TextInput} from "../../../components/PropertyEditor";
import {gql, useQuery} from "@apollo/client";
import ProjectsLoading from "./ProjectsLoading";
import ErrorMessage from "../../../components/ErrorMessage";

const GET_PROJECT_TEMPLATES = gql`
    query templates(
        $title: String,
        $first: Int = 20,
        $search: String = "",
        $page: Int = 1,
        $is_template: Int = 1,
        $template_is_example: Int = 1
    ) {
        result: templates(
            template_name: $title,
            first: $first,
            search: $search,
            page: $page,
            is_template: $is_template,
            template_is_example: $template_is_example
        ) {
            data {
                id
                template_image_url
                template_name
                isAuthUserLike
                templateLikesCount
                templateNodesCount
                template_interactions
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${PAGINATOR_FIELDS}
`;

/**
 * Render pro templates list
 * @param user
 * @param onSelect
 * @returns {null|*}
 * @constructor
 */
const ProTemplates = () => {
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

export default ProTemplates;

const PageWrapper = ({children}) => {
    let {activeTab} = useParams();
    const [{page, search: q}, setTab] = useAddProjectRoute();
    const [search, setSearch] = useState(q);

    return (
      <div style={{ padding: '0px 30px' }}>
          <div className={'grid'} style={{maxWidth: '1460px'}}>
              <div className={'col10'}>
                  <h1 style={{marginTop: 0}}>Example Interactive Video Templates</h1>
                  <p style={{maxWidth:'1000px'}}>
                      Here we have recreated a selection of our favourite Interactive Videos from around the web.
                      These templates have many different styles of Interactive Video and can be used as inspiration for your next
                      project. Interactr doesn't own the right to the videos inside some of these projects. They're intended to be used for inspiration only.
                  </p>
                  <p style={{marginBottom: '25px'}}>
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

    const {data, loading, error} = useQuery(GET_PROJECT_TEMPLATES, { variables: queryParams });

    if(loading ) return <div style={{paddingLeft: 15}}><ProjectsLoading /></div>;

    if(error) return <ErrorMessage error={error}  />;

    const onSelect = () => {};

    return  <ProjectTemplateList
      templatesData={data.result}
      isLocked={false}
      onSelect={onSelect}
    />
};