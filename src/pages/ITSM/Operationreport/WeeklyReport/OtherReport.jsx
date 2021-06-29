import React, { useEffect, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Icon,
  message
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import AddForm from './components/AddForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const formincontentLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const { MonthPicker } = DatePicker;
let startTime;
let endTime;
function OtherReport(props) {
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      reporttype,
      mainId,
      listreportType,
      listId,
      reportSearch
    } },
    dispatch,
    loading,
  } = props;

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [addTitle, setAddTitle] = useState([]);
  const [list, setList] = useState([]);
  const [copyData, setCopyData] = useState('')

  // 新增一条记录
  const handleaddTable = (params) => {
    const newData = (list).map(item => ({ ...item }));
    newData.push({
      ...params
    });
    setList(newData);
  };

  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const savedata = {
          ...value,
          status: 'add',
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: reporttype === 'week' ? '其他运维周报' : '其他运维月报',
          reporttype,
          mainId,
          time1: startTime,
          time2: endTime,
        }

        dispatch({
          type: 'softreport/saveOther',
          payload: savedata
        })
      }

    })
  }

  const defaultTime = () => {
    //  周统计
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
  }

  const handlePaste = () => {
    if (!listreportType || !listId) {
      message.info('请在列表选择一条数据复制哦')
      return false;
    }

    if (listreportType !== '其他运维周报') {
      message.info('只能粘贴同种周报类型哦');
      return false;
    }

    return dispatch({
      type: 'softreport/pasteReport',
      payload: {
        editStatus: 'edit',
        id: listId
      }
    }).then(res => {
      if (res.code === 200) {
        setCopyData(res)
        setAddTitle(res.addData)
      } else {
        message.info('您无法复制该条记录，请返回列表重新选择')
      }
    })
  }

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      softReportform();
    }
  }, [files]);

  // 上传删除附件触发保存
  useEffect(() => {
    defaultTime();
  }, [loading]);

  const handleBack = () => {
    router.push({
      pathname: `/ITSM/operationreport/weeklyreport/myweeklyreport`,
      query: { mainId, closetab: true },
      state: { cache: false }
    });

    if (reporttype === 'week') {
      if (!reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/weeklyreport/myweeklyreport',
          query: { pathpush: true },
          state: { cache: false }
        }
        );
      }

      if (reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/weeklyreport/myweeklyreportsearch',
          query: { pathpush: true },
          state: { cache: false }
        }
        );
      }

    }

    if (reporttype === 'month') {
      if (!reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/monthlyreport/mymonthlyreport',
          query: { pathpush: true },
          state: { cache: false }
        })
      }
      if (reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/monthlyreport/mymonthlysearch',
          query: { pathpush: true },
          state: { cache: false }
        })
      }
    }
  }

  const onChange = (date, dateString) => {
    if (reporttype === 'week') {
      startTime = dateString;
      endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
      setFieldsValue({ time2: moment(endTime) });
    } else {
      startTime = date.startOf('month').format('YYYY-MM-DD');
      endTime = date.endOf('month').format('YYYY-MM-DD');
    }
  }

  const endonChange = (date, dateString) => {
    endTime = dateString;
    startTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setFieldsValue({ time1: moment(startTime) })
  }

  const newMember = () => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    nowNumber.push({ 'add': '1', tableNumber: [] });
    setAddTitle(nowNumber)
  }

  const removeForm = (tableIndex) => {
    addTitle.splice(tableIndex, 1);
    const resultArr = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultArr.push(addTitle[i])
    }
    setAddTitle(resultArr)
  }

  return (
    <PageHeaderWrapper
      title={listreportType === 'week' ? '其他运维周报' : '其他运维月报'}
      extra={
        loading === false && (
          <>
            <Button type='primary' onClick={softReportform}>保存</Button>
            <Button type='primary' onClick={handlePaste}>粘贴</Button>
            <Button onClick={handleBack}>
              返回
            </Button>
          </>
        )
      }
    >
      <Card style={{ padding: 24 }}>
        {startTime && (
          <Row gutter={24}>
            <Form>
              <Col span={24}>
                <Form.Item
                  label={reporttype === 'week' ? '周报名称' : '月报名称'}
                  style={{ display: 'inline-flex' }}
                >
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required,
                        message: '请输入名称'
                      }
                    ],
                    initialValue: copyData.main ? copyData.main.name : ''
                  })
                    (
                      <Input style={{ width: 700 }} />
                    )}
                </Form.Item>
              </Col>
              {
                reporttype === 'week' && (
                  <div style={{ display: 'inline' }}>
                    <Col span={24}>
                      <Form.Item label='填报时间' style={{ display: 'inline-flex' }}>
                        {getFieldDecorator('time1', {
                          rules: [
                            {
                              required,
                              message: '请输入填报时间'
                            }
                          ],
                          initialValue: moment(startTime)
                        })(<DatePicker
                          allowClear={false}
                          style={{ marginRight: 10 }}
                          onChange={onChange}
                        />)}
                      </Form.Item>

                      <Form.Item label='' style={{ display: 'inline-flex' }}>
                        {
                          getFieldDecorator('time2', {
                            initialValue: moment(endTime)
                          })
                            (<DatePicker
                              allowClear={false}
                              onChange={endonChange}
                            />)
                        }
                      </Form.Item>
                    </Col>
                  </div>
                )
              }

              {
                reporttype === 'month' && (
                  <Col span={24}>
                    <Form.Item label='填报日期'>
                      {getFieldDecorator('time1', {
                        rules: [
                          {
                            required,
                            message: '请选择填报日期'
                          }
                        ],
                        initialValue: moment(copyData.main ? copyData.main.time1 : startTime)
                      })(<MonthPicker
                        allowClear
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              {loading === false && addTitle && addTitle.length > 0 && (
                addTitle.map((item, index) => {
                  return (
                    <>
                      <Col span={23}>
                        <AddForm
                          formincontentLayout={formincontentLayout}
                          px={index + 2}
                          addTable={newdata => {
                            handleaddTable(newdata)
                          }}
                          dynamicData={addTitle[index]}
                          loading={loading}
                        />
                      </Col>

                      <Col span={1}>
                        <Icon
                          className="dynamic-delete-button"
                          type="minus-circle-o"
                          onClick={() => removeForm(index)}
                        />
                      </Col>

                    </>
                  )
                })
              )
              }

              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="primary"
                ghost
                onClick={() => newMember()}
                icon="plus"
              >
                新增其他内容
              </Button>
            </Form>
          </Row>
        )}
      </Card>
    </PageHeaderWrapper>

  )
}

export default Form.create({})(
  connect(({ loading }) => ({
    loading: loading.models.softreport,
  }))(OtherReport),
);
