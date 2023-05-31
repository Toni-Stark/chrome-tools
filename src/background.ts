import { LIST_URL } from './config/types';

let tabList = {};
let dataList = [];
let current: any = { url: '', run: false };
let tabTimer = null;
let createTimer = null;
let serviceId = null;
let currentIndex = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.tab === LIST_URL) {
    startGetUrlReferer(message.arr, 0);
    sendResponse(true);
    return true;
  }
});

function startGetUrlReferer(arr, index) {
  let params = { url: arr[index], run: true };
  dataList = arr;

  if (!current?.run && serviceId) {
    current = params;
    chrome.tabs.update(serviceId, { url: arr[index] });
    currentIndex = index + 1;
    return;
  }
  current = params;
  chrome.tabs.create({ url: arr[index] });
  currentIndex = index + 1;
}

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  if (!serviceId) {
    serviceId = tabId;
  }
  if (serviceId !== tabId) return;
  clearTimeout(tabTimer);
  tabTimer = null;
  if (!tabList[currentIndex]) {
    tabList[currentIndex] = [tab.url];
  } else {
    if (tabList[currentIndex][tabList[currentIndex].length - 1] !== tab.url) tabList[currentIndex].push(tab.url);
  }
  if (tab.status !== 'complete') return;
  tabTimer = setTimeout(() => {
    console.log(tab.url);
    clearTimeout(tabTimer);
    tabTimer = null;
    current.run = false;
    startGetUrlReferer(dataList, currentIndex);
    if (dataList.length !== Object.keys(tabList).length) return;
    clearData();
  }, 2000);
});

function clearData() {
  clearInterval(createTimer);
  createTimer = null;
  if (serviceId) {
    chrome.tabs.remove(serviceId, () => {
      serviceId = null;
      tabTimer = null;
      createTimer = null;
      current = { url: '', run: false };
      currentIndex = 0;
    });
  }
}
