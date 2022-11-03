import React, {useEffect, useState} from 'react';
import IconButton from 'components/Buttons/IconButton';
import styles from './PreviewPageUrl.module.scss'
import Button from "../../../components/Buttons/Button";
import cx from 'classnames'
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import {useProjectCommands} from "../../../graphql/Project/hooks";

const PreviewPageUrl = ({project})=>{
  const {getSharePageUrl} = useProjectCommands();

  const [copied, setCopied] = useState(false);

  const sharePageUrl = getSharePageUrl(project);

  if(! sharePageUrl ) return null;

  return (
    <div className="form-control">
      <h4 className="faded-heading">Project Sharing Url</h4>
      {sharePageUrl && project.published_at?
        <div className={cx(styles.wrapper, 'clearfix')}>
          <div className={styles.input}>
            {/*<input type="text" defaultValue={} />*/}
            <p><a href={sharePageUrl} target={'_blank'}>{sharePageUrl}</a></p>

            {copied ? (
                <Button icon="check" small>Copied</Button>
            ) :  (
                <CopyToClipboard
                    text={sharePageUrl}
                    onCopy={() => setCopied(true)}>
                  <Button icon="copy" small>Copy</Button>
                </CopyToClipboard>
            ) }

          </div>
          {/*<div className={styles.buttons}>*/}
          {/*  /!*<IconButton icon="clipboard">Copy</IconButton>*!/*/}
          {/*  <IconButton icon="link" onClick={()=>{*/}
          {/*    let win = window.open(url, '_blank');*/}
          {/*    setTimeout(()=>{*/}
          {/*      win.focus();*/}
          {/*    })*/}

          {/*  }}>Open Link</IconButton>*/}
          {/*</div>*/}
        </div>
        : <p style={{marginTop:'5px'}}><em>Publish project to generate your share page link</em></p>
      }
    </div>
  )
};
export default PreviewPageUrl;