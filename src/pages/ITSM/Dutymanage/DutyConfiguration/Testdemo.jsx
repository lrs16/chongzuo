import React, { useImperativeHandle,useRef } from 'react';

function Testdemo(props,ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    inputRef,
  }));
  return <input ref={inputRef} />;
}
const result = React.forwardRef(Testdemo);
console.log('result: ', result);

export default Testdemo