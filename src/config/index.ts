export const base_url = ['weibo', 'csdn.net', 'catl.com', 'jd.com'];
export const regBaseUrl = (str) => {
  return base_url.find((item) => {
    return str.indexOf(item) >= 0;
  });
};
