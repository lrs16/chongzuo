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
        menuDesc: '?????????????????????',
      },
    });
  };

  const columns = [
    {
      title: '??????',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (text, record, index) =>
        `${(paginations.current - 1) * paginations.pageSize + (index + 1)}`,
    },
    {
      title: '???????????????',
      dataIndex: 'providerNo',
      key: 'providerNo',
      width: 200,
      render: (text, record) => {

        if (pagetitle === '???????????????') {
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
      title: '???????????????',
      dataIndex: 'providerName',
      key: 'providerName',
      width: 150,
    },
    {
      title: '????????????',
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
      title: '?????????',
      dataIndex: 'director',
      key: 'director',
      width: 150,
    },
    {
      title: '??????????????????',
      dataIndex: 'directorPhone',
      key: 'directorPhone',
      width: 200,
    },
    {
      title: '??????',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: text => {
        return (
          <Radio.Group disabled value={text}>
            <Radio value="1">??????</Radio>
            <Radio value="0">??????</Radio>
          </Radio.Group>
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        if (pagetitle === '???????????????') {
          return (
            <span>
              <a onClick={() => gotoDetail(text, record)}>??????</a>

              {record.isEdit === '1' && (
                <>
                  <Divider type="vertical" />
                  <Popconfirm title="????????????????????????" onConfirm={() => handleDelete(record.id)}>
                    <a>??????</a>
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
        const filename = '??????.xls';
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
    showTotal: total => `?????? ${total} ?????????`,
    onChange: page => changePage(page),
  };

  //  ????????????????????????
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
        // ????????????????????????
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
      // ??????????????????,???????????????
      if (location.state.reset) {
        handleReset();
      }
      // ???????????????????????????
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
                <Form.Item label="???????????????">
                  {getFieldDecorator('providerNo', {
                    initialValue: cacheinfo.providerNo,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="???????????????">
                  {getFieldDecorator('providerName', {
                    initialValue: cacheinfo.providerName,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="?????????">
                  {getFieldDecorator('director', {
                    initialValue: cacheinfo.director,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="??????????????????">
                  {getFieldDecorator('directorPhone', {
                    initialValue: cacheinfo.directorPhone,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={handlesearch}>
                  ??????
                </Button>

                <Button onClick={handleReset}>??????</Button>
              </Col>
            </Form>
          </Row>
        </div>


        <Button type="primary" onClick={() => download()}>
          ????????????
        </Button>

        {pagetitle === '???????????????' && (
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            onClick={newProvider}
            icon="plus"
          >
            ???????????????
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
