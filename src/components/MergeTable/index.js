import React from 'react';
import {
  Table
} from 'antd';

function MergeTable(props) {
  const {
    column,
    Mergecell,
    tableSource
  } = props;

    //  对象数组去重
    const uniqueObjArr = (arr, fieldName) => {
      const result = [];
      const resultArr = [];
      arr.map(function (item, index, value) {
        if (result.indexOf(item[fieldName]) === -1) {
          result.push(item[fieldName]);
          resultArr.push(item);
        }
      })
      return resultArr;
    }
  
    //  去重并合并到children
    const sortData = (dataArr) => {
      const orgArrRe = dataArr.map(item =>
        ({ Mergecell: item.Mergecell })
      );
      const orgArr = uniqueObjArr(orgArrRe, Mergecell);// 数组去重
      orgArr.map(function (childOne) {
        childOne.children = [];
        dataArr.map(function (childTwo) {
          if (childOne.Mergecell === childTwo.Mergecell) {
            childOne.children.push(childTwo);
          }
        })
      })
  
      for (const every of orgArr) {
        every.span = every.children ? every.children.length : 0;
      }
  
      orgArr.forEach((every) => { every.span = every.children ? every.children.length : 0; });
      return orgArr;
    }
  
    //  遍历子元素，并赋值纵向合并数rowSpan
    const makeData = (data) => {
      const sortResult = sortData(data);
      const dataSource = [];
      sortResult.forEach((item) => {
        if (item.children) {
          item.children.forEach((itemOne, indexOne) => {
            const myObj = itemOne;
            myObj.rowSpan = indexOne === 0 ? item.span : 0;
            dataSource.push(myObj);
          });
        }
      });
      console.log(dataSource);
      return dataSource;
    }

    return (
      <Table
      bordered
      columns={column}
      dataSource={makeData(tableSource)}
      pagination={false}
       />
    )
  
}

export default MergeTable;