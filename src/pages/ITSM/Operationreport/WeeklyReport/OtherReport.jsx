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

function OtherReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      reporttype,
      mainId,
      reportSearch
    } },
    dispatch,
    loading,
    olduploadstatus
  } = props;


  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [list, setList] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [copyData, setCopyData] = useState('');
  const [addrow, setAddrow] = useState(false);
  const [deleteSign, setDeleteSign] = useState(false);

  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [paste, setPaste] = useState(false);

  // 新增一条记录

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

  //  保存表单
  const otherReportform = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const savedata = {
          ...value,
          status: 'add',
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list || []),
          type: reporttype === 'week' ? '其他运维周报' : '其他运维月报',
          reporttype,
          mainId,
          time1: reporttype === 'week' ? moment(startTime).format('YYYY-MM-DD') : moment(startTime).startOf('month').format('YYYY-MM-DD'),
          time2: reporttype === 'week' ? moment(endTime).format('YYYY-MM-DD') : moment(endTime).endOf('month').format('YYYY-MM-DD'),
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
    const currentstartTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    const currentendTime = moment().format('YYYY-MM-DD');

    setStartTime(currentstartTime);
    setEndTime(currentendTime);
  }

  const handlePaste = () => {
    if (!localStorage.getItem('listId')) {
      message.info('请在列表选择一条数据复制哦')
      return false;
    }

    if (reporttype === 'week') {
      if (localStorage.getItem('listreportType') !== '其他运维周报') {
        message.info('只能粘贴同种周报类型哦');
        return false;
      }
    }

    if (reporttype === 'month') {
      if (localStorage.getItem('listreportType') !== '其他运维月报') {
        message.info('只能粘贴同种月报类型哦');
        return false;
      }
    }

    return dispatch({
      type: 'softreport/pasteReport',
      payload: {
        editStatus: 'edit',
        id: localStorage.getItem('listId')
      }
    }).then(res => {
      if (res.code === 200) {
        setPaste(true);
        setStartTime('')
        setCopyData(res);
        setList(res.addData);
        message.success('粘贴成功')
      } else {
        message.info('您无法复制该条记录，请返回列表重新选择')
      }
    })
  }

  const dateFormat = 'YYYY-MM-DD';

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      otherReportform();
    }
  }, [files]);

  // 上传删除附件触发保存
  useEffect(() => {
    setTimeshow(false);
    defaultTime();
  }, []);

  useEffect(() => {
    if (startTime) {
      setTimeshow(true);
    }
  }, [timeshow])

  useEffect(() => {
    if (copyData && copyData.main && paste) {
      setStartTime(copyData.main.time1)
      setEndTime(copyData.main.time2)
    }
  }, [copyData, paste])

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
      const currentendTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
      setTimeshow(false);
      setStartTime(dateString);
      setEndTime(currentendTime);
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
    setStartTime(currendstartTime);
    setEndTime(dateString);
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

  const removeForm = (tableIndex) => {
    list.splice(tableIndex, 1);
    const resultArr = list.map((item, index) => {
      const newItem = item;
      newItem.px = (index + 1).toString();
      return newItem;
    })
    setList(resultArr);
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        // loading === false && (
        <>
          <Button
            type='primary'
            onClick={handlePaste}
            disabled={olduploadstatus}
          >
            粘贴
          </Button>

          <Button
            type='primary'
            onClick={otherReportform}
            disabled={olduploadstatus}
          >
            保存
          </Button>

          <Button onClick={handleBack}>
            返回
          </Button>
        </>
        // )
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
                      <Input style={{ width: 700 }} placeholder={`省级集中XXXX系统其他运维${reporttype === 'week' ? '周' : '月'}报`} />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && loading === false && startTime && timeshow && (
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
                        initialValue: moment(copyData.main ? copyData.main.time1 : startTime)
                      })(<MonthPicker
                        allowClear={false}
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              {loading === false && list && list.length > 0 && (
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
                          uploadStatus={olduploadstatus}
                        />
                      </Col>

                      {
                        list[index] && (
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
  connect(({ loading, viewcache }) => ({
    loading: loading.models.softreport,
    olduploadstatus: viewcache.olduploadstatus,
  }))(OtherReport),
);
