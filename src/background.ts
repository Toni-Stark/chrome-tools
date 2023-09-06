import { AllUrlType, CLOSE_EXTENSION_BAT, END_URL, LIST_URL, OPEN_EXTENSION_BAT, SETTING_BAT_COOKIE } from './config/types';
import { GetPendingData, UploadPendingData } from './requestStore';

let tabList = {};
let tabTimer = {};

let current = 0;
let lisInter = null;
let listenerList = [];

let data = [];

let time1 = null;

let currentType = CLOSE_EXTENSION_BAT;

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  if (currentType !== OPEN_EXTENSION_BAT) {
    return;
  }
  if(tabList[tabId]?.length>1 && tabList[tabId][tabList[tabId].length - 1] === setDelEndLine(tab.url)){
    return;
  }
  if (tabList[tabId]?.length > 0) {
    if (tabList[tabId][tabList[tabId].length - 1] !== setDelEndLine(tab.url)) {
      tabList[tabId].push(setDelEndLine(tab.url));
    }
  } else {
    tabList[tabId] = [setDelEndLine(tab.url)];
  }

  clearTimeout(tabTimer[tabId]);
  tabTimer[tabId] = null;
  tabTimer[tabId] = setTimeout(() => {
    chrome.tabs.get(tabId, function(tab) {
      if (tab) {
        chrome.tabs.remove(tabId, function() {
          listenerList.splice(0, 1);
          if (Object.keys(tabList).length >= data.length && listenerList?.length === 0) {
            uploadUrlList(tabList, data);
          }
        });
      } else {
        console.log('Tab does not exist!', tab, tabTimer[tabId]);
      }
    });
  }, 15000);
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'popup') {
    if (message?.bind === OPEN_EXTENSION_BAT) {
      currentType = OPEN_EXTENSION_BAT;
      GetServerDataList();
      sendResponse('绑定成功');
      return true;
    }
    if (message?.bind === CLOSE_EXTENSION_BAT) {
      currentType = CLOSE_EXTENSION_BAT;
      CloseServer();
      sendResponse('关闭成功');
      return true;
    }
    sendResponse(true);
    return true;
  }
  if (message.tab === LIST_URL) {
    data = message.arr;
    startGetUrlReferer(data);
    sendResponse(true);
    return true;
  }
  if (message.tab === END_URL) {
    clearDataListener();
    sendResponse(true);
    return true;
  }
});

const clearDefaultValue = () => {
  for (let key in tabTimer) {
    if (!tabTimer[key]) delete tabTimer[key];
  }
  tabList = {};
  current = 0;
  lisInter = null;
  listenerList = [];
  clearDataListener();
};

const GetServerDataList = () => {
  GetPendingData().then((res: any) => {
    if (res?.data.length > 0) {
      data = res.data;
      time1 = setTimeout(() => {
        startGetUrlReferer(res.data);
        clearTimeout(time1);
        time1 = null;
      }, 3000);
    } else {
      clearDefaultValue();
      time1 = setTimeout(() => {
        GetServerDataList();
        clearTimeout(time1);
        time1 = null;
      }, 300000);
    }
  });
};
const CloseServer = () => {
  clearInterval(lisInter);
  lisInter = null;
  current = 0;
  tabList = {};
  data = [];
  listenerList = [];
  clearDataListener();
  clearDefaultValue();
};

function startGetUrlReferer(arr: Array<AllUrlType>) {
  if (arr?.length <= 0) return;
  clearInterval(lisInter);
  clearDefaultValue();
  lisInter = setInterval(() => {
    if (listenerList.length >= 20) return;
    if (current < arr.length) {
      let urlVal = arr[current].home_url;
      chrome.tabs.create({ url: urlVal, selected: false, active: false }, (res: any) => {
        data[current]['tab_id'] = res.id;
        let url: any = res.url || res?.pendingUrl || urlVal;
        if (tabList[res.id]?.length > 0) {
          if (setDelEndLine(tabList[res.id][0]) !== setDelEndLine(url)) {
            if (Object.keys(tabList).length > 0) {
              tabList[res.id] = [setDelEndLine(url), ...tabList[res.id]];
            } else {
              tabList[res.id] = [setDelEndLine(url)];
            }
          }
        } else {
          tabList[res.id] = [setDelEndLine(url)];
        }
        listenerList.push(current);
        current++;
      });
    }
    if (current >= arr.length) {
      clearInterval(lisInter);
      lisInter = null
    }
  }, 800);
}

function uploadUrlList(list, data) {
  let arr = {};
  let obj = JSON.parse(JSON.stringify(data));
  for (const key in list) {
    if (list.hasOwnProperty(key)) {
      let index = obj.findIndex((item) => setDelEndLine(item.home_url) === setDelEndLine(list[key][0]));
      if (index >= 0) {
        arr[obj[index].id.toString()] = list[key];
        delete list.key;
        obj.splice(index, 1);
      } else {
        let ind = obj.findIndex((item) => item.tab_id == key);
        if (ind >= 0) {
          arr[obj[ind].id.toString()] = list[key];
          delete list.key;
          obj.splice(ind, 1);
        }
      }
    }
  }
  if (Object.keys(arr).length < data.length) {
    // if (Object.keys(arr).length < data.length || !timerReg) {
    return;
  }

  UploadPendingData({ data: arr }).then((res: any) => {
    clearTimeout(time1);
    time1 = null;
    time1 = setTimeout(() => {
      GetServerDataList();
      clearTimeout(time1);
      time1 = null;
    }, 2000);
  });
}

const setDelEndLine = (url) => {
  let u = url;
  let reg = u.slice(u.length - 1, u.length);
  if (reg === '/') {
    u = u.slice(0, u.length - 1);
  }
  return u;
};

function clearDataListener() {
  clearInterval(lisInter);
  lisInter = null;
}
