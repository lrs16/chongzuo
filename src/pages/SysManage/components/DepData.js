/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select } from 'antd';

const { Option } = Select;

@connect(({ managereport, loading }) => ({
  managereport,
  loading: loading.models.managereport,
}))
class SelectData extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getusermanagedatas();
  }

  getusermanagedatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'managereport/fetchdatas',
    });
  }

  handleChange(value) {
    // console.log(value);
    this.props.getData(value);
  }

  render() {
    const {
      managereport: { departments },
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <Select placeholder="请选择部门" onChange={this.handleChange.bind(this)}>
          {departments.map(({ key, code }) => [
            <Option key={key} value={code}>
              {code}
            </Option>,
          ])}
        </Select>
      </Form>
    );
  }
}

export default Form.create()(SelectData);
