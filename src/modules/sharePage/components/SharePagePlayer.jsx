import React from 'react';
import Script from 'react-load-script';
import styles from './sharePage.module.scss';

export default function SharePagePlayer({project, player}) {
 // const wrapperUrl = config.WRAPPER_PATH_PREFIX + "/production/" + player.version_id + "/player-wrapper.js";
 const wrapperUrl =  "/player-wrapper.js";

  if(project.published_path && !project.published_path.startsWith("https://swiftcdn6.global.ssl.fastly.net")) {
    return (
      <div className={styles.playerWrapper}>
        <div class="iv-player_responsive_padding" style={{padding:"56.25% 0 0 0", position:"relative"}} data-projectid={project.id} data-hash={project.storage_path?.split('/')[1]} data-version={player.version_id} data-context="play">
            <div class="iv-player_responsive_wrapper" style={{height:"100%", left:0, position: "absolute", top:0, width:"100%"}}>
                <div class="iv-player_embed iv-player_async_p2z7746nud videoFoam=true" style={{height:"100%", position:"relative", width:"100%"}}>
                    <div class="iv-player_swatch" style={{height:"100%", left:0, opacity:1, overflow:"hidden", position:"absolute", top:0, width:"100%"}}>
                    </div>
                </div>
            </div>
        </div>
        <Script
          url={wrapperUrl}
          onError={(err) => console.error('Wrapper Script loader error => ', err)}
          onLoad={() => console.info('Wrapper Loaded successfully')}
          // onCreate={}
        />
      </div>
    );
  }

  if(project.storage_path) {
    // !!!!!!!! *******  Remember any changes here should be done in the share page too ******** !!!!!!!!!
    return (
      <div className={styles.playerWrapper}>
        <iframe class="_vs_ictr_player" src={project.storage_path +`/index.html?cb=${randomString()}`} width={project.embed_width} height={project.embed_height} frameborder="0" allow="autoplay *" scrolling="no" ></iframe>
        <Script
            url={wrapperUrl}
            onError={(err) => console.error('Wrapper Script loader error => ', err)}
            onLoad={() => console.info('Wrapper Loaded successfully')}
            // onCreate={}
          />
      </div>
    )
  }

  return (
    <div className={styles.playerWrapper}>
      <div style={{padding: "15%", textAlign: 'center', color: 'gray'}}>
        Project Not Published Yet
      </div>
    </div>
  )
}
