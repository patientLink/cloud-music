import React, {useEffect, useRef} from 'react'
import styled from 'styled-px2vw'
import Scroll from '../scroll'
import PropTypes from 'prop-types'
import globalStyle from '../../assets/global-style'

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  >span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${globalStyle["font-size-m"]};
  }
`

const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${globalStyle["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${globalStyle["theme-color"]};
    padding: 4px 7px;
    border: 1px solid ${globalStyle["theme-color"]};
    opacity: 0.8;
  }
`

function Horizon(props) {

  const {list, oldVal, title} = props
  const {clickHandle} = props
  const Category = useRef(null)

  useEffect(() => {
    let categoryDOM = Category.current
    let tagElems = categoryDOM.querySelectorAll('span')    
    let totalWidth = 0
    Array.from(tagElems).forEach(ele => {
      totalWidth += ele.offsetWidth
    })
    categoryDOM.style.width = `${totalWidth}px`
    
  }, [])

  return (
    <Scroll direction="horizontal">
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {
            list.map((item) => {
              return (
                <ListItem
                  key={item.key}
                  className={typeof oldVal === 'string' ? (oldVal === item.key ? 'selected' : '') : ((oldVal['area'] === item.area && oldVal['type'] === item.type) ? 'selected' : '')}
                  onClick={() => clickHandle(item)}
                >
                  {item.name}
                </ListItem>
              )
            })
          }
        </List>
      </div>
    </Scroll>
  )
}

Horizon.defaultProps = {
  list: [],
  oldVal: '',
  title: '',
  clickHandle: null
}

Horizon.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  clickHandle: PropTypes.func
}

export default React.memo(Horizon)