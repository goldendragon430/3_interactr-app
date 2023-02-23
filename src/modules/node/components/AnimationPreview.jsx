import React, {useEffect, useRef, useState} from "react";
import anime from "animejs";
import Button from "../../../components/Buttons/Button";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import {useParams} from 'react-router-dom'

const QUERY = gql`
    query node($nodeId: ID!) {
        node(id: $nodeId) {
            id
            background_color
            media {
                id
                is_image
                thumbnail_url
            }
        }
    }
`;
const AnimationPreview = ({completeAnimation}) => {
  const {nodeId} = useParams();

  // Root node is needed to get the media to preview the node
  const {data, loading, error} = useQuery(QUERY, {
    variables:{nodeId},
    fetchPolicy: 'cache-only'
  });

  const ref = useRef(null);

  const [previewing, setPreviewing] = useState(false);

  const isFirstRun = useRef(true);

  const preview = () => {
    animate(ref, completeAnimation)
    setPreviewing(true);

    setTimeout(()=>{
      unAnimate(ref);
      setPreviewing(false);
    }, 2000)
  };

  useEffect(()=>{
    // Used to prevent the animation running on first load
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    preview();
  }, [completeAnimation]);

  if(loading || error) return null;

  return (
    <>
      <label>Preview</label>
      <div
        style={{position: 'relative', maxHeight: '250px', paddingBottom: '56.25%', display: 'flex', justifyContent: 'center', backgroundColor: '#eee', overflow: 'hidden'}}
      >
        <div ref={ref} style={{position: 'absolute', top: 0, height: '100%', width: '100%', display: 'flex', justifyContent: 'center'}}>
          <Thumbnail media={data.node.media} background_color={data.node.background_color}/>
        </div>
      </div>
      <Button small secondary icon={'play'} loading={previewing} onClick={preview} style={{marginTop: '15px'}}>Preview</Button>
    </>
  )
};
export default AnimationPreview;

const Thumbnail = ({media, background_color}) => {
  if(media) return <img src={media.thumbnail_url}  className={'img-fluid'} style={{position: 'absolute', top: 0, height: '100%'}}/>

  return <div style={{background: background_color, height: '100%', position: 'absolute', top: 0 }}>&nbsp;</div>
};

const animate = (ref, animation) => {
  if (animation) {
    const a = window.node_animations[animation];
    const animationObj = (a) ? a.anime :  window.node_animations['fadeOut'].anime;
    const basicTimeline = anime.timeline();

    const obj = {
      targets: ref.current,
      ...animationObj,
      easing: 'easeOutSine',
      duration: 750
    };

    basicTimeline.add(obj);
  }
};

const unAnimate = (ref) => {
  ref.current.removeAttribute('style');
  ref.current.style['position'] = 'absolute';
  ref.current.style['top'] = 0;
  ref.current.style['height'] = '100%';
  ref.current.style['width'] = '100%';
  ref.current.style['display'] = 'flex';
  ref.current.style['justifyContent'] = 'center';
};