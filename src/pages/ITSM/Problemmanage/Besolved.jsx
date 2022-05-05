import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
  Cascader,
  Tooltip
} from 'antd';

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import Problemexcel from './components/Problemexcel';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { Option } = Select;
const { RangePicker } = DatePicker;

function Besolved(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    dispatch,
    besolveList,
    loading,
    location,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  const [selectdata, setSelectData] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [tabrecord, setTabRecord] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

  const searchdata = (values, page, pageSize) => {
    const newvalues = {
      ...values,
      createTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      createTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      createTime: '',
    }
    dispatch({
      type: 'problemmanage/searchBesolve',
      payload: {
        ...newvalues,
        pageSize,
        type: values && values.type && values.type.length > 0 ? (values.type).toString() : '',
        pageNum: page,
      },
    });
    setTabRecord({ ...newvalues });
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    searchdata({}, 1, 15)
    setPaginations({ current: 1, pageSize: 15 });
  };

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPaginations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: besolveList.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };

  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'problemmanage/besolvedownload',
          payload: {
            ids: selectedKeys.toString(),
            ...values,
            type: values && values.type && values.type.length > 0 ? (values.type).toString() : '',
            createTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            createTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            createTime: '',
          }
        }).then(res => {
          const filename = `下载.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      }
    })
  }

  const exportDownload = () => {
    dispatch({
      type: 'problemmanage/exportdownloadExcel',
    }).then(res => {
      const filename = '下载.xls';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  const record = {
    currentNode: '',
    importance: '',
    no: '',
    registerUser: '',
    source: '',
    title: '',
    type: '',
    paginations,
  };

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  const columns = [
    {
      title: '问题编号',
      dataIndex: 'no',
      key: 'no',
      width: 150,
      sorter: (a, b) => a.no.localeCompare(b.no),
      render: (text, record) => {
        const handleClick = () => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                ...tabrecord,
                paginations,
                expand,
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
          router.push({
            pathname: `/ITSM/problemmanage/besolveddetail/workorder`,
            query: {
              id: record.id,
              taskName: record.currentNode,
              mainId: record.mainId,
              orderNo: text,
              sign: '待办',
            },
            state: {
              runpath: '/ITSM/problemmanage/besolved',
              cacheinfo: {
                ...tabrecord,
                paginations,
                expand,
              },
            }
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '问题标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '问题来源',
      dataIndex: 'sourcecn',
      key: 'sourcecn',
    },
    {
      title: '问题分类',
      dataIndex: 'typecn',
      key: 'typecn',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '当前处理环节',
      dataIndex: 'currentNode',
      key: 'currentNode',
    },
    {
      title: '发送人',
      dataIndex: 'registerUser',
      key: 'registerUser',
    },
    {
      title: '发生时间',
      dataIndex: 'registerOccurTime',
      key: 'registerOccurTime',
    },
    {
      title: '重要程度',
      dataIndex: 'importancecn',
      key: 'importancecn',
    },

  ];

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...tabrecord,
              registerTime: '',
              paginations,
              expand,
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
      };
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset();
        setExpand(false);;
      };
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        const { createTimeBegin, createTimeEnd } = location.state.cacheinfo;
        setExpand(location.state.cacheinfo.expand);
        setPaginations({ ...paginations, current, pageSize });
        setFieldsValue({
          createTime: createTimeBegin ? [moment(createTimeBegin), moment(createTimeEnd)] : '',
        })
      };
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    if (cacheinfo !== undefined) {
      validateFields((err, values) => {
        if (!err) {
          searchdata(values, cacheinfo.paginations.current, cacheinfo.paginations.pageSize)
        }
      });
    }
  }, []);

  // 不要用查询标题的方式，人家改了名字就查不到了，用id
  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const problemSource = getTypebyTitle('问题来源');
  const priority = getTypebyTitle('严重程度');
  const currentNode = getTypebyTitle('当前处理环节');
  const problemType = getTypebyTitle('问题分类');

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关闭 <UpOutlined /></>) : (<>展开 <DownOutlined /></>)}
    </Button>
  </>);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="334"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <div className='noexplain'>
          <Row gutter={16}>
            <Form {...formItemLayout}>
              <Col span={8}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('no', {
                    initialValue: cacheinfo.no,
                  })(<Input placeholder='请输入' allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="当前处理环节">
                  {getFieldDecorator('currentNode', {
                    initialValue: cacheinfo.currentNode,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {currentNode.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <span style={{ display: expand ? 'block' : 'none' }}>
                <>
                  <Col span={8}>
                    <Form.Item label="问题标题" >
                      {getFieldDecorator('title', {
                        initialValue: cacheinfo.title,
                      })
                        (<Input placeholder='请输入' allowClear />)}
                    </Form.Item>
                  </Col>
                </>
                <Col span={8}>
                  <Form.Item label="问题来源">
                    {getFieldDecorator('source', {
                      initialValue: cacheinfo.source,
                    })
                      (
                        <Select placeholder="请选择" allowClear>
                          {problemSource.map(obj => [
                            <Option key={obj.key} value={obj.dict_code}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="问题分类">
                    {getFieldDecorator('type', {
                      initialValue: cacheinfo.type ? (cacheinfo.type.toString()).split(',') : '',
                    })(
                      <Cascader
                        fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                        options={problemType}
                        placeholder="请选择"
                      />,
                      <Input />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送人">
                    {getFieldDecorator('registerUser', {
                      initialValue: cacheinfo.registerUser,
                    })(
                      <Input placeholder='请输入' allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发生时间">
                    {getFieldDecorator('createTime', {
                      initialValue: ''
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        placeholder="请选择"
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="重要程度">
                    {getFieldDecorator('importance', {
                      initialValue: cacheinfo.importance,
                    })
                      (
                        <Select placeholder="请选择" allowClear>
                          {priority.map(obj => [
                            <Option key={obj.key} value={obj.dict_code}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>
              </span>
              {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
            </Form>
          </Row>
        </div>


        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'row' }} >
          <Button type="primary" style={{ marginRight: 8 }} onClick={exportDownload}>
            下载导入模板
          </Button>

          {
            loading === false && (
              <div>
                <Problemexcel
                  fileslist={[]}
                  ChangeFileslist={newvalue => setFiles(newvalue)}
                />
              </div>
            )

          }
          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => download()}
          >
            导出数据
          </Button>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={besolveList.rows}
          rowKey={r => r.id}
          pagination={pagination}
          // rowSelection={rowSelection}
          scroll={{ x: 800, y: 700 }}
        />
      </Card>

    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    besolveList: problemmanage.besolveList,
    loading: loading.models.problemmanage,
  }))(Besolved),
);
