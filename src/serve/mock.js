import Mock from 'mockjs'

const baseURL = 'http://119.23.247.196:8031';
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
        number: '1',
        key:'1',
        callType: '市话',
        describe: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      }, {
        number: '2',
        key:'2',
        callType: '长途',
        describe: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      }, {
        number: '3',
        key:'3',
        callType: '长途',
        describe: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      }]
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
)

// Mock.setup(settings)
// 配置拦截 ajax 请求时的行为，支持的配置项有 ： tiimeout
Mock.setup({
	timeout: 1000
})
