import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  Row,
  Col,
  Card,
  Select,
  Divider,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

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

function ScoringRulesmaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    scoreList,
    dispatch,
    location,
    loading,
  } = props;

  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  const [selectdata, setSelectData] = useState('');
  const [tabrecord, setTabRecord] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'qualityassessment/scoreListpage',
      payload: {
        ...values,
        pageNum: page,
        pageSize,
      },
    });
    setTabRecord({ ...values });
  };

  const handleDelete = id => {
    return dispatch({
      type: 'qualityassessment/scoreDel',
      payload: id,
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        searchdata({}, 1, paginations.pageSize);
      } else {
        message.error(res.msg);
      }
    });
  };

  const download = () => {
    validateFields((err, value) => {
      dispatch({
        type: 'qualityassessment/scoreExport',
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

  const gotoDetail = (text, record,params) => {
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
      pathname: '/ITSM/servicequalityassessment/detailscoringrulesmaintenance',
      query: {
        Id: record.scoreNo,
        id: record.id,
        scoreSearch: params,
      },
      state: {
        dynamicpath: true,
        menuDesc: '评分细则详情',
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
      title: '评分细则编号',
      dataIndex: 'scoreNo',
      key: 'scoreNo',
      width: 200,
      render: (text, record) => {
        if (pagetitle === '评分细则查询') {
          return <a onClick={() => gotoDetail(text, record,'scoreSearch')}>{text}</a>;
        }

        return <span>{text}</span>;
      },
    },
    {
      title: '评分细则名称',
      dataIndex: 'scoreName',
      key: 'scoreName',
      width: 150,
    },
    {
      title: '考核类型',
      dataIndex: 'assessType',
      key: 'assessType',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        if (pagetitle === '评分细则维护') {
          return (
            <span>
              <a onClick={() => gotoDetail(text, record)}>编辑</a>
              <>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => handleDelete(record.id)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
              </>
            </span>
          );
        }
        return null;
      },
    },
  ];
  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  useEffect(() => {
    validateFields((err, value) => {
      searchdata(value, paginations.current, paginations.pageSize);
    });
  }, []);

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {},
    });
    resetFields();
    searchdata({}, 1, 15);
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

  const newScoringrules = () => {
    router.push({
      pathname: '/ITSM/servicequalityassessment/addscoringrulesmaintenance',
      query: {
        addtab: true,
      },
    });
  };

  const handlesearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, 15);
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
    total: scoreList && scoreList.total,
    showTotal: total => `总共 ${total}条记录`,
    onChange: page => changePage(page),
  };

  const record = {
    scoreNo: '',
    scoreName: '',
    assessType: '',
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
              paginations,
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset();
        // setExpand(false);
      }
    }
  }, [location.state]);

  const assessmentType = getTypebyTitle('考核类型');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="576"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="评分细则编号">
                {getFieldDecorator('scoreNo', {
                  initialValue: cacheinfo.scoreNo,
                })(<Input />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="评分细则名称">
                {getFieldDecorator('scoreName', {
                  initialValue: cacheinfo.scoreName,
                })(<Input />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="考核类型">
                {getFieldDecorator('assessType', {
                  initialValue: cacheinfo.assessType,
                })(
                  <Select placeholder="请选择" allowClear>
                    {assessmentType.map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Form>

          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" style={{ marginRight: 8 }} onClick={handlesearch}>
              查询
            </Button>

            <Button onClick={handleReset}>重置</Button>
          </Col>

          <Button type="primary" onClick={() => download()}>
            导出数据
          </Button>
        </Row>

        {pagetitle === '评分细则维护' && (
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            onClick={newScoringrules}
            icon="plus"
          >
            新增评分细则
          </Button>
        )}

        <Table
          loading={loading}
          columns={columns}
          dataSource={scoreList && scoreList.records}
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
    scoreList: qualityassessment.scoreList,
    loading: loading.models.qualityassessment,
  }))(ScoringRulesmaintenance),
);
