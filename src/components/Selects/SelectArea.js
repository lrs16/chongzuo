import React, { Component } from 'react';
import { Select } from 'antd';

const selectdtats = [
  '广西电网公司',
  '南宁供电局',
  '柳州供电局',
  '桂林供电局',
  '贵港供电局',
  '玉林供电局',
  '来宾供电局',
  '河池供电局',
  '梧州供电局',
  '北海供电局',
  '钦州供电局',
  '防城港供电局',
  '崇左供电局',
  '贺州供电局',
];
class SelectArea extends Component {
  state = {
    selectedItems: [],
  };

  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    const { selectedItems } = this.state;
    const filteredOptions = selectdtats.filter(o => !selectedItems.includes(o));
    return (
      <Select
        mode="multiple"
        placeholder="请选择"
        value={selectedItems}
        onChange={this.handleChange}
        style={{ width: '300px', margin: '0 10px' }}
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default SelectArea;
