/* eslint-disable array-callback-return */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import React from 'react';
import {
  Table,
} from 'antd';

function MergeTable(props) {
  const {
    column, // 表格的行
    mergecell, //  合并字段
    tableSource, // 表格的数据
    loading,
    pagination,
  } = props;

  //  对象数组去重
  const uniqueObjArr = (arr, fieldName) => {
    const result = [];
    const resultArr = [];
    arr.map(item => {
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
      ({ [mergecell]: item[mergecell] })
    );
    const orgArr = uniqueObjArr(orgArrRe, [mergecell]);// 数组去重
    orgArr.map(function (childOne) {
      childOne.children = [];
      dataArr.map(function (childTwo) {
        if (childOne[mergecell] === childTwo[mergecell]) {
          childOne.children.push(childTwo);
        }
      })
    })

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
    return dataSource;
  }

  return (
    <>
      {tableSource && tableSource.length && mergecell ? (
        <Table
          columns={column}
          loading={loading}
          scroll={{ x: 1300 }}
          dataSource={makeData(tableSource) || []}
          pagination={pagination}
          rowKey={record => record.id}
        />
      ) : (<Table 
        columns={column} pagination={pagination}/>)}
    </>
  )

}

export default MergeTable;