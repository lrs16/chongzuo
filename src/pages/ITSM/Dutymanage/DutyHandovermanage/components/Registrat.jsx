import React, {
  useState,
  useEffect,
  forwardRef, useImperativeHandle
} from 'react';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import { Row, Col, Form, Input, DatePicker, Select, Card, message } from 'antd';

// const RadioGroup = Radio.Group; Radio, 
const { TextArea } = Input;
const { Option } = Select;


const forItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
  labelAlign: 'right',
};

const Registrat = forwardRef((props, ref) => {
  const {
    formrecord,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
      setFieldsValue
    },
    forminladeLayout,
    currentUserarr,
    shiftinfo,
    files,
    ChangeFiles,
  } = props;
  const [shiftList, setShiftList] = useState([]);
  const [fileslist, setFilesList] = useState([]);

  console.log(formrecord.dutyStaffName,'fff');
  console.log(sessionStorage.getItem('userName'),'lplp')

  const [time, setTime] = useState({
    startValue: null,
    endValue: null,
    endOpen: false,
  })

  const required = true;

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  // const onChange = (checked) => {
  //   console.log(`switch to ${checked}`);
  // }

  const disabledStartDate = startValue => {
    const { endValue } = time;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = endValue => {
    const { startValue } = time;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  const onChange = (field, value) => {
    const obj = time;
    switch (field) {
      case 'startValue':
        obj.startValue = value;
        setTime(obj);
        break;
      case 'endValue':
        obj.endValue = value;
        setTime(obj);
        break;
      default:
        break;
    }
  };
  const onStartChange = value => {
    onChange('startValue', value);
  };

  const onEndChange = value => {
    onChange('endValue', value);
  };

  const handleEndOpenChange = open => {
    console.log(11)
    const obj = time;
    obj.endOpen = open
    setTime(obj);
  };

  const handleStartOpenChange = open => {
    if (!open) {
      const obj = time;
      obj.endOpen = true;
      setTime(obj);
    }
  };

  const handleChange = (value, option, type) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const { values,id,beginTime, endTime } = option.props;
    const start = `${currentDate} ${beginTime}`;
    const end = `${currentDate} ${endTime}`;
    switch (type) {
      case 'shiftName':
        setFieldsValue(
          {
            dutyBeginTime: moment(start),
            dutyEndTime: moment(end),
            shiftId: id,
          }
        );
        break;
      default:
        break;
    }

  }

  return (
    <Row gutter={24}>
      <Form {...forItemLayout} >
        <Card title="值班日志信息" bordered={false}>
          <Col span={8}>
            <Form.Item label="值班日志编号">
              {getFieldDecorator('logbookNo', {
                initialValue: formrecord.logbookNo,
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="值班班组" >
              {getFieldDecorator('groupName', {
                initialValue: currentUserarr.groupName || formrecord.groupName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Form.Item label="值班班组id" style={{ display: 'none' }}>
            {getFieldDecorator('groupId', {
              initialValue: currentUserarr.groupId || formrecord.groupId,
            })(<Input disabled />)}
          </Form.Item>

          <Col span={8}>
            <Form.Item label="值班班次">
              {getFieldDecorator('shiftName', {
                initialValue: formrecord.shiftName,
              })(
                <Select placeholder="请选择" onChange={(value, option) => handleChange(value, option, 'shiftName')}>
                  {(shiftinfo || []).map((obj, index) => [
                    <Option
                      key={obj.id}
                      values={obj.shiftName}
                      beginTime={obj.beginTime}
                      endTime={obj.endTime}
                      id={obj.id}
                    >
                      {obj.shiftName}
                    </Option>
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>

          <Form.Item label="值班班次id" style={{ display: 'none' }}>
            {getFieldDecorator('shiftId', {
              initialValue: formrecord.shiftId,
            })(
              <Input disabled />
            )}
          </Form.Item>

          <Col span={8}>
            <Form.Item label="值班时间" >
              <Row>
                <Col span={11}>
                  {getFieldDecorator('dutyBeginTime', {
                    rules: [{ required, }],
                    initialValue: formrecord.dutyBeginTime ? moment( formrecord.dutyBeginTime):'',
                  })(
                    <DatePicker
                      disabledDate={disabledStartDate}
                      onChange={onStartChange}
                      onOpenChange={handleStartOpenChange}
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('00:00:00', 'HH:mm:ss'),
                      }}
                      value={time.startValue}
                      placeholder="开始时间"
                      format='YYYY-MM-DD HH:mm:ss'
                      style={{ minWidth: 120, width: '100%' }}
                    />
                  )}
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                <Col span={11}>
                  {getFieldDecorator('dutyEndTime', {
                    rules: [{ required, }],
                    initialValue:  formrecord.dutyEndTime ? moment( formrecord.dutyEndTime):'',
                  })(
                    <DatePicker
                      disabledDate={disabledEndDate}
                      onChange={onEndChange}
                      open={time.endOpen}
                      onOpenChange={handleEndOpenChange}
                      value={time.endValue}
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('23:59:59', 'HH:mm:ss'),
                      }}
                      placeholder="结束时间"
                      format='YYYY-MM-DD HH:mm:ss'
                      style={{ minWidth: 120, width: '100%' }}
                    />
                  )}
                </Col>
              </Row>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="值班人">
              {getFieldDecorator('dutyStaffName', {
                rules: [
                  {
                    required,
                    message: '请选择值班人',
                  },
                ],
                initialValue: formrecord.dutyStaffName  || sessionStorage.getItem('userName'),
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>

          <Form.Item label="值班人" style={{ display: 'none' }}>
            {getFieldDecorator('dutyUserId', {
              initialValue: formrecord.dutyUserId || currentUserarr.userId,
            })(
              <Input disabled />
            )}
          </Form.Item>

          <Col span={8}>
            <Form.Item label="日志登记时间">
              {getFieldDecorator('registerTime', {
                initialValue: formrecord.registerTime ? moment(formrecord.registerTime) : moment(new Date()),
              })(<DatePicker
                placeholder="请输入"
                allowClear
                disabled
              />)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="巡检及监控记录" {...forminladeLayout}>
              {getFieldDecorator('monitorNotes', {
                rules: [{
                  required,
                  message: '请输入巡检及监控记录'
                }],
                initialValue: formrecord.monitorNotes
              })(
                <TextArea
                  rows={4}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="重大运维事件" {...forminladeLayout}>
              {getFieldDecorator('devopsNotes', {
                rules: [
                  {
                    required,
                    message: '请输入重大运维事件'
                  }
                ],
                initialValue: formrecord.devopsNotes
              })(
                <TextArea
                  rows={4}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="异常情况记录" {...forminladeLayout}>
              {getFieldDecorator('alarmNotes', {
                rules: [
                  {
                    required,
                    message: '请输入异常情况记录'
                  }
                ],
                initialValue: formrecord.alarmNotes
              })(
                <TextArea rows={4} />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="其他情况记录" {...forminladeLayout}>
              {getFieldDecorator('otherNotes', {
                rules: [
                  {
                    required,
                    message: '请填写其他情况记录'
                  }
                ],
                initialValue: formrecord.otherNotes
              })(
                <TextArea rows={4} />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="上传附件"  {...forminladeLayout}>
              {getFieldDecorator('attachment', {
                 initialValue: formrecord.attachment
              })(
                <div style={{ width: 400 }}>
                  <SysUpload
                    fileslist={files}
                    ChangeFileslist={newvalue => setFilesList(newvalue)}
                  />
                </div>,
              )}
            </Form.Item>
          </Col>
        </Card>


        <Card title='交接班信息' bordered={false}>
          <Col span={8}>
            <Form.Item label="交班人">
              {getFieldDecorator('handoverName', {
                initialValue: formrecord.handoverName || sessionStorage.getItem('userName'),
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接班人">
              {getFieldDecorator('heirId', {
                rules: [
                  {
                    required,
                    message: '请选择接班人'
                  }
                ]
                // initialValue: moment(new Date()),
              })(
                <Input />
              )}
            </Form.Item>
          </Col>

          <Form.Item label="接班人" style={{display:'none'}}>
              {getFieldDecorator('handoverId', {
                initialValue: formrecord.addUserId,
              })(
                <Input />
              )}
            </Form.Item>
          
          <Col span={8}>
            <Form.Item label="接班班组">
              {getFieldDecorator('heirGroupName', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接班班次">
              {getFieldDecorator('heirShiftName', {
                // initialValue: moment(new Date()),
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="交班时间">
              {getFieldDecorator('handoverTime', {
                initialValue: moment(new Date()),
              })(
                <DatePicker
                  disabled
                  showTime
                  format="YYYY-MM-DD hh:mm:ss"
                  style={{ width: '100%' }}
                  allowClear />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="交接物品">
              {getFieldDecorator('handoverItems', {
                // initialValue: moment(new Date()),
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需注意事项" {...forminladeLayout}>
              {getFieldDecorator('attention', {
              })(
                <TextArea rows={4} />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="交接状态">
              {getFieldDecorator('handoverStatus', {
                initialValue: '',
              })(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接班时间">
              {getFieldDecorator('receiveTime', {
                initialValue: moment(new Date()),
              })(
                <DatePicker
                  disabled
                  showTime
                  format="YYYY-MM-DD hh:mm:ss"
                  style={{ width: '100%' }}
                  allowClear />
              )}
            </Form.Item>
          </Col>
        </Card>

      </Form>
    </Row >
  );
});

Registrat.defaultProps = {
  formrecord: {
    logbookNo:'',
    groupName:'',
    groupId:'',
    shiftName:'',
    shiftId:'',
    dutyBeginTime:'',
    dutyEndTime:'',
    dutyUserId:'',
    registerTime:'',
    monitorNotes:'',
    devopsNotes:'',
    alarmNotes:'',
    otherNotes:'',
    attachment:'',
    handoverName:'',
    heirId:'',
    handoverId:'',
    heirGroupName:'',
    heirShiftName:'',
    handoverTime:'',
    handoverItems:'',
    attention:'',
    handoverStatus:'',
    receiveTime:'',
    dutyStaffName: sessionStorage.getItem('userName'),
    addUserId: sessionStorage.getItem('userauthorityid'),
  },
}

export default Form.create()(Registrat);