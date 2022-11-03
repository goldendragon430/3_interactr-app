import React from 'react';
import keyDown from 'react-keydown';
import anime from 'animejs';
import forEach from "lodash/forEach";

export default class Element extends React.Component {
  handleClick = () => {
    this.props.onSelect && this.props.onSelect();
  };

  myRef = React.createRef();

  componentWillMount(){
    window.addEventListener("preview_animation", ()=>this.preview())
  }

  componentDidMount() {
    this.preview();
  }

  componentWillUnmount() {
    window.removeEventListener('preview_animation', ()=>this.preview());
  }

  preview(){
    this.myRef.current.removeAttribute('style');
    forEach(this.props.style, (value, key) => {
      this.myRef.current.style[key] = value;
    });


    this.animate();
  }


  animate() {
    const { animated, animation } = this.props;
    if (!animated) return;
    if (animation) {
      const a = window.element_animations[animation.name];
      const animationObj = (a) ? a.anime :  window.element_animations['FadeIn'].anime;
      const basicTimeline = anime.timeline();

      const obj = {
        targets: this.myRef.current,
        ...animationObj,
        delay: animation.delay * 1000,
        easing: animation.easing,
        duration: animation.duration * 1000
      };
      basicTimeline.add(obj);
    }
  }

  @keyDown('delete', 'backspace')
  delete(e) {
    if (this.props.selected) {
      this.props.onDelete && this.props.onDelete();
    }
  }

  render() {
    const { children, id, style, className, selected } = this.props;
    return (
      <div
        ref={this.myRef}
        data-elemkey={id && id.toString()}
        style={{
          ...style,
          outline: selected && '2px dashed rgba(17, 51, 72,0.8)',
          willChange: 'transform'
          //boxShadow: selected && '0 0 5px 0 #fff'
        }}
        className={className}
        onClick={this.handleClick}
      >
        {children}
      </div>
    );
  }
}
