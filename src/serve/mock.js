import Mock from 'mockjs'

const baseURL = 'http://120.77.237.25:8080';
const systemApi = {
  login: baseURL + "/user/login",
  role: baseURL + '/getRole',
  area: baseURL + '/area/getArea'
};

// /* login */Mock.mock(rurl?, rtype?, template|function(options))
// options指向本次请求的 Ajax 选项集，含有 url、type、body 三个属性。
Mock.mock(
  systemApi.login,
  'post',
  ({body}) => {
    const { password, username } = JSON.parse(body)
    if (username === 'admin' && password === '123456') {
      console.log(123)
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

// Mock.setup(settings)
// 配置拦截 ajax 请求时的行为，支持的配置项有 ： tiimeout
Mock.setup({
	timeout: 400
})
