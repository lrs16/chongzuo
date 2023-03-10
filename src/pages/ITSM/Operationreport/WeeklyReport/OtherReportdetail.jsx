import React, { useEffect, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  Icon,
  message,
  DatePicker,
  Spin
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AddForm from './components/AddForm';

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
let saveSign = true;
let newtime = ''
let newtime2 = ''

function OtherReportdetail(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      reporttype,
      status,
      mainId,
      reportSearch
    } },
    openReportlist,
    dispatch,
    location,
    loading,
    olduploadstatus
  } = props;

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [list, setList] = useState([]);
  const [deleteSign, setDeleteSign] = useState(false);
  const [addrow, setAddrow] = useState(false);
  const [newbutton, setNewButton] = useState(false);

  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { main } = openReportlist;

  useEffect(() => {
    if (loading === false && saveSign) {
      const { addData } = openReportlist;
      setList(addData)

      if (openReportlist && main) {
        const saveInitlatime1 = openReportlist.main.time1;
        const saveInitlatime2 = openReportlist.main.time2;
        newtime = saveInitlatime1;
        newtime2 = saveInitlatime2;
      }
    }



  }, [loading])

  // 动态添加表格暂存数据

  const handleaddTable = (params, px, rowdelete) => {
    if (deleteSign && rowdelete) {
      const newData = [];
      newData.push({
        ...params
      });

      setList(newData);
      setNewButton(false)
    } else {
      let filtIndex;
      const newData = (list).map(item => ({ ...item }));

      for (let i = 0; i < newData.length; i += 1) {
        if (newData[i].px === px) {
          filtIndex = i;
          break;
        }
      }

      if (newData && newData.length) {
        if (filtIndex !== undefined) {
          newData.splice(filtIndex, 1, params);
        }
      }

      if (newData && (newData.length === 0 || filtIndex === undefined)) {
        newData.push({
          ...params
        });
      }

      setList(newData);
      setNewButton(false)
    }
  };

  const getopenFlow = () => {
    dispatch({
      type: 'softreport/openReport',
      payload: {
        editStatus: 'edit',
        id: mainId
      }
    })
  }

  //  保存表单
  const otherReportform = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const savedata = {
          ...value,
          status,
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list || []),
          type: reporttype === 'week' ? '其他运维周报' : '其他运维月报',
          reporttype,
          mainId,
          time1: moment(startTime).format('YYYY-MM-DD'),
          time2: moment(endTime).format('YYYY-MM-DD'),
        }
        return dispatch({
          type: 'softreport/saveOther',
          payload: savedata
        }).then(res => {
          if (res.code === 200) {
            message.info(res.msg);
            getopenFlow();
            saveSign = true;
            setTimeshow(false)
          }
        })
      }
    })
  }

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      otherReportform();
    }
  }, [files]);

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

  useEffect(() => {
    newtime = ''
    if (mainId && newtime === '') {
      getopenFlow()
    }
  }, [mainId])

  useEffect(() => {
    if (loading === false && saveSign) {
      const { addData } = openReportlist;
      setList(addData)
    }

    if (openReportlist && main) {
      const saveInitlatime1 = openReportlist.main.time1;
      const saveInitlatime2 = openReportlist.main.time2;
      setStartTime(saveInitlatime1)
      setEndTime(saveInitlatime2)
    }

  }, [loading])

  useEffect(() => {
    saveSign = true;
  }, [])


  useEffect(() => {
    if (newtime && loading === false) {
      setStartTime(newtime)
      setEndTime(newtime2)
      setTimeshow(true);
    }
  }, [timeshow, loading])

  useEffect(() => {
    newtime = ''
    if (location.state && location.state.reset && mainId && newtime === '') {
      getopenFlow()
    }
    setTimeshow(false);
  }, [location.state])

  const onChange = (date, dateString) => {
    if (reporttype === 'week') {
      const currentendTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
      setTimeshow(false);
      newtime = dateString;
      newtime2 = currentendTime
      setFieldsValue({ time2: moment(endTime) });
    } else {
      const monthstartTime = date.startOf('month').format('YYYY-MM-DD');
      const monthendTime = date.endOf('month').format('YYYY-MM-DD');
      setStartTime(monthstartTime);
      setEndTime(monthendTime);
    }
  }

  const endonChange = (date, dateString) => {
    const currendstartTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setTimeshow(false);
    newtime = currendstartTime;
    newtime2 = dateString;
    setFieldsValue({ time1: moment(startTime) })
  }


  const newMember = () => {
    const nowNumber = list.map(item => ({ ...item }));
    const newarr = nowNumber.map((item, index) => {
      return Object.assign(item, { px: (index + 1).toString() })
    });
    const addObj = {
      files: '',
      content: '',
      title: '',
      list: '',
      px: (nowNumber.length + 1).toString()
    }
    newarr.push(addObj);
    setList(newarr);
    setNewButton(true);
    setDeleteSign(false);
  }

  //  移除表格
  const removeForm = (tableIndex) => {
    list.splice(tableIndex, 1);
    const resultArr = list.map((item, index) => {
      const newItem = item;
      newItem.px = (index + 1).toString();
      return newItem;
    })
    setList(resultArr);
  }

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

  const dateFormat = 'YYYY-MM-DD';

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          {loading === false && (
            <Button
              type='primary'
              onClick={exportWord}
              disabled={olduploadstatus}
            >
              导出
            </Button>
          )}

          {loading === false && !reportSearch && (
            <Button
              type='primary'
              onClick={() => { saveSign = false; otherReportform() }}
              disabled={olduploadstatus}
            >
              保存
            </Button>
          )}

          <Button onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      {
        loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin spinning={loading} />
          </div>
        )
      }
      <Card style={{ padding: 24 }}>
        {loading === false && main && main.time1 && (
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
                    initialValue: main ? main.name : ''
                  })
                    (
                      <Input disabled={reportSearch} style={{ width: 700 }} placeholder={`省级集中XXXX系统其他运维${reporttype === 'week' ? '周' : '月'}报`} />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && startTime && timeshow && (
                  <Col span={16}>
                    <div>
                      <span style={{ marginLeft: 10 }}>填报时间 :</span>

                      <span
                        style={{ marginRight: 10, marginLeft: 10 }}
                      >
                        <DatePicker
                          allowClear={false}
                          format={dateFormat}
                          defaultValue={moment(startTime)}
                          onChange={onChange}
                          disabled={reportSearch}
                        />
                      </span>


                      <span
                        style={{ marginRight: 10 }}
                      >-</span>

                      <span>
                        <DatePicker
                          allowClear={false}
                          format={dateFormat}
                          defaultValue={moment(endTime)}
                          onChange={endonChange}
                          disabled={reportSearch}

                        />
                      </span>

                    </div>
                  </Col>

                )
              }

              {
                reporttype === 'month' && (
                  <Col span={24}>
                    <Form.Item label='填报日期' style={{ display: 'inline-flex' }}>
                      {getFieldDecorator('time1', {
                        rules: [
                          {
                            required,
                            message: '请选择填报日期'
                          }
                        ],
                        initialValue: moment(main ? main.time1 : '')
                      })(<MonthPicker
                        allowClear={false}
                        onChange={onChange}
                        disabled={reportSearch}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              {(loading === false && list && list.length > 0) && (
                list.map((item, index) => {
                  return (
                    <>
                      <Col span={23}>
                        <AddForm
                          formincontentLayout={formincontentLayout}
                          px={(index + 1).toString()}
                          addTable={(newdata, addpx, rowdelete) => {
                            handleaddTable(newdata, addpx, rowdelete)
                          }}
                          index={index}
                          dynamicData={list.length ? list[index] : {}}
                          loading={loading}
                          ChangeAddRow={v => setAddrow(v)}
                          sign={deleteSign}
                          detailParams={reportSearch}
                          uploadStatus={olduploadstatus}
                        />
                      </Col>

                      {
                        !reportSearch && (
                          <Col span={1}>
                            <Icon
                              className="dynamic-delete-button"
                              type="delete"
                              onClick={() => { removeForm(index); setDeleteSign(true) }}
                            />
                          </Col>
                        )
                      }
                    </>
                  )
                })
              )
              }

              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="primary"
                ghost
                onClick={() => { newMember() }}
                icon="plus"
                disabled={olduploadstatus || reportSearch}
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
  connect(({ softreport, viewcache, loading }) => ({
    openReportlist: softreport.openReportlist,
    loading: loading.models.softreport,
    olduploadstatus: viewcache.olduploadstatus,
  }))(OtherReportdetail),
);
