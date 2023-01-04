import React, { useState } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Table,
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  Alert,
  Popconfirm,
  message,
  Badge
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import { createInspection, createsoftInspection, createclockInspection } from '../services/api';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const colormap = new Map([
  ['离线', 'default'],
  ['在线', 'success'],
]);

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

function PatrolconfigModal(props) {
  const {
    children,
    dispatch,
    list,
    onChangeList,
    pagename,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    }
  } = props;

  const [visible, setVisible] = useState(false);
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const onSelectChange = (RowKeys, Rows) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRows(Rows);
  };

  // 列表checkbox
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 列表查询
  const searchdata = (page, size) => {
    const values = getFieldsValue();
    dispatch({
      type: 'automation/findtaskObjectList',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
        taskId: undefined
      },
    });
  };

  // 取消
  const handleCancel = () => {
    setVisible(false);
  };

  // 执行巡检
  const handleOk = () => {
    if (selectedRowKeys.length === 0) {
      message.error('至少选择一条agent');
    } else {
      const ids = selectedRowKeys;
      if (pagename === 'softpatrol') { // 软件巡检
        createsoftInspection(ids).then(resp => {
          if (resp.code === 200) {
            message.success(resp.msg);
            onChangeList();
          } else {
            message.error(resp.msg);
          }
        });
      }
      if (pagename === 'hostpatrol') { // 主机巡检
        createInspection(ids).then(resp => {
          if (resp.code === 200) {
            message.success(resp.msg);
            onChangeList();
          } else {
            message.error(resp.msg);
          }
        });
      }
      if (pagename === 'clockpatrol') { // 时钟巡检
        createclockInspection(ids).then(resp => {
          if (resp.code === 200) {
            message.success(resp.msg);
            onChangeList();
          } else {
            message.error(resp.msg);
          }
        });
      }
    }
    // 关闭弹窗
    handleCancel();
    resetFields();
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };

  const handleopenClick = () => {
    setVisible(true);
    searchdata(1, 15, undefined);
  };

  // 查询
  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  // 重置
  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  const onShowSizeChange = (page, size) => {
    searchdata(1, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  // 分页
  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
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
      width: 200,
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

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8, marginBottom: 20 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>
  );

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const typemap = getTypebyId(105);         // 类型
  const statusmap = getTypebyId(106);       // 状态
  const zonemap = getTypebyId(107);         // 区域

  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        title='自定义巡检'
        onCancel={() => handleCancel()}
        visible={visible}
        width={1160}
        footer={[
          <Button key="back" onClick={() => handleCancel()}>
            取消
          </Button>,
          <Popconfirm title="是否确认进行执行巡检？" onConfirm={() => handleOk()}>
            <Button key="submit" type="primary" style={{ marginLeft: 8 }}
            >
              执行巡检
            </Button>,
          </Popconfirm>

        ]}
      >
        <DictLower
          typeid={104}
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="agent名称">
                {getFieldDecorator('agentName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="agent区域">
                {getFieldDecorator('agentZone', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {zonemap.map(obj => (
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="agent类型">
                {getFieldDecorator('agentType', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {typemap.map(obj => (
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="agent状态">
                {getFieldDecorator('agentStatus', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {statusmap.map(obj => (
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="agent地址">
                {getFieldDecorator('agentHost', {
                  initialValue: '',
                })(
                  <Input placeholder="请输入" allowClear />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="节点地址" style={{ display: expand ? 'block' : 'none' }}>
                {getFieldDecorator('nodeHost', {
                  initialValue: '',
                })(
                  <Input placeholder="请输入" allowClear />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="agent备注" style={{ display: expand ? 'block' : 'none' }}>
                {getFieldDecorator('agentRemarks', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ paddingLeft: expand ? '8.5%' : '24px' }}>{extra}</Col>
          </Form>
          <Col span={24}><Alert message={`已选择【${selectedRows.length}】个agent`} type="info" style={{ marginBottom: 5, width: '100%' }} /></Col>
        </Row>
        <Table
          dataSource={list.rows}
          columns={columns}
          rowKey={record => record.id}
          scroll={{ x: 500 }}
          rowSelection={rowSelection}
          paginations={pagination}
        />
      </Modal>
    </>
  );
}

export default Form.create({})(
  connect(({ automation, loading }) => ({
    list: automation.list,
    loading: loading.models.automation,
  }))(PatrolconfigModal),
);