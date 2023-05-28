import React, {useEffect, useState} from 'react';
import './app.css'
import move from "./unilt/move";

function App() {
    const initMatrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 2]
      ]
    const [matrix, setMatrix] = useState(initMatrix)

    const initNumberIndex = []
    const [newNumberIndex, setNewNumberIndex] = useState(initNumberIndex)

    //计算结果下标
    const resultNumberIndex = []
    const [mergeNumberIndex, setMergeNumberIndex] = useState(resultNumberIndex)

    const [isShow, setIsShow] = useState(false)

    const [bestScore, setBestScore] = useState(0)
    const [score, setScore] = useState(0)


    let startTime = '' // 触摸开始时间
    let startDistanceX = '' // 触摸开始X轴位置
    let startDistanceY = '' // 触摸开始Y轴位置
    let endTime = '' // 触摸结束时间
    let endDistanceX = '' // 触摸结束X轴位置
    let endDistanceY = '' // 触摸结束Y轴位置
    let moveTime = '' // 触摸时间
    let moveDistanceX = '' // 触摸移动X轴距离
    let moveDistanceY = '' // 触摸移动Y轴距离
    function startXY(e){
        startTime = new Date().getTime()
        startDistanceX = e.touches[0].screenX
        startDistanceY = e.touches[0].screenY
    }
    function endXY(e){
        endTime = new Date().getTime()
        endDistanceX = e.changedTouches[0].screenX
        endDistanceY = e.changedTouches[0].screenY
        moveTime = endTime - startTime
        moveDistanceX = startDistanceX - endDistanceX
        moveDistanceY = startDistanceY - endDistanceY
        // 判断滑动距离超过40 且 时间小于500毫秒
        if ((Math.abs(moveDistanceX) > 40 || Math.abs(moveDistanceY) > 40) && moveTime < 500) {
            // 判断X轴移动的距离是否大于Y轴移动的距离
            if (Math.abs(moveDistanceX) > Math.abs(moveDistanceY)) {
                // 左右
                if (moveDistanceX > 0){
                    const {reScore,
                        reBestScore,
                        reNewNumberIndex,
                        reIsShow,
                        reMatrix,
                        reMergeNumberIndex} = move(matrix, 'left',score,bestScore,newNumberIndex)
                    respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex)
                }
                else{
                    const {reScore,
                        reBestScore,
                        reNewNumberIndex,
                        reIsShow,
                        reMatrix,
                        reMergeNumberIndex} = move(matrix, 'right',score,bestScore,newNumberIndex)
                    respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex)
                }
            }
            else {
                // 上下
                if (moveDistanceY > 0){
                    const {reScore,
                        reBestScore,
                        reNewNumberIndex,
                        reIsShow,
                        reMatrix,
                        reMergeNumberIndex} = move(matrix, 'up',score,bestScore,newNumberIndex)
                    respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex)
                }
                else{
                    const {reScore,
                        reBestScore,
                        reNewNumberIndex,
                        reIsShow,
                        reMatrix,
                        reMergeNumberIndex} = move(matrix, 'down',score,bestScore,newNumberIndex)
                    respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex)
                }
            }
        }
    }
    function getDistance(item){
        let box = document.querySelector(item) // 监听对象
        box.addEventListener("touchstart", startXY)
        box.addEventListener("touchend", endXY)
    }
    function removeGetDistance(item){
        let box = document.querySelector(item) // 监听对象
        box.removeEventListener('touchstart', startXY);
        box.removeEventListener('touchend', endXY);
    }
    useEffect(()=>{
        let flag = 0
        const os = function () {
            const ua = navigator.userAgent,
                isWindowsPhone = /(?:Windows Phone)/.test(ua),
                isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
                isAndroid = /(?:Android)/.test(ua),
                isFireFox = /(?:Firefox)/.test(ua),
                isChrome = /(?:Chrome|CriOS)/.test(ua),
                isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox &&
                    /(?:Tablet)/.test(ua)),
                isPhone = /(?:iPhone)/.test(ua) && !isTablet,
                isPc = !isPhone && !isAndroid && !isSymbian;
            return {
                isTablet: isTablet,
                isPhone: isPhone,
                isAndroid: isAndroid,
                isPc: isPc
            };
        }();
        if (os.isPc){
            document.addEventListener('keydown',handleKeyDown);
        }
        else{
            flag = 1
            getDistance('.main')
        }
        return function cleanUp(){
            if (!flag){
                document.removeEventListener('keydown', handleKeyDown);
            }
            else{
                removeGetDistance('.main')
            }

        }
    })
    function handleKeyDown(e){
      if (e.keyCode === 37){
          const {reScore,
              reBestScore,
              reNewNumberIndex,
              reIsShow,
              reMatrix,
              reMergeNumberIndex} = move(matrix, 'left',score,bestScore,newNumberIndex)
          respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex)
      }
      else if(e.keyCode === 38){
          const {reScore,
              reBestScore,
              reNewNumberIndex,
              reIsShow,
              reMatrix,
              reMergeNumberIndex} = move(matrix, 'up',score,bestScore,newNumberIndex)
          respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex)
      }
      else if(e.keyCode === 39){
          const {reScore,
              reBestScore,
              reNewNumberIndex,
              reIsShow,
              reMatrix,
              reMergeNumberIndex} = move(matrix, 'right',score,bestScore,newNumberIndex)
          respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex)
      }
      else if(e.keyCode === 40){
          const {reScore,
              reBestScore,
              reNewNumberIndex,
              reIsShow,
              reMatrix,
              reMergeNumberIndex} = move(matrix, 'down',score,bestScore,newNumberIndex)
          respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex)
      }
    }
    function respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex){
        setScore(reScore)
        setBestScore(reBestScore)
        setMatrix(reMatrix)
        setNewNumberIndex(reNewNumberIndex)
        setIsShow(reIsShow)
        setMergeNumberIndex(reMergeNumberIndex)
    }

    //格子定位获取
    function getPosition(row_index, col_index){
      return `title-position-${row_index}-${col_index} `
    }

    function getValColor(val){
        return `tile-${val}`
    }
    function newTile(row, col, newNumberIndex){
        if (row === newNumberIndex[0] && col === newNumberIndex[1]){
            return 'new-tile'
        }else{
            return ''
        }

    }

    function mergeTile(row, col, mergeIndex){
        let len = mergeIndex.length
        let flag = false
        if (len === 0){
            return ''
        }
        for (let i=0; i < len; i++){
            if (mergeIndex[i][0] === row && mergeIndex[i][1] === col){
                flag = true
            }
        }
        if (flag){
            return 'merge-tile'
        }

    }

    function newGame(){
        const game = []
        const gameIndex = []
        for(let i=0; i<matrix.length; i++){
            game.push([])
            for (let j=0; j<matrix[0].length; j++){
                game[i].push(0)
            }
        }

        _randomNewNumber(game)
        function _randomNewNumber(game){
            let i = 0;
            while(i<2){
                const row = Math.floor(Math.random()*4);
                const col = Math.floor(Math.random()*4);
                if (game[row][col] === 0){
                    game[row][col] = 2
                    gameIndex.push([row,col])
                }else{
                    _randomNewNumber()
                }
                i++
            }
        }

        setMatrix([...game])
        setNewNumberIndex([...gameIndex])
        setIsShow(false)
        setScore(0)
    }

  return (
    <div className="main" onKeyDown={(e)=>handleKeyDown(e)}>
      <div className="head">
          <div className="score">
              <h1 className="title">2048</h1>
              <div className="scores-container">
                  <div className="score-container">{score}</div>
                  <div className="best-container">{bestScore}</div>
              </div>

          </div>
          <div className="text">
              <p>在线玩2048游戏</p>
              <p>在电脑端使用键盘 W,A,S,D或者方向键</p>
              <p>
                  在手机端在数字上滑动即可.
                  合并数字，达到2048方块!
              </p>
          </div>
          <div className="newGameButton" onClick={newGame}>新游戏</div>
      </div>
      <div className="game_interface" >
          <div>
              {
                  matrix.map((row,index)=>{
                      return (
                          <div className="game_col" key={index}>
                              {
                                  row.map((_,index)=>{
                                      return <div className="game_box_item" key={index}></div>
                                  })
                              }
                          </div>
                      )
                  })
              }
          </div>
          <div className="tile-container">
              {
                  matrix.map((row,row_index)=>{
                      return (
                          <div className="row" key={row_index}>
                              {
                                  row.map((col,col_index)=>{
                                      if (col !== 0){
                                          return <div
                                              className={`tile  ${getPosition(row_index+1, col_index+1)} `}
                                          >
                                              <div  className={`${newTile(row_index, col_index, newNumberIndex)} ${getValColor(col)} ${mergeTile(row_index, col_index, mergeNumberIndex)}`}>
                                                  {col}
                                              </div>
                                          </div>
                                      }
                                  })
                              }
                          </div>
                      )
                  })
              }
              <div className="gameOver" style={{display:(isShow === true ? 'block' : 'none')}}>
                  <p>GameOver</p>
                  <button onClick={newGame}>再玩一次</button>
              </div>
          </div>
      </div>
    </div>
  );
}

export default App;
