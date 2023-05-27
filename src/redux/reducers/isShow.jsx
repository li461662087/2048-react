//*
// 1. 该文件式用于创建一个Count组件服务的reducer，reducer的本质就是一个函数
// 2. reducer函数会接到两个参数，分别为：之前的状态（preState），动作对象（action）
// */

const initIsShow = false
export default function isShow(preState = initIsShow, action){
    const {type, data} = action
    switch (type) {
        case "change":
            if(data){
                return true
            }else{
                return false
            }
        default:
            return preState
    }
}