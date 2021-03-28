const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1
export default class Lyric {
  constructor(lrc, handler = () => {}) {
    this.lrc = lrc
    this.lines = []
    this.handler = handler
    this.state = STATE_PAUSE
    this.curLineIndex = 0
    this.startStamp = 0
    this.self = this
    this._initLines()
  }

  _initLines() {
    const lines = this.lrc.split('\n')
    for(let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let result = timeExp.exec(line)
      if(!result) continue  
      const txt = line.replace(timeExp, '').trim()
      if(txt) {
        if(result[3].length === 3) {
          result[3] = result[3] / 10
        }
        this.lines.push({
          time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
          txt
        })
      }

    }
    this.lines.sort((a, b) => a.time - b.time)
  }

  play(offset=0, isSeek=false) {
    if(!this.lines.length) return
    this.state = STATE_PLAYING
    this.curLineIndex = this._findCurLineIndex(offset)
    this._callHandler(this.curLineIndex - 1)
    this.startStamp = +new Date() - offset

    if(this.curLineIndex < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest(isSeek)
    }
  }

  _findCurLineIndex(time) {
    for(let i = 0; i < this.lines.length; i++) {
      if(time <= this.lines[i].time) {
        return i 
      }
    }
    return this.lines.length
  }

  _callHandler(i) {
    
    if(i < 0) {
      return
    }
    this.lines[i] && this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }

  _playRest(isSeek=false) {
    let line = this.lines[this.curLineIndex]
    let delay
    if(isSeek) {
      delay = line.time - (+new Date() - this.startStamp)
    } else {
      let preTime = this.lines[this.curLineIndex - 1] ? 
        this.lines[this.curLineIndex - 1].time : 0
      delay = line.time - preTime
    }
    this.timer = setTimeout(() => {
      this._callHandler(this.curLineIndex++)
      if(this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay);
  }

  togglePlay(offset) {
    if(this.state === STATE_PLAYING) {
      this.stop()
    } else {
      this.state = STATE_PLAYING
      this.play(offset, true)
    }
  }

  stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }

  seek(offset) {
    this.play(offset, true)
  }

  destroy() {
    this.self = null
  }
}