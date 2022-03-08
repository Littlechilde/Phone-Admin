import Mock from 'mockjs'

const baseURL = 'http://119.23.247.196:8031';
const systemApi = {
  login: baseURL + "/user/login",
  role: baseURL + '/getRole',
  area: baseURL + '/area/getArea',
  callType:baseURL + '/callType',
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
        type: '市话',
        mark: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      }, {
        number: '2',
        key:'2',
        type: '长途',
        mark: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      }, {
        number: '3',
        key:'3',
        type: '长途',
        mark: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      }]
    }
  }
)

// Mock.setup(settings)
// 配置拦截 ajax 请求时的行为，支持的配置项有 ： tiimeout
Mock.setup({
	timeout: 1000
})
