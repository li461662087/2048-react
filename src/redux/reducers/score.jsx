const initScore = 0
export default function score(preState = initScore, action){
    const {type, data} = action
    switch (type) {
        case "scoreIncrement":
            if (preState >= data){
                return preState
            }else{
                return data
            }
        case "beZero":
            return data
        default:
            return preState
    }
}