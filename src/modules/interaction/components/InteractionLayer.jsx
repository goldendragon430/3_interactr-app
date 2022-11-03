import React from 'react';
import ModalElementEditor from 'modules/element/components/ModalElementEditor';
import anime from 'animejs';
import styles from 'modules/node/components/NodePage.module.scss';
import forEach from 'lodash/forEach';
import ModalTimer from './ModalTimer';
import { selectModalElement } from 'modules/element';

@connect(null,{selectModalElement})
export default class InteractionLayer extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  timeout = false;

  handleSelectElement = (elementType, elementId) => {
     this.props.selectModalElement(elementType, elementId);
  };

  componentWillMount() {
    window.addEventListener('preview_animation', ()=>this.preview());
  }

  componentDidMount(){
    this.preview();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {modal} = this.props;
    this.myRef.current.style['background'] = modal.backgroundColour;
  }

  componentWillUnmount() {
    window.removeEventListener('preview_animation', ()=>this.preview());
  }

  preview(){
    const {modal} = this.props;
    // Clean Element
    if (this.myRef.current) {
      this.myRef.current.removeAttribute('style');
      forEach(this.layerStyles, (value, key) => {
        this.myRef.current.style[key] = value;
      });

      this.myRef.current.style['background'] = modal.backgroundColour;

      this.animate();
    }
  }



  animate() {
    const { modal } = this.props;
    // Can be not set yet
    if (modal && modal.background_animation) {
      // console.log(modal, '\n', modal.background_animation);
      const animation = modal.background_animation;
      const animationObj = window.background_animations[animation.name].anime;
      const basicTimeline = anime.timeline();

      const obj = {
        targets: this.myRef.current,
        ...animationObj,
        easing: animation.easing,
        duration: animation.duration * 1000
      };
      console.log(obj);
      basicTimeline.add(obj);
    }
  }

  layerStyles = {
    backgroundColor: '',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    height: '100%',
    width: '100%',
    willChange: 'transform'
  };

  render() {
    const { modal, grid } = this.props;
    const background_animation = (modal && modal.background_animation) || {};

    return (
      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
        {background_animation.use_timer && <ModalTimer modal={modal} />}
        <div ref={this.myRef} style={{ ...this.layerStyles, backgroundColor: modal.backgroundColour, willChange: 'transform' }}>
          &nbsp;
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
          <ModalElementEditor
              grid={grid}
              className={styles.stacked}
              elementContainers={modal.elements}
              animated={true}
              onSelectElement={this.handleSelectElement}
          />
        </div>
      </div>
    );
  }
}
