import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Table,
  Card,
  Divider,
  Button,
  message,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Icon,
  Popover,
  Checkbox
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import { togetSearchUsers } from './services/api';
import CabinetDrawer from './components/CabinetDrawer';
import SysLeadinCabinet from './components/SysLeadinCabinet';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

function CabinetManege(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    cabinetList,
    loading,
    location,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields
    },
  } = props;

  let formThead;

  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  // const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');
  const [allUserData, setallUserData] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [columns, setColumns] = useState([]); // 动态表格

  // 列表请求
  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    dispatch({
      type: 'cabinetmanage/findCabinetList',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    });
  };

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      searchdata(1, 15);
    }
  }, [files]);

  // 打开抽屉
  const handleShowDrawer = (drwertitle, type, record) => {
    setVisible(!visible);
    setTitle(drwertitle);
    // setSaveType(type);
    setData(record);
    togetSearchUsers().then(res => {
      if (res.code === 200) {
        setallUserData(res.data.userList);
      } else {
        message.error('获取负责人失败');
      }
    });
  };

  // 提交
  const handleSubmit = values => {
    dispatch({
      type: 'cabinetmanage/toUpdateCabinet',
      payload: {
        ...values,
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        searchdata(1, 15);
      } else {
        message.error(res.msg);
      }
    });
  };

  // 重置
  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  }

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
    total: cabinetList.total,
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

  // 删除
  const handleDelete = (id) => {
    dispatch({
      type: 'cabinetmanage/toDeleteCabinet',
      payload: { Ids: id },
    }).then(res => {
      if (res.code === 200) {
        message.success('删除成功');
        searchdata(1, 15);
      } else {
        message.error(res.msg);
      }
    });
  };

  // 列表
  const initialColumns = [
    {
      title: '机柜编号',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '区域',
      dataIndex: 'cabinetZoneId',
      key: 'cabinetZoneId',
      width: 120,
    },
    {
      title: '机柜名称',
      dataIndex: 'cabinetName',
      key: 'cabinetName',
      width: 250,
      ellipsis: true,
    },
    {
      title: '机柜编码',
      dataIndex: 'cabinetNo',
      key: 'cabinetNo',
      width: 200,
      ellipsis: true,
    },
    {
      title: '机柜位置',
      dataIndex: 'cabinetSeat',
      key: 'cabinetSeat',
      width: 250,
      ellipsis: true,
    },
    {
      title: '机柜容量',
      dataIndex: 'cabinetU',
      key: 'cabinetU',
      width: 120,
      sorter: (a, b) => a.cabinetU.substring(0, a.cabinetU.length - 1) - b.cabinetU.substring(0, b.cabinetU.length - 1)
    },
    {
      title: '剩余容量',
      dataIndex: 'cabinetResidueU',
      key: 'cabinetResidueU',
      width: 120,
      sorter: (a, b) => a.cabinetResidueU.substring(0, a.cabinetResidueU.length - 1) - b.cabinetResidueU.substring(0, b.cabinetResidueU.length - 1)
    },
    {
      title: '负责人',
      dataIndex: 'director',
      key: 'director',
      width: 120,
    },
    {
      title: '机柜排序',
      dataIndex: 'cabinetSorts',
      key: 'cabinetSorts',
      width: 200,
    },
    {
      title: '机柜备注',
      dataIndex: 'cabinetRemarks',
      key: 'cabinetRemarks',
      width: 300,
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 250,
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      key: 'updateBy',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => {
        return (
          <div>
            <a type="link" onClick={() => handleShowDrawer('编辑机柜', 'update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a type="link" style={{ color: 'red' }} onClick={() => handleDelete(record.id)}>
              删除
            </a>
          </div>
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
      };
      if (val.title === '操作') {
        obj.render = (_, record) => {
          return (
            <div>
              <a type="link" onClick={() => handleShowDrawer('编辑机柜', 'update', record)}>
                编辑
              </a>
              <Divider type="vertical" />
              <a type="link" style={{ color: 'red' }} onClick={() => handleDelete(record.id)}>
                删除
              </a>
            </div>
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
  );

  // 导出
  const download = () => {
    const values = getFieldsValue();
    dispatch({
      type: 'cabinetmanage/download',
      payload: {
        ...values,
        startTime: values.startTime?.length ? moment(values.startTime).format('YYYY-MM-DD 00:00:00') : '',
        endTime: values.endTime?.length ? moment(values.endTime).format('YYYY-MM-DD 23:59:59') : '',
        startUpdateTime: values.startUpdateTime?.length ? moment(values.startUpdateTime).format('YYYY-MM-DD 23:59:59') : '',
        endUpdateTime: values.endUpdateTime?.length ? moment(values.endUpdateTime).format('YYYY-MM-DD 23:59:59') : '',
        starMaintainTime: values.starMaintainTime?.length ? moment(values.starMaintainTime).format('YYYY-MM-DD 23:59:59') : '',
        endMaintainTime: values.endMaintainTime?.length ? moment(values.endMaintainTime).format('YYYY-MM-DD 23:59:59') : '',
      }
    }).then(res => {
      const filename = `机柜导出_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  // 下载导入模板
  const downloadTemplate = () => {
    dispatch({
      type: 'cabinetmanage/downloadTemplate',
    }).then(res => {
      const filename = `机柜导入模板_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  };

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const zonemap = getTypebyId(717); // 区域

  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 568
      } else {
        height = clientHeight - 510
      }
    }
    return height;
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid={710}
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card bodyStyle={{ paddingBottom: 0 }}>
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="区域">
                {getFieldDecorator('cabinetZoneId', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {zonemap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="机柜编码">
                {getFieldDecorator('cabinetNo', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="机柜名称">
                {getFieldDecorator('cabinetName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="机柜位置">
                {getFieldDecorator('cabinetSeat', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="机柜容量">
                {getFieldDecorator('cabinetU', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="负责人">
                {getFieldDecorator('director', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="创建人">
                {getFieldDecorator('createByNameExt', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="创建时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('startTime', {
                    })(
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
                    {getFieldDecorator('endTime', {
                    })(
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
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="更新人">
                {getFieldDecorator('updateByNameExt', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="更新时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('startUpdateTime', {
                    })(
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
                    {getFieldDecorator('endUpdateTime', {
                    })(
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
            {expand ? (<Col span={8} style={{ marginTop: 4, paddingLeft: '5.666667%' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
          </Form>
        </Row>
        {/* 列表顶部按钮 */}
        <div style={{ marginBottom: 8, display: 'flex' }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleShowDrawer('新增机柜', 'add',)}>新增</Button>
          <div>
            <SysLeadinCabinet
              fileslist={files.arr}
              ChangeFileslist={newvalue => setFiles(newvalue)}
            />
          </div>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => download()}>导出</Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => downloadTemplate()}>下载导入模板</Button>
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
          dataSource={cabinetList.rows || []}
          loading={loading}
          rowKey={r => r.id}
          pagination={pagination}
          scroll={{ x: 1300, y: setTableHeight() }}
        />
      </Card>
      {/* 抽屉 */}
      <CabinetDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
        // savetype={savetype}
        destroyOnClose
        directormap={allUserData}
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ cabinetmanage, loading }) => ({
    cabinetList: cabinetmanage.cabinetList,
    loading: loading.models.cabinetmanage,
  }))(CabinetManege),
);