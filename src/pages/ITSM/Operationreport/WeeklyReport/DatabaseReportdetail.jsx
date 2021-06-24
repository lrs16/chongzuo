import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Descriptions,
  Popconfirm,
  Divider,
  Icon
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import Diskgroup from './components/DatabaseComponent/Diskgroup';
import Top10Surface from './components/DatabaseComponent/Top10Surface';
import Top10Increase from './components/DatabaseComponent/Top10Increase';
import QuestionsComments from './components/DatabaseComponent/QuestionsComments';
import LastweekHomework from './components/LastweekHomework';
import NextweekHomework from './components/NextweekHomework';
import AddForm from './components/AddForm';
import styles from './index.less';
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
function DatabaseReportdetail(props) {
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
    dispatch,
    openReportlist,
    developmentList,
    submitdevelopmentlist,
    remainingDefectslist,
    lastweekHomeworklist,
    nextweekHomeworklist,
    loading,
  } = props;

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [secondbutton, setSecondbutton] = useState(false);
  const [addTitle, setAddTitle] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fileslist, setFilesList] = useState([]);
  const [discList, setDiscList] = useState([]); // 本周运维情况综述列表 
  const [tablespaceList, setTablespaceList] = useState([]) // 软件运维巡检
  const [tableUpList, setTableUpList] = useState([]) // 运维材料提交情况
  const [defectList, setDefectList] = useState([]) // 软件运维巡检
  const [operationList, setOperationList] = useState([]) // 上周作业计划
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [list, setList] = useState([]);
  const { main } = openReportlist;


  console.log(list, 'list')
  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const savedata = {
          ...values,
          status,
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: reporttype === 'week' ? '数据库运维周报':'数据库运维月报',
          reporttype,
          mainId,
          time1: startTime,
          time2: endTime,
          discList: JSON.stringify(discList),
          tablespaceList: JSON.stringify(tablespaceList),
          tableUpList: JSON.stringify(tableUpList),
          defectList: JSON.stringify(defectList),
          operationList: JSON.stringify(operationList),
          nextOperationList: JSON.stringify(nextOperationList),
        }
        return dispatch({
          type: 'softreport/saveDataBase',
          payload: savedata
        }).then(res => {
          if (res.code === 200) {
            getopenFlow()
          }
        })
      }

    })

  }

  const defaultTime = () => {
    //  周
    if (reporttype === 'week') {
      startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    } else {
      //  月
      startTime = moment().startOf('month').format('YYYY-MM-DD');
      endTime = moment().endOf('month').format('YYYY-MM-DD');
    }
  }
  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      softReportform();
    }
  }, [files]);

  //   七、上周作业完成情况--表格
  const lastweekHomework = () => {
    dispatch({
      type: 'softreport/lastweekHomework',
      payload: {
        time1: startTime,
        time2: endTime,
        pageIndex: 0,
        pageSize: 10
      }
    })
  }
  //   七、下周作业完成情况--表格
  const nextweekHomework = () => {
    dispatch({
      type: 'softreport/nextweekHomework',
      payload: {
        time1: startTime,
        time2: endTime,
        pageIndex: 0,
        pageSize: 10
      }
    })
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

  // 新增一条记录
  const handleaddTable = (params) => {
    const newData = (list).map(item => ({ ...item }));
    newData.push({
      ...params
    });
    setList(newData)
  };


  // 上传删除附件触发保存
  useEffect(() => {
    lastweekHomework();
    nextweekHomework();
    defaultTime();
  }, []);

  useEffect(() => {
    if (mainId) {
      getopenFlow()
    }
  }, [mainId])

  useEffect(() => {
    const { addData } = openReportlist;
    setAddTitle(addData);
    setList(addData)
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
          {
            !reportSearch && (
              <Button type='primary' onClick={softReportform}>保存</Button>
            )
          }

          <Button onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card>
        {loading === false && startTime && (
          <Row gutter={24}>
            <Form >

              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? '周报名称' : '月报名称'}>
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
                      <Input disabled={reportSearch} />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && (
                  <Col span={24}>
                    <Form.Item label='填报日期'>
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
                )
              }

              {
                reporttype === 'month' && (
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
                      initialValue: main.content
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
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={openReportlist.contentFiles ? JSON.parse(openReportlist.contentFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ contentFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
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
                  startTime={startTime}
                  endTime={endTime}
                  reportSearch={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Top10Increase
                  forminladeLayout={forminladeLayout}
                  developmentList={developmentList}
                  submitdevelopmentlist={submitdevelopmentlist}
                  tableUpArr={openReportlist.tableUpList}
                  tableUpList={contentrowdata => {
                    setTableUpList(contentrowdata)
                  }}
                  startTime={startTime}
                  endTime={endTime}
                  reportSearch={reportSearch}
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
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={openReportlist.tableUpFiles ? JSON.parse(openReportlist.tableUpFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ tableUpFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
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
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={openReportlist.defectFiles ? JSON.parse(openReportlist.defectFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ defectFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
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
                <p style={{ fontWeight: '900', fontSize: '16px' }}>四、上周作业完成情况</p>
              </Col>

              {/* 上周作业完成情况*/}
              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  operationArr={openReportlist.operationList}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setOperationList(contentrowdata)
                  }}
                  mainId={mainId}
                  detailParams={reportSearch}
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
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={openReportlist.operationFiles ? JSON.parse(openReportlist.operationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ operationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
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
                <p style={{ fontWeight: '900', fontSize: '16px' }}>五、下周作业计划</p>
              </Col>

              {/* 下周工作计划 */}
              <Col span={24}>
                <NextweekHomework
                  forminladeLayout={forminladeLayout}
                  nextOperationArr={openReportlist.nextOperationList}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  nextOperationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  mainId={mainId}
                  detailParams={reportSearch}
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
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={openReportlist.nextOperationFiles ? JSON.parse(openReportlist.nextOperationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ nextOperationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
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


              {loading === false && addTitle && addTitle.length > 0 && (
                addTitle.map((item, index) => {
                  return (
                    <>
                      <Col span={23}>
                        <AddForm
                          formincontentLayout={formincontentLayout}
                          px={index + 6}
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
  connect(({ softreport, loading }) => ({
    openReportlist: softreport.openReportlist,
    loading: loading.models.softreport,
  }))(DatabaseReportdetail),
);
