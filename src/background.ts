
// fetch('https://chengdu.baixing.com/ershougongchengche/a2593450496.html?from=regular').then(r => r.text()).then(result => {
//   // console.log(result);
// })

let dataList = [];
chrome.storage.sync.set({'num': 0});

function updateData(data, callback) {
  fetch("http://192.168.10.241:10035/api/spider/set", {
    headers: {
      "accept": "application/json, text/javascript, */*; q=0.01",
      // "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      // "x-requested-with": "XMLHttpRequest"
    },
    body: JSON.stringify(data),
    method: "POST"
  }).then(response => response.json())
    .then(res => {
      console.log(res)
      if (res.code === 200) {
        callback(res)
      }
    })
}


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
    let currentData = dataList[message.num];
    let params = {
      thumbnail: currentData.background,
      url: message.data.link,
      title: currentData.title,
      content: currentData.detail,
      source_url: currentData.url,
      address: currentData.address,
      contacts: message.data.userName,
      phone: message.data.phone,
    }

    updateData(params, (res)=>{
      let index = dataList.findIndex((item, index)=>item.id === message.data.id);
      dataList[index] = Object.assign({}, dataList[index], message.data);
      chrome.storage.sync.set({
        'num': message.num || 0
      })
      chrome.storage.sync.get('num', res => {
        sendResponse({dataList,num: res.num})
      })
    });
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

