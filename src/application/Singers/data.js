import React, {createContext, useReducer} from 'react'
import produce from 'immer'

export const CategoryDataContext = createContext({})

export const CHANGE_CATEGORY = 'singers/CHANGE_CATEGORY'
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA'

const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CATEGORY: 
      return produce(state, draftState => {
        draftState['type'] = action.data['type']
        draftState['area'] = action.data['area']
      })
    case CHANGE_ALPHA: 
      return produce(state, draftState => {
        draftState['alpha'] = action.data
      })
  }
}

const defaultState = {
  type: '',
  area: '',
  alpha: ''
}

export const Data = props => {
  const [data, dispatch] = useReducer(reducer, defaultState)
  return (
    <CategoryDataContext.Provider value={{data, dispatch}}>
      {props.children}
    </CategoryDataContext.Provider>
  )
}