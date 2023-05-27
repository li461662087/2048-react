import React, {useEffect, useRef, useState} from 'react';
import './app.css'

function App() {
    const divRef = useRef()
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
                return moveDistanceX > 0 ? move(matrix, 'left') : move(matrix, 'right')
            } else {
                // 上下
                return moveDistanceX > 0 ? move(matrix, 'down') : move(matrix, 'up')
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
          move(matrix, 'left')
      }
      else if(e.keyCode === 38){
          move(matrix, 'up')
      }
      else if(e.keyCode === 39){
          move(matrix, 'right')
      }
      else if(e.keyCode === 40){
          move(matrix, 'down')
      }
    }
    function move(matrix, direction){
      const rows = matrix.length;
      const cols = matrix[0].length;
      let mergeIndexList = []

      function _inRange(i, j){
          return matrix[i] && matrix[i][j] !== undefined;
      }
      const next = {
          up: (i, j)=> [i + 1, j],
          down: (i, j)=> [i - 1, j],
          left: (i, j)=> [i, j + 1],
          right: (i, j)=> [i, j - 1]
      }
      function _getNextNotZeroValue(i, j){
          let [nextI, nextJ] = next[direction](i, j)
          while(_inRange(nextI, nextJ)){
              const nextValue = matrix[nextI][nextJ]
              if (nextValue){
                  return [nextI, nextJ, nextValue]
              }
              else{
                  [nextI, nextJ] = next[direction](nextI, nextJ)
              }
          }
      }

      function _cal(i, j){
          if(!_inRange(i, j)){
              return;
          }
          //计算出这个位置的值
          const result = _getNextNotZeroValue(i, j)
          if (!result){
              return;
          }
          const [nextI, nextJ, nextValue] = result;
          if(matrix[i][j] === 0){
              matrix[i][j] = nextValue;
              matrix[nextI][nextJ] = 0
              _cal(i, j)
          }else  if(matrix[i][j] === nextValue){
              matrix[i][j] += nextValue
              //记录当前最大值
              if (matrix[i][j] > score){
                  setScore(matrix[i][j])

              }
              if (matrix[i][j] > bestScore){
                  setBestScore(matrix[i][j])
              }
              matrix[nextI][nextJ] = 0
              mergeIndexList = [...mergeIndexList,[i,j]]
          }
          //计算下一个位置的值
          _cal(...next[direction](i, j))
      }

      if (direction === 'up'){
          for (let j = 0; j < cols; j++) {
              _cal(0, j)
          }
      }
      else if (direction === 'down'){
          for (let j = 0; j < cols; j++) {
              _cal(rows - 1, j)
          }
      }
      else if (direction === 'left'){
          for (let i = 0; i < rows; i++) {
              _cal(i, 0)
          }
      }else{
          for (let i = 0; i < rows; i++) {
              _cal(i, rows - 1)
          }
      }

      function _newNumber(newNumberIndex){
          if (_isFull(matrix)){
              //随机生成数字
              const row = Math.floor(Math.random()*4);
              const col = Math.floor(Math.random()*4);
              if (matrix[row][col] === 0){
                  matrix[row][col] = 2
                  setNewNumberIndex([row,col])
              }
              else{
                  _newNumber(newNumberIndex)
              }
          }else{
              isOver()
          }
          //判断是否没位置了
          function _isFull(matrix){
              for(let i=0; i<matrix.length; i++){
                  for (let j=0; j<matrix.length; j++){
                      if (matrix[i][j] === 0){
                          return true
                      }
                  }
              }
              return false
          }
          function isOver(){
              const row = matrix.length
              const col = matrix[0].length

              let time = 0

              for (let i=0; i<row; i++){
                  for (let j=0; j<col; j++){
                      if (matrix[i][j] === 0){
                          return
                      }else{
                          if(_findAround(i, j)){
                              time++
                          }else{
                              return;
                          }
                      }
                  }
              }
              function _findAround(i,j){
                  let flag = 4
                  let result = 0
                  if (!_isRange(i, j+1)){
                      flag--
                  }
                  if(!_isRange(i, j-1)){
                      flag--
                  }
                  if (!_isRange(i-1, j)){
                      flag--
                  }
                  if (!_isRange(i+1, j)){
                      flag--
                  }


                  if (_isRange(i, j+1) && _isSame([i,j], [i,j+1])){
                      result++
                  }
                  if(_isRange(i, j-1) && _isSame([i,j], [i,j-1])){
                      result++
                  }
                  if(_isRange(i+1, j) && _isSame([i,j], [i+1,j])){
                      result++
                  }
                  if(_isRange(i-1, j) && _isSame([i,j], [i-1,j])){
                      result++
                  }

                  if (flag === result){
                      return true
                  }
                  else{
                      return false
                  }
                  function _isRange(i, j){
                      return matrix[i] && matrix[i][j] !== undefined;
                  }
                  function _isSame(pre,next){
                      if(matrix[next[0]][next[1]] !== 0 && matrix[next[0]][next[1]] !== matrix[pre[0]][pre[1]]){
                          return true
                      }else{
                          return false
                      }
                  }
              }

              if (time === row*col){
                  setIsShow(true)
              }
          }
      }
        _newNumber(newNumberIndex)
        setMatrix([...matrix])
        setMergeNumberIndex([...mergeIndexList])
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
