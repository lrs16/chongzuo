import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Card,
  message,
  Row,
  Col,
  Popconfirm,
  Divider,
  Radio,
} from 'antd';
import ContractList from './components/ContractList';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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

function ProviderMaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    location,
    providerArr,
    dispatch,
    loading,
  } = props;
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  const [tabrecord, setTabRecord] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'qualityassessment/providerList',
      payload: {
        ...values,
        pageNum: page,
        pageSize,
      },
    });
    setTabRecord({ ...values });
  };

  const handlesearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, 15);
    });
    setPaginations({ current: 1, pageSize: 15 });
  };



  const handleDelete = id => {
    return dispatch({
      type: 'qualityassessment/providerDel',
      payload: id,
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        searchdata({}, 1, paginations.pageSize);
      } else {
        message.error(res.msg);
      }
    });
  };


  const gotoDetail = (text, record, params) => {
    dispatch({
      type: 'viewcache/gettabstate',
      payload: {
        cacheinfo: {
          ...tabrecord,
          paginations,
        },
        tabid: sessionStorage.getItem('tabid')
      },
    });
    router.push({
      pathname: '/ITSM/servicequalityassessment/detailserviceprovidermaintenance',
      query: {
        id: record.id,
        Id: record.providerNo,
        providerStatus: record.isEdit,
        providerSearch: params,
      },
      state: {
        dynamicpath: true,
        menuDesc: '服务运维商详情',
      },
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (text, record, index) =>
        `${(paginations.current - 1) * paginations.pageSize + (index + 1)}`,
    },
    {
      title: '服务商编号',
      dataIndex: 'providerNo',
      key: 'providerNo',
      width: 200,
      render: (text, record) => {

        if (pagetitle === '服务商查询') {
          return (
            <a type="link" onClick={() => gotoDetail(text, record, 'providerSearch')}>
              {text}
            </a>
          );
        }

        return <span>{text}</span>;
      },
    },
    {
      title: '服务商名称',
      dataIndex: 'providerName',
      key: 'providerName',
      width: 150,
    },
    {
      title: '合同数量',
      dataIndex: 'contractNum',
      key: 'contractNum',
      width: 150,
      render: (text, record) => {
        return (
          <ContractList id={record.id}>
            <a type="link">{text}</a>
          </ContractList>
        );
      },
    },
    {
      title: '负责人',
      dataIndex: 'director',
      key: 'director',
      width: 150,
    },
    {
      title: '负责人手机号',
      dataIndex: 'directorPhone',
      key: 'directorPhone',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: text => {
        return (
          <Radio.Group disabled value={text}>
            <Radio value="1">启用</Radio>
            <Radio value="0">禁用</Radio>
          </Radio.Group>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        if (pagetitle === '服务商维护') {
          return (
            <span>
              <a onClick={() => gotoDetail(text, record)}>编辑</a>

              {record.isEdit === '1' && (
                <>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => handleDelete(record.id)}>
                    <a>删除</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                </>
              )}
            </span>
          );
        }

        return null;
      },
    },
  ];

  const download = () => {
    validateFields((err, value) => {
      dispatch({
        type: 'qualityassessment/providerExport',
        payload: {
          id: selectedKeys.toString(),
          ...value,
        },
      }).then(res => {
        const filename = '下载.xls';
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  const newProvider = () => {
    router.push({
      pathname: '/ITSM/servicequalityassessment/addserviceprovidermaintenance',
      query: {
        addtab: true,
      },
    });
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {},
    });
    resetFields();
    searchdata({}, 1, 15);
    setPaginations({ current: 1, pageSize: 15 });
  };

  useEffect(() => {
    if (location.state && location.state.reset) {
      handleReset();
      searchdata({}, 1, 15);
    }
  }, [location.state]);

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

  const rowSelection = {
    onChange: index => {
      setSelectedKeys([...index]);
    },
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pagesize) => onShowSizeChange(page, pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: providerArr && providerArr.total,
    showTotal: total => `总共 ${total} 条记录`,
    onChange: page => changePage(page),
  };

  //  传给多标签的数据
  const record = {
    providerNo: '',
    providerName: '',
    director: '',
    directorPhone: '',
    paginations: {
      current: 1,
      pageSize: 15
    }
  };

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

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
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset();
      }
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        setPaginations({ ...paginations, current, pageSize });
      }
    }
  }, [location.state]);

  useEffect(() => {
    validateFields((err, value) => {
      searchdata(value, cacheinfo.paginations.current, cacheinfo.paginations.pageSize);
    });
  }, []);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <div className='noexplain'>
          <Row>
            <Form {...formItemLayout}>
              <Col span={8}>
                <Form.Item label="服务商编号">
                  {getFieldDecorator('providerNo', {
                    initialValue: cacheinfo.providerNo,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="服务商名称">
                  {getFieldDecorator('providerName', {
                    initialValue: cacheinfo.providerName,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="负责人">
                  {getFieldDecorator('director', {
                    initialValue: cacheinfo.director,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="负责人手机号">
                  {getFieldDecorator('directorPhone', {
                    initialValue: cacheinfo.directorPhone,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={handlesearch}>
                  查询
                </Button>

                <Button onClick={handleReset}>重置</Button>
              </Col>
            </Form>
          </Row>
        </div>


        <Button type="primary" onClick={() => download()}>
          导出数据
        </Button>

        {pagetitle === '服务商维护' && (
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            onClick={newProvider}
            icon="plus"
          >
            新增服务商
          </Button>
        )}

        <Table
          loading={loading}
          columns={columns}
          dataSource={providerArr && providerArr.records}
          rowKey={records => records.id}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 800, y: 700 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ qualityassessment, loading }) => ({
    providerArr: qualityassessment.providerArr,
    loading: loading.models.qualityassessment,
  }))(ProviderMaintenance),
);
