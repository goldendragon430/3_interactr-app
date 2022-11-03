import React from 'react';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import Swal from 'sweetalert2';


export default class TimelineDragResize extends React.Component {
  constructor(props) {
    super(props);

    const {
      pos: { x, y }
    } = props;
    const newWidth = props.itemWidth;

    this.state = {
      pos: {
        x: x,
        y: y
      },
      itemWidth: newWidth,
      clicked: false,
      shouldAllowUpdate: true,
      timeIn: 0,
      timeOut: 0
    };

    this.debounceMouseMove = debounce(this.onMouseMove, 10);
    this.showDebouncedDisableWarning = throttle(this.showDisableWarning, 5000, { trailing: false });

  }

  componentWillReceiveProps(nextProps) {
    const {
      pos: { x, y }
    } = nextProps;
    const newWidth = nextProps.itemWidth;

    if (nextProps.children !== this.props.children || this.props.resizeTime !== nextProps.resizeTime) {
      this.setState({ shouldAllowUpdate: true });
      // Children change, let us force a re-render of the component.
    }

    if (newWidth !== this.state.itemWidth || x !== this.state.pos.x || this.props.resizeTime !== nextProps.resizeTime) {
      let toUpdate = {
        pos: {
          x,
          y
        },
        itemWidth: newWidth
      };

      if (window.forceUpdateTimelineBar) {
        window.forceUpdateTimelineBar = false;
        toUpdate.shouldAllowUpdate = true;
      }

      this.setState(toUpdate);
    }
  }

  shouldComponentUpdate(newProps, newState) {
    if (this.props.selected !== newProps.selected) {
      return true;
    }

    if (this.props.pos !== newProps.pos) {
      return true;
    }

    const { shouldAllowUpdate } = this.state;
    return shouldAllowUpdate;
  }


  componentDidMount() {
    this.pane.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.debounceMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

  }

  componentWillUnmount() {
    this.pane.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.debounceMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }


  showDisableWarning() {
    Swal.fire({
      title: 'Error',
      text: 'You cannot move a modal trigger. You can only change the time the modal comes in',
      icon: 'warning',
      confirmButtonColor: '#ff6961',
      confirmButtonText: 'Got it!'
    });
  }

  onMouseMove = e => {
    const { clicked } = this.state;
    const { disableResize } = this.props;

    if (clicked && clicked.isMoving) {
      if (disableResize) {
        if (e.clientX > clicked.mouseClickX + 5 || e.clientX < clicked.mouseClickX - 5) {
          this.showDebouncedDisableWarning();
        }
        return;
      }

      const clientXDeductOffset = e.clientX - clicked.cursorOffset;
      if (clientXDeductOffset < clicked.leftEdge) {
        // do not allow it to go off the left hand side.
        // the smaller size must be 0.1px otherwise the elementGroups won't work.
        this.pane.style.left = '0.0px';
        return;
      }

      if (clientXDeductOffset + clicked.startPaneWidth > clicked.rightEdge) {
        // do not allow it to go off the right hand side.
        this.pane.style.left = clicked.rightEdge - clicked.leftEdge - clicked.startPaneWidth + 'px';
        return;
      }

      this.pane.style.left = clientXDeductOffset - clicked.leftEdge + 'px';
    }

    if (clicked && clicked.isResizing) {
      if (clicked.edge === 'right' && disableResize) {
        // cannot drag right on disble
        return;
      }
      const currentMouseX =
        clicked.edge === 'left' ? e.clientX - clicked.cursorOffset : e.clientX + clicked.cursorOffset;

      if (currentMouseX < clicked.leftEdge || currentMouseX > clicked.rightEdge) {
        if (currentMouseX > clicked.rightEdge) {
          this.pane.style.width = clicked.rightEdge - clicked.leftEdge - this.removePx(this.pane.style.left) + 'px';
        }

        if (currentMouseX < clicked.leftEdge) {
          const newWidth = clicked.startPaneWidth - (clicked.leftEdge - clicked.mouseClickX);
          // the smaller size must be 0.1px otherwise the elementGroups won't work.
          this.pane.style.left = '0.1px';
          this.pane.style.width = newWidth + 'px';
        }

        return;
      }

      if (currentMouseX !== clicked.mouseClickX) {
        if (clicked.edge === 'left') {
          const newX = currentMouseX - clicked.leftEdge;
          const newWidth = clicked.startPaneWidth - (currentMouseX - clicked.mouseClickX);

          if (newWidth < 30) {
            return;
          }

          if (newX < 0) {
            return;
          }

          this.pane.style.width = newWidth + 'px';
          this.pane.style.left = newX + 'px';
        } else if (clicked.edge === 'right') {
          const newWidth = currentMouseX - clicked.startPaneX;
          if (newWidth < 30) {
            return;
          }

          this.pane.style.width = newWidth + 'px';
        }
      }
    }
  };

  removePx(input) {
    return parseFloat(input.replace('px', ''));
  }

  onMouseDown = e => {
    // e.preventDefault();
    const edge = this.getEdgeTouching(e);
    if (!edge) {
      this.setState({ clicked: false });
      return false;
    }

    this.props.onClick();

    const pane = this.pane.getBoundingClientRect();
    const holder = this.holder.getBoundingClientRect();

    const cursorOffset = edge === 'left' || edge === 'main' ? e.clientX - pane.left : pane.right - e.clientX;

    let mouseClickX = e.clientX;
    if (edge === 'left' || edge === 'right') {
      mouseClickX = e.clientX - cursorOffset;
    }

    this.setState({
      clicked: {
        mouseClickX: mouseClickX,
        cursorOffset: cursorOffset,
        startPaneX: pane.left,
        startPaneWidth: pane.width,
        edge: edge,
        isResizing: edge === 'left' || edge === 'right',
        isMoving: edge === 'main',
        leftEdge: holder.left,
        rightEdge: holder.right,
        widthEdge: holder.width
      }
    });
  };

  onMouseUp = e => {
    if (this.state.clicked && (this.state.clicked.isResizing || this.state.clicked.isMoving)) {
      // convert to start and end time. Then update the start and end time.

      const { from, to } = this.calculateFromAndToForNewCoordinates();

      window.forceTimeInputUpdate = true; // horrible hack for now.
      this.props.onChange(from, to);
      this.setState({ clicked: false, shouldAllowUpdate: false });
    }
  };

  calculateFromAndToForNewCoordinates = () => {
    const { timelineDuration } = this.props;

    const width = this.removePx(this.pane.style.width);
    const left = this.removePx(this.pane.style.left);

    const timelineHolder = document.getElementById('axis-wrapper');
    const ratio = timelineDuration / timelineHolder.offsetWidth;

    const from = left * ratio;
    const to = (width + left) * ratio;

    return {
      from: from.toFixed(2),
      to: to.toFixed(2)
    };
  };

  getEdgeTouching = e => {
    const b = this.pane.getBoundingClientRect();
    const mouseX = e.clientX - b.left;

    const sideGap = 10;
    if (mouseX < sideGap) {
      return 'left';
    } else if (mouseX >= b.width - sideGap) {
      return 'right';
    } else if (mouseX > sideGap && mouseX < b.width - sideGap) {
      return 'main';
    }

    return false;
  };

  render() {
    const { children, className, disableResize, onClick, style } = this.props;
    const { itemWidth, pos, timeIn, timeOut } = this.state;

    const myStyle = Object.assign(
      {
        left: pos.x,
        width: itemWidth + 'px',
        height: '30px'
      },
      style
    );

    return (
      <div ref={holder => (this.holder = holder)}>
        <div ref={pane => (this.pane = pane)} className={className} style={myStyle}>
          {/* trying out el name instead of tooltip may change back later after using the app for a while */}
          <div style={{ marginRight: '10px', marginLeft: '10px', overflow: 'hidden', height: '18px' }}>{children}</div>
        </div>
      </div>
    );
  }
}