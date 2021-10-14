import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Radio, Table, Badge, Alert } from 'antd';
import AviewMadel from './AviewMadel';

const { TextArea } = Input;
const colormap = new Map([
  ['离线', 'default'],
  ['在线', 'success'],
]);

function Contentdes(props) {
  const { forminladeLayout, contentInfo, dispatch } = props;
  const [data, setData] = useState([]);
  const [taskobjectdata, settaskobjectData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [detaildata, setdetailData] = useState('');

  useEffect(() => {
    dispatch({
      type: 'autotask/findtaskScriptList1',
      payload: {
        taskId: contentInfo[0].id,
        pageNum: 1,
        pageSize: 15,
      },
    }).then(res => {
      if (res.code === 200) {
        setData(res.data.rows);
      }
    });

    dispatch({
      type: 'autotask/findtaskObjectList1',
      payload: {
          taskId: contentInfo[0].id,
          pageNum: 1,
          pageSize: 15,
      },
  }).then(res => {
      if (res.code === 200) {
        settaskobjectData(res.data);
      }
  });
  }, [contentInfo[0].id]);

  const handleShowscriptModel = (modeltitle, itemdata) => {
    setVisible(!visible);
    setTitle(modeltitle);
    setdetailData(itemdata);
  };

  const columns = [
    {
      title: '区域',
      dataIndex: 'agentZone',
      key: 'agentZone',
      width: 120,
    },
    {
      title: '名称',
      dataIndex: 'agentName',
      key: 'agentName',
      width: 250,
      ellipsis: true,
    },
    {
      title: '设备IP',
      dataIndex: 'agentHost',
      key: 'agentHost',
      width: 200,
    },
    {
      title: '协议',
      dataIndex: 'agentHyper',
      key: 'agentHyper',
      width: 80,
    },
    {
      title: '端口',
      dataIndex: 'agentPort',
      key: 'agentPort',
      width: 80,
    },
    {
      title: '类型',
      dataIndex: 'agentType',
      key: 'agentType',
      width: 80,
    },
    {
      title: 'token',
      dataIndex: 'agentToken',
      key: 'agentToken',
      width: 120,
    },
    {
      title: '目录',
      dataIndex: 'agentDeploy',
      key: 'agentDeploy',
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'agentStatus',
      key: 'agentStatus',
      width: 80,
      render: (text, record) => (
        <span>
          <Badge status={colormap.get(record.agentStatus)} text={text} />
        </span>
      ),
    },
    {
      title: '节点地址',
      dataIndex: 'nodeHost',
      key: 'nodeHost',
      width: 120,
    },
    {
      title: '节点端口',
      dataIndex: 'nodePort',
      key: 'nodePort',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'agentRemarks',
      key: 'agentRemarks',
      width: 120,
    },
  ];

  return (
    contentInfo &&
    (<>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...forminladeLayout}>
          <Col span={24}>
            <Form.Item label='作业名称'>
              <Input defaultValue={contentInfo[0].taskName} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='作业对象'>
            <Alert message={`已选择【${contentInfo[0].taskObjectNum}】个agent` || `已选择【0】个agent`} type="info" style={{marginBottom: 10}} />
              <Table
                dataSource={taskobjectdata.rows}
                columns={columns}
                scroll={{ x: 200 }}
                rowKey={record => record.id}
                pagination={false}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='作业脚本' >
              {data.map((item, index) => (
                <a onClick={() => handleShowscriptModel('脚本详情', item)}>{`脚本${index + 1}【${item.scriptName}】`}<br /></a>
              ))}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='作业备注'>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={contentInfo[0].taskRemarks} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="执行方式">
              <Radio.Group value={contentInfo[0].taskModes} disabled>
                <Radio value='手动'>手动</Radio>
                <Radio value='定时'>定时</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Form>
      </Row>
      {/* 窗窗 */}
      <AviewMadel
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        getdetaildata={detaildata}
      />
    </>)
  );
}

export default Contentdes;
