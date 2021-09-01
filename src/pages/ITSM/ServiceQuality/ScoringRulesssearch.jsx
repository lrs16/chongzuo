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



function ScoringRulesssearch(props) {
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
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

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

  const columns = [
    {
      title: '评分细则编号',
      dataIndex: 'scoreNo',
      key: 'scoreNo',
      width:200,
      render: (text, record) => {
        const gotoDetail = () => {
          router.push({
            pathname: '/ITSM/servicequalityassessment/detailscoringrulesmaintenance',
            query: {
              id: record.id,
              No: record.scoreNo,
              scoreSearch:true
            }
          })
        }
        return (
          <a onClick={() => gotoDetail()}>{text}</a>
        )
      }
    },
    {
      title: '评分细则名称',
      dataIndex: 'scoreName',
      key: 'scoreName',
      width:150
    },
    {
      title: '考核类型',
      dataIndex: 'assessType',
      key: 'assessType',
      width:150
    },
  ]
  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(
        item => item.title === title)[0].children;
    }
    return []
  }

  const download = () => {
    validateFields((err, value) => {
      dispatch({
        type: 'qualityassessment/scoreExport',
        payload: {
          ids: selectedKeys.toString(),
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



  useEffect(() => {
    validateFields((err,value) => {
      searchdata(value, paginations.current, paginations.pageSize)
    })
  }, [])

  const handleReset = () => {
    router.push({
      pathname:location.pathname,
      query:{},
      state:{}
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
    scoreNo:'',
    scoreName:'',
    assessType:'',
  }

  const rowSelection = {
    onChange: (index, handleSelect) => {
      setSelectedKeys([...index])
      setSelectedRows([...handleSelect])
    }
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
                          <Option key={obj.key} value={obj.dict_code}>
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

          <Col span={8}>
            <Button type='primary'  onClick={() => download()}>导出数据</Button>
          </Col>
        </Row>

        <Table
          loading={loading}
          columns={columns}
          dataSource={scoreList.records}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 800,y: 700 }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment, loading }) => ({
    scoreList: qualityassessment.scoreList,
    loading:loading.models.qualityassessment,
  }))(ScoringRulesssearch)
)


