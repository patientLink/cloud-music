import axios from 'axios'

export const baseUrl = process.env.NODE_ENV == 'production' ? "http://129.204.236.31:3030" : "http://localhost:3030"

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  config => {
    return config
  }, err => {
    return Promise.reject(err)
  }
)

axiosInstance.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    return Promise.reject(err)
  }
)

export {
  axiosInstance
}

export const categoryTypes = [{
  name: "华语男",
  key: "1001",
  type: "1",
  area: "7"
},
{
  name: "华语女",
  key: "1002",
  type: "2",
  area: "7"
},
{
  name: "华语组合",
  key: "1003",
  type: "3",
  area: "7"
},
{
  name: "欧美男",
  key: "2001",
  type: "1",
  area: "96"
},
{
  name: "欧美女",
  key: "2002",
  type: "2",
  area: "96"
},
{
  name: "欧美组合",
  key: "2003",
  type: "3",
  area: "96"
},
{
  name: "日本男",
  key: "6001",
  type: "1",
  area: "8"
},
{
  name: "日本女",
  key: "6002",
  type: "2",
  area: "8"
},
{
  name: "日本组合",
  key: "6003",
  type: "3",
  area: "8"
},
{
  name: "韩国男",
  key: "7001",
  type: "1",
  area: "16"
},
{
  name: "韩国女",
  key: "7002",
  type: "2",
  area: "16"
},
{
  name: "韩国组合",
  key: "7003",
  type: "3",
  area: "16"
},
{
  name: "其他男歌手",
  key: "4001",
  type: "1",
  area: "0"
},
{
  name: "其他女歌手",
  key: "4002",
  type: "2",
  area: "0"
},
{
  name: "其他组合",
  key: "4003",
  type: "3",
  area: "0"
},
]

export const alphaTypes = [{
  key: "a",
  name: "A"
},
{
  key: "b",
  name: "B"
},
{
  key: "c",
  name: "C"
},
{
  key: "d",
  name: "D"
},
{
  key: "e",
  name: "E"
},
{
  key: "f",
  name: "F"
},
{
  key: "g",
  name: "G"
},
{
  key: "h",
  name: "H"
},
{
  key: "i",
  name: "I"
},
{
  key: "j",
  name: "J"
},
{
  key: "k",
  name: "K"
},
{
  key: "l",
  name: "L"
},
{
  key: "m",
  name: "M"
},
{
  key: "n",
  name: "N"
},
{
  key: "o",
  name: "O"
},
{
  key: "p",
  name: "P"
},
{
  key: "q",
  name: "Q"
},
{
  key: "r",
  name: "R"
},
{
  key: "s",
  name: "S"
},
{
  key: "t",
  name: "T"
},
{
  key: "u",
  name: "U"
},
{
  key: "v",
  name: "V"
},
{
  key: "w",
  name: "W"
},
{
  key: "x",
  name: "X"
},
{
  key: "y",
  name: "Y"
},
{
  key: "z",
  name: "Z"
}
]

export const HEADER_HEIGHT = 45

export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}