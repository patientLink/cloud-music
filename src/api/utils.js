import dayjs from 'dayjs'

export const getCount = (count) => {
  if(count < 0) return
  if(count < 10000) {
    return count + ''
  } else if(Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万'
  } else {
    return Math.floor(count / 10000000) / 10 + '亿'
  }
}

export const getCountv2 = (count) => {
  if(count === 0) return ''
  if(count < 1000) return count+''
  if(count < 10000) return '999+'
  if(count < 100000) return '1w+'
  if(count < 1000000) return '10w+'
  return '100w+'
}


export const debounce = (func, delay, immediate=false) => {
  let timer
  return function(...args) {
    if(timer) {
      clearTimeout(timer)
    }
    if(immediate) {
      if(!timer) {
        func.apply(this, args)
        timer = setTimeout(() => {
          timer = null
        }, delay);
      }
    } else {
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay);
    }
    
  }
}

export function throttle(func, delay){
  let timer = null
  let last
  return function(...args){
    let now = Date.now()
    if(last && now < last + delay) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        func.apply(this, args)
      }, delay);
    } else {
      last = now
      clearTimeout(timer)
      func.apply(this, args)
    }
  }
}

export const filterIndex = rankList => {
  for(let i = 0; i < rankList.length - 1; i++) {
    if(rankList[i].tracks.length && !rankList[i+1].tracks.length) {
      return i+1
    }
  }
}

export const getName = list => {
  if(typeof list === 'string') {
    return list
  }
  let str = ""
  list.forEach((item, index) => {
    str += index === 0 ? item.name : ("/" + item.name)
  })
  return str
}

export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0

let elementStyle = document.createElement("div").style

let vendor = (() => {
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "Transform"
  }
  for(let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false
})()

export function prefixStyle(style) {
  if(vendor === false) {
    return false
  }
  if(vendor === "standard") {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export const getSongUrl = id => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

export const formatPlayTime = interval => {
  interval = interval | 0;// |0表示向下取整
  const minute = (interval / 60) | 0;
  const second = (interval % 60).toString().padStart(2, "0");
  return `${minute}:${second}`;
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let new_arr = [...arr]
  for(let i = 0; i < new_arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = new_arr[i]
    new_arr[i] = new_arr[j]
    new_arr[j] = t
  }
  return new_arr
}

export const findIndex = (song, list) => {
  return list.findIndex(item => item.id === song.id)
}

export const getValueOfTransform = (str, prop) => {
  if(!str) return 0
  prop = prop && prop.toUpperCase()
  let reg = new RegExp(`translate${prop}\\(-?(\\d+)px\\)`,'i')
  let target = str.match(reg)
  if(!target) return 0
  
  return +target[1]
}

export const getGenerator = (num) => {
  let date = dayjs(num).format('YYYY') % 100
  let front = Math.floor(date / 10) 
  let back = date % 10
  back = back < 5 ? 0 : 5
  return '' + front + back + '后'
}