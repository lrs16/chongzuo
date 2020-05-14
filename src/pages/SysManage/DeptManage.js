/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Card, Button, Input, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DeptTree from '@/components/DeptTree';
import DeptList from './components/DeptList';
import DeptModal from './components/DeptModal';

const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ upmsdept, loading }) => ({
  upmsdept,
  loading: loading.models.upmsdept,
}))
class DeptManage extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'upmsdept/fetchdatas',
    });
  }

  reloadlist() {
    const { dispatch } = this.props;
    dispatch({
      type: 'upmsdept/fetchdatas',
    });
  }

  reloadtree() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptree/fetch',
    });
  }

  handleUpdate = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsdept/update',
      payload: values,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.reloadlist();
        this.reloadtree();
      } else {
        Message.error('添加组织失败');
      }
    });
  };

  handleEdite = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsdept/edite',
      payload: values,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.reloadlist();
        this.reloadtree();
      } else {
        Message.error('更新组织失败');
      }
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsdept/remove',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.reloadlist();
        this.reloadtree();
      } else {
        Message.error('删除菜单失败');
      }
    });
  };

  render() {
    const {
      upmsdept: { data },
    } = this.props;
    const dataSource = [...data];
    return (
      <PageHeaderWrapper title="组织管理">
        <Card>
          <Layout>
            <Sider theme="light">
              <DeptTree />
            </Sider>
            <Content>
              <div style={{ background: '#fff' }}>
                <Search placeholder="请输入" style={{ float: 'right', width: '30%' }} />
                <DeptModal onSumit={this.handleUpdate}>
                  <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    icon="plus"
                  >
                    新建组织
                  </Button>
                </DeptModal>
                <DeptList
                  datas={dataSource}
                  DeleteData={this.handleDelete}
                  doEdite={this.handleUpdate}
                />
              </div>
            </Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DeptManage;
