import React from "react";
import {BooleanInput, Option, TextInput} from "../../../components/PropertyEditor";
import getAsset from "../../../utils/getAsset";

/**
 * Render chapter card in chapters popup
 * @param project
 * @param nodeItem
 * @param nodeChapterItem
 * @param updateUseAsChapter
 * @param updateChapterTitle
 * @returns {*}
 * @constructor
 */
const NodeChapterCard = ({ nodeItem, nodeChapterItem, updateUseAsChapter, updateChapterTitle }) => {
    return (
        <li className="grid" style={{borderBottom: '1px solid #ccc', paddingTop: '15px', paddingBottom: '15px'}}>
            <div className="col2">
                <img src={ (nodeItem.media && nodeItem.media.thumbnail_url) || getAsset('/img/no-thumbnail.png')}  className="img-fluid" style={{borderRadius: '15px', boxShadow: '0 3px 30px rgba(0,0,0,.1), 0 3px 20px rgba(0,0,0,.1)'}} />
            </div>
            <div className="col3">
                <h3 style={{marginBottom: 0, marginTop: '25px'}}>{nodeItem.name}</h3>
            </div>
            <div className="col3">
                <Option
                    style={{marginTop: '10px'}}
                    label="Use as Chapter"
                    Component={BooleanInput}
                    value={nodeItem.use_as_chapter}
                    onChange={(val) => updateUseAsChapter(val, nodeItem.id)}
                />
            </div>
            <div className="col4" style={{paddingTop: '10px'}}>
                {nodeItem.use_as_chapter && nodeChapterItem ? (
                    <Option
                        label="Chapter Name"
                        Component={TextInput}
                        value={nodeChapterItem.title}
                        onChange={(val) => updateChapterTitle(val, nodeItem.id)}
                    />
                ) : null}
            </div>
        </li>
    );
};

export default NodeChapterCard;