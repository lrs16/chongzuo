import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  AutoComplete,
  message,
  Spin
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { operationPerson } from '@/services/common';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { providerList, scoreListpage, contractProvider, clauseListpage } from '../services/quality';

import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  },
};

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const columns = [
  {
    title: '服务绩效编号',
    dataIndex: 'assessNo',
    key: 'assessNo',
    width: 200,
    render: (text, record) => {
      const todetail = () => {
        router.push({
          pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
          query: {
            assessNo: record.assessNo,
            mainId: record.instanceId,
            taskId: record.currentTaskId,
            orderNo: text,
          }
        })
      };
      return <a onClick={todetail}>{text}</a>
    }
  },
  {
    title: '服务商',
    dataIndex: 'providerName',
    key: 'providerName',
    width: 150,
  },
  {
    title: '责任人',
    dataIndex: 'directorName',
    key: 'directorName',
    width: 150,
  },
  {
    title: '考核内容说明',
    dataIndex: 'assessContent',
    key: 'assessContent',
    width: 150,
  },
  {
    title: '考核类型',
    dataIndex: 'assessType',
    key: 'assessType',
    width: 150,
  },
  {
    title: '一级指标',
    dataIndex: 'target1Name',
    key: 'target1Name',
    width: 150,
  },
  {
    title: '二级指标',
    dataIndex: 'target2Name',
    key: 'target2Name',
    width: 150,
  },
  {
    title: '详细条款',
    dataIndex: 'clauseName',
    key: 'clauseName',
    width: 150,
  },
  {
    title: '考核得分',
    dataIndex: 'assessValue',
    key: 'assessValue',
    width: 150,
  },
  {
    title: '发生时间',
    dataIndex: 'assessTime',
    key: 'assessTime',
    width: 150,
  },
  {
    title: '考核得分',
    dataIndex: 'assessValue',
    key: 'assessValue',
    width: 150,
  },
  {
    title: '当前处理环节',
    dataIndex: 'currentTaskName',
    key: 'currentTaskName',
    width: 150,
  },
  {
    title: '关联合同名称',
    dataIndex: 'contractName',
    key: 'contractName',
    width: 150,
  },
  {
    title: '考核状态',
    dataIndex: 'assessStatus',
    key: 'assessStatus',
    width: 150,
  },
  {
    title: '登记人',
    dataIndex: 'register',
    key: 'register',
    width: 150,
  },
  {
    title: '登记时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    width: 150,
  },
  {
    title: '业务负责人审核结果',
    dataIndex: 'directorVerifyValue',
    key: 'directorVerifyValue',
    width: 150,
  },
  {
    title: '业务负责人审核说明',
    dataIndex: 'directorVerifyContent',
    key: 'directorVerifyContent',
    width: 150,
  },
  {
    title: '业务负责人审核状态',
    dataIndex: 'directorVerifyStatus',
    key: 'directorVerifyStatus',
    width: 150,
  },
  {
    title: '业务负责人审核人',
    dataIndex: 'directorVerifier',
    key: 'directorVerifier',
    width: 150,
  },
  {
    title: '业务负责人审核时间',
    dataIndex: 'directorVerifyTime',
    key: 'directorVerifyTime',
    width: 150,
  },
  {
    title: '自动化科专责审核结果',
    dataIndex: 'expertVerifyValue',
    key: 'expertVerifyValue',
    width: 150,
  },
  {
    title: '自动化科专责审核说明',
    dataIndex: 'expertVerifyContent',
    key: 'expertVerifyContent',
    width: 150,
  },
  {
    title: '自动化科专责审核状态',
    dataIndex: 'expertVerifyStatus',
    key: 'expertVerifyStatus',
    width: 150,
  },
  {
    title: '自动化科专责审核人',
    dataIndex: 'expertVerifier',
    key: 'expertVerifier',
    width: 150,
  },
  {
    title: '自动化科专责审核时间',
    dataIndex: 'expertVerifyTime',
    key: 'expertVerifyTime',
    width: 150,
  },
  {
    title: '是否申诉',
    dataIndex: 'isAppeal',
    key: 'isAppeal',
    width: 150,
  },
  {
    title: '申诉内容',
    dataIndex: 'appealContent',
    key: 'appealContent',
    width: 150,
  },
  {
    title: '服务商确认人',
    dataIndex: 'providerConfirmer',
    key: 'providerConfirmer',
    width: 150,
  },
  {
    title: '服务商确认时间',
    dataIndex: 'providerConfirmTime',
    key: 'providerConfirmTime',
    width: 150,
  },
  {
    title: '业务负责人复核结果',
    dataIndex: 'directorReviewValue',
    key: 'directorReviewValue',
    width: 150,
  },
  {
    title: '业务负责人复核说明',
    dataIndex: 'directorReviewContent',
    key: 'directorReviewContent',
    width: 150,
  },
  {
    title: '业务负责人复核人',
    dataIndex: 'directorReviewer',
    key: 'directorReviewer',
    width: 150,
  },
  {
    title: '业务负责人复核时间',
    dataIndex: 'directorReviewTime',
    key: 'directorReviewTime',
    width: 150,
  },
  {
    title: '服务绩效考核确认结果',
    dataIndex: 'finallyConfirmValue',
    key: 'finallyConfirmValue',
    width: 150,
  },
  {
    title: '服务绩效考核确认说明',
    dataIndex: 'finallyConfirmContent',
    key: 'finallyConfirmContent',
    width: 150,
  },
  {
    title: '服务绩效考核确认人',
    dataIndex: 'finallyConfirmer',
    key: 'finallyConfirmer',
    width: 150,
  },
  {
    title: '服务绩效考核确认时间',
    dataIndex: 'finallyConfirmTime',
    key: 'finallyConfirmTime',
    width: 150,
  },
]
function TobedealtList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue, resetFields },
    tobeDealtarr,
    target1,
    target2,
    userinfo,
    dispatch,
    loading
  } = props;
  const [performanceLeader, setPerformanceLeader] = useState('')
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [contractArr, setContractArr] = useState([]);
  const [expand, setExpand] = useState(false);
  const [fileslist, setFilesList] = useState([]);
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [contractlist, setContractlist] = useState([]); // 合同
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [clauselist, setClauselist] = useState([]); // 详细条款
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id
  const [target1Type, setTarget1Type] = useState('功能开发'); //  设置指标类型
  const [target2Type, setTarget2Type] = useState('');
  const [spinloading, setSpinLoading] = useState(true);

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'performanceappraisal/tobeDealtdata',
      payload: {
        ...values,
        pageNum: page,
        pageSize
      }
    })
  }

  const getPerformanceleader = () => {
    operationPerson().then(res => {
      const result = (res.data).map(item => {
        return {
          key: item.id,
          value: item.userName
        }
      })
      setPerformanceLeader(result)
    })
  }



  useEffect(() => {
    getPerformanceleader();
    validateFields((err, value) => {
      searchdata(value, 1, 15)
    })
  }, [])

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPageinations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = (page) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPageinations({
      ...paginations,
      current: page,
    });
  };


  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: tobeDealtarr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };

  const handleSearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, paginations.pageSize)
    })
  }

  //  根据考核类型查询一级指标
  const getTarget1 = (type) => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget1',
      payload: type || ''
    })
  }
  //  根据考核类型查询二级指标
  const getTarget2 = (id) => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget2',
      payload: id
    })
  }

  //  获取详细条款数据
  const getclausedetail = (targetId, scoreId) => {
    dispatch({
      type: 'qualityassessment/clauseListpage',
      payload: {
        targetId,
        scoreId,
        pageNum: 1,
        pageSize: 1000
      }
    })
  }

  //  获取合同名称
  const getContrractname = (providerId) => {
    contractProvider(providerId).then(res => {
      if (res) {
        const arr = [...(res.data)];
        setContractArr(arr);
      }
    });
  }

  // 自动完成服务商
  const disableduser = disablelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.providerNo}</span>
          <span>{opt.providerName}</span>
          <span>{opt.director}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 自动完成关联合同名称
  const contractNamedata = contractlist.map((opt, index) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.contractNo}</span>
          <span>{opt.contractName}</span>
          <span>{opt.signTime}</span>
          <span>{opt.dueTime}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 自动完成评分细则
  const scorenameList = scorelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.scoreNo}</span>
          <span>{opt.scoreName}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 请求服务商
  const SearchDisableduser = (value, type) => {
    const requestData = {
      value,
      pageNum: 1,
      pageSize: 1000
    }
    switch (type) {
      case 'provider':
        providerList({ ...requestData }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setDisabledList(arr);
          }
        });
        break;
      case 'contract':
        if (!providerId) {
          message.error('请先选择服务商哦')
        } else {
          contractProvider(providerId).then(res => {
            if (res) {
              const arr = [...(res.data)];
              setSpinLoading(false);
              setContractlist(arr);
            }
          });
        }

        break;
      case 'score':
        scoreListpage({ ...requestData }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      case 'clause':
        clauseListpage({ ...requestData, scoreId, targetId: target2Type, }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      default:
        break;
    }
  };

  // 选择服务商，信息回填
  const handleDisableduser = (v, opt, type) => {
    const { id, providerName, scoreName, contractName, assessType, clauseName } = opt.props.disableuser;
    switch (type) {
      case 'provider':
        setFieldsValue({
          provider: providerName,         // 服务商
          providerId: id,         // 服务商id
          contract: '',
          contractId: ''
        });
        getContrractname(id)
        setProviderId(id);
        break;

      case 'score':
        setFieldsValue({
          score: scoreName,      // 评分细则名称
          scoreId: id,         // 评分细则id
          assessType,
          target1Name: '',
          target1Id: '',
          target2Name: '',
          target2Id: ''
        });
        setScoreId(id)
        getTarget1(assessType === '功能开发' ? '1' : '2')
        break;

      default:
        break;
    }
  };

  const handleFocus = (params) => {
    switch (params) {
      case 'one':
        if (loading !== true && target1 && target1.length === 0) {
          message.error('请选择考核类型')
        }
        break;
      case 'two':
        if (loading !== true && target2 && target2.length === 0) {
          message.error('请选择有效的一级指标')
        }
        break;
      case 'contract':
        if (loading !== true && contractArr && contractArr.length === 0) {
          message.error('请选择有效的服务商')
        }
        break;
      default:
        break;
    }
  }

  const handleChange = (values, option, params) => {
    const { key, props: { value } } = option;
    switch (params) {
      case 'assessType':
        setFieldsValue({
          target1Name: '',
          target1Id: '',
          target2Name: '',
          target2Id: ''
        })
        getTarget1(value);
        break;
      case 'target1Name':
        setFieldsValue({
          target1Name: value,
          target1Id: key,
          target2Name: '',
          target2Id: ''
        })
        getTarget2(key);
        setTarget2Type(key)
        break;
      case 'target2Name':
        getclausedetail(key, scoreId);
        setFieldsValue({
          target2Name: value,
          target2Id: key
        })
        break;
      case 'clause':
        setFieldsValue({
          clauseId: key
        })
        break;

      default:
        break;
    }
  }

  const handleReset = () => {
    resetFields()
  }

  const selectOnchange = (value, option) => {
    console.log('value: ', value);
    const { props: { children } } = option;
    setFieldsValue({
      directorName: children,
      directorId: value
    });
  }



  const extra = (
    <>
      <Button type='primary' style={{ marginLeft: 8 }} onClick={handleSearch}>查询</Button>
      <Button style={{ marginLeft: 8 }} onClick={handleReset}>重置</Button>
      <Button
        type='link'
        style={{ marginLeft: 8 }}
        onClick={() => {
          setExpand(!expand)
        }}
      >
        {expand ? (<>关闭 <UpOutlined /></>) : (<>展开 <DownOutlined /></>)}
      </Button>
    </>)

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='考核编号'>
                {
                  getFieldDecorator('assessNo', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='考核状态'>
                {
                  getFieldDecorator('assessStatus', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <div style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label='当前处理环节'
                >
                  {
                    getFieldDecorator('currentTaskName', {})
                      (
                        <Select>
                          <Option key='服务绩效考核登记' value='服务绩效考核登记'>服务绩效考核登记</Option>
                          <Option key='业务负责人审核' value='业务负责人审核'>业务负责人审核</Option>
                          <Option key='自动化科专责审核' value='自动化科专责审核'>自动化科专责审核</Option>
                          <Option key='服务商确认' value='服务商确认'>服务商确认</Option>
                          <Option key='服务绩效考核确认' value='服务绩效考核确认'>服务绩效考核确认</Option>
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='发生时间'>
                  {
                    getFieldDecorator('timeoccurrence', {})
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                        />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务商'>
                  {
                    getFieldDecorator('provider', {
                    })
                      (
                        <AutoComplete
                          dataSource={disableduser}
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{ width: 600 }}
                          onSelect={(v, opt) => handleDisableduser(v, opt, 'provider')}
                        >
                          <Search
                            placeholder="可输入姓名搜索"
                            onSearch={values => SearchDisableduser(values, 'provider')}
                            allowClear
                          />
                        </AutoComplete>,
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='关联合同名称'>
                  {
                    getFieldDecorator('contract', {
                    })
                      (
                        <Select
                          placeholder='请选择'
                          allowClear
                          onChange={(value, option) => handleChange(value, option, 'contract')}
                          onFocus={() => handleFocus('contract')}
                        >
                          {contractArr.map(obj => [
                            <Option key={obj.contractName} value={obj.id}>
                              <div className={styles.disableuser}>
                                <span>{obj.contractNo}</span>
                                <span>{obj.contractName}</span>
                              </div>
                            </Option>
                          ])}
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>

              {performanceLeader && performanceLeader.length && (
                <Col span={8}>
                  <Form.Item label='责任人'>
                    {
                      getFieldDecorator('directorId', {
                      })
                        (
                          <Select onSelect={selectOnchange}>
                            {performanceLeader.map(obj => [
                              <Option key={obj.key} value={obj.key}>
                                {obj.value}
                              </Option>
                            ])}

                          </Select>
                        )
                    }
                  </Form.Item>
                </Col>
              )}

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label='责任人id'>
                  {
                    getFieldDecorator('directorName', {
                    })
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='考核类型'>
                  {
                    getFieldDecorator('assessType', {})
                      (
                        <Select
                          onChange={(value, option) => handleChange(value, option, 'assessType')}
                        >
                          <Option key='1' value='1'>功能开发</Option>
                          <Option key='2' value='2'>系统运维</Option>
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='考核内容说明'>
                  {
                    getFieldDecorator('assessContent', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='一级指标'>
                  {
                    getFieldDecorator('target1Name', {
                    })
                      (
                        <Select
                          onChange={(value, option) => handleChange(value, option, 'target1Name')}
                          onFocus={() => handleFocus('one')}
                          placeholder='请选择'
                          allowClear>
                          {(target1).map(obj => [
                            <Option key={obj.id} value={obj.title}>
                              {obj.title}
                            </Option>
                          ])}
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label='一级指标id'>
                  {
                    getFieldDecorator('target1Id', {
                    })
                      (
                        <Input />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='二级指标'>
                  {
                    getFieldDecorator('target2Name', {
                    })
                      (
                        <Select
                          onChange={(value, option) => handleChange(value, option, 'target2Name')}
                          onFocus={() => handleFocus('two')}
                          placeholder='请选择'
                          allowClear>
                          {(target2).map(obj => [
                            <Option key={obj.id} value={obj.title}>
                              {obj.title}
                            </Option>
                          ])}
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label=' 二级指标'>
                  {
                    getFieldDecorator('target2Id', {
                      // initialValue: register.target2Id
                    })
                      (
                        <Input />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='详细条款'>
                  {
                    getFieldDecorator('detailed', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='得分'>
                  {
                    getFieldDecorator('assessValue', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='登记人'>
                  {
                    getFieldDecorator('register', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='登记时间'>
                  {
                    getFieldDecorator('applyTime', {})
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                        />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人审核结果'>
                  {
                    getFieldDecorator('directorVerifyValue', {})
                      (
                        <Select>
                          <Option key='1' value='1'>通过</Option>
                          <Option key='0' value='0'>不通过</Option>
                        </Select>

                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人审核说明'>
                  {
                    getFieldDecorator('directorVerifyContent', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人审核状态'>
                  {
                    getFieldDecorator('directorVerifyStatus', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责审核人'>
                  {
                    getFieldDecorator('directorVerifier', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人审核时间'>
                  {
                    getFieldDecorator('directorVerifyTime', {})
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                        />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核结果'>
                  {
                    getFieldDecorator('expertVerifyValue', {})
                      (
                        <Select>
                          <Option key='待审核' value='待审核'>待审核</Option>
                          <Option key='已审核' value='已审核'>已审核</Option>
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核说明'>
                  {
                    getFieldDecorator('expertVerifyContent', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核状态'>
                  {
                    getFieldDecorator('expertVerifyStatus', {})
                      (<Select>
                        <Option key='待审核' value='待审核'>待审核</Option>
                        <Option key='已审核' value='已审核'>已审核</Option>
                      </Select>)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核人'>
                  {
                    getFieldDecorator('expertVerifier', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核时间'>
                  {
                    getFieldDecorator('expertVerifyTime', {})
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                        />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='是否申诉'>
                  {
                    getFieldDecorator('isAppeal', {})
                      (
                        <Select>
                          <Option key='1' value='1'>是</Option>
                          <Option key='0' value='0'>否</Option>
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='申诉内容'>
                  {
                    getFieldDecorator('appealContent', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务商确认人'>
                  {
                    getFieldDecorator('providerConfirmer', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务商确认时间'>
                  {
                    getFieldDecorator('providerConfirmTime', {})
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                        />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核结果'>
                  {
                    getFieldDecorator('directorReviewValue', {})
                      (
                        <Select>
                          <Option key='1' value='1'>同意</Option>
                          <Option key='0' value='0'>不同意</Option>
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核说明'>
                  {
                    getFieldDecorator('directorReviewContent', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核人'>
                  {
                    getFieldDecorator('directorReviewer', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核时间'>
                  {
                    getFieldDecorator('directorReviewTime', {})
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                        />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务绩效考核确认结果'>
                  {
                    getFieldDecorator('finallyConfirmValue', {})
                      (
                        <Select>
                          <Option key='完成' value='完成'>完成</Option>
                          <Option key='取消' value='取消'>取消</Option>
                        </Select>
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务绩效考核确认说明'>
                  {
                    getFieldDecorator('finallyConfirmContent', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务绩效考核确认人'>
                  {
                    getFieldDecorator('finallyConfirmer', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务绩效考核确认时间'>
                  {
                    getFieldDecorator('finallyConfirmTime', {})
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                        />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核人'>
                  {
                    getFieldDecorator('directorReviewer', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

            </div>

            {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}

          </Form>
        </Row>

        <Table
          loading={loading}
          columns={columns}
          dataSource={tobeDealtarr.records}
          scroll={{ x: 1500 }}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>

  )
}

export default Form.create({})(
  connect(({ performanceappraisal, qualityassessment, itsmuser, loading }) => ({
    tobeDealtarr: performanceappraisal.tobeDealtarr,
    target2: qualityassessment.target2,
    target1: qualityassessment.target1,
    loading: loading.models.performanceappraisal
  }))(TobedealtList)
)

