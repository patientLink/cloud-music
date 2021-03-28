import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'
import {debounce} from '../../api/utils'

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  position: relative;
  background: ${globalStyle["theme-color"]};
  .icon-back {
    font-size: 24px;
    color: ${globalStyle["font-color-light"]};
  }
  .box {
    flex: 1;
    margin: 0 0 0 10px;
    padding-right: 26px;
    line-height: 22px;
    background: ${globalStyle["theme-color"]};
    color: ${globalStyle["highlight-background-color"]};
    font-size: ${globalStyle["font-size-m"]};
    outline: none;
    border: none;
    border-bottom: 1px solid ${globalStyle["border-color"]};
    &::placeholder {
      color: ${globalStyle["font-color-light"]};
    }
  }
  .icon-delete {
    position: absolute;
    right: 24px;
    top: 13px;
    font-size: 14px;
    color: ${globalStyle["background-color"]};
  }
`

const SearchBox = props => {
  const queryRef = useRef()

  const [query, setQuery] = useState('')

  const {newQuery} = props

  const {handleQuery} = props

  const displayStyle = query ? {display: 'block'} : {display: 'none'}

  useEffect(() => {
    queryRef.current.focus()
  }, [])

  useEffect(() => {
    handleQueryDebounce(query)
  }, [query])

  useEffect(() => {
    if(newQuery !== query) {
      setQuery(newQuery)
    }
  }, [newQuery])

  const handleChange = (e) => {
    setQuery(e.currentTarget.value)
    handleQueryDebounce(query)
  }

  let handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500)
  }, [handleQuery])

  const clearQuery = () => {
    setQuery('')
    queryRef.current.focus()
  }
  
  

  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back()}>&#xe61f;</i>
      <input ref={queryRef} className="box" placeholder="搜索歌曲、歌手、专辑" value={query} onChange={handleChange} />
      <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>&#xe61a;</i>
    </SearchBoxWrapper>
  )
}

export default SearchBox