import { TAB_INFO } from '../config/types';

export const openNewTab = (data) => {
  chrome.runtime.sendMessage({ tab: TAB_INFO, data }, (result) => {
    console.log(result, '发送新tag成功');
  });
};

export const getLoadingState = () => {
  return document.readyState;
};
