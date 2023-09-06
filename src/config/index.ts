import { appConfig } from './appConfig';

export const icp_tools_ops = {
  init: function () {
    this.env = 'prod'; //当前环境，dev（本地开发环境） | inner (内部环境) | prod (生产环境)
  },
  getHost: function () {
    return appConfig[this.env];
  },
  buildUrl: function (path?: any, params?: any) {
    let host = this.getHost();
    let url = host + path;
    let _paramUrl = '';
    if (params) {
      _paramUrl = Object.keys(params)
        .map((k) => {
          return [encodeURIComponent(k), encodeURIComponent(params[k])].join('=');
        })
        .join('&');
      _paramUrl = '?' + _paramUrl;
    }
    return url + _paramUrl;
  },
  openUrl: function (url) {
    chrome.tabs.create({ url: url });
  },
  getTokenName: function () {
    return 'cms_home_' + this.env;
  },
  checkLogin: function (callback) {
    console.log(this.buildUrl('/'), this.getTokenName());
    chrome.cookies.get({ name: this.getTokenName(), url: this.buildUrl('/') }, function (res) {
      let is_login = false;
      if (res && res.value) {
        is_login = true;
      }
      callback(res, is_login);
    });
  }
};


