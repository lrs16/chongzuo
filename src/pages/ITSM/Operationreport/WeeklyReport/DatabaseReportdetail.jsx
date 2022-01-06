import React, { useEffect, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Descriptions,
  Icon,
  message
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import Diskgroup from './components/DatabaseComponent/Diskgroup';
import Top10Surface from './components/DatabaseComponent/Top10Surface';
import Top10Increase from './components/DatabaseComponent/Top10Increase';
import Morethan5g from './components/DatabaseComponent/Morethan5g';
import QuestionsComments from './components/DatabaseComponent/QuestionsComments';
import LastweekHomework from './components/LastweekHomework';
import AddForm from './components/AddForm';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
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

const { MonthPicker } = DatePicker;
const { TextArea } = Input;
let saveSign = true;
let showTimecomponent = false;

function DatabaseReportdetail(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      reporttype,
      status,
      mainId,
      reportSearch
    } },
    dispatch,
    openReportlist,
    developmentList,
    submitdevelopmentlist,
    remainingDefectslist,
    loading,
    olduploadstatus
  } = props;

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [fileslist, setFilesList] = useState([]);
  const [discList, setDiscList] = useState([]); // 本周运维情况综述列表 
  const [tablespaceList, setTablespaceList] = useState([]) // 软件运维巡检
  const [tableUpList, setTableUpList] = useState([]) // 运维材料提交情况
  const [defectList, setDefectList] = useState([]) // 软件运维巡检
  const [operationList, setOperationList] = useState([]) // 上周作业计划
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [table5GList, setTable5GList] = useState([]) // 下周作业列表
  const [list, setList] = useState([]);

  const [newbutton, setNewButton] = useState(false);
  const [addrow, setAddrow] = useState(false);
  const [deleteSign, setDeleteSign] = useState(false);

  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { main } = openReportlist;

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
  const databaseReportform = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const savedata = {
          ...values,
          status,
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: reporttype === 'week' ? '数据库运维周报' : '数据库运维月报',
          reporttype,
          mainId,
          time1: moment(startTime).format('YYYY-MM-DD'),
          time2: moment(endTime).format('YYYY-MM-DD'),
          discList: JSON.stringify(discList || ''),
          tablespaceList: JSON.stringify(tablespaceList || ''),
          tableUpList: JSON.stringify(tableUpList || ''),
          defectList: JSON.stringify(defectList || ''),
          operationList: JSON.stringify(operationList || ''),
          nextOperationList: JSON.stringify(nextOperationList || ''),
          table5GList: JSON.stringify(table5GList || ''),
        }
        return dispatch({
          type: 'softreport/saveDataBase',
          payload: savedata
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            getopenFlow();
          } else {
            message.info('保存失败')
          }
        })
      }
      return []
    })
  }

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      databaseReportform();
    }
  }, [files]);

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


  useEffect(() => {
    if (mainId) {
      getopenFlow()
    }
  }, [mainId])

  useEffect(() => {
    saveSign = true;
  }, [])

  useEffect(() => {
    if (showTimecomponent === false) {
      showTimecomponent = true;
    }
  }, [showTimecomponent])

  useEffect(() => {
    if (startTime) {
      setTimeshow(true);
    }
  }, [timeshow])

  useEffect(() => {
    if (loading === false && saveSign) {
      const { addData } = openReportlist;
      setList(addData)
    }

    const discArr = openReportlist.discList;
    const tablespaceArr = openReportlist.tablespaceList;
    const tableUpArr = openReportlist.tableUpList;
    const defectArr = openReportlist.defectList;
    const operationArr = openReportlist.operationList;
    const nextOperationArr = openReportlist.nextOperationList;
    const table5GListArr = openReportlist.table5GList;
    setDiscList(discArr);
    setTablespaceList(tablespaceArr);
    setTableUpList(tableUpArr);
    setDefectList(defectArr);
    setOperationList(operationArr);
    setNextOperationList(nextOperationArr);
    setTable5GList(table5GListArr);

    if (openReportlist && main) {
      const saveInitlatime1 = openReportlist.main.time1;
      const saveInitlatime2 = openReportlist.main.time2;
      setStartTime(saveInitlatime1)
      setEndTime(saveInitlatime2)
    }

  }, [loading])

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

  const newMember = () => {
    const nowNumber = list.map(item => ({ ...item }));
    const newarr = nowNumber.map((item, index) => {
      return Object.assign(item, { px: (index + 6).toString() })
    });
    const addObj = {
      files: '',
      content: '',
      title: '',
      list: '',
      px: (nowNumber.length + 6).toString()
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
      newItem.px = (index + 6).toString();
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
          {loading === false && openReportlist.main !== undefined && (
            <Button
              type='primary'
              onClick={exportWord}
              disabled={olduploadstatus}
            >导出</Button>
          )}

          {
            loading === false && !reportSearch && main && main.time1 && nextOperationList !== undefined && (
              <Button
                type='primary'
                onClick={() => { saveSign = false; showTimecomponent = false; databaseReportform() }}
                disabled={olduploadstatus}
              >保存</Button>
            )
          }

          <Button onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card style={{ padding: 24 }}>
        {loading === false && main && main.time1 && nextOperationList !== undefined && (
          <Row gutter={24}>
            <Form >
              <Col span={24}>
                <Form.Item
                  label={reporttype === 'week' ? '周报名称' : '月报名称'}
                  style={{ display: 'inline-flex' }}
                >
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required,
                        message: '请输入周报名称'
                      }
                    ],
                    initialValue: main?.name ? main.name : ''
                  })
                    (
                      <Input disabled={reportSearch} style={{ width: 700 }} placeholder={`省级集中计量自动化系统数据库运维${reporttype === 'week'? '周':'月'}报`} />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && startTime && timeshow && (
                  <Col span={24}>
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
                    <Form.Item
                      label='起始时间'
                      style={{ display: 'inline-flex' }}
                    >
                      {getFieldDecorator('time1', {
                        rules: [
                          {
                            required,
                            message: '请输入填报时间'
                          }
                        ],
                        initialValue: main ? moment(main.time1) : ''
                      })(<MonthPicker
                        allowClear={false}
                        disabled={reportSearch}
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              {/* 一、本周运维情况综述 */}
              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>{reporttype === 'week' ? '一、本周运维情况综述' : '一、本月运维情况综述'}</p>
              </Col>

              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('content', {
                      initialValue: main ? main.content : ''
                    })
                      (<TextArea
                        autoSize={{ minRows: 3 }}
                        disabled={reportSearch}
                      />)
                  }
                </Form.Item>
              </Col>

              {
                !reportSearch && (
                  <Col span={24}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('contentFiles', {
                        initialValue: openReportlist.contentFiles ? openReportlist.contentFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.contentFiles ? JSON.parse(openReportlist.contentFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ contentFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.contentFiles === '' ? '[]' : openReportlist.contentFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>二、巡检汇总</p>
              </Col>

              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('patrolAndExamineContent', {
                      initialValue: openReportlist.patrolAndExamineContent
                    })(<TextArea
                      autoSize={{ minRows: 3 }}
                      disabled={reportSearch}
                    />)
                  }
                </Form.Item>
              </Col>

              {/* 二、常规运维工作开展情况 */}
              {/* 磁盘组 */}
              <Col span={24}>
                <Diskgroup
                  forminladeLayout={forminladeLayout}
                  submitdevelopmentlist={submitdevelopmentlist}
                  discArr={openReportlist.discList}
                  discList={contentrowdata => {
                    setDiscList(contentrowdata)
                  }}
                  reportSearch={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Top10Surface
                  forminladeLayout={forminladeLayout}
                  developmentList={developmentList}
                  submitdevelopmentlist={submitdevelopmentlist}
                  tablespaceArr={openReportlist.tablespaceList}
                  tablespaceList={contentrowdata => {
                    setTablespaceList(contentrowdata)
                  }}
                  time={main}
                  reportSearch={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Top10Increase
                  tableUpArr={openReportlist.tableUpList}
                  tableUpList={contentrowdata => {
                    setTableUpList(contentrowdata)
                  }}
                  reportSearch={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Morethan5g
                  forminladeLayout={forminladeLayout}
                  table5Garr={openReportlist.table5GList}
                  table5GList={contentrowdata => {
                    setTable5GList(contentrowdata)
                  }}
                  startTime={startTime}
                  endTime={endTime}
                />
              </Col>

              {/* Top10表增长附件 */}
              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('tableUpFiles', {
                        initialValue: openReportlist.tableUpFiles ? openReportlist.tableUpFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.tableUpFiles ? JSON.parse(openReportlist.tableUpFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ tableUpFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.tableUpFiles === '' ? '[]' : openReportlist.tableUpFiles} />}
                        </span>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                )
              }

              {/* 三、发现问题及修改建议 */}
              <Col span={24}>
                <QuestionsComments
                  remainingDefectslist={remainingDefectslist}
                  forminladeLayout={forminladeLayout}
                  defectArr={openReportlist.defectList ? openReportlist.defectList : []}
                  defectList={contentrowdata => {
                    setDefectList(contentrowdata)
                  }}
                  startTime={startTime}
                  endTime={endTime}
                  reportSearch={reportSearch}
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('defectFiles', {
                        initialValue: openReportlist.defectFiles ? openReportlist.defectFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.defectFiles ? JSON.parse(openReportlist.defectFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ defectFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.defectFiles === '' ? '[]' : openReportlist.defectFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '四、上周作业完成情况' : '四、上月作业完成情况'}</p>
              </Col>

              {/* 上周作业完成情况 */}
              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  operationArr={openReportlist.operationList}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setOperationList(contentrowdata)
                  }}
                  mainId={mainId}
                  detailParams={reportSearch}
                  databaseParams='true'
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('operationFiles', {
                        initialValue: openReportlist.operationFiles ? openReportlist.operationFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.operationFiles ? JSON.parse(openReportlist.operationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ operationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.operationFiles === '' ? '[]' : openReportlist.operationFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '五、下周作业计划' : '五、下月作业计划'}</p>
              </Col>

              {/* 下周工作计划 */}
              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  operationArr={openReportlist.nextOperationList}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  mainId={mainId}
                  detailParams={reportSearch}
                  databaseParams='true'
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('nextOperationFiles', {
                        initialValue: openReportlist.nextOperationFiles ? openReportlist.nextOperationFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.nextOperationFiles ? JSON.parse(openReportlist.nextOperationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ nextOperationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.nextOperationFiles === '' ? '[]' : openReportlist.nextOperationFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }

              {(loading === false && list && list.length > 0) && (
                list.map((item, index) => {
                  return (
                    <>
                      <Col span={23}>
                        <AddForm
                          formincontentLayout={formincontentLayout}
                          px={(index + 6).toString()}
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
                onClick={() => newMember()}
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
  connect(({ softreport,viewcache, loading }) => ({
    openReportlist: softreport.openReportlist,
    loading: loading.models.softreport,
    olduploadstatus: viewcache.olduploadstatus,
  }))(DatabaseReportdetail),
);
