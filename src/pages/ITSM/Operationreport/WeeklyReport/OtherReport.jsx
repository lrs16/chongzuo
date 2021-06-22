import React, { useEffect, useRef, useState } from 'react';
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
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import AddForm from '../WeeklyReport/components/AddForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
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

const { RangePicker, MonthPicker } = DatePicker;
const { TextArea } = Input;
let startTime;
let monthStarttime;
let endTime;
let isNew = false;
function OtherReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    location: { query: {
      reporttype,
      mainId,
      listreportType,
      listId,
    } },
    dispatch,
    loading,
  } = props;


  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [secondbutton, setSecondbutton] = useState(false);
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
    // if(params.files) {
    //   softReportform()
    // }
  };


  //  保存表单
  const softReportform = (params) => {
    props.form.validateFields((err, value) => {
      const savedata = {
        ...value,
        status:'add',
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
    router.push('/ITSM/operationreport/weeklyreport/myweeklyreport');
  }

  const onChange = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1[0]).format('YYYY-MM-DD');
      endTime = moment(value.time1[1]).format('YYYY-MM-DD');
    })
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
        <>
          <Button type='primary' onClick={softReportform}>保存</Button>
          <Button type='primary' onClick={handlePaste}>粘贴</Button>
          <Button type='primary' onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card>
        {startTime && (
          <Row gutter={16}>
            <Form {...formItemLayout}>

              <Col span={8}>
                <Form.Item label={reporttype === 'week' ? '周报名称' : '月报名称'}>
                  {getFieldDecorator('name', {
                    initialValue: copyData.main ? copyData.main.name : ''
                  })
                    (
                      <Input />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && (
                  <Col span={8}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        rules: [
                          {
                            required,
                            message: '请选择填报日期'
                          }
                        ],
                        initialValue: [moment(copyData.main ? copyData.main.time1 : startTime), moment(copyData.main ? copyData.main.time2 : endTime)]
                      })(<RangePicker
                        allowClear={false}
                        // disabledDate={startdisabledDate}
                        // placeholder='请选择'
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              {
                reporttype === 'month' && (
                  <Col span={8}>
                    <Form.Item label='起始时间'>
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
                        // disabledDate={startdisabledDate}
                        // placeholder='请选择'
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
                          list={addData => {
                            setList(addData)
                          }}
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
                新增内容
              </Button>

            </Form>
          </Row>

        )}

      </Card>
    </PageHeaderWrapper>

  )
}

export default Form.create({})(
  connect(({ softreport, loading }) => ({
    loading: loading.models.softreport,
  }))(OtherReport),
);
