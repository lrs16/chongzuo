import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Divider, Button, Message, Popconfirm, Input, Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MenuModal from './components/MenuModal';

const { Search } = Input;
@connect(({ upmsmenu, loading }) => ({
  upmsmenu,
  loading: loading.models.upmsmenu,
}))
class MenuManage extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'upmsmenu/fetchdatas',
    });
  }

  render() {
    const reload = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'upmsmenu/fetchdatas',
      });
    };

    const handleUpdate = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsmenu/update',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          reload();
        } else {
          Message.error('添加菜单失败');
        }
      });
    };
    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsmenu/edite',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          reload();
        } else {
          Message.error('更新菜单失败');
        }
      });
    };
    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsmenu/remove',
        payload: { id },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          reload();
        } else {
          Message.error('删除菜单失败');
        }
      });
    };
    const handleSearch = (values, pageinit) => {
      const { dispatch } = this.props;
      const { page, pagesize } = pageinit;
      return dispatch({
        type: 'upmsmenu/search',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg || '查询成功！');
          reload();
        } else {
          Message.error('什么也没有查到！');
        }
      });
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },

      {
        title: '路由',
        dataIndex: 'menuUrl',
        key: 'menuUrl',
      },
      {
        title: '图标',
        dataIndex: 'menuIcon',
        key: 'menuIcon',
      },
      {
        title: '英文名称',
        dataIndex: 'menuName',
        key: 'menuName',
      },
      {
        title: '中文名称',
        dataIndex: 'menuDesc',
        key: 'menuDesc',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        key: 'createUser',
        sorter: true,
      },
      {
        title: '权限',
        dataIndex: 'menuAuth',
        key: 'menuAuth',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <MenuModal onSumit={values => handleEdite(values)} title="编辑脚本" record={record}>
              <a type="link">编辑</a>
            </MenuModal>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此菜单吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const {
      upmsmenu: { data },
    } = this.props;
    const dataSource = [...data];
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderWrapper title="菜单管理">
        <Card>
          <div>
            <Form>
              {getFieldDecorator('queKey')(
                <Search
                  placeholder="请输入"
                  style={{ float: 'right', width: '30%' }}
                  onSearch={values => handleSearch(values)}
                />,
              )}
            </Form>
            <MenuModal onSumit={handleUpdate}>
              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="dashed"
                icon="plus"
              >
                新建菜单
              </Button>
            </MenuModal>
            <Table dataSource={dataSource} columns={columns} rowKey={record => record.id} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MenuManage);
