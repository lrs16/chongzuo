import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Table,
  Popconfirm,
  Divider,
  Icon,
  message
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import AddForm from './components/AddForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';

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

const { RangePicker,MonthPicker } = DatePicker;
const { TextArea } = Input;
let startTime;
let endTime;
function OtherReportdetail(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    location: { query: {
      type,
      reporttype,
      status,
      mainId,
      reportSearch
    } },
    openReportlist,
    dispatch,
    loading,
  } = props;


  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [secondbutton, setSecondbutton] = useState(false);
  const [addTitle, setAddTitle] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const { main } = openReportlist;

  // 动态添加表格暂存数据
  const handleaddTable = (params) => {
    const newData = (list).map(item => ({ ...item }));
    newData.push({
      ...params
    });
    setList(newData)
    // if(params.files) {
    //   softReportform()
    // }
  };

  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      const savedata = {
        ...value,
        status,
        editStatus: mainId ? 'edit' : 'add',
        addData: JSON.stringify(list),
        type: reporttype === 'week' ? '其他运维周报' : '其他运维月报',
        reporttype,
        mainId,
        time1: startTime,
        time2: endTime,
      }
      return dispatch({
        type: 'softreport/saveOther',
        payload: savedata
      }).then(res => {
        if (res.code === 200) {
          message.info(res.msg);
          getopenFlow();
        }
      })

    })
  }

  const defaultTime = () => {
    //  周统计
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
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

      if(reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/weeklyreport/myweeklyreportsearch',
          query: { pathpush: true },
          state: { cache: false }
        }
        );
      }
    } 

    if(reporttype === 'month') {
      if(!reportSearch) {
        console.log(1)
        router.push({
          pathname: '/ITSM/operationreport/monthlyreport/mymonthlyreport',
          query: { pathpush: true },
          state: { cache: false }
        })
      }
      if(reportSearch) {
        console.log(2)
        router.push({
          pathname: '/ITSM/operationreport/monthlyreport/mymonthlysearch',
          query: { pathpush: true },
          state: { cache: false }
        })
      }
    }
  }

  const getopenFlow = () => {
    dispatch({
      type: 'softreport/openReport',
      payload: {
        editStatus: 'edit',
        id: mainId
      }
    })
  }

  useEffect(() => {
    if (mainId) {
      getopenFlow();
    }
  }, [mainId])

  useEffect(() => {
    const { addData } = openReportlist;
    setAddTitle(addData)
    setList(addData)
  }, [loading])

  const onChange = (date, dateString) => {
    if (reporttype === 'week') {
      startTime = dateString[0];
      endTime = dateString[1];
    } else {
      startTime = date.startOf('month').format('YYYY-MM-DD');
      endTime = date.endOf('month').format('YYYY-MM-DD');
    }
  }

  const newMember = () => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    nowNumber.push({ 'add': '1', tableNumber: [] });
    setAddTitle(nowNumber)
  }

  //  移除表格
  const removeForm = (tableIndex) => {
    addTitle.splice(tableIndex, 1);
    list.splice(tableIndex, 1);
    const resultArr = [];
    const listArr = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultArr.push(addTitle[i])
    }
    for (let i = 0; i < list.length; i++) {
      listArr.push(list[i])
    }
    setAddTitle(resultArr)
    setList(listArr)
  }

  useEffect(() => {
    const { addData } = openReportlist;
    setAddTitle(addData)
  }, [loading])

  const exportWord = () => {
    dispatch({
      type: 'softreport/exportWord',
      payload: { mainId }
    }).then(res => {
      const fieldName = '下载.doc';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fieldName;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          {loading === false && (
            <Button type='primary' onClick={exportWord}>导出</Button>
          )}

          {!reportSearch && (
            <Button type='primary' onClick={softReportform}>保存</Button>
          )}

          <Button type='primary' onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card>
        {loading === false && startTime && (
          <Row gutter={24}>
            <Form>

              <Col span={24}>
                <Form.Item label={type === 'week' ? '周报名称' : '月报名称'}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required,
                        message: '请输入名称'
                      }
                    ],
                    initialValue: main ? main.name : ''
                  })
                    (
                      <Input disabled={reportSearch} />
                    )}
                </Form.Item>
              </Col>

              {reporttype === 'week' && (
                <Col span={24}>
                  <Form.Item label='起始时间'>
                    {getFieldDecorator('time1', {
                      initialValue: [moment(main.time1), moment(main.time2)]
                    })(<RangePicker
                      allowClear={false}
                      disabled={reportSearch}
                      // disabledDate={startdisabledDate}
                      // placeholder='请选择'
                      onChange={onChange}
                    />)}
                  </Form.Item>
                </Col>
              )}

              {reporttype === 'month' && (
                <Col span={24}>
                  <Form.Item label='起始时间'>
                    {getFieldDecorator('time1', {
                      initialValue: moment(main.time1)
                    })(<MonthPicker
                      allowClear={false}
                      disabled={reportSearch}
                      // disabledDate={startdisabledDate}
                      // placeholder='请选择'
                      onChange={onChange}
                    />)}
                  </Form.Item>
                </Col>
              )}




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

                      {!reportSearch && (
                        <Col span={1}>
                          <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => removeForm(index)}
                          />
                        </Col>
                      )}


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
                disabled={reportSearch}
              >
                新增其他运维
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
    openReportlist: softreport.openReportlist,
    loading: loading.models.softreport,
  }))(OtherReportdetail),
);
