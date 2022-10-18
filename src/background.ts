
// fetch('https://chengdu.baixing.com/ershougongchengche/a2593450496.html?from=regular').then(r => r.text()).then(result => {
//   // console.log(result);
// })

let dataList = [];
chrome.storage.sync.set({'num': 0});
console.log("渲染一次");

let obj = [
  {
    address: "新都 - 新都老城区 - 新都区三河场园桂路95号",
    thumbnail: "https://img6.baixing.net/2bcc7fba6900e958881f80acafa6d42d_240x180wbp",
    content:"雪铁龙 / 2010年04月 / 11万公里 / 爱丽舍 / 23小时前更新",
    source_url: "https://chengdu.baixing.com/ershouqiche",
    url:"https://xindu.baixing.com/ershouqiche/a2597003986.html?from=ding",
    price:"0.86万元",
    title:"雪铁龙 爱丽舍 2010款 爱丽舍-三厢 1.6 手动 尊贵"
  },
  {
    address: "新都 - 新都老城区 - 新都区三河场园桂路95号",
    thumbnail: "https://img6.baixing.net/2bcc7fba6900e958881f80acafa6d42d_240x180wbp",
    content:"雪铁龙 / 2010年04月 / 11万公里 / 爱丽舍 / 23小时前更新",
    source_url: "https://chengdu.baixing.com/ershouqiche",
    url:"https://xindu.baixing.com/ershouqiche/a2597003986.html?from=ding",
    price:"0.86万元",
    title:"雪铁龙 爱丽舍 2010款 爱丽舍-三厢 1.6 手动 尊贵"
  }
]

fetch("http://192.168.10.241:10035/api/spider/set", {
  headers: {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "x-requested-with": "XMLHttpRequest"
  },
  body: JSON.stringify({data: obj}),
  method: "POST"
}).then(response => response.json())
  .then(res => {
    console.log(res)
    if (res.code === 200) {
      console.log(res);
    }
  })

let hadNewWeb = false;
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.tab === "data-list") {
//     dataList = dataList.concat(message.data);
//     chrome.storage.sync.set({
//       'num': message.num || 0
//     })
//     chrome.storage.sync.get('num', (res) => {
//       sendResponse({dataList, currentNum: res.num, hadNewWeb});
//       hadNewWeb = true;
//     });
//     return true;
//   }
//   else if (message.tab === "data-info") {
//     let index = dataList.findIndex((item, index)=>item.id === message.data.id);
//     dataList[index] = Object.assign({}, dataList[index], message.data);
//     chrome.storage.sync.set({
//       'num': message.num || 0
//     })
//     console.log(dataList)
//     chrome.storage.sync.get('num', res => {
//       sendResponse({dataList,num: res.num})
//     })
//     return true;
//   }
//   else if (message.tab === "data-end") {
//     hadNewWeb = false;
//     sendResponse({dataList, currentNum: 0, hadNewWeb});
//     chrome.storage.sync.set({
//       'num':  0
//     })
//     return true;
//   }
//   else if (message.tab === "list-url") {
//     console.log(message)
//     if(message.isStart){
//       chrome.storage.sync.set({
//         'isStart': true,
//         'baseUrl': message.listUrl
//       })
//     } else {
//       chrome.storage.sync.set({
//         'isStart':  false
//       })
//     }
//     sendResponse('data')
//   }
// });

