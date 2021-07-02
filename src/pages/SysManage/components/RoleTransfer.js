import React, { Component } from 'react';
import { Transfer, Spin } from 'antd';

class RoleTransfer extends Component {
  state = {
    targetKeys: [],
  };

  componentWillReceiveProps() {
    this.gettargetData();
  }

  gettargetData = () => {
    const targetData = this.sort(this.props.userrole);
    this.setState({
      targetKeys: targetData,
    });
  };

  handleChange = targetdata => {
    this.props.UpdateRole(targetdata);
    setTimeout(() => {
      this.setState({ targetKeys: targetdata });
    }, 0);
  };

  // id转换成key
  addArr = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.id = datas[i].id;
      vote.key = datas[i].id;
      vote.title = datas[i].roleName;
      vote.rolecode = datas[i].roleCode;
      newArr.push(vote);
    }
    return newArr;
  };

  // 转换targetData数组
  sort = data => {
    // console.log(data);
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    data.forEach(item => {
      result.push(item.id);
    });
    return result;
  };

  renderItem = item => {
    const customLabel = (
      <span>
        {item.title} - {item.rolecode}
      </span>
    );
    return {
      label: customLabel, // for displayed item
      value: item.id, // for title and filter matching
    };
  };

  render() {
    const dataSource = this.addArr(this.props.sysrole);
    // console.log(dataSource);
    const { targetKeys } = this.state;
    // console.log(targetKeys);
    return (
      <Spin spinning={this.props.openloading}>
        <Transfer
          titles={['未分配', '已分配']}
          dataSource={dataSource}
          targetKeys={targetKeys}
          onChange={this.handleChange}
          render={this.renderItem}
          listStyle={{
            height: 'calc(100vh - 150px)',
            width: 315,
            overflow: 'auto',
          }}
        />
      </Spin>
    );
  }
}

export default RoleTransfer;
