import times from "lodash/times";
import cx from "classnames";
import styles from "./ProjectsPage.module.scss";
import cardstyles from "../../../components/Card.module.scss";
import ContentLoader from "react-content-loader";
import React from "react";

export default function ProjectsLoading () {
    return (
        <div style={{display: 'inline-block'}}>
            {
            times(8, (i)=>(
                <article className={cx('cards_card', styles.projectCard)} key={'project_list_article' + i}>
                    <div className={cardstyles.Card}>
                        <ContentLoader
                            speed={2}
                            width={300}
                            height={315}
                            viewBox="0 0 300 315"
                        >
                            {/* Only SVG shapes */}
                            <rect x="25" y="10" rx="3" ry="3" width="250" height="160" />
                            <rect x="25" y="185" rx="3" ry="3" width="250" height="25" />
                            <rect x="25" y="220" rx="3" ry="3" width="250" height="20" />
                            <rect x="25" y="255" rx="3" ry="3" width="100" height="30" />
                            <rect x="165" y="255" rx="3" ry="3" width="111" height="30" />
                        </ContentLoader>
                    </div>
                </article>
            ))}
    </div>
    );
};