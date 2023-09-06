import { TAB_INFO } from '../config/types';

export const openNewTab = (data) => {
  chrome.runtime.sendMessage({ tab: TAB_INFO, data }, (result) => {
    console.log(result, 'res');
  });
};

export const getLoadingState = () => {
  return document.readyState;
};
