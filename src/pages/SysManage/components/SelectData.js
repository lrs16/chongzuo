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
    // .then(res =>{
    //   this.renderDep();
    // })
  }

  renderDep() {
    const {
      managereport: { departments },
    } = this.props;
    return (
      <Select placeholder="请选择部门" style={{ width: '100%' }} onChange={this.handleChange}>
        {departments.map(({ key, value, code }) => [
          <Select.Option value={value} key={key}>
            {code}
          </Select.Option>,
        ])}
      </Select>
    );
  }

  handleChange(value) {
    console.log(value);
    // if(this.props.handleChane){
    //     const {value} = this.state;
    //     this.props.handleChane({value})
    // }
    // this.setState({value:''});
  }

  render() {
    const {
      managereport: { departments },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <Form.Item label="脚本应用">
            {getFieldDecorator('departments', {
              initialValue: departments,
            })(this.renderDep())}
          </Form.Item>
        </Form>
        {/* {this.renderDep()} */}

        {/* <Select 
          placeholder="请选择部门" 
          onChange={this.handleChange}
          style={{ width: '100%' }} 
          // defaultValue="lucy"
        >
          {departments.map(( { key, code}) => [
            <Select.Option value={key} key={key}>
              {code}
            </Select.Option>
                  ])}
        </Select> */}
      </div>
    );
  }
}

export default Form.create()(SelectData);
