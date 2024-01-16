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

export default [
  // 用户登录
  {
    url: '/mock/login',
    methods: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createUserList().data.find(
        (item) => item.username === username && item.password === password,
      )
      if (!checkUser) {
        return { status: 1, msg: '用户名或密码错误' }
      }
      // 如果有返回成功的信息
      const { token } = checkUser
      return { status: 0, data: { token } }
    },
  },
  {
    url: '/mock/user/info',
    methods: 'get',
    response: (req) => {
      const token = req.headers.token
      const checkUser = createUserList().data.find(
        (item) => item.token === token,
      )

      if (!checkUser) {
        return { status: 1, msg: { message: '获取用户信息失败' } }
      }
      return { status: 0, data: { ...checkUser } }
    },
  },
]
