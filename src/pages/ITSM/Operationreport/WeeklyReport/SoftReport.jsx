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
  Divider
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import Development from './components/Development';
import ThisweekMaintenance from './components/ThisweekMaintenance';
import ServiceCompletion from './components/ServiceCompletion';
import ThisWeekitsm from './components/ThisWeekitsm';
import SoftCompletion from './components/SoftCompletion';
import RemainingDefects from './components/RemainingDefects';
import LastweekHomework from './components/LastweekHomework';
import NextweekHomework from './components/NextweekHomework';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

let starttime;
let monthStarttime;
let endTime;
function SoftReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    dispatch,
    maintenanceList,
    developmentList,
    submitdevelopmentlist,
    serviceCompletionlist,
    serviceCompletionsecondlist,
    serviceCompletionthreelist,
    thisWeekitsmlist,
    softCompletionlist,
    completionsecondTablelist,
    remainingDefectslist,
    lastweekHomeworklist,
    nextweekHomeworklist,
    loading,
  } = props;

  const required = true;
  const saveformRef = useRef();
  const developmentformRef = useRef();
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [tableIndex,setTableIndex] = useState('1')
  //  保存表单
  const softReportform = () => {
    saveformRef.current.validateFields((err,value)=> {
      // console.log('value1: ', value);
      developmentformRef.current.validateFields((err,value)=> {
        // console.log('value2: ', value);
      })
    })
  }

  //  本周运维情况综述表格数据
  const maintenanceTable = () => {
    dispatch({
      type: 'thisweekly/fetchMaintance'
    })
  }

  //  常规运维工作开展情况第一个表格
  const developmentTable = () => {
    dispatch({
      type: 'thisweekly/developmentListdata'
    })
  }
  //  常规运维工作开展情况第二个表格
  const submitdevelopmentData = () => {
    dispatch({
      type: 'thisweekly/submitdevelopmentData'
    })
  }
  //  三、运维服务指标完成情况---第一个表格
  const serviceCompletionfirst = () => {
    dispatch({
      type: 'thisweekly/serviceCompletionone'
    })
  }
  //  三、运维服务指标完成情况---第二个表格
  const serviceCompletiontwo = () => {
    dispatch({
      type: 'thisweekly/serviceCompletiontwo'
    })
  }
  //  三、运维服务指标完成情况---第三个表格
  const serviceCompletionthree = () => {
    dispatch({
      type: 'thisweekly/serviceCompletionthree'
    })
  }
  //  四、本周事件、问题及故障表格数据
  const thisWeekitsm = () => {
    dispatch({
      type: 'thisweekly/thisWeekitsm'
    })
  }
  //  五、软件作业完成情况第一个表格
  const completionfirstlyTable = () => {
    dispatch({
      type: 'thisweekly/completionfirstlyTable'
    })
  }
  //  五、软件作业完成情况第二个表格
  const completionsecondTable = () => {
    dispatch({
      type: 'thisweekly/completionsecondTable'
    })
  }
  //   六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件）
  const remainingDefects = () => {
    dispatch({
      type: 'thisweekly/remainingDefects'
    })
  }

  //   七、上周作业完成情况--表格
  const lastweekHomework = () => {
    dispatch({
      type: 'thisweekly/lastweekHomework'
    })
  }
  //   七、下周作业完成情况--表格
  const nextweekHomework = () => {
    dispatch({
      type: 'thisweekly/nextweekHomework'
    })
  }

  const defaultTime = () => {
    //  周统计
    starttime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD HH:mm:ss');
    endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
    endTime = `${endTime} 00:00:00`;
  }

  const startdisabledDate = (current) => {
    return current > moment().subtract('days', 6)
  }

  const onChange = (date, dateString) => {
    starttime = dateString;
    endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
    setFieldsValue({ time2: moment(endTime) });
  }

  const endonChange = (date, dateString) => {
    endTime = dateString;
    starttime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setFieldsValue({ time1: moment(starttime) })
  }

  const enddisabledDate = (current) => {
    return current > moment().endOf('day')
  }

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      softReportform();
    }
  }, [files]);

  // 上传删除附件触发特定表单保存
  useEffect(() => {
    switch (tableIndex) {
      case '1':
        console.log(1)
        break;
    
      default:
        break;
    }
  }, [tableIndex]);
  
  // 上传删除附件触发保存
  useEffect(() => {
    maintenanceTable();
    developmentTable();
    submitdevelopmentData();
    serviceCompletionfirst();
    serviceCompletiontwo();
    serviceCompletionthree();
    thisWeekitsm();
    completionfirstlyTable();
    completionsecondTable();
    remainingDefects();
    lastweekHomework();
    nextweekHomework();
    defaultTime();
  }, []);

  const handleBack = () => {
    router.push('/ITSM/operationreport/weeklyreport/myweeklyreport');
  }

  //  保存第一表格的数据
  const handleSavethisweek = (saveParams) => {
    console.log('saveParams: ', saveParams);
  }

  //  保存第二表格

  const handleSavedevelopment = (saveParams,rowId,params) => {
    console.log('params: ', params);
    // console.log('saveParams: ', saveParams);
    // console.log('rowId: ', rowId);
    // console.log('params: ', params);
  }

  // 删除数据
  const handleDelete = (deleteId) => {
    console.log('deleteId: ', deleteId);

  }



  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button type='primary'>导出</Button>
          <Button type='primary' onClick={softReportform}>保存</Button>
          <Button type='primary' onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card>
        {/* 一本周运维情况综述 */}
        {
          loading === false && (
            <>
              <Form {...formItemLayout}>
                <Row>
                  <Col span={8}>
                    <Form.Item label='周报名称'>
                      {getFieldDecorator('params1', {
                        rules: [
                          {
                            required,
                            message: '请输入周报名称'
                          }
                        ]
                      })
                        (
                          <Input />
                        )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={8}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: moment(starttime)
                      })(<DatePicker
                        allowClear={false}
                        disabledDate={startdisabledDate}
                        // placeholder='请选择'
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('time2', {
                          initialValue: moment(endTime)
                        })
                          (<DatePicker
                            allowClear={false}
                            disabledDate={enddisabledDate}
                            onChange={endonChange}
                          />)
                      }
                    </Form.Item>
                  </Col>
                </Row>


                {/* <p></p> */}


                {/* <p style={{ display: 'inline', marginRight: 8 }}>-</p> */}



              </Form>
              < ThisweekMaintenance
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                ref={saveformRef}
                maintenanceList={maintenanceList}
                handleSavethisweek={(newValue => handleSavethisweek(newValue))}
                files={[]}
                ChangeFiles={(newvalue) => {
                  setFiles(newvalue);
                }}
              />

              {/* 二、常规运维工作开展情况 */}
              <Development
                forminladeLayout={forminladeLayout}
                developmentList={developmentList}
                submitdevelopmentlist={submitdevelopmentlist}
                ref={developmentformRef}
                handleSavedevelopment={(newValue,editId,params) => handleSavedevelopment(newValue,editId,params)}
                handleDelete={(deleteId => handleDelete(deleteId))}
                ChangeFiles={(newvalue) => {
                  setFiles(newvalue)
                }}
                getTableindex={index => setTableIndex(index)}
              />

              {/* 三、运维服务指标完成情况 */}
              <ServiceCompletion
                forminladeLayout={forminladeLayout}
                serviceCompletionlist={serviceCompletionlist}
                serviceCompletionsecondlist={serviceCompletionsecondlist}
                serviceCompletionthreelist={serviceCompletionthreelist}
              />

              {/* 四、本周事件、问题及故障 */}
              <ThisWeekitsm
                forminladeLayout={forminladeLayout}
                thisWeekitsmlist={thisWeekitsmlist}
              />

              {/* 五、软件作业完成情况 */}
              <SoftCompletion
                forminladeLayout={forminladeLayout}
                softCompletionlist={softCompletionlist}
                completionsecondTablelist={completionsecondTablelist}
              />

              {/* 六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件）六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件） */}
              <RemainingDefects
                forminladeLayout={forminladeLayout}
                remainingDefectslist={remainingDefectslist}
              />

              {/* 七、上周作业完成情况 */}
              <LastweekHomework
                forminladeLayout={forminladeLayout}
                lastweekHomeworklist={lastweekHomeworklist}
              />

              <NextweekHomework
                forminladeLayout={forminladeLayout}
                nextweekHomeworklist={nextweekHomeworklist}
              />

            </>
          )
        }


      </Card>
    </PageHeaderWrapper>

  )
}

export default Form.create({})(
  connect(({ thisweekly, loading }) => ({
    maintenanceList: thisweekly.maintenanceList,
    developmentList: thisweekly.developmentList,
    submitdevelopmentlist: thisweekly.submitdevelopmentlist,
    serviceCompletionlist: thisweekly.serviceCompletionlist,
    serviceCompletionsecondlist: thisweekly.serviceCompletionsecondlist,
    serviceCompletionthreelist: thisweekly.serviceCompletionthreelist,
    thisWeekitsmlist: thisweekly.thisWeekitsmlist,
    softCompletionlist: thisweekly.softCompletionlist,
    completionsecondTablelist: thisweekly.completionsecondTablelist,
    remainingDefectslist: thisweekly.remainingDefectslist,
    lastweekHomeworklist: thisweekly.lastweekHomeworklist,
    nextweekHomeworklist: thisweekly.nextweekHomeworklist,
    loading: loading.models.thisweekly,
  }))(SoftReport),
);
