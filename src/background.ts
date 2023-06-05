import { END_URL, LIST_URL } from './config/types';

let tabList = {};
let tabTimer = {};

let current = 0;
let lisInter = null;
let listenerList = [];

let data = [];
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.tab === LIST_URL) {
    data = message.arr;
    startGetUrlReferer(data);
    sendResponse(true);
    return true;
  }
  if (message.tab === END_URL) {
    console.log('结束按钮');
    clearDataListener();
    sendResponse(true);
    return true;
  }
});

function startGetUrlReferer(arr) {
  lisInter = setInterval(() => {
    if (listenerList.length >= 20) return;
    if (current < arr.length) {
      chrome.tabs.create({ url: arr[current], selected: false, active: false });
      listenerList.push(current);
      current++;
    }
    if (current >= arr.length) clearInterval();
  }, 1000);
}

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  clearTimeout(tabTimer[tabId]);
  tabTimer[tabId] = null;
  if (!tabList[tabId]) {
    tabList[tabId] = [tab.url];
  } else {
    if (tabList[tabId][tabList[tabId].length - 1] !== tab.url) tabList[tabId].push(tab.url);
  }
  if (tab.status !== 'complete') return;
  tabTimer[tabId] = setTimeout(() => {
    clearTimeout(tabTimer[tabId]);
    tabTimer[tabId] = null;
    chrome.tabs.remove(tabId, () => {
      tabTimer[tabId] = null;
      listenerList.splice(0, 1);
    });
  }, 15000);
  console.log(Object.keys(tabList).length, data.length);
  if (Object.keys(tabList).length >= data.length) {
    console.log(tabList);
  }
});
function clearDataListener() {
  clearInterval(lisInter);
  lisInter = null;
}
