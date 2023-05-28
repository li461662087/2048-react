export default function move(matrix, direction, score, bestScore, newNumberIndex){
    const rows = matrix.length;
    const cols = matrix[0].length;
    let mergeIndexList = []
    let reScore = score
    let reBestScore = bestScore
    let reNewNumberIndex = []
    let reIsShow = false
    let reMatrix = null
    let reMergeNumberIndex = []

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
                reScore = matrix[i][j]

            }
            if (matrix[i][j] > bestScore){
                reBestScore = matrix[i][j]
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
                reNewNumberIndex = [row,col]
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
                reIsShow = true
            }
        }
    }
    _newNumber(newNumberIndex)
    reMatrix = [...matrix]
    reMergeNumberIndex = [...mergeIndexList]

    return {
        reScore,
        reBestScore,
        reNewNumberIndex,
        reIsShow,
        reMatrix,
        reMergeNumberIndex
    }
}