import React,{ useEffect } from 'react';
import {
  Table,
  Form
} from 'antd';
import { connect } from 'dva';

function MergeTable(props) {
  const {
    column, // 表格的行
    mergecell, //  合并字段
    tableSource, // 表格的数据
    loading
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
       {tableSource && tableSource.length > 0 && mergecell  && (
          <Table
            bordered
            columns={column}
            dataSource={makeData(tableSource)}
            pagination={false}
            rowKey={record => record.statCode}
          />
         )}
     </>
    )
  
}

// export default MergeTable;
export default Form.create({})(
  connect(({ problemstatistics, loading }) => ({
    statusArr: problemstatistics.statusArr,
    loading: loading.models.problemstatistics
  }))(MergeTable),
);