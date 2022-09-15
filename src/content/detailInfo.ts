let dataList = [];
let isStart = false;
let currentNum = 0;
console.log(43324234)
export const getDetailInfo = (data) => {
    chrome.runtime.sendMessage({tab: 'data-list',data}, (result) => {
        dataList = result.dataList;
        if(!isStart){
            isStart = true;
            return new Promise((resolve, reject) => {
                setInterval(()=>{
                    window.open(`https://chengdu.baixing.com/ershougongchengche/a${dataList[currentNum].id}.html?from=regular`)
                },3000);
            })
        }
    });
}

export const sendData = (data, callback) => {
    chrome.runtime.sendMessage({tab: 'data-info',data}, (result) => {
        currentNum = result.currentNum;
        callback(result)
    })
}
