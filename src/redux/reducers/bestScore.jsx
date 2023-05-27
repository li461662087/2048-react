const initBestScore = 0
export default function bestScore(preState = initBestScore, action){
    const {type, data} = action
    switch (type) {
        case "increment":
            if (preState >= data){
                return preState
            }else{
                return data
            }
        default:
            return preState
    }
}