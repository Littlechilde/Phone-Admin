import Mock from 'mockjs'
const { VITE_BASE_URL } = import.meta.env

const baseURL = VITE_BASE_URL;
const systemApi = {
  login: baseURL + "/user/login",
  role: baseURL + '/getRole',
  area: baseURL + '/area/getArea',
  callType:baseURL + '/callType',
  userType:baseURL + '/userType',
  roleType:baseURL + '/roleType',
  areaType:baseURL + '/areaType',
  userList:baseURL + '/userList',
  payList:baseURL + '/payList',
  getDetail:baseURL + '/getDetail',
};

// /* login */Mock.mock(rurl?, rtype?, template|function(options))
// options指向本次请求的 Ajax 选项集，含有 url、type、body 三个属性。
Mock.mock(
  systemApi.login,
  'post',
  ({body}) => {
    const { password, username } = JSON.parse(body)
    if (username === 'admin' && password === '123456') {
      return {
          code : 200,
          data:{
            token:'admin'
          }
        }
      } else if(username === 'editor' && password === '123456') {
        return {
          code : 200,
          token:'editor-token'
        }
      } else {
        return {
          code : 200,
          token:'test-token'
        }
      }
  }
)

Mock.mock(
  systemApi.area,
  'get',
  (options) => {
    return {
      code: 200,
      data: '常德高新区'
    }
  }
)

Mock.mock(
  systemApi.callType,
  'get',
  (options) => {
    return {
      code: 200,
      data: [{
        "icon": "",
        "list": [],
        "menuId": 1,
        "name": "研发部",
        "open": true,
        "orderNum": 0,
        "parentId": 0,
        "parentName": "",
        "describe": "研发部mark研发部mark",
        "type": 0,
        "url": ""
      }, {
        "icon": "",
        "list": [],
        "menuId": 2,
        "name": "东湖路工程学院保卫处",
        "open": true,
        "orderNum": 0,
        "parentId": 0,
        "parentName": "",
        "describe": "此处为mockjs数据，类似接口加载",
        "type": 0,
        "url": "tree"
      },
      {
        "icon": "",
        "list": [],
        "menuId": 3,
        "name": "湘大生活部",
        "open": true,
        "orderNum": 0,
        "parentId": 1,
        "parentName": "研发部",
        "describe": "未借助浏览器缓存",
        "type": 0,
        "url": ""
      }
    ]
    }
  }
)

Mock.mock(
  systemApi.userType,
  'get',
  (options) => {
    return {
      code: 200,
      data: [{
        number: '1',
        key:'1',
        callType: '范十月',
        describe: "湘潭大学",
      }, {
        number: '2',
        key:'2',
        callType: '刘某',
        describe: "工程学院土木系",
      }, {
        number: '3',
        key:'3',
        callType: '小贺',
        describe: "娄底学院",
      }]
    }
  }
)

Mock.mock(
  systemApi.roleType,
  'get',
  (options) => {
    return {
      code: 200,
      data: [{
        number: '1',
        key:'1',
        callType: '范十月',
        describe: "admin",
      }, {
        number: '2',
        key:'2',
        callType: '刘某',
        describe: "user",
      }, {
        number: '3',
        key:'3',
        callType: '小贺',
        describe: "admin",
      }]
    }
  }
)

Mock.mock(
  systemApi.areaType,
  'get',
  (options) => {
    return {
      code: 200,
      data: [{
        number: '1',
        key:'1',
        callType: '0731',
        describe: "长沙市岳麓区梅溪湖",
      }, {
        number: '2',
        key:'2',
        callType: '0731',
        describe: "湘潭市东湖路工程学院",
      }, {
        number: '3',
        key:'3',
        callType: '0739',
        describe: "邵阳市双清区",
      }]
    }
  }
)

Mock.mock(
  systemApi.userList,
  'get',
  (options) => {
    return {
      code: 200,
      data: [{
        number: '1',
        key:'1',
        name: '小范',
        address: "长沙市岳麓区梅溪湖",
        user:'小贺',
        phone: "17135367892",
        checked: true,
        children: [{
          number: '12',
          key:'25',
          name: '贺老板',
          address: "湘潭市东湖路工程学院北",
          user:'小贺',
          phone: "17123334441",
          checked: false,
        }]
      }, {
        number: '2',
        key:'2',
        name: '贺老板',
        address: "湘潭市东湖路工程学院北",
        user:'小贺',
        phone: "17123334441",
        checked: false,
      }, {
        number: '3',
        key:'3',
        name: '李总',
        address: "长沙市开福区开福寺",
        user:'小范',
        phone: "17123334441",
        checked: false,
      }]
    }
  }
)

Mock.mock(
  systemApi.payList,
  'get',
  (options) => {
    return {
      code: 200,
      data: [{
        number: '1',
        key:'1',
        callType: '市话',
        describe: "2元/分钟",
      }, {
        number: '2',
        key:'2',
        callType: '市话',
        describe: "3元/分钟",
      }, {
        number: '3',
        key:'3',
        callType: '市话',
        describe: "0.2元/分钟",
      }]
    }
  }
);

Mock.mock(
  systemApi.getDetail,
  'get',
  (options) => {
    return {
      code: 0,
      data: [
        {
        id: '1',
        mainNumber:'933132008',
        resolveNumber:'933133308',
        callTime: 17,
        callType: '集团通话',
        pay: "0",
        area:'',
        payMark:''
      },
      {
        id: '2',
        mainNumber:'933132008',
        resolveNumber:'933133308',
        callTime: 26,
        callType: '集团通话',
        pay: "0",
        area:'',
        payMark:''
      },
      {
        id: '3',
        mainNumber:'933492023',
        resolveNumber:'933132295',
        callTime: 140,
        callType: '集团通话',
        pay: "0",
        area:'',
        payMark:''
      },
      {
        id: '4',
        mainNumber:'933952667',
        resolveNumber:'933952653',
        callTime: 30,
        callType: '集团通话',
        pay: "0",
        area:'',
        payMark:''
      },
      {
        id: '5',
        mainNumber:'933133214',
        resolveNumber:'018874727059',
        callTime: 25,
        callType: '市内通话',
        pay: "0.2",
        area:'',
        payMark:''
      },
      {
        id: '6',
        mainNumber:'933952116',
        resolveNumber:'933952192',
        callTime: 49,
        callType: '集团通话',
        pay: "0",
        area:'',
        payMark:''
      },
      {
        id: '7',
        mainNumber:'933413145',
        resolveNumber:'933418386',
        callTime: 27,
        callType: '集团通话',
        pay: "0",
        area:'',
        payMark:''
      },
      {
        id: '8',
        mainNumber:'933442860',
        resolveNumber:'018273308811',
        callTime: 192,
        callType: '市内通话',
        pay: "0.3",
        area:'',
        payMark:''
      },
      {
        id: '9',
        mainNumber:'933447856',
        resolveNumber:'015773300052',
        callTime: 23,
        callType: '市内通话',
        pay: "0.2",
        area:'',
        payMark:''
      },
      {
        id: '10',
        mainNumber:'933132100',
        resolveNumber:'933132057',
        callTime: 22,
        callType: '集团通话',
        pay: "0",
        area:'',
        payMark:''
      },
      {
        id: '11',
        mainNumber:'933442860',
        resolveNumber:'018273308811',
        callTime: 192,
        callType: '市内通话',
        pay: "0.3",
        area:'',
        payMark:''
      },
      {
        id: '12',
        mainNumber:'933837863',
        resolveNumber:'013875401870',
        callTime: 19,
        callType: '市内通话',
        pay: "0.2",
        area:'',
        payMark:''
      },
      {
        id: '13',
        mainNumber:'933133445',
        resolveNumber:'933133602',
        callTime: 266,
        callType: '集团通话',
        pay: "0",
        area:'',
        payMark:''
      },
    ]
    }
  }
)

// Mock.setup(settings)
// 配置拦截 ajax 请求时的行为，支持的配置项有 ： tiimeout
Mock.setup({
	timeout: 1000
})
