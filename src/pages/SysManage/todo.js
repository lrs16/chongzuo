import React, { Component } from 'react';
import { Form, Button, Input, Select } from 'antd';
import SelectData from './components/DepData';

const { Option } = Select;
class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: ['新增用户', '编辑用户', '删除用户', '用户查询'],
      inputValue: '',
      selectOp: ['企划部', '运维部', '研发部'],
      selectedOp: '',
    };
  }

  hanleBtnClick() {
    // console.log(this.state.inputValue);
    this.setState({
      list: [...this.state.list, this.state.inputValue, this.state.selectedOp],
      inputValue: '',
      selectedOp: '',
    });
  }

  hanleInputChange(e) {
    // console.log(e.target.value);
    this.setState({
      inputValue: e.target.value,
    });
  }

  handleChange(value) {
    this.setState({
      selectedOp: value,
    });
  }

  handleChangeDep(value) {
    this.setState({
      selectedOp: value,
    });
    // console.log(value);
  }

  render() {
    return (
      <div>
        {/* <Input onChange={this.hanleInputChange.bind(this)} />
        <Button onClick={this.hanleBtnClick.bind(this)}>新增</Button> */}
        <Form layout="inline">
          <Form.Item>
            <Input value={this.state.inputValue} onChange={this.hanleInputChange.bind(this)} />
          </Form.Item>
          <Form.Item>
            <Button onClick={this.hanleBtnClick.bind(this)}>新增</Button>
          </Form.Item>
          <Form.Item>
            <Select
              defaultValue="运维部"
              style={{ width: 120 }}
              onChange={this.handleChange.bind(this)}
            >
              {this.state.selectOp.map((item, index) => {
                return (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
            <SelectData getData={this.handleChangeDep.bind(this)} />
          </Form.Item>
        </Form>
        <ul>
          {this.state.list.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default Todo;
