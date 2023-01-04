import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const { Option } = Select;
@connect(({ upmsrole, loading }) => ({
  upmsrole,
  loading: loading.models.upmsrole,
}))
class SelectRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
    };
    // this.handleChange=this.handleChange.bind
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'upmsrole/fetchdatas',
    });
  }

  handleChange = value => {
    this.setState({ selectedItems: value });
    // onChange将值传给父组件
    this.props.onChange(value);
  };

  render() {
    const { selectedItems } = this.state;
    const {
      upmsrole: { data },
    } = this.props;
    const filteredOptions = data.filter(o => !selectedItems.includes(o));
    return (
      <Select
        mode="multiple"
        placeholder="请选择角色"
        value={selectedItems}
        onChange={this.handleChange}
        getPopupContainer={triggerNode => triggerNode.parentNode} // 解决下拉不显示在上层的问题
      >
        {filteredOptions.map(({ id, roleCode, roleName }) => (
          <Option key={id} value={roleCode}>
            {roleName}
          </Option>
        ))}
      </Select>
    );
  }
}

export default SelectRole;
