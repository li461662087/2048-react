import {legacy_createStore as createStore} from "redux";
import reducers from "./reducers";

export default createStore(reducers)