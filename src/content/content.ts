import { regBaseUrl } from '../config';
import { getLoadingState, openNewTab } from './bindCurrent';
import { TAB_INFO } from '../config/types';

// (function () {
// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
//   console.log('request------------------->');
//   console.log(request, sender);
//   console.log('request------------------->');
// });
// if (regBaseUrl(location.host)) {
//   console.log('验证通过weibo', location.host);
//   openNewTab({ href: location.href });
// }
// })();
// console.log('加载失败');
// // window.onload = () => {
// chrome.runtime.sendMessage({ tab: TAB_INFO, href: location.href }, (result) => {
//   console.log(result, '返回数据');
// });
// // };
