import React from 'react';

// 克隆子元素按钮，并添加事件
const withClick = (element, getFormvalue = () => { }) => {
  console.log(element)
  return <element.type {...element.props} onMouse={getFormvalue} />;
};
function TopTabHoc(props) {
  const { children } = props;
  const handleClick = () => {
    console.log('top')
  }
  return (
    <>
      {withClick(children, handleClick)}
    </>
  );
}

export default TopTabHoc;