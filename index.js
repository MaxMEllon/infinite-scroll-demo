import React, { useState, useReducer, useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Scroller from './InfiniteScroller'

const Items = styled.div`
  border-bottom: solid 1px gray;
  height: 50px;
  flex: 1;
  text-align: center;
  background: cyan;
`

const itemRenderer = ({ index, item }) => <Items key={index}>{item}</Items>

function Root() {
  const [items, dispatch] = useReducer((state, action) => [...state, ...action.payload], [])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const timerId = useRef(null)

  const loadMore = useCallback(() => {
    if (timerId.current !== null) return
    setLoading(true)
    timerId.current = setTimeout(() => {
      const newItems = Array.from(new Array(1)).map(() => Math.random())
      setLoading(false)
      dispatch({ payload: items.concat(newItems) })
      timerId.current = null
    }, Math.floor(Math.random() * 500 + 500))
  }, [items, timerId.current])

  useEffect(() => {
    if (items.length > 200) setHasMore(false)
  }, [items])

  return (
    <Scroller
      items={items}
      loadMore={loadMore}
      hasMore={hasMore}
      itemRenderer={itemRenderer}
      loading={loading}
    />
  )
}

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Root />, document.querySelector('#root'))
})


