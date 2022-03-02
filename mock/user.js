export default [
  {
    url: '/api/mockText',
    method: 'POST',
    response: ({ body }) => {
      console.log('body>>>>>>>>', body)
      return {
        code: 200,
        message: 'ok',
        data: ['test', 'text2'],
      }
    },
  },
  {
    url: '/api/login',
    method: 'POST',
    response: ({ body }) => {
      console.log(body);
      return {
        code: 200,
        message: 'ok',
        data: {token:'admin'},
      }
    },
  },
]