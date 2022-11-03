import React from "react";
import _map from "lodash/map";
import cx from "classnames";
import TemplateCard from "../../template/components/TemplateCard";
import Pagination from "../../../components/Pagination";
import {motion} from 'framer-motion'

/**
 * Render templates by cards
 * @param active
 * @param templates
 * @param isLocked
 * @param onSelect
 * @returns {*}
 * @constructor
 */
const ProjectTemplateList = ({active, templatesData, isLocked, onSelect, refetchTemplates}) => {
    const templates = templatesData?.data;
    const paginatorInfo = templatesData?.paginatorInfo;

    const showPreviewButton = (template) => {
        return template.template_name !== 'Blank';
    };

    const setIsLocked = (template) => {
        return false;
        let isLockedState = isLocked;
        if (active === 'club_template') {
            isLockedState = !template.legacy;
        }

        return isLockedState;
    };


    const list =  {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -5, scale: 0.7 },
        show: { opacity: 1, x:0, scale: 1, transition: {type: 'ease-in'} }
    }

    return (
      <>
        {
            templates?.length > 0 ?
            <div>
                <motion.div className="cards_grid clearfix"  initial="hidden" animate="show"  variants={list}>
                    {_map(templates, template => (
                        <motion.div className={cx('cards_card')} key={template.id} variants={item}>
                            <TemplateCard
                                template={template}
                                locked={setIsLocked(template)}
                                onSelect={templateId => onSelect(templateId, template.legacy)}
                                showPreviewButton={showPreviewButton(template)}
                                large={false}
                                previewIconColor="indigo"
                            />
                        </motion.div>
                    ))}
                </motion.div>
                <ProjectTemplatesPaginator
                    paginatorInfo={paginatorInfo || {}}
                    onChange={page => {
                        refetchTemplates({[active]: 1, page});
                    }}
                />
            </div>
            : <span className="grid" style={{ marginLeft: "25px"}}>No results found</span>
        } 
      </>
    )
};

const ProjectTemplatesPaginator = ({paginatorInfo, onChange}) => {
    const maxPageCount = paginatorInfo.total / paginatorInfo.perPage;
    const page = paginatorInfo.currentPage;

    return (
      <div style={{paddingLeft: '5px', paddingBottom: '50px'}}>
          <Pagination
            forcePage={parseInt(page)}
            dataCount={paginatorInfo.count}
            pageCount={maxPageCount}
            onPageChange={onChange}
          />
      </div>

    )
};

export default ProjectTemplateList;