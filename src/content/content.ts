console.log(44234234)
let isLoading = false;

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
                element.scrollTop += 300;
                i += 1;
            }
        }
        var interval = setInterval(main, 300)
    }

    page_scroll(callback)
}

if (location.host === 'chengdu.baixing.com' && !isLoading) {
    isLoading = true;
    setScroll(()=>{
        let ul_list = document.getElementsByClassName("list-ad-items");
        let li_item = ul_list[0].querySelectorAll(".listing-ad");

        let data = [];
        li_item.forEach((item)=>{
            let imgDom:HTMLImageElement = item.querySelector('.media-cap>img');
            let obj = {
                title: item.querySelector('.ad-title').textContent,
                address: item.querySelectorAll('.ad-item-detail')[0].textContent,
                detail: item.querySelectorAll('.ad-item-detail')[1].textContent,
                price: item.querySelector('.highlight').textContent,
                background: imgDom?.src,
                id: item.attributes['data-aid'].nodeValue
            };
            data.push(obj);
        })
        console.log(data)
    })
}
