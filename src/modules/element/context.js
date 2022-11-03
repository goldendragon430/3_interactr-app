import React from 'react';

export const ElementContext = React.createContext({
  id: null,
  onClick: null,
  onDelete: null,
  type: null,
  activeId: null
});