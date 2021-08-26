import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Row,
  Col,
  Card,
  Select,
  Divider,
} from 'antd';
import moment from 'moment';
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
    sm: { span: 16 }
  }
}

const { Option } = Select;



function ScoringRulesmaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    scoreList,
    dispatch,
    location,
    loading
  } = props;

  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 })
  const [selectdata, setSelectData] = useState('');
  const [tabrecord, setTabRecord] = useState({});


  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'qualityassessment/scoreListpage',
      payload: {
        ...values,
        pageNum: page,
        pageSize
      }
    });
    setTabRecord({ ...values })
  }

  const handleDelete = (id) => {
    return dispatch({
      type: 'qualityassessment/scoreDel',
      payload: id
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        searchdata({}, 1, paginations.pageSize)
      } else {
        message.error(res.msg);
      }
    })
  }

  const download = () => {
    validateFields((err, value) => {
      dispatch({
        type: 'qualityassessment/scoreExport',
        payload: {
          ...value
        }
      }).then(res => {
        const filename = '下载.xls';
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url)
      })
    })
  }

  const columns = [
    {
      title: '评分细则编号',
      dataIndex: 'scoreNo',
      key: 'scoreNo'
    },
    {
      title: '评分细则名称',
      dataIndex: 'scoreName',
      key: 'scoreName'
    },
    {
      title: '考核类型',
      dataIndex: 'assessType',
      key: 'assessType'
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        const gotoDetail = () => {
          router.push({
            pathname: '/ITSM/servicequalityassessment/detailscoringrulesmaintenance',
            query: {
              id: record.id,
            }
          })
        }
        return (
          <span>
            <a onClick={() => gotoDetail()}>编辑</a>
            {/* {
              record.isEdit && ( */}
            <>
              <Divider type='vertical' />
              <Popconfirm
                title='是否要删除此行？'
                onConfirm={() => handleDelete(record.id)}
              >
                <a>删除</a>
              </Popconfirm>
              <Divider type='vertical' />
            </>
            {/* //   )
            // } */}

            {/* <a>保存</a> */}
          </span>
        )
      }
    }
  ]
  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(
        item => item.title === title)[0].children;
    }
    return []
  }

  useEffect(() => {
    validateFields((err, value) => {
      searchdata(value, paginations.current, paginations.pageSize)
    })
  }, [])

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    searchdata({}, 1, 15)
  }

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize)
      }
    })
    setPaginations({
      ...paginations,
      pageSize
    })
  }

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize)
      }
    })

    setPaginations({
      ...paginations,
      current: page
    })
  }

  const newScoringrules = () => {
    router.push({
      pathname: '/ITSM/servicequalityassessment/addscoringrulesmaintenance'
    })
  }

  const handlesearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, 15)
    })
  }

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pagesize) => onShowSizeChange(page, pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: scoreList.total,
    showTotal: total => `总共 ${total}条记录`,
    onChange: (page) => changePage(page)
  }

  const record = {
    scoreNo: '',
    scoreName: '',
    assessType: '',
  }

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
            tabid: sessionStorage.getItem('tabid')
          },
        });
      };
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset();
        // setExpand(false);
      };
    }
  }, [location.state]);

  const assessmentType = getTypebyTitle('考核类型');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid='1410413049587699713'
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='评分细则编号'>
                {
                  getFieldDecorator('scoreNo', {
                    initialValue: cacheinfo.scoreNo
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='评分细则名称'>
                {
                  getFieldDecorator('scoreName', {
                    initialValue: cacheinfo.scoreName
                  })
                    (<Input />)
                }

              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='考核类型'>
                {
                  getFieldDecorator('assessType', {
                    initialValue: cacheinfo.assessType
                  })
                    (
                      <Select placeholder='请选择' allowClear>
                        {assessmentType.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ])}
                      </Select>
                    )
                }
              </Form.Item>
            </Col>
          </Form>

          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              type='primary'
              style={{ marginRight: 8 }}
              onClick={handlesearch}
            >
              查询
            </Button>

            <Button onClick={handleReset}>
              重置
            </Button>
          </Col>

          {/* <Col span={8}> */}
            <Button type='primary' onClick={() => download()}>导出数据</Button>
          {/* </Col> */}
        </Row>

        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          onClick={newScoringrules}
          icon='plus'
        >
          新增评分细则
        </Button>

        <Table
          loading={loading}
          columns={columns}
          dataSource={scoreList.records}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment, loading }) => ({
    scoreList: qualityassessment.scoreList,
    loading: loading.models.qualityassessment,
  }))(ScoringRulesmaintenance)
)


