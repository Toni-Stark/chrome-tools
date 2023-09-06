import { TAB_INFO } from '../config/types';

export const openNewTab = (data) => {
  browser.runtime.sendMessage({ tab: TAB_INFO, data }).then( (result) => {
    console.log(result, 'res');
  });
};

export const getLoadingState = () => {
  return document.readyState;
};
