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
  AutoComplete,
  Select,
  Spin
} from 'antd';
import { contractProvider, providerList, scoreListpage } from '../services/quality';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from '../index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  },
}

const { Search } = Input;
const { Option } = Select;


function ServiceProvidersearch(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      validateFields,
      resetFields,
      setFieldsValue
    },
    providerArr,
    scorecardArr,
    dispatch,
    loading
  } = props;
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  const [data, setData] = useState([]);
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [contractlist, setContractlist] = useState([]); // 合同
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [spinloading, setSpinLoading] = useState(true);
  const [contractArr, setContractArr] = useState([]);

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'performanceappraisal/getscorecardlistPage',
      payload: {
        ...values,
        pageNum: page,
        pageSize
      }
    })
  }

  const handlesearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, 15)
    })
  }

  useEffect(() => {
    validateFields((err, value) => {
      searchdata(value, paginations.current, paginations.pageSize)
    })
  }, [])

  const handleDelete = (id) => {
    return dispatch({
      type: 'performanceappraisal/scorecardDel',
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

  const columns = [
    {
      title:'记分卡编号',
      dataIndex:'cardNo',
      key:'cardNo'
    },
    {
      title: '服务商',
      dataIndex: 'providerName',
      key: 'providerName',
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName'
    },
    {
      title: '考核类型',
      dataIndex: 'assessType',
      key: 'assessType'
    },
    {
      title: '评价计分卡名称',
      dataIndex: 'cardName',
      key: 'cardName'
    },
    {
      title: '评分细则名称',
      dataIndex: 'scoreName',
      key: 'scoreName'
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: '专业部门',
      dataIndex: 'deptName',
      key: 'deptName'
    },
    {
      title: '评价区间',
      dataIndex: 'cardSeason',
      key: 'cardSeason'
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        const gotoDetail = () => {
          router.push({
            pathname: '/ITSM/servicequalityassessment/creditcard/creditcardregisterdetail',
            query: {
              id: record.id,
              scorecardStatus: record.isEdit,
              search:true
            }
          })
        }
        return (
          <span>
            <a onClick={() => gotoDetail()}>编辑</a>
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
          </span>
        )
      }
    },
  ]


  const handleReset = () => {
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

  const exportDownload = () => {
    validateFields((err, values) => {
      dispatch({
        type: 'performanceappraisal/scorecardExport',
        payload:{
          ...values,
          pageNum:paginations.current,
          pageSize:paginations.pageSize
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

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pagesize) => onShowSizeChange(page, pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: scorecardArr.total,
    showTotal: total => `总共 ${total} 条记录`,
    onChange: (page) => changePage(page)
  }


  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='计分卡编号'>
                {
                  getFieldDecorator('cardNo')
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='评价计分卡名称'>
                {
                  getFieldDecorator('cardName')
                    (<Input />)
                }

              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='评分细则名称'>
                {
                  getFieldDecorator('scoreName', {})
                    (
                      <Input />
                    )
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='考核类型'>
                {
                  getFieldDecorator('assessType')
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='版本号'>
                {
                  getFieldDecorator('version')
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='专业部门'>
                {
                  getFieldDecorator('deptName')
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='评价区间'>
                {
                  getFieldDecorator('cardSeason')
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='服务商'>
                {
                  getFieldDecorator('providerName', {
                  })
                    (
                      <Input />
                    )
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='合同名称'>
                {
                  getFieldDecorator('contractName', {
                  })
                    (
                      <Input />
                    )
                }
              </Form.Item>
            </Col>


            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                type='primary'
                style={{ marginRight: 8 }}
                onClick={handlesearch}
              >
                查询
              </Button>

              <Button onClick={handleReset}>重置</Button>
            </Col>

          </Form>
        </Row>

        <Button type='primary' onClick={exportDownload}>导出数据</Button>


        <Table
          loading={loading}
          columns={columns}
          dataSource={scorecardArr.records}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ performanceappraisal, loading }) => ({
    scorecardArr: performanceappraisal.scorecardArr,
    loading: loading.models.performanceappraisal
  }))(ServiceProvidersearch)
)
