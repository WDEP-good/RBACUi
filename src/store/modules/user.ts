// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserAll, reqUserList, reqUserAdd, getUserById, reqUserUpdate,reqUserDelete } from '@/api/user/index'
// 引入用户的数据类型
import { UserState } from './types/type'
// 引入登录接口的数据类型
import type {
  loginFormData,
  loginResponseDate,
  userAllResponseData,
  userInfoData,
  userListFormData,
  userListResponseData,
} from '@/api/user/type'


// 创建用户小仓库，User_Store是仓库名
let useUserStore = defineStore('User_Store', {
  // 用于存放数据
  state: (): UserState => {
    return {
      // 这是使用的mock模拟后端数据，添加登录后的身份标识
      // token: localStorage.getItem('TOKEN'),
      // 使用JSON.parse转换，将添加的用户标识转换成对象赋给user
      user: JSON.parse(localStorage.getItem('Vue3-User') as string),
      users: []
    }
  },
  // 用于定义对仓库的操作
  actions: {
    // 定义一个异步操作 userLogin：传入一条数据
    async userLogin(data: loginFormData) {
      // 定义result存储reqLogin登录接口返回的数据
      // await 等待使用reqLogin接口请求数据，将请求到的数据赋值给result
      let result: loginResponseDate = await reqLogin(data)
      // 如果status为0说明获取到了用户信息
      if (result.status == 0) {
        // 将获取到的用户数据进行存储，as是断言，及强制认为返回的是这个类型
        this.user = result.data as userInfoData
        // 将用户的数据存储到浏览器本地数据库localStorage，将result.data对象转换成JSON字符串，存储在localStorage的Vue3-User当中
        localStorage.setItem('Vue3-User', JSON.stringify(result.data) as string)
        // 返回OK
        return 'OK'
      } else {
        // 否则
        return Promise.reject(new Error(result.msg))
      }
    },
    // 删除用户登录信息数据
    removeUser() {
      console.log(this.user);
      // 将点击退出登录的这个账号的user信息设置为null
      this.user = null;
      // 在localStorage浏览器本地数据库中将登录标识删除
      localStorage.removeItem("Vue3-User")
    },
    // 获取用户列表（分页）
    async getUserAll() {
      let result: userAllResponseData = await reqUserAll();
      if (result.status == 0) {
        this.users = (result.data as userInfoData[]);
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 获取用户列表
    async getUserList(data: userListFormData) {
      let result: userListResponseData = await reqUserList(data);
      if (result.status == 0) {
        this.users = (result.data?.data as userInfoData[]);
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 添加用户
    async addUser(data: userInfoData) {
      let result: loginResponseDate = await reqUserAdd(data);
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 通过id查找用户
    async getUserById(_id: string) {
      let result: loginResponseDate = await getUserById(_id);
      if (result.status == 0) {
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 编辑用户信息
    async updateUser(data: userInfoData) {
      let result: loginResponseDate = await reqUserUpdate(data);
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 删除用户信息
    async deleteUser(userId:string) {
      let result: loginResponseDate = await reqUserDelete(userId);
      console.log(result.status);
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },

  },
})
export default useUserStore
