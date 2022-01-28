import { createContext } from 'react';

export const ThemeCustomContext = createContext({
  showImage: false,
  changeShowImage: () => {},
});
