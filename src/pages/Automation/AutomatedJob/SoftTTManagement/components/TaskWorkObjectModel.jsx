import React, { useState } from 'react';
import {
  Form,
  Modal,
  Table,
  Badge,
} from 'antd';

const colormap = new Map([
  ['离线', 'default'],
  ['在线', 'success'],
]);

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

function TaskWorkObjectModel(props) {
  const {
    children,
    dispatch,
    values
  } = props;

  const { id } = props.record;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleopenClick = () => {
    setVisible(true);
    dispatch({
      type: 'autosoftwork/findautoSoftObjectList1',
      payload: {
        values,
        workId: id,
        pageNum: 1,
        pageSize: 15,
      },
    }).then(res => {
      if (res.code === 200) {
        setData(res.data);
      }
    });
  };

  const columns = [
    {
      title: '区域',
      dataIndex: 'hostZoneId',
      key: 'hostZoneId',
      width: 200,
    },
    {
      title: '设备名称',
      dataIndex: 'hostName',
      key: 'hostName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '设备IP',
      dataIndex: 'hostIp',
      key: 'hostIp',
      width: 200,
    },
    {
      title: '软件名称',
      dataIndex: 'softName',
      key: 'softName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '软件端口',
      dataIndex: 'softPort',
      key: 'softPort',
      width: 120,
    },
    {
      title: '软件路径',
      dataIndex: 'softPath',
      key: 'softPath',
      width: 250,
      ellipsis: true,
    },
    {
      title: '软件版本号',
      dataIndex: 'softVersion',
      key: 'softVersion',
      width: 120,
    },
    {
      title: '软件状态',
      dataIndex: 'softStatus',
      key: 'softStatus',
      width: 120,
      render: (text, record) => (
        <span>
          <Badge status={colormap.get(record.agentStatus)} text={text} />
        </span>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'director',
      key: 'director',
      width: 120,
    },
    {
      title: '启动脚本路径',
      dataIndex: 'startupScriptPath',
      key: 'startupScriptPath',
      width: 250,
      ellipsis: true
    },
    {
      title: '停止脚本路径',
      dataIndex: 'stopScriptPath',
      key: 'stopScriptPath',
      width: 250,
      ellipsis: true
    },
    {
      title: '启动参数',
      dataIndex: 'startupScriptArgs',
      key: 'startupScriptArgs',
      width: 150,
    },
    {
      title: '停止参数',
      dataIndex: 'stopScriptArgs',
      key: 'stopScriptArgs',
      width: 150,
    },
    {
      title: '软件备注',
      dataIndex: 'softRemarks',
      key: 'softRemarks',
      width: 200,
    },
  ];

  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        title='启停对象'
        onCancel={() => handleCancel()}
        footer={null}
        visible={visible}
        width="68%"
        centered
        maskClosable
        closable
      >
        <Table
          dataSource={data.rows}
          columns={columns}
          scroll={{ x: 200 }}
          rowKey={record => record.id}
          pagination={false}
        />
      </Modal>
    </>
  );
}

export default Form.create({})(TaskWorkObjectModel);