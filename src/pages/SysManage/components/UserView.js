import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Drawer, Badge, Card, Tag, Radio, Spin, Upload, message, Avatar } from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
const statusMap = ['default', 'success', 'processing'];
const status = ['停用', '启用', '临时'];

const usersex = ['男', '女'];
// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
@connect(({ usermanage, loading }) => ({
  usermanage,
  loading: loading.models.usermanage,
}))
class UserView extends Component {
  state = {
    visible: false,
  };

  getuserrole = () => {
    const { userId } = this.props;
    this.props.dispatch({
      type: 'usermanage/fetchuserrole',
      payload: { userId },
    });
  };

  getusermenu = () => {
    const { userId } = this.props;
    this.props.dispatch({
      type: 'usermanage/fetchusermenu',
      payload: { userId },
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });

    this.getuserrole();
    this.getusermenu();
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    const {
      children,
      record,
      usermanage: { userrole, usermenu },
      loading,
    } = this.props;
    return (
      <>
        {withClick(children, this.showDrawer)}
        <Drawer
          width={720}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
          drawerStyle={{ background: '#f5f5f5' }}
          // destroyOnClose
        >
          <h3>用户：{record.userName}</h3>
          <Card bordered={false} title="基本信息" style={{ marginBottom: 24 }}>
            <DescriptionList size="large">
              <Description term="用户ID">{record.id}</Description>
              <Description term="登录账号">{record.loginCode}</Description>
              <Description term="用户名">{record.userName}</Description>
              <Description term="性别">{usersex[record.userSex]}</Description>
              <Description term="电话">{record.userMobile}</Description>
              <Description term="邮箱">{record.userEmail}</Description>
              <Description term="所属组织">{record.deptId}</Description>
              <Description term="状态">
                <Badge status={statusMap[record.userStatus]} text={status[record.userStatus]} />
              </Description>
              <Description term="创建人">{record.createUser}</Description>
              <Description term="创建时间">
                {moment(record.createTime).format('YYYY-MM-DD')}
              </Description>
              <Description term="更新时间">
                {moment(record.updateTime).format('YYYY-MM-DD')}
              </Description>
            </DescriptionList>
          </Card>
          <Card bordered={false} title="用户角色" style={{ marginBottom: 24 }}>
            <Spin spinning={loading}>
              {userrole.map(item => {
                return (
                  <Tag key={item.id} style={{ padding: '5px 10px', marginBottom: 10 }} color="blue">
                    {item.roleName}
                  </Tag>
                );
              })}
            </Spin>
          </Card>
          <Card bordered={false} title="菜单权限">
            <Spin spinning={loading}>
              {usermenu.map(item => {
                return (
                  <Tag key={item.id} style={{ padding: '5px 10px', marginBottom: 10 }} color="blue">
                    {item.menuDesc}
                  </Tag>
                );
              })}
            </Spin>
          </Card>
        </Drawer>
      </>
    );
  }
}

export default UserView;
