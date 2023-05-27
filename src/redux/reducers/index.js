import {combineReducers} from "redux";

import bestScore from "./bestScore";
import isShow from "./isShow";
import score from "./score";

export default combineReducers({
    bestScore,
    isShow,
    score,
})