import React from 'react';

import { OnNodeEndAction } from './OnNodeEndAction';
import { OnNodeEndAnimation } from './OnNodeEndAnimation';
import { OnNodeEndDelay } from './OnNodeEndDelay';

export const OnNodeEndTabs = ({tab, node, update}) => {
  const tabAnimation = {
    animate: {y: 0, opacity: 1},
    initial: {y:25, opacity: 0},
    transition: { type: "spring", duration: 0.2, bounce: 0.5, damping: 15}
  };

  switch(tab) {
    case('action'):
      return (
        <OnNodeEndAction 
          node={node} update={update} tabAnimation={tabAnimation}
        />
      )
    case('animation'):
      return (
        <OnNodeEndAnimation 
          node={node} update={update} tabAnimation={tabAnimation}
        />
      )
    case('delay'):
      return (
        <OnNodeEndDelay 
          node={node} update={update} tabAnimation={tabAnimation} 
        />
      )
  }
};