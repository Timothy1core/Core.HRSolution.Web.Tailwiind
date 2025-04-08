import { ReactNode } from 'react';
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ScrollTopComponent,
  SwapperComponent,
  ToggleComponent
} from '../assets/ts/components';

// Define the WithChildren object for TypeScript types
const WithChildren = {
  children: ReactNode
};

// Function to reinitialize various components
const reInitMenu = () => {
  setTimeout(() => {
    ToggleComponent.reinitialization();
    ScrollTopComponent.reinitialization();
    DrawerComponent.reinitialization();
    MenuComponent.reinitialization();
    ScrollComponent.reinitialization();
    SwapperComponent.reinitialization();
  }, 500);
};

export { WithChildren, reInitMenu };
