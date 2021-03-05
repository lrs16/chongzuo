import React,{useState,useEffect} from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Table
} from 'antd';
import { connect } from 'dva';

const columns = [
  {
    title:'序号',
    dataIndex:'id',
    key:'id'
  },
  {
    title:'事件编号',
    dataIndex:'eventNumber',
    key:'eventNumber'
  },
  {
    title:'标题',
    dataIndex:'title',
    key:'title'
  },
  {
    title:'状态',
    dataIndex:'statue',
    key:'statue'
  },
  {
    title:'关联类型',
    dataIndex:'associationType',
    key:'associationType'
  },
];

const columnRealse = [
  {
    title:'序号',
    dataIndex:'id',
    key:'id'
  },
  {
    title:'发布编号',
    dataIndex:'realseNumber',
    key:'realseNumber'
  },
  {
    title:'标题',
    dataIndex:'title',
    key:'title'
  },
  {
    title:'状态',
    dataIndex:'statue',
    key:'statue'
  },
  {
    title:'关联类型',
    dataIndex:'associationType',
    key:'associationType'
  },
];
function Associateworkorder(props) {
  const { 
    form:{getFieldDecorator},
    dispatch,
    chooseClass,
    eventtableList,
    realsetableList
   } = props;
   console.log(eventtableList,'eventtableList');

   const geteventList = () => {
    dispatch({
      type:'problemmanage/eventList',
    })
   };
   
   useEffect(() => {
     if(chooseClass === 1) {
       geteventList();
       getreaseList();
     } else if(chooseClass === 2) {
      getreaseList();
     }
   },[]);

 

   const getreaseList = () => {
     console.log('222222222222');
     dispatch({
      type:'problemmanage/realselist',
    })
   }

  return (
    <div>
      <Form layout='inline'>
        {
          chooseClass === 1 && (
            <Form.Item label='事件编号'>
            {
              getFieldDecorator('eventNumber',{})(<Input/>)
            }
          </Form.Item>
          )
        }

        {
          chooseClass === 2 && (
            <Form.Item label='发布编号'>
            {
              getFieldDecorator('releaseNumber',{})(<Input/>)
            }
          </Form.Item>
          )
        }
       

        <Form.Item>
          <Button type='primary'>查询</Button>
        </Form.Item>

        <Form.Item>
          <Button>重置</Button>
        </Form.Item>
      </Form>

      { chooseClass === 1 && (
        <Table
        columns={columns}
        dataSource={eventtableList.data}
      />
      )}

      { chooseClass === 2 && (
        <Table
        columns={columnRealse}
        dataSource={realsetableList.data}
      />
      )}

    </div>
    
  )
}
export default Form.create({})
(
  connect(({problemmanage,loading})=>({
    eventtableList:problemmanage.eventtableList,
    realsetableList:problemmanage.realsetableList,
    loading:loading.models.problemmanage
  }))(Associateworkorder)
);