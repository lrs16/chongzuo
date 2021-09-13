import React, { useState } from 'react';
import {
  Drawer,
  Table
} from 'antd';
import { connect } from 'dva';

const culumns = [
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    key: 'contractNo',
    width:200
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    key: 'contractName',
    width:150
  },
  {
    title: '签订日期',
    dataIndex: 'signTime',
    key: 'signTime',
    width:150
  },
  {
    title: '到期日期',
    dataIndex: 'dueTime',
    key: 'dueTime',
    width:150
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width:150
  },
]

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}

function ContractList(props) {
  const [visible, setVisible] = useState(false);
  const {
    id,
    children,
    title,
    dispatch,
    contractProviderobj
  } = props;

  const handleopenClick = () => {
    dispatch({
      type: 'qualityassessment/contractProvider',
      payload: {id}
    })
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={visible}
        width={800}
        centered='true'
        maskClosable='true'
        destroyOnClose={true}
        onClose={handleCancel}
      >
        <Table columns={culumns} dataSource={contractProviderobj} />
      </Drawer>
    </>
  )
}

export default (
  connect(({ qualityassessment, loading }) => ({
    contractProviderobj: qualityassessment.contractProviderobj,
    loading: loading.models.qualityassessment
  }))
)(ContractList);