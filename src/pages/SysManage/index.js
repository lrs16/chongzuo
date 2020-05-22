/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
// import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableForm from './TableForm';
// import Test from './Client';

@connect(({ usermanage, loading }) => ({
  usermanage,
  loading: loading.models.usermanage,
}))
@Form.create()
class index extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getuserslist();
  }

  getuserslist() {
    this.props.dispatch({
      type: 'usermanage/fetch',
    });
  }

  render() {
    const {
      usermanage: { data },
    } = this.props;
    const dataSource = [...data];
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper title="用户管理">
        {/* <Test /> */}
        <Card bordered={false}>
          {getFieldDecorator('members', {
            initialValue: dataSource,
          })(<TableForm />)}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default index;
