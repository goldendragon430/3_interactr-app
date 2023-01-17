import React from 'react';
import Script from 'react-load-script';
import styles from './sharePage.module.scss';

function randomString(){
  return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function SharePagePlayer({project, player}) {
  let wrapperUrl =  import.meta.env.VITE_WRAPPER_URL;
  let paddingTop = "56.25%";
  if(project.embed_width == "540") paddingTop = "75%";
  else if(project.embed_width == "228") paddingTop = "177.778%";
  
  if(project.published_path && !project.published_path.startsWith("https://swiftcdn6.global.ssl.fastly.net")) {
    return (
      <div className={styles.playerWrapper}>
        <div class="iv-player_responsive_padding" style={{padding:`${paddingTop} 0 0 0`, position:"relative"}} data-hash={project.storage_path?.split('/')[1]}>
            <div class="iv-player_responsive_wrapper" style={{height:"100%", left:0, position: "absolute", top:0, width:"100%"}}>
                <div class="iv-player_embed iv-player_async_p2z7746nud videoFoam=true" style={{height:"100%", position:"relative", width:"100%"}}>
                    <div class="iv-player_swatch" style={{height:"100%", left:0, opacity:0, overflow:"hidden", position:"absolute", top:0, width:"100%"}}>
                      <img src={project.image_url} style={{filter:'blur(5px)', height:'100%', objectFit:'contain', width:'100%'}} alt="" aria-hidden="true" />
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
    wrapperUrl = import.meta.env.VITE_OLD_WRAPPER_URL;
    return (
      <div className={styles.playerWrapper}>
        <iframe class="_vs_ictr_player" src={`https://swiftcdn6.global.ssl.fastly.net/` + project.storage_path +`/index.html?cb=${randomString()}`} width={project.embed_width} height={project.embed_height} frameborder="0" allow="autoplay *" scrolling="no" ></iframe>
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
