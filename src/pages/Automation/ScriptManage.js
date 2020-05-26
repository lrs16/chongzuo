import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Table, Card, Divider, Button, Message, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ScriptDrawer from './components/ScriptDrawer';
import DoJob from './components/DoJob';

@connect(({ scriptmanage, loading }) => ({
  scriptmanage,
  loading: loading.models.scriptmanage,
}))
class Script extends Component {
  state = {
    scriptdata: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'scriptmanage/fetch',
      payload: { limit: 100, pages: 0 },
    });
  }

  render() {
    const fetchscriptinfo = id => {
      const { dispatch } = this.props;
      dispatch({
        type: 'scriptmanage/fetchinfo',
        payload: { id },
      }).then(() => {
        this.setState({
          scriptdata: this.props.scriptmanage.info,
        });
      });
    };
    const reload = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'scriptmanage/fetch',
      });
    };

    const handleAdd = values => {
      const { dispatch } = this.props;
      // console.log(values);
      return dispatch({
        type: 'scriptmanage/add',
        payload: values,
      }).then(res => {
        if (res && res.status === '200') {
          Message.success(res.msg);
          reload();
          return res;
        }
        Message.error('添加脚本失败');
      });
    };
    const handlEdit = (id, value) => {
      // console.log(value,id);
      const { dispatch } = this.props;
      return dispatch({
        type: 'scriptmanage/edit',
        payload: { id, value },
      }).then(res => {
        if (res && res.status === '200') {
          Message.success(res.msg || '编辑脚本成功');
          reload();
        } else {
          Message.error('编辑脚本失败');
        }
      });
    };
    const handleDelete = id => {
      // console.log(value,id);
      const { dispatch } = this.props;
      return dispatch({
        type: 'scriptmanage/remove',
        payload: { id },
      }).then(res => {
        if (res && res.status === '200') {
          Message.success(res.msg || '删除脚本成功');
          reload();
        } else {
          Message.error('删除脚本失败');
        }
      });
    };
    const addJob = (id, value) => {
      // console.log(value,id);
      const { dispatch } = this.props;
      return dispatch({
        type: 'jobsmanage/dojob',
        payload: { id, value },
      }).then(res => {
        // console.log(res)
        if (res && res.status === '200') {
          Message.success(res.msg || '快速执行作业成功');
          reload();
        } else {
          Message.error('执行作业失败');
        }
      });
    };

    const columns = [
      {
        title: '编码',
        dataIndex: 'scriptId',
        key: 'scriptId',
      },
      {
        title: '脚本名称',
        dataIndex: 'scriptName',
        key: 'scriptName',
      },
      {
        title: '类型',
        dataIndex: 'scriptType',
        key: 'scriptType',
      },
      {
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
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const scriptInfo = this.state.scriptdata;
          return (
            <ScriptDrawer
              scriptid={record.scriptId}
              // datas={this.state.scriptdata}
              fetchInof={() => {
                fetchscriptinfo(record.scriptId);
              }}
              title="查看脚本信息"
              record={scriptInfo}
            >
              <a>查看</a>
            </ScriptDrawer>
          );
        },
        // render: (text, record) => (
        //   <div>
        //     {/* <DoJob
        //       onDoSumit={value => addJob(record.id, value)}
        //       title="快速执行作业"
        //       record={record}
        //     >
        //       <a>快速执行</a>
        //     </DoJob> */}
        //     <ScriptDrawer
        //       scriptid={record.scriptId}
        //       // datas={this.state.scriptdata}
        //       fetchInof={() =>{fetchscriptinfo(record.scriptId)}}
        //       title="查看脚本"
        //       record={scriptInfo}
        //     >
        //       <a>查看</a>
        //     </ScriptDrawer>
        //     {/* <Popconfirm title="确定删除此脚本吗？" onConfirm={() => handleDelete(record.id)}>
        //       <Button type="link">删除</Button>
        //     </Popconfirm> */}
        //   </div>
        // ),
      },
    ];

    const { scriptmanage = {} } = this.props;
    const { data = {} } = scriptmanage;
    const { content = [] } = data;
    return (
      <PageHeaderWrapper title="脚本管理">
        <Card>
          {/* <div>
            <ScriptDrawer onSumit={handleAdd}>
              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="dashed"
                icon="plus"
              >
                新建脚本
              </Button>
            </ScriptDrawer>
          </div> */}
          <Table dataSource={content} rowKey={record => record.scriptId} columns={columns} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Script;
