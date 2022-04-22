import {combineReducers} from 'redux'
import {reducer as recommendReducer} from '../application/Recommend/store'
import {reducer as singerReducer} from '../application/Singers/store'
import {reducer as rankReducer} from '../application/Rank/store'
import {reducer as albumReducer} from '../application/Album/store'
import {reducer as singerInfoReducer} from '../application/Singer/store'
import {reducer as playerReducer} from '../application/Player/store'
import {reducer as searchReducer} from '../application/Search/store'
import {reducer as userReducer} from '../application/Login/store'
import {reducer as commentsReducer} from '../application/CommentsList/store'
import {reducer as followReducer} from '../application/Follow/store'
import {reducer as operationReducer} from '../components/OperationsList/store'

export default combineReducers({
  recommend: recommendReducer,
  singers: singerReducer,
  rank: rankReducer,
  album: albumReducer,
  singerInfo: singerInfoReducer,
  player: playerReducer,
  search: searchReducer,
  user: userReducer,
  comments: commentsReducer,
  follow: followReducer,
  operation: operationReducer
})