import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Popconfirm, Button, Message, Divider, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const statusMap = ['default', 'success'];
const status = ['停用', '启用'];

@connect(({ usermanage, loading }) => ({
  usermanage,
  loading: loading.models.usermanage,
}))
class SysuserMangage extends Component {
  componentDidMount() {
    this.getuserslist();
  }

  getuserslist() {
    this.props.dispatch({
      type: 'usermanage/fetch',
    });
  }

  render() {
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '角色代码',
        dataIndex: 'loginCode',
        key: 'loginCode',
      },
      {
        title: '启用状态',
        dataIndex: 'userStatus',
        key: 'userStatus',
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.userStatus]} text={status[record.userStatus]} />
          </span>
        ),
      },
      // {
      //   title: '操作',
      //   dataIndex: 'action',
      //   key: 'action',
      //   render: (text, record) => (
      //     <div>
      //       <span
      //         title="用户分配角色"
      //         record={record}
      //         roleid={record.id}

      //       >
      //         <a type="link">菜单权限</a>
      //       </span>
      //       <Divider type="vertical" />
      //       <span title="编辑用户" record={record}>
      //         <a type="link">编辑</a>
      //       </span>
      //       <Divider type="vertical" />
      //       <Popconfirm title="确定删除此用户吗？">
      //         <a type="link">删除</a>
      //       </Popconfirm>
      //     </div>
      //   ),
      // },
    ];
    const {
      usermanage: { data },
    } = this.props;
    const dataSource = [...data];
    return (
      <PageHeaderWrapper>
        <Card>
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            icon="plus"
          >
            新增用户
          </Button>
          <Table dataSource={dataSource} columns={columns} rowKey={record => record.id} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SysuserMangage;
