import {getDetailInfo, sendData} from "./detailInfo";

let isLoading = false;
let locationHost = location.host.split('.')[1] === 'baixing';
let locationPathName  = location.pathname === '/ershouqiche/';
let data = [];
let pathName = location.pathname.split('/');
let pattern = /a\d*\.html/;
let isDetail = pattern.test(pathName[pathName.length-1]);
const setScroll = (callback) => {

    function page_scroll(callback) {
        var i = 1
        var element = document.documentElement
        element.scrollTop = 0;

        function main() {
            if (element.scrollTop + element.clientHeight == element.scrollHeight) {
                clearInterval(interval)
                callback()
            } else {
                element.scrollTop += 30;
                i += 1;
            }
        }
        var interval = setInterval(main, 10)
    }

    page_scroll(callback)
};

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    const { uri, data, type } = request;
    console.log(uri, data, type, sender)
})

if(isDetail){
    let descStr = '';
    let descList = document.querySelectorAll('.viewad-meta2 .viewad-meta2-item');
        descList.forEach((item, index)=>{
            descStr += item.children[0].textContent+item.children[1].textContent;
        })
    let obj = {
        link: location.href,
        title: document.querySelectorAll('.viewad-title h1')[0].textContent,
        detail: descStr,
        phone: 12345678911,
        userName: document.querySelector('.poster-name').textContent,
    }
    sendData(obj, res => {
        // window.close()
    });
} else if ( locationHost && locationPathName && !isLoading) {
    isLoading = true;
    setScroll(()=>{
        let ul_list = document.querySelectorAll(".list-ad-items");
        let li_item = ul_list[0].querySelectorAll(".listing-ad");

        li_item.forEach((item)=>{
            let imgDom:HTMLImageElement = item.querySelector('.media-cap>img');
            let title:HTMLLinkElement = item.querySelector('.ad-title');
            let obj = {
                title: title.textContent,
                address: item.querySelectorAll('.ad-item-detail')[0].textContent,
                detail: item.querySelectorAll('.ad-item-detail')[1].textContent,
                price: item.querySelector('.highlight').textContent,
                background: imgDom?.src,
                link: title.href
            };
            data.push(obj);
        })
        setTimeout(()=>{
            let pageList:any = document.getElementsByClassName('list-pagination')[0].querySelectorAll('li>a');
            pageList[pageList.length-1].click();
        },3000)
        getDetailInfo(data);
    });
}

