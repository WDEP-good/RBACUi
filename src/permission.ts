import router from './router';
import pinia from './store/index';
import useUserStore  from "./store/modules/user"
let userStore =  useUserStore(pinia)
router.beforeEach((to,_from,next)=>{
    const user = userStore.user;
    //用户已经登录
    if(user && user._id){
        if(to.path === "/"){
            next({
                path:"/layout"
            })
        }else{
            next()
        }
    }else{        
        if(to.path==="/"){
            next()
        }else{
            next({
                path:"/"
            })
        }
    }




})