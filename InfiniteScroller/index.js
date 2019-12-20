import React, { useLayoutEffect, useEffect, useRef, useMemo, useCallback } from 'react'
import styled from 'styled-components'


export default function Scroller({
  hasMore,
  loading,
  loadMore,
  itemRenderer,
  items,
}) {
  const $elem = useRef(null)
  const observer = useRef(null)

  const loadMoreEnhanced = useCallback(() => {
    const rect = $elem.current.getBoundingClientRect()
    if (rect.top < document.body.clientHeight) {
      observer.current.unobserve($elem.current)
    }
    if (hasMore) {
      loadMore()
    }
  }, [hasMore, loadMore])

  useEffect(() => {
    observer.current = new IntersectionObserver(loadMoreEnhanced, {
      root: null,
      rootMargin: '0%',
      threshold: 0,
    })
  }, [$elem.current])

  useEffect(() => {
    // subscribe intersection when already dom mouted
    if (!loading && observer.current !== null) {
      observer.current.observe($elem.current)
    }
  }, [loading, observer.current])

  useEffect(() => {
    if (hasMore) loadMore()
  }, [])

  const children = useMemo(() => items.map((item, index) => (
    itemRenderer({ item, index })
  )), [items])

  return (
    <div id="wrapper">
      {children}
      {loading ? <Indicator /> : <Spacer />}
      <Sensor ref={$elem} />
    </div>
  )
}

function Indicator() {
  return (
    <div style={{ width: '100px', height: '100px' }}>
      loading....
    </div>
  )
}

const Spacer = styled.div`
  width: 100px;
  height: 100px;
  padding: 0;
  margin: 0;
`

const Sensor = styled.div`
  width: 10px;
  height: 10px;
  padding: 0;
  margin: 0;
`
