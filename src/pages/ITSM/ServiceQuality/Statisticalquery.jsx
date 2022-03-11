import React, { useEffect, useState } from 'react';
import {
  Table,
  DatePicker,
  Card,
  Row,
  Col,
  Form,
  Button,
  message,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AnalysisPopup from './AnalysisPopup';
import { scoreListpage } from '../ServiceQuality/services/quality';


let startTime;
let endTime;
let sign = true;

const { MonthPicker } = DatePicker;
function Statisticalquery(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    statsSearcharr,
    dispatch
  } = props;
  const [tabActiveKey, setTabActiveKey] = useState('week');
  const [visible, setVisible] = useState(false);
  const [typeName, setTypename] = useState('');
  const [title, setTitle] = useState('');
  const [picval, setPicVal] = useState({});
  const [scorelist, setScorelist] = useState([]); // 评分细则

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo'
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName'
    },
    {
      title: '考核周期',
      dataIndex: 'assessPhase',
      key: 'assessPhase'
    },
    {
      title: '签订日期',
      dataIndex: 'signTime',
      key: 'signTime'
    },
    {
      title: '服务商名称',
      dataIndex: 'providerName',
      key: 'providerName'
    },
    {
      title: '本周扣分',
      dataIndex: 'weekMinus',
      key: 'weekMinus',
      render: (text, record) => {
        return <a onClick={() => {
          if (sign) {
            setPicVal({
              assessBeginTime: startTime,
              assessEndTime: endTime,
              contractId: record.contractId,
              scoreType: '减'
            });
            setVisible(true)
            setTitle('合同名称:' + record.contractName + ';' + '考核周期:' + (record.assessPhase || ''))
          } else {
            message.info('请点击查询查询数据后才可查看本周扣分详情')
          }
        }}>{text}</a>

      }
    },
    {
      title: '本周加分',
      dataIndex: 'weekPlus',
      key: 'weekPlus',
      render: (text, record) => {
        return <a onClick={() => {
          if (sign) {
            setPicVal({
              assessBeginTime: startTime,
              assessEndTime: endTime,
              contractId: record.contractId,
              scoreType: '加'
            });
            setVisible(true)
            setTitle('合同名称:' + record.contractName + ';' + '考核周期:' + (record.assessPhase || ''))
          } else {
            message.info('请点击查询查询数据后才可查看本周加分详情')
          }
        }}>{text}</a>

      }
    },
    {
      title: '累计扣分',
      dataIndex: 'minus',
      key: 'minus',
      render: (text, record) => {
        return <a onClick={() => {
          setPicVal({
            assessBeginTime: record.beginTime,
            assessEndTime: record.endTime,
            contractId: record.contractId,
            scoreType: '减'
          });
          setTitle('合同名称:' + record.contractName + ';' + '考核周期:' + (record.assessPhase || ''))
          setVisible(true)
        }}>{text}</a>

      }
    },
    {
      title: '累计加分',
      dataIndex: 'plus',
      key: 'plus',
      render: (text, record) => {
        return <a onClick={() => {
          setPicVal({
            assessBeginTime: record.beginTime,
            assessEndTime: record.endTime,
            contractId: record.contractId,
            scoreType: '加'
          });
          setTitle('合同名称:' + record.contractName + ';' + '考核周期:' + (record.assessPhase || ''))
          setVisible(true)
        }}>{text}</a>
      }
    },
    {
      title: '考核得分',
      dataIndex: 'total',
      key: 'total',
      render: (text, record) => {
        return <a onClick={() => {
          setPicVal({
            assessBeginTime: record.beginTime,
            assessEndTime: record.endTime,
            contractId: record.contractId,
            scoreType: '合计'
          });
          setTitle('合同名称:' + record.contractName + ';' + '考核周期:' + (record.assessPhase || ''))
          setVisible(true)
        }}>{text}</a>
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        const scorecardSave = () => {
          const findassessType = scorelist.filter(obj => obj.id === record.scoreId)
          dispatch({
            type: 'performanceappraisal/scorecardSave',
            payload: {
              cardNo: '',
              cardName: '生成计分卡',
              providerName: record.providerName,
              providerId: record.providerId || '11',
              contractId: record.contractId,
              contractName: record.contractName,
              scoreName: '',
              scoreId: record.scoreId || '1',
              assessType: findassessType[0].assessType === '功能开发' ? '1' : '2' || '1',
              version: '1.1',
              deptName: '广西电网责任有限责任公司',
              evaluationInterval: [],
              details: [],
              beginTime: record.beginTime,
              endTime: record.endTime,
              phaseId: record.phaseId,
            }
          })
        }
        return <a onClick={scorecardSave}>生成计分卡</a>
      }
    }
  ];

  const columns2 = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo'
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName'
    },
    {
      title: '考核周期',
      dataIndex: 'assessPhase',
      key: 'assessPhase'
    },
    {
      title: '签订日期',
      dataIndex: 'signTime',
      key: 'signTime'
    },
    {
      title: '服务商名称',
      dataIndex: 'providerName',
      key: 'providerName'
    },
    {
      title: '累计扣分',
      dataIndex: 'minus',
      key: 'minus',
      render: (text, record) => {
        return <a onClick={() => {
          setPicVal({
            assessBeginTime: record.beginTime,
            assessEndTime: record.endTime,
            contractId: record.contractId,
            scoreType: '减'
          });
          setTitle('合同名称:' + record.contractName + ';' + '考核周期:' + (record.assessPhase || ''))
          setVisible(true)
        }}>{text}</a>
      }
    },
    {
      title: '累计加分',
      dataIndex: 'plus',
      key: 'plus',
      render: (text, record) => {
        return <a onClick={() => {
          setPicVal({
            assessBeginTime: record.beginTime,
            assessEndTime: record.endTime,
            contractId: record.contractId,
            scoreType: '加'
          });
          setTitle('合同名称:' + record.contractName + ';' + '考核周期:' + (record.assessPhase || ''))
          setVisible(true)
        }}>{text}</a>
      }
    },
    {
      title: '考核得分',
      dataIndex: 'total',
      key: 'total',
      render: (text, record) => {
        return <a onClick={() => {
          setPicVal({
            assessBeginTime: record.beginTime,
            assessEndTime: record.endTime,
            contractId: record.contractId,
            scoreType: '合计'
          });
          setTitle('合同名称:' + record.contractName + ';' + '考核周期:' + (record.assessPhase || ''))
          setVisible(true)
        }}>{text}</a>
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        const scorecardSave = () => {
          const findassessType = scorelist.filter(obj => obj.id === record.scoreId)
          dispatch({
            type: 'performanceappraisal/scorecardSave',
            payload: {
              cardNo: '',
              cardName: '生成计分卡',
              providerName: record.providerName,
              providerId: record.providerId || '11',
              contractId: record.contractId,
              contractName: record.contractName,
              scoreName: '',
              scoreId: record.scoreId || '1',
              assessType: findassessType[0].assessType === '功能开发' ? '1' : '2' || '1',
              version: '1.1',
              deptName: '广西电网责任有限责任公司',
              evaluationInterval: [],
              details: [],
              beginTime: record.beginTime,
              endTime: record.endTime,
              phaseId: record.phaseId,
            }
          })
        }
        return <a onClick={scorecardSave}>生成计分卡</a>
      }
    }
  ];

  const onChange = (date, dateString) => {
    switch (tabActiveKey) {
      case 'week':
        startTime = dateString;
        endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
        setFieldsValue({ time2: moment(endTime) });
        sign = false;
        break;
      case 'month':
        startTime = date.startOf('month').format('YYYY-MM-DD');
        setFieldsValue({ monthStarttime: moment(startTime) });
        sign = false;
        break;
      default:
        break;
    }
  }

  const endonChange = (date, dateString) => {
    switch (tabActiveKey) {
      case 'week':
        endTime = dateString;
        startTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
        setFieldsValue({ time1: moment(startTime) });
        sign = false;
        break;
      case 'month':
        endTime = date.endOf('month').format('YYYY-MM-DD');
        setFieldsValue({
          monthEndtime: moment(endTime),
        });
        sign = false;
        break;
      default:
        break;
    }
  }

  const defaultTime = () => {
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD HH:mm:ss');
    endTime = moment().format('YYYY-MM-DD HH:mm:ss');
    switch (tabActiveKey) {
      case 'week':
        setFieldsValue({
          time1: moment(startTime),
          time2: moment(endTime)
        });
        break;
      case 'month':
        startTime = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
        endTime = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
        setFieldsValue({
          monthStarttime: moment(startTime),
          monthEndtime: moment(endTime)
        });
        break;
      default:
        break;
    }
  }

  const getList = () => {
    if (new Date(startTime).valueOf() > new Date(endTime).valueOf()) {
      message.info('开始时间必须小于结束时间')
    } else {
      dispatch({
        type: 'performanceappraisal/fetchstatsSearch',
        payload: {
          beginTime: moment(startTime).format('YYYY-MM-DD 00:00:00'),
          endTime: moment(endTime).format('YYYY-MM-DD 23:59:59'),
          type: tabActiveKey === 'week' ? 'W' : 'M'
        }
      })
      sign = true;
    }
  }

  useEffect(() => {
    const requestData = {
      scoreName: '',
      pageNum: 1,
      pageSize: 1000,
      status: '1',
    };
    defaultTime();
    getList();
    scoreListpage({ ...requestData }).then(res => {
      if (res) {
        const arr = [...res.data.records];
        setScorelist(arr);
      }
    });
  }, [tabActiveKey])

  const tabList = [
    {
      key: 'week',
      tab: '服务绩效统计（按周）',
    },
    {
      key: 'month',
      tab: '服务绩效统计（按月）',
    },
  ]

  const handleTabChange = (key) => {
    setTabActiveKey(key);
  }

  const download = () => {
    dispatch({
      type: 'performanceappraisal/fetchstatsExport',
      payload: {
        beginTime: moment(startTime).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(endTime).format('YYYY-MM-DD 23:59:59'),
        type: tabActiveKey === 'week' ? 'W' : 'M'
      }
    }).then(res => {
      const filename = `统计查询.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      <>
        <Card>
          <Row gutter={16}>

            <Form layout='inline'>
              {
                tabActiveKey === 'week' && (
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {
                        getFieldDecorator('time1', {
                          initialValue: undefined
                        })(
                          <DatePicker
                            allowClear={false}
                            onChange={onChange}
                          />
                        )
                      }

                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('time2', {
                          initialValue: undefined
                        })
                          (<DatePicker
                            allowClear={false}
                            // disabledDate={enddisabledDate}
                            onChange={endonChange}
                          />)
                      }
                    </Form.Item>

                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={getList}
                    >
                      查询
                    </Button>

                  </Col>
                )
              }


              {
                tabActiveKey === 'month' && (
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('monthStarttime', {
                        initialValue: undefined
                      })(
                        <MonthPicker
                          allowClear='false'
                          onChange={onChange}
                        />)}
                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('monthEndtime', {
                          initialValue: undefined
                        })
                          (<MonthPicker
                            allowClear={false}
                            onChange={endonChange}
                          />)
                      }
                    </Form.Item>

                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={getList}
                    >
                      查询
                    </Button>
                  </Col>
                )
              }

            </Form>
          </Row>

          <Button
            type='primary'
            style={{ marginBottom: 24, marginTop: 5 }}
            onClick={download}
          >
            导出数据
          </Button>

          <Table
            columns={tabActiveKey === 'week' ? columns : columns2}
            dataSource={statsSearcharr}
            rowKey={record => record.phaseId}
          />
        </Card>

        <AnalysisPopup
          visible={visible}
          typeName={typeName}
          title={title}
          popupParameters={picval}
          closePop={() => { setVisible(false); setTypename('') }}
        />

      </>

    </PageHeaderWrapper>
  )
}
export default Form.create({})(
  connect(({ performanceappraisal, loading }) => ({
    statsSearcharr: performanceappraisal.statsSearcharr,
    loading: loading.models.performanceappraisal,
  }))(Statisticalquery),
);