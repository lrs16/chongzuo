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

  getItemsValue = () => {
    // 3、自定义方法，用来传递数据（需要在父组件中调用获取数据）
    const valus = this.props.form.getFieldsValue(); // 4、getFieldsValue：获取一组输入控件的值，如不传入参数，则获取全部组件的值
    return valus;
  };

  handleClick = values => {
    this.props.data(values);
  };

  render() {
    const {
      managereport: { departments },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Form>
          <Form.Item>
            {getFieldDecorator('currentLayer', {
              initialValue: this.props.defaultData,
            })(
              <Select
                placeholder="请选择部门"
                onChange={this.handleClick}
                style={{ width: '100%' }}
              >
                {departments.map(({ key, value, code }) => [
                  <Option value={value} key={key}>
                    {code}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}

export default Form.create()(SelectData);
