import React, { Component } from 'react';
import { connect } from 'dva';
import { Transfer, Spin, Table } from 'antd';
import difference from 'lodash/difference';

const leftTableColumns = [
  {
    dataIndex: 'title',
    title: '名称',
  },
  // {
  //   dataIndex: 'hostcode',
  //   title: '编码',
  // },
];

const rightTableColumns = [
  {
    dataIndex: 'title',
    title: '名称',
  },
  // {
  //   dataIndex: 'hostcode',
  //   title: '编码',
  // },
];
@connect(({ softrole, loading }) => ({
  softrole,
  loading: loading.models.softrole,
}))
class SoftTransfer extends Component {
  state = {
    targetKeys: [],
    current: 1,
    pageSize: 10,
  };

  componentWillReceiveProps() {
    this.gettargetData();
  }

  gettargetData = () => {
    const targetData = this.sort(this.props.hostId?this.props.rightrole:this.props.softId?this.props.processList:'');
    this.setState({targetKeys: targetData});
  };

  handleChange = targetdata => {
    this.props.UpdateRole(targetdata);
    setTimeout(() => {
      this.setState({ targetKeys: targetdata });
    }, 0);
  };

  //id转换成key
  addArr = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.id = datas[i].id;
      vote.key = datas[i].id;
      vote.title = datas[i].softwareName?datas[i].softwareName:datas[i].courseName;
      vote.hostcode = datas[i].roleCode;
      newArr.push(vote);
    }
    return newArr;
  };

  //转换targetData数组
  sort = data => {
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
    const hostLable = (
      <span>
        {item.title}
      </span>
    );
    return {
      label: hostLable,
      value: item.id,
    };
  };

  render() {
    const dataSource = this.addArr(
      this.props.hostId?this.props.leftrole:this.props.softId?this.props.softdata:''
    );
    const { targetKeys } = this.state;

    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      // total:leftbox.total,
      onChange: page => this.changePage(page),
    };
    const TableTransfer = ({ leftColumns, rightColumns,...restProps}) => (
      <Transfer {...restProps} showSelectAll={false}>
        {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;
          const rowSelection = {
            // getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
            onSelectAll(selected, selectedRows) {
              const treeSelectedKeys = selectedRows
                .filter(item => !item.disabled)
                .map(({ key }) => key);
              const diffKeys = selected
                ? difference(treeSelectedKeys, listSelectedKeys)
                : difference(listSelectedKeys, treeSelectedKeys);
              onItemSelectAll(diffKeys, selected);
            },
            onSelect({ key }, selected) {
              onItemSelect(key, selected);
            },
            selectedRowKeys: listSelectedKeys,
          };

          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : null }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) return;
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
              // pagination={pagination}
            />
          );
        }}
      </Transfer>
    );
    return (
      <Spin spinning={this.props.openloading}>
        <TableTransfer
           titles={['未分配', '已分配']}
          dataSource={dataSource}
          targetKeys={targetKeys}
          // showSearch={showSearch}
          onChange={this.handleChange}
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
          listStyle={{
            width: 300,
            height: 700,
          }}
        ></TableTransfer>
      </Spin>
    );
   
  }
}

export default SoftTransfer;
