import {axiosInstance} from './config'
import md5 from 'md5'
// 获取banner图
export const getBannerRequest = () => {
  return axiosInstance.get('/banner')
}
// 获取推荐歌单
export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized')
}
// 获取热门歌手列表
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?limit=30&offset=${count*30}`)
}
// 获取分类歌手列表
export const getSingerListRequest= (type, area, alpha, count) => {
  return axiosInstance.get(`/artist/list?type=${type}&area=${area}&initial=${alpha}&offset=${count*30}`);
}
// 获取榜单列表
export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`)
}
// 获取歌单详情
export const getAlbumDetailRequest = id => {
  return axiosInstance.get(`/playlist/detail?id=${id}&timestamp=${Date.now()}`)
}
// 获取专辑详情
// export const getPlaylistDetailRequest = id => {
//   return axiosInstance.get(`/album?id=${id}`)
// }

// 获取歌手详情
export const getSingerInfoRequest = id => {
  return axiosInstance.get(`/artists?id=${id}`)
}
// 获取歌曲歌词
export const getLyricRequest = id => {
  return axiosInstance.get(`/lyric?id=${id}`)
}
// 获取热门搜索关键字
export const getHotKeyWordsRequest = () => {
  return axiosInstance.get(`/search/hot`)
}
// 获取关键字相关列表
export const getSuggestListRequest = query => {
  return axiosInstance.get(`/search/suggest?keywords=${query}`)
}
// 获取关键字结果
export const getResultSongsListRequest = query => {
  return axiosInstance.get(`/search?keywords=${query}`)
}
// 获取歌曲详情
export const getSongDetailRequest = id => {
  return axiosInstance.get(`/song/detail?ids=${id}`)
}
// 获取评论 0-歌曲 1-mv 2-歌单 3-专辑 4-电台 5-视频 6-动态

// 获取歌曲评论 
// sortType: 1-推荐 2-热度 3-时间  
// cursor: 当sortType为3时且页数不是第一页时需传入,值为上一条数据的time
export const getCommentRequest = (id, type=0, pageNo=1, sortType=1, cursor) => {
  return axiosInstance.get(`/comment/new?type=${type}&id=${id}&pageNo=${pageNo}&sortType=${sortType}${(cursor && (sortType===99 || sortType===3)) ? '&cursor='+cursor : ''}`)
}
// 获取手机验证码
export const getCaptchaRequest = number => {
  return axiosInstance.get(`/captcha/sent?phone=${number}`)
}
// 验证手机验证码
export const verifyCaptchaRequest = (number, captcha) => {
  return axiosInstance.get(`/captcha/verify?phone=${number}&captcha=${captcha}`)
}
// 手机号码登录请求
export const phoneLoginRequest = (number, psw) => {
  let md5_password = md5(psw)
  // console.log(md5_password)
  return axiosInstance.get(`/login/cellphone?phone=${number}&md5_password=${md5_password}`)
}
// 获取账号登录状态
export const getLoginStatusRequest = () => {
  return axiosInstance.get(`/login/status`)
}
// 账号登出
export const logoutRequest = () => {
  return axiosInstance.get(`/logout`)
}
// 获取用户详情
export const getUserDetail = (id) => {
  return axiosInstance.get(`/user/detail?uid=${id}`)
}
// 获取用户信息，如歌单、收藏、mv、dj数量
export const getUserSubcount = () => {
  return axiosInstance.get(`/user/subcount`)
}
// 获取用户等级信息
export const getUserLevel = () => {
  return axiosInstance.get(`/user/level`)
}
// 获取用户喜欢歌曲列表
export const getUserLikelist = (uid) => {
  return axiosInstance.get(`/likelist?uid=${uid}&timestamp=${Date.now()}`)
}
// 获取用户歌单
export const getUserPlaylist = (uid) => {
  return axiosInstance.get(`/user/playlist?uid=${uid}&timestamp=${Date.now()}`)
}
// 喜欢音乐
export const likeMusic = (id, like) => {
  // return axiosInstance.post(`/like?id=${id}&like=${like}`)
  return axiosInstance.post('/like', {
    id,
    like,
    timestamp: Date.now()
  })
}
// 获取用户关注列表
export const getUserFollows = (id, page) => {
  return axiosInstance.get(`/user/follows?uid=${id}&offset=${page*30}`)
}
// 获取用户粉丝列表
export const getUserFolloweds = (id, lasttime) => {
  return axiosInstance.get(`/user/followeds?uid=${id}&lasttime=${lasttime}`)
}