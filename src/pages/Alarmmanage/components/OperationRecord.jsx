import React from 'react';
import { Table } from 'antd';

function OperationRecord(props) {
  const { data } = props;
  const columns = [
    {
      title: '操作时间',
      dataIndex: 'ctime',
      key: 'ctime',
    },
    {
      title: '操作账号',
      dataIndex: 'userAccount',
      key: 'userAccount',
    },
    {
      title: '账户名称',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '操作记录',
      dataIndex: 'modifyContent',
      key: 'modifyContent',
      // render: (text, record) => (
      //   <span>
      //     <Badge status={recordingMap[record.recording]} text={recording[record.recording]} />
      //   </span>
      // ),
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (text, record) => (
    //     <span>
    //       <Badge status={statusMap[record.status]} text={status[record.status]} />
    //     </span>
    //   ),
    // },
  ];
  return (
    <Table
      dataSource={data}
      rowKey={record => record.operatid}
      columns={columns}
    />
  );
}

export default OperationRecord;
