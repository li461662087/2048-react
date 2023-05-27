export function getDistance(box){
    // let box = document.querySelector(item) // 监听对象
    let startTime = '' // 触摸开始时间
    let startDistanceX = '' // 触摸开始X轴位置
    let startDistanceY = '' // 触摸开始Y轴位置
    let endTime = '' // 触摸结束时间
    let endDistanceX = '' // 触摸结束X轴位置
    let endDistanceY = '' // 触摸结束Y轴位置
    let moveTime = '' // 触摸时间
    let moveDistanceX = '' // 触摸移动X轴距离
    let moveDistanceY = '' // 触摸移动Y轴距离
    console.log(box)
    box.addEventListener("touchstart", (e) => {
        startTime = new Date().getTime()
        startDistanceX = e.touches[0].screenX
        startDistanceY = e.touches[0].screenY
    })
    box.addEventListener("touchend", (e) => {
        endTime = new Date().getTime()
        endDistanceX = e.changedTouches[0].screenX
        endDistanceY = e.changedTouches[0].screenY
        moveTime = endTime - startTime
        moveDistanceX = startDistanceX - endDistanceX
        moveDistanceY = startDistanceY - endDistanceY
        console.log(moveDistanceX, moveDistanceY)
        // 判断滑动距离超过40 且 时间小于500毫秒
        if ((Math.abs(moveDistanceX) > 40 || Math.abs(moveDistanceY) > 40) && moveTime < 500) {
            // 判断X轴移动的距离是否大于Y轴移动的距离
            if (Math.abs(moveDistanceX) > Math.abs(moveDistanceY)) {
                // 左右
                return moveDistanceX > 0 ? 'left' : 'right'
            } else {
                // 上下
                return moveDistanceX > 0 ? 'top' : 'down'
            }
        }
    })

}


