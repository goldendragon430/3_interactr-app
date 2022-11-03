import React from 'react';
import styles from './zoomControl.module.scss';
import IconButton from 'components/Buttons/IconButton';
import {useComposerCommands} from "../../../graphql/LocalState/composer";

function ZoomControl() {
  const {updateZoom} = useComposerCommands();

  return (
    <div className={styles.wrapper}>
      <IconButton white grouped icon="minus" onClick={() => updateZoom(0.1)} />
      <IconButton white grouped icon="plus" onClick={() => updateZoom(-0.1)} />
      <IconButton white grouped icon="undo" onClick={() => updateZoom('reset')} />
    </div>
  );
}
export default React.memo(ZoomControl)