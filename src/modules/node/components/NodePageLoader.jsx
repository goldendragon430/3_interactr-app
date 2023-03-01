import React from 'react';
import ContentLoader from "react-content-loader";

import { ELEMENT_EDITOR_DOM_ID } from "../../interaction/utils";
import { NodeActions } from "../NodeActions";
import styles from "./NodePage.module.scss";
import NodePageLayout from "./NodePageLayout";


const NodePageLoader = () => {
  return(
    <NodePageLayout
      heading="Node Page"
      actionsComponent={<NodeActions />} // The node page buttons
    >
      <section className={styles.editor}>
        <NodeEditorLoader />
        <ElementTabsLoader />
        <InteractionBarsLoader />
      </section>
    </NodePageLayout>
  )
};
export default NodePageLoader;

export const NodeEditorLoader = () => {
  return(
    <div className={styles.playerWrapper}>
      <div id={ELEMENT_EDITOR_DOM_ID} className={styles.canvasWrapper} style={{height: 405 + 'px', width: 720 + 'px'}}>
        <ContentLoader
          speed={1}
          width={720}
          height={405}
          viewBox="0 0 720 405"
          backgroundColor="#f3f6fd"
        >
          {/* Only SVG shapes */}
          <rect x="0" y="0" rx="3" ry="3" width="720" height="405" />
        </ContentLoader>
      </div>
    </div>
  )
};

export const ElementTabsLoader = () => {
  return(
    <div className={styles.elementsTabs}>
      <div className={styles.elementsList}>
        <ContentLoader
          speed={1}
          width={720}
          height={350}
          viewBox="0 0 720 350"
          backgroundColor="#f3f6fd"
        >
          {/* Only SVG shapes */}
          <rect x="0" y="0" rx="3" ry="3" width="720" height="350" />
        </ContentLoader>
      </div>
    </div>
  )
};

export const InteractionBarsLoader = () => {
  return(
    <div className={styles.timeline}>
      <ContentLoader
        speed={1}
        width={1200}
        height={350}
        viewBox="0 0 1200 350"
        backgroundColor="#f3f6fd"
      >
        {/* Only SVG shapes */}
        <rect x="0" y="0" rx="3" ry="3" width="1200" height="350" />
      </ContentLoader>
    </div>
  )
};