import React from 'react';
import Icon from 'components/Icon';

export default function Spinner({ fullpage = false, style, text = 'Loading' }) {
  // if style prop has similar properties it will override this
  style = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ...style };
  if (fullpage) {
    style = {
      ...style,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'black',
      opacity: '0.2'
    };
  }
  return (
    <div style={style}>
      <div style={{ textAlign: 'center' }}>
        <Icon name="circle-notch" spin style={{ fontSize: '38px' }} />
        <p style={{ textAlign: 'center', fontSize: '28px', margin: '0' }}>{text}</p>
      </div>
    </div>
  );
}
