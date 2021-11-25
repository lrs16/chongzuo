import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Button, Form, Input, Select, Row, Col, DatePicker, Tooltip, Icon, Popover, Checkbox } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import HistorVersionDrawer from './components/HistorVersionDrawer';
import GetFileModal from './components/GetFileModal';

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

function SoftwareConfig(props) {
  const pagetitle = props.route.name;
  const {
    loading,
    dispatch,
    softconflist,
    location,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    },
  } = props;

  let formThead;

  const [expand, setExpand] = useState(false);
  const [confid, setconfId] = useState('');
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [columns, setColumns] = useState([]); // 动态表格

  // 历史版本抽屉
  const handleShowHistoryDrawer = (drawtitle, gotid) => {
    setTitle(drawtitle);
    setconfId(gotid);
    setVisible(!visible);
  };

  // 列表请求
  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    dispatch({
      type: 'softconf/findsoftConfList',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    })
  };

  // 重置
  const handleReset = () => {
    resetFields();
    searchdata(1, 15);
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
    total: softconflist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  // 查询
  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  // 列表
  const initialColumns = [{
    title: '批次号',
    dataIndex: 'pullNum',
    key: 'pullNum',
    width: 250,
  },
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
    width: 300,
    ellipsis: true,
  },
  {
    title: '主机IP',
    dataIndex: 'hostIp',
    key: 'hostIp',
    width: 200,
  },
  {
    title: '软件名称',
    dataIndex: 'softName',
    key: 'softName',
    width: 300,
    ellipsis: true,
  },
  {
    title: '配置文件路径',
    dataIndex: 'confPath',
    key: 'confPath',
    width: 250,
    onCell: () => {
      return {
        style: {
          maxWidth: 250,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
  },
  {
    title: '配置文件名称',
    dataIndex: 'confName',
    key: 'confName',
    width: 250,
  },
  {
    title: '配置文件大小',
    dataIndex: 'confSize',
    key: 'confSize',
    width: 150,
  },
  {
    title: '配置文件内容',
    dataIndex: 'confCont',
    key: 'confCont',
    width: 300,
    onCell: () => {
      return {
        style: {
          maxWidth: 300,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
  },
  {
    title: '配置文件版本号',
    dataIndex: 'confVersion',
    key: 'confVersion',
    width: 200,
  },
  {
    title: '文件md5',
    dataIndex: 'confMd5',
    key: 'confMd5',
    width: 300,
  },
  {
    title: '比对上次文件变化',
    dataIndex: 'lastCompareStatus',
    key: 'lastCompareStatus',
    width: 250,
  },
  {
    title: '文件修改时间',
    dataIndex: 'fileLateTime',
    key: 'fileLateTime',
    width: 200,
  },
  {
    title: '获取时间',
    dataIndex: 'pullTime',
    key: 'pullTime',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: (text, record) => {
      return (
        <a type="link"
          record={record}
          text={text}
          onClick={() => {
            handleShowHistoryDrawer('查看历史版本', record.confInstance);
          }}
        >
          历史版本
        </a>
      );
    },
  },
  ];

  // 动态列表名称
  const defaultAllkey = columns.map(item => {
    return item.title;
  });

  // 创建列表
  const creataColumns = () => {
    // columns
    initialColumns.length = 0;
    formThead.map(val => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: 250,
        ellipsis: true,
        onCell: (val.title === '配置文件路径' || val.title === '配置文件内容') ? () => {
          return {
            style: {
              maxWidth: 250,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }
          }
        } : () => { },
      };
      if (val.title === '配置文件路径' || val.title === '配置文件内容') {
        obj.render = (text) => {
          return (
            <Tooltip placement='topLeft' title={text} >{text}</Tooltip>
          )
        }
      }
      if (val.title === '操作') {
        obj.render = (text, record) => {
          return (
            <a type="link"
              record={record}
              text={text}
              onClick={() => {
                handleShowHistoryDrawer('查看历史版本', record.confInstance);
              }}
            >
              历史版本
            </a>
          );
        }
        obj.fixed = 'right'
      }
      initialColumns.push(obj);
      setColumns(initialColumns);
      return null;
    }
    )
  };

  // 列表设置
  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : [])
  };

  // 列名点击
  const onCheck = (checkedValues) => {
    formThead = initialColumns.filter(i =>
      checkedValues.indexOf(i.title) >= 0
    );

    if (formThead.length === 0) {
      setColumns([]);
    }
    creataColumns();
  };

  useEffect(() => {
    searchdata(1, 15);
    setColumns(initialColumns);
  }, [location]);

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>
  )

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const zonemap = getTypebyId(717); // 区域
  const lastcomparestatusmap = getTypebyId(1009); // 软件配置变化状态

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid={710}
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="区域">
                {getFieldDecorator('hostZoneId', {
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
            <Col span={8}>
              <Form.Item label="设备名称">
                {getFieldDecorator('hostName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="主机IP">
                    {getFieldDecorator('hostIp', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="软件名称">
                    {getFieldDecorator('softName', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="配置文件名称">
                    {getFieldDecorator('confName', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="配置文件路径">
                    {getFieldDecorator('confPath', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="批次号">
                    {getFieldDecorator('pullNum', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="比对上次文件变化">
                    {getFieldDecorator('lastCompareStatus', {
                      initialValue: '',
                    })(<Select placeholder="请选择" allowClear>
                      {lastcomparestatusmap.map(obj => (
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="获取时间">
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('startPullTime', {})(
                          <DatePicker
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: moment('00:00:00', 'HH:mm:ss'),
                            }}
                            placeholder="开始时间"
                            format='YYYY-MM-DD HH:mm:ss'
                            style={{ minWidth: 120, width: '100%' }}
                          />
                        )}
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                      <Col span={11}>
                        {getFieldDecorator('endPullTime', {})(
                          <DatePicker
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: moment('23:59:59', 'HH:mm:ss'),
                            }}
                            placeholder="结束时间"
                            format='YYYY-MM-DD HH:mm:ss'
                            style={{ minWidth: 120, width: '100%' }}
                          />
                        )}
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </>
            )}
            {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
          </Form>
        </Row>
        <div style={{ marginBottom: 8 }}>
          <GetFileModal>
            <Button type="primary" style={{ marginRight: 8 }}
            >获取文件</Button>
          </GetFileModal>
        </div>
        {/* 列表设置 */}
        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <>
                <p style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    onChange={onCheckAllChange}
                    checked={columns.length === initialColumns.length === true}
                  >
                    列表展示
                  </Checkbox>
                </p>
                <Checkbox.Group
                  onChange={onCheck}
                  value={defaultAllkey}
                  defaultValue={columns}
                >
                  {initialColumns.map(item => (
                    <Col key={`item_${item.key}`} style={{ marginBottom: 8 }}>
                      <Checkbox
                        value={item.title}
                        key={item.key}
                        checked={columns}
                      >
                        {item.title}
                      </Checkbox>
                    </Col>
                  ))}
                </Checkbox.Group>
              </>
            }
          >
            <Button>
              <Icon type="setting" theme="filled" style={{ fontSize: 14 }} />
            </Button>
          </Popover>
        </div>
        <Table
          columns={columns}
          dataSource={softconflist.rows || []}
          loading={loading}
          rowKey={r => r.id}
          pagination={pagination}
          scroll={{ x: 1600 }}
        />
        <HistorVersionDrawer
          zonemap={zonemap}
          lastcomparestatusmap={lastcomparestatusmap}
          visible={visible}
          ChangeVisible={newvalue => setVisible(newvalue)}
          title={title}
          id={confid}
          destroyOnClose
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ softconf, loading }) => ({
    softconflist: softconf.softconflist,
    loading: loading.models.softconf,
  }))(SoftwareConfig),
);