function createUserList() {
  return {
    data: [
      {
        token: 'Admin Token',
        _id: '641280fdc5ff3cb994002003',
        username: 'test1',
        name: '测试用户1',
        password: '1234',
        phone: '13112345678',
        role_id: '640ec59a9f6e3402f8edd4ec',
        create_time: 1678934269969,
        __v: 0,
        role: {
          _id: '640ec59a9f6e3402f8edd4ec',
          name: '管理员',
          menus: [
            '/home',
            '/user',
            '/role',
            '/school',
            '/majors',
            '/student',
            '/class',
          ],
          create_time: 1678689690752,
          __v: 0,
          auth_time: 1678952409061,
          auth_name: 'test1',
        },
      },
      {
        token: 'System Token',
        _id: '64098cc6984047a6c854b303',
        username: 'admin',
        password: 'admin',
        create_time: 1678347462193,
        __v: 0,
        role: {
          menus: [],
        },
      },
    ],
  }
}
// 对外暴露一个数组，数组里面有一个登录接口
export default [
  // 用户登录
  {
    // 请求地址
    url: '/mock/login',
    // 请求方式
    methods: 'post',
    response: ({ body }) => {
      // 获取请求体携带过来的用户名和密码，通过解构获取
      const { username, password } = body
      // 调用获取用户信息函数，用于判断是否有此用户，如果请求体传来的用户名和密码均和函数获取的信息相符，那么就存在用户
      // 则checkUser为true表示返回用户信息成功
      const checkUser = createUserList().data.find(
        (item) => item.username === username && item.password === password,
      )
      // 没有用户返回失败信息，也就是checkUser为false是触发
      if (!checkUser) {
        // 返回一个status：1，因为这是在配置mock，模拟接口返回的数据，是根据后端接口文档的数据样式返回数据的，因此返回一个status，表示用户信息获取失败，同时返回msg
        return { status: 1, msg: '用户名或密码错误' }
      }
      // 如果有返回成功的信息，则通过解构获取token(这是用于用户身份的标识)，返回一个status表示获取信息成功，且返回用户标识token
      const { token } = checkUser
      return { status: 0, data: { token } }
    },
  },
  // 获取用户信息接口
  {
    // 请求地址
    url: '/mock/user/info',
    // 请求方式
    methods: 'get',
    response: (req) => {
      // 获取请求头携带的token
      const token = req.headers.token
      // 查找从请求头中返回来的token用户身份标识是否有相符的
      const checkUser = createUserList().data.find(
        (item) => item.token === token,
      )
      // 如果没有相符的则说明数据里没有要获取的用户信息，则返回status：1作为失败的响应，及msg
      if (!checkUser) {
        return { status: 1, msg: { message: '获取用户信息失败' } }
      }
      // 如果获取成功，则返回成功标识status：0，并返回用户的数据
      return { status: 0, data: { ...checkUser } }
    },
  },
]
