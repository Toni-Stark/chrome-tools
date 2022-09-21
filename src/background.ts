
// fetch('https://chengdu.baixing.com/ershougongchengche/a2593450496.html?from=regular').then(r => r.text()).then(result => {
//   // console.log(result);
// })

let dataList = [];
chrome.storage.sync.set({'num': 0});
console.log("渲染一次")
let hadNewWeb = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.tab === "data-list") {
    dataList = dataList.concat(message.data);
    chrome.storage.sync.set({
      'num': message.num || 0
    })
    chrome.storage.sync.get('num', (res) => {
      sendResponse({dataList, currentNum: res.num, hadNewWeb});
      hadNewWeb = true;
    });
    return true;
  }
  else if (message.tab === "data-info") {
    let index = dataList.findIndex((item, index)=>item.id === message.data.id);
    dataList[index] = Object.assign({}, dataList[index], message.data);
    chrome.storage.sync.set({
      'num': message.num || 0
    })
    console.log(dataList)
    chrome.storage.sync.get('num', res => {
      sendResponse({dataList,num: res.num})
    })
    return true;
  }
  else if (message.tab === "data-end") {
    hadNewWeb = false;
    sendResponse({dataList, currentNum: 0, hadNewWeb});
    chrome.storage.sync.set({
      'num':  0
    })
    return true;
  }
  else if (message.tab === "list-url") {
    console.log(message)
    if(message.isStart){
      chrome.storage.sync.set({
        'isStart': true,
        'baseUrl': message.listUrl
      })
    } else {
      chrome.storage.sync.set({
        'isStart':  false
      })
    }
    sendResponse('data')
  }
});

