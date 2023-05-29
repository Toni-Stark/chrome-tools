import {getDetailInfo, sendData} from "./detailInfo";
let data = [];

let isLoading = false;
let pattern = /a\d*\.html/;
let locationHost = location.host.split('.')[1] === 'baixing';
// // xiaoshou
// let locationPathName = location.pathname === '/xiaoshou/';
// ershouqiche
let locationPathName = location.pathname === '/ershouqiche/';
// // ershouqiche
// let locationPathName = location.pathname === '/ershouqiche/';
// // ershouqiche
// let locationPathName = location.pathname === '/ershouqiche/';
let pathName = location.pathname.split('/');
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
                element.scrollTop += 10;
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
    /**
     *  二手汽车，二手房，二手手机，二手电脑，二手家电，宠物猫，宠物狗通用
     */
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
    /**
     *  销售通用
     */
    // let descStr = '';
    // let descList = document.querySelectorAll('.viewad-meta2 .viewad-meta2-item');
    // descList.forEach((item, index)=>{
    //     descStr += item.children[0].textContent+item.children[1].textContent;
    // })
    // let detail = document.getElementsByClassName('viewad-text')[0].textContent;
    // let obj = {
    //     link: location.href,
    //     title: document.querySelectorAll('.viewad-title h1')[0].textContent,
    //     address: descStr,
    //     phone: 12345678911,
    //     userName: document.querySelector('.poster-name').textContent,
    //     detail: detail
    // }
    console.log(obj);
    sendData(obj, res => {
        // window.close()
    });
} else if ( locationHost && locationPathName && !isLoading) {
    isLoading = true;
    setScroll(()=>{
        /**
         *  二手汽车，二手房，二手手机，二手电脑，二手家电，宠物猫，宠物狗通用
         */
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
                link: title.href,
                url: location.href.split('\?')[0]
            };
            data.push(obj);
        })
        /**
         *  销售通用
         */
        // let ul_list = document.querySelectorAll(".table-view");
        // let li_item = ul_list[0].querySelectorAll(".listing-ad");
        // li_item.forEach((item)=>{
        //     let title:HTMLLinkElement = item.querySelector('.ad-title');
        //     let obj = {
        //         title: title.textContent,
        //         price: item.querySelector('.salary').textContent,
        //         link: title.href
        //     };
        //     data.push(obj);
        // })
        console.log(data);
        // setTimeout(()=>{
        //     let pageList:any = document.getElementsByClassName('list-pagination')[0].querySelectorAll('li>a');
        //     pageList[pageList.length-1].click();
        // },3000)
        getDetailInfo(data);
    });
}

