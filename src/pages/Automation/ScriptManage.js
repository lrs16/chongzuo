import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card,  Divider, Button, Message, Popconfirm  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ScriptDrawer from './components/ScriptDrawer';
import DoJob from './components/DoJob';


@connect(({ scriptmanage, loading }) => ({
  scriptmanage,
  loading: loading.models.scriptmanage,
}))
class Script extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'scriptmanage/fetch',
      // payload: {pageNumber:1, pageSize:10},
      payload: {pageNumberInit:1, pageSizeInit:10},
    }) 
  }

  render() {
  
    const columns = [{
      title: '编码',
      dataIndex: 'scriptId',
      key: 'scriptId',
    }, {
      title: '脚本名称',
      dataIndex: 'scriptName',
      key: 'scriptName',
    }, {
      title: '类型',
      dataIndex: 'scriptType',
      key: 'scriptType',
    },{
      title: '创建人',
      dataIndex: 'scriptAuthor',
      key: 'scriptAuthor',
    },
    {
      title: '最后修改人',
      dataIndex: 'scriptLastModifiedBy',
      key: 'scriptLastModifiedBy',
    },
    {
      title: '脚本来源',
      dataIndex: 'scriptSource',
      key: 'scriptSource',
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <div>
          <DoJob onDoSumit={value => addJob(record.id,value)} title="快速执行作业" record={record}>
            <Button type="link">快速执行</Button>
          </DoJob>
          <ScriptDrawer onSumit={value => handlEdit(record.id,value)} title="编辑脚本" record={record}> 
            <Button type="link">编辑</Button>
          </ScriptDrawer>
          <Popconfirm title="确定删除此脚本吗？" onConfirm={() =>handleDelete(record.id)}>
            <Button type="link">删除</Button>
          </Popconfirm>
          
        </div>
      ),
    }
  ];
  const reload = () =>{
    const { dispatch } = this.props;
      dispatch({
        type: 'scriptmanage/fetch',
  });
  };
  const handleAdd = (values) =>{
    const { dispatch } = this.props;
    // console.log(values);
    return dispatch({
       type: 'scriptmanage/add',
       payload: values
     }).then(res =>{
       if(res&&res.status === "200"){
         Message.success(res.msg);
         reload();
         return res;
       }
        Message.error("添加脚本失败")
     });      
  };
  const handlEdit =(id,value) =>{
    // console.log(value,id);
    const { dispatch } = this.props;
    return dispatch({
      type:"scriptmanage/edit",
      payload:{id,value}
    }).then(res =>{
      if(res&&res.status === "200"){
        Message.success(res.msg || '编辑脚本成功');
        reload();
      }else{
       Message.error("编辑脚本失败")
      }
    });  
  };
  const handleDelete = id =>{
    // console.log(value,id);
    const { dispatch } = this.props;
    return dispatch({
      type:"scriptmanage/remove",
      payload: { id },
    }).then(res =>{
      if(res&&res.status === "200"){
        Message.success(res.msg || '删除脚本成功');
        reload();
      }else{
       Message.error("删除脚本失败")
      }
    });    
  };
  const addJob =(id,value) =>{
    // console.log(value,id);
    const { dispatch } = this.props;
    return dispatch({
      type:"jobsmanage/dojob",
      payload:{id,value}
    }).then(res =>{
      // console.log(res)
      if(res&&res.status === "200"){
        Message.success(res.msg || '快速执行作业成功');
        reload();
      }else{
       Message.error("执行作业失败")
      }
    });  
  };

    const { scriptmanage = {} } = this.props;
    const { data  = {} } = scriptmanage;
    const { content = []} = data;

    return (
      <PageHeaderWrapper title="脚本管理"> 
        <Card> 
          <div>
            <ScriptDrawer onSumit={handleAdd}>
              <Button type="primary">新建脚本</Button>
            </ScriptDrawer>
          </div>
          <Table
            dataSource={content}          
            rowKey={record => record.scriptId}
            columns={columns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Script;