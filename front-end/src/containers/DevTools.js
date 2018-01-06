import React from 'react';
import { createDevTools } from 'react-devtools';
import DockMonitor from 'react-devtools-dock-monitor';

const DevTools = createDevTools(
  <dockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={true}
  />
);
export default DevTools;
