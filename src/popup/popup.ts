let list: Array<Partial<ParamsType>> = [
  {
    title: 'list',
    type: 'view',
    class: '',
    placeholder: '例：body > .content-list',
    must: true,
  },
  {
    title: 'item',
    type: 'view',
    class: '',
    placeholder: '例：.content-list > .content-item',
  },
  {
    title: '缩略图',
    type: 'img',
    label: '缩略图',
    class: '',
    placeholder: '例：.item > img',
  },
  {
    title: '标题',
    type: 'value',
    label: '标题',
    class: '',
    placeholder: '例：.title',
  },
  {
    title: '详情链接',
    type: 'link',
    label: '链接',
    class: '',
    placeholder: '例：.title a',
  },
];

const openStorage = ({key, data, callback}: Partial<StorageType>) => {
  if(data){
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    return JSON.parse(localStorage.getItem(key));
  }
  callback && callback()
};

let addBtn = document.getElementsByClassName('add-class')[0];
let over = document.getElementsByClassName('over')[0];
let start = document.getElementsByClassName('start')[0];
let listRoute = document.getElementsByClassName('list-route')[0];

addBtn.addEventListener('click', (e)=>{
  let domList = document.getElementsByClassName('list')[0];
  let nameView: any = document.getElementsByClassName('add-name')[0];
  let valueView: any = document.getElementsByClassName('add-value')[0];
  let labelView: any = document.getElementsByClassName('add-label')[0];
  if (!nameView?.value || !valueView?.value || !labelView?.value) {
    alert('请完整填入')
    return;
  }
  let obj: Partial<ParamsType> = {
    title: nameView.value,
    label: labelView.value,
    class: valueView.value,
    type: 'value',
  }
  list.push(obj);
  nameView.value='';
  labelView.value='';
  valueView.value='';
  openStorage({key:'data-list', data: list})
  domList.appendChild(createItem(obj, list.length-1));
})

over.addEventListener('click', (e)=> {
  chrome.runtime.sendMessage({tab: 'list-url', isStart: false},(result) => {
    console.log(result)
  })
})
start.addEventListener('click', (e)=> {
  let dataList = openStorage({key: 'data-list'});
  let listUrl = openStorage({key: 'list-url'});

  chrome.runtime.sendMessage({tab: 'list-url', dataList, listUrl, isStart: true},(result) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.runtime.sendMessage({tab: tabs[0].id, listUrl, isStart: true}, (contentResult) => {
        console.log(contentResult)
      });
    })
  })
})

listRoute.addEventListener('change', (e:any)=> {
  openStorage({key: 'list-url', data: e.target.value})
})
const onChangeValue = (e) => {
   console.log(e);
}

const onChangeLabel = (e) => {
  console.log(e);
}

const deleteLabel = (e) => {
  console.log(e);
}

const createDom = (data: Partial<DomType>): Document => {
  let obj = document.createElement(data.dom);
  let jsonList = openStorage({key:'data-list'})
  Object.keys(data).map((item, index) => {
    if (['dom', 'index', 'onChange', 'onClick'].includes(item) === false) obj[item] = data[item];
    if (['onChange'].includes(item)) obj.addEventListener('change', (e)=>{
      if(e.target.className === "item-label"){
        jsonList[data.index]['label'] = e.target.value
      } else {
        jsonList[data.index]['class'] = e.target.value
      }
      openStorage({key: 'data-list', data: jsonList})
    })
    if (['onClick'].includes(item)) obj.addEventListener('click', (e)=>{
      let objJson = openStorage({key: 'data-list'});
      objJson.splice(data.index, 1);
      openStorage({key: 'data-list', data: objJson, callback: ()=>initList()});
    })
  })
  return obj
}

const createItem = (item, index) => {
  let dom: Document = createDom({dom: 'div', className: 'item'});
  let div: Document = createDom({dom: 'div', textContent: item.title});
  let input: Document = createDom({dom: 'input', placeholder: item.placeholder || '未设置', type:'text', value: item?.class || '', onChange: onChangeValue, index});
  let btn: Document = !item.must && createDom({dom: 'button', className: 'add-btn', textContent:'删除', onClick: deleteLabel, index});
  let label: Document = item.label && createDom({dom: 'input', className: 'item-label', placeholder: item.label || '未设置', type:'text', value: item?.label || '', onChange: onChangeLabel, index});
  dom.appendChild(div)
  dom.appendChild(input)
  label && dom.appendChild(label)
  btn && dom.appendChild(btn)
  return dom
}

const initList = () => {
  let domList: any = document.getElementsByClassName('list')[0];
  let listRoute: any = document.getElementsByClassName('list-route')[0];
  listRoute.value = openStorage({key: 'list-url'})
  domList.innerHTML = '';
  let jsonList = openStorage({key:'data-list'});
  console.log(domList, jsonList)
  list = jsonList ? jsonList : list;
  list.map((item, index)=>{
    let dom = createItem(item, index);
    domList.appendChild(dom);
  })
  openStorage({key:'data-list', data: list});
}

window.onload = () => {
  initList();
};

type DomType = {
  dom: any;
  className: any;
  type: any;
  style: any;
  textContent: any;
  placeholder: any;
  value: any;
  onChange: (e) => void;
  onClick: (e) => void;
  index: number;
}

type ParamsType = {
  title: string;
  type: string,
  class: string,
  label: string,
  placeholder: string,
  must: boolean,
  value: boolean,
}

type StorageType = {
  key: string,
  data: any,
  callback: () => void
}
