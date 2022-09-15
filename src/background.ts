
fetch('https://chengdu.baixing.com/ershougongchengche/a2593450496.html?from=regular').then(r => r.text()).then(result => {
  // console.log(result);
})

let dataList = [];
let currentNum = 0;

console.log("渲染一次")

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.tab) {
    case "data-list":
      dataList = dataList.concat(message.data);
      sendResponse({dataList});
      break;
    case "data-info":
      console.log(message, currentNum)
      let index = dataList.findIndex((item, index)=>item.id === message.data.id);
      dataList[index] = Object.assign({}, dataList[index], message.data);
      console.log(dataList[index])
      currentNum ++;
      sendResponse({msg:'接受到', currentNum})
      break
  }
});
