import React from 'react';

export const NodeContext = React.createContext({
  interactions: {},
  elementGroups: {},
  updateInteraction: ()=>{},
  updateElement: ()=>{},
  updateElementGroup: ()=>{},
  syncContext: ()=>{}
});

NodeContext.displayName = "NodeContext";