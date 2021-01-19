import _ from 'lodash';
import { useState, useEffect, useRef } from 'react';

/* eslint-disable  no-undef */
const useStickyHeader = () => {
  const stickyHeaderRef = useRef(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  useEffect(() => {
    const onScroll = _.throttle(() => {
      const { offsetTop, offsetHeight } = stickyHeaderRef.current;
      const isSticky = document.documentElement.scrollTop > (offsetTop + offsetHeight);
      setIsHeaderSticky(isSticky);
    }, 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return { stickyHeaderRef, isHeaderSticky };
};

export default useStickyHeader;
