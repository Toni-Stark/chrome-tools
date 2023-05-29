let dataList = [];
let isStart = false;
let currentNum = 0;

export const getDetailInfo = (data) => {
    chrome.runtime.sendMessage({tab: 'data-list', data, num: localStorage.getItem('num')}, (result) => {
        if(result){
            dataList = result.dataList;
            localStorage.setItem('num', String(0));
            if(!isStart){
                isStart = true;
                return new Promise((resolve, reject) => {
                    if(!result.hadNewWeb){
                        console.log(dataList, currentNum, 'log----------------');
                        window.open(`${dataList[currentNum].link}`);
                    }
                })
            }
        }
    });
}

export const sendData = (data, callback) => {
    chrome.runtime.sendMessage({tab: 'data-info',data, num: localStorage.getItem('num') }, (result) => {
        console.log(currentNum, data)
        if(Number(currentNum) < result.dataList.length - 1){
            callback(result)
            currentNum = Number(result.num) + 1;
            setTimeout(()=>{
                localStorage.setItem('num', String(currentNum));
                location.href = `${result.dataList[currentNum].link}`;
            }, 5000);
        } else {
            chrome.runtime.sendMessage({tab: 'data-end',data, num: localStorage.getItem('num') }, (result) => {
                window.close();
            })
        }
    })
}

