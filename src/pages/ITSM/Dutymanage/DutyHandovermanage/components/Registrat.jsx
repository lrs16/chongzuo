import React, {
  useState,
  useEffect,
  forwardRef, useImperativeHandle
} from 'react';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import { Row, Col, Form, Input, DatePicker, Select, Card, message } from 'antd';
import SysDict from '@/components/SysDict';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import styles from '../index.less';
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
    successioninfo,
    statue,
    files,
    ChangeFiles,
    type,
  } = props;

  const [shiftList, setShiftList] = useState([]);
  const [fileslist, setFilesList] = useState([]);
  const [selectdata, setSelectData] = useState('');

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

  const handleChange = (value, option, types) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const nextDate = moment().add(1, 'd').format('YYYY-MM-DD');
    let end;
    const { values, id, beginTime, endTime, userId, groupId } = option.props;
    const start = `${currentDate} ${beginTime}`;
    if (moment(new Date()).format(`YYYY-MM-DD ${beginTime}`).valueOf() > moment(new Date()).format(`YYYY-MM-DD ${endTime}`).valueOf()) {
      end = `${nextDate} ${endTime}`;
    } else {
      end = `${currentDate} ${endTime}`;
    }
    switch (types) {
      case 'shiftName':
        setFieldsValue(
          {
            dutyBeginTime: moment(start),
            dutyEndTime: moment(end),
            shiftId: id,
            dutyStaffId: groupId,
            dutyUserId: userId

          }
        );
        break;
      case 'heirName':
        setFieldsValue(
          {
            heirName: value,
            heirId: id,
            heirUserId: userId
          }
        );
        break;
      case 'heirShiftName':
        setFieldsValue(
          {
            heirShiftName: value,
            // heirUserId: userId
          }
        );
        break;
      default:
        break;
    }
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const handoveritems = getTypebyTitle('交接物品');

  return (
    <Row gutter={24} className={styles.headcolor}>
      <SysDict
        typeid="1438058740916416514"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...forItemLayout} >
        {
          type && (
            <Card title="接班说明" bordered={false} >
              <Col span={24}>
                <Form.Item label="接班说明" {...forminladeLayout}>
                  {getFieldDecorator('receiveRemark', {
                    rules: [
                      {
                        required,
                        message: '请输入接班说明'
                      }
                    ],
                    initialValue: formrecord.receiveRemark
                  })(
                    <TextArea
                      disabled={type !== 'listButton'}
                      rows={4}
                    />
                  )}
                </Form.Item>
              </Col>
            </Card>
          )
        }

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
                initialValue: (currentUserarr && currentUserarr.groupName) || formrecord.groupName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Form.Item label="值班班组id" style={{ display: 'none' }}>
            {getFieldDecorator('groupId', {
              initialValue: (currentUserarr && currentUserarr.groupId) || formrecord.groupId,
            })(<Input disabled />)}
          </Form.Item>

          <Col span={8}>
            <Form.Item label="值班班次">
              {getFieldDecorator('shiftName', {
                rules: [
                  {
                    required,
                    message: '请选择值班班次',
                  }],
                initialValue: formrecord.shiftName,
              })(
                <Select
                  placeholder="请选择"
                  onChange={(value, option) => handleChange(value, option, 'shiftName')}
                  disabled={statue}
                >
                  {(shiftinfo || []).map((obj, index) => [
                    <Option
                      key={obj.id}
                      value={obj.shiftName}
                      beginTime={obj.beginTime}
                      endTime={obj.endTime}
                      groupId={obj.groupId}
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
                    rules: [
                      {
                        required,
                        message: '请选择值班时间',
                      }],
                    initialValue: formrecord.dutyBeginTime ? moment(formrecord.dutyBeginTime) : '',
                  })(
                    <DatePicker
                      disabled
                      allowClear={true}
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
                    rules: [{
                      required,
                      message: '请选择值班时间',
                    }],
                    initialValue: formrecord.dutyEndTime ? moment(formrecord.dutyEndTime) : '',
                  })(
                    <DatePicker
                      allowClear={true}
                      disabled
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
                initialValue: formrecord.dutyStaffName || sessionStorage.getItem('userName'),
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>

          <Form.Item label="值班人" style={{ display: 'none' }}>
            {getFieldDecorator('dutyUserId', {
              initialValue: formrecord.dutyUserId || (currentUserarr && currentUserarr.userId),
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
                format='YYYY-MM-DD HH:mm:ss'
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
                  disabled={statue}
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
                  disabled={statue}
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
                <TextArea disabled={statue} rows={4} />
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
                <TextArea disabled={statue} rows={4} />
              )}
            </Form.Item>
          </Col>

          {
            !statue && (
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
            )
          }



          {
            statue && (
              <Col span={24}>
                <Form.Item label="上传附件"  {...forminladeLayout}>
                  {getFieldDecorator('attachment', {
                    initialValue: formrecord.attachment
                  })(
                    <span style={{ color: 'blue', textDecoration: 'underline' }} >
                      {formrecord && formrecord.attachment && <Downloadfile files={formrecord.attachment} />}
                    </span>
                  )}
                </Form.Item>
              </Col>
            )
          }
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
              {getFieldDecorator('heirName', {
                rules: [
                  {
                    required,
                    message: '请选择接班人'
                  }
                ],
                initialValue: formrecord.heirName,
              })(
                <Select
                  disabled={statue}
                  placeholder="请选择"
                  onChange={(value, option) => handleChange(value, option, 'heirName')}
                  getPopupContainer={e => e.parentNode}
                >
                  {(successioninfo || []).map((obj, index) => [
                    <Option
                      key={obj.id}
                      value={obj.heirName}
                      userId={obj.userId}
                    >
                      {obj.heirName}
                    </Option>
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>

          <Form.Item label="接班人" style={{ display: 'none' }}>
            {getFieldDecorator('heirId', {
              initialValue: formrecord.heirId,
            })(
              <Input disabled={statue} />
            )}
          </Form.Item>

          <Form.Item label="接班人" style={{ display: 'none' }}>
            {getFieldDecorator('heirUserId', {
              initialValue: formrecord.heirUserId,
            })(
              <Input />
            )}
          </Form.Item>

          <Col span={8}>
            <Form.Item label="接班班组">
              {getFieldDecorator('heirGroupName', {
                initialValue: (currentUserarr && currentUserarr.groupName) || formrecord.groupName,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>

          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="接班班组">
              {getFieldDecorator('heirGroupId', {
                initialValue: (currentUserarr && currentUserarr.groupId) || formrecord.heirGroupId,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="接班班次">
              {getFieldDecorator('heirShiftName', {
                initialValue: formrecord.heirShiftName,
              })(
                <Select
                  disabled={statue}
                  placeholder="请选择"
                  getPopupContainer={e => e.parentNode}
                  onChange={(value, option) => handleChange(value, option, 'heirShiftName')}>
                  {(shiftinfo || []).map((obj, index) => [
                    <Option
                      key={obj.id}
                      value={obj.shiftName}
                    >
                      {obj.shiftName}
                    </Option>
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="交班时间">
              {getFieldDecorator('handoverTime', {
                initialValue: formrecord.handoverTime ? moment(formrecord.handoverTime) : moment(new Date()),
              })(
                <DatePicker
                  disabled
                  showTime
                  format='YYYY-MM-DD HH:mm:ss'
                  style={{ width: '100%' }}
                  allowClear />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="交接物品" {...forminladeLayout}>
              {getFieldDecorator('handoverItems', {
                initialValue: formrecord.handoverItems || undefined,
              })(
                <Select
                  mode="multiple"
                  disabled={statue}
                  placeholder="请选择"
                  allowClear
                  getPopupContainer={e => e.parentNode}
                >
                  {(handoveritems || []).map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需注意事项" {...forminladeLayout}>
              {getFieldDecorator('attention', {
                initialValue: formrecord.attention,
              })(
                <TextArea disabled={statue} rows={4} />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="交接状态">
              {getFieldDecorator('handoverStatus', {
                initialValue: formrecord.handoverStatus,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接班时间">
              {getFieldDecorator('receiveTime', {
                initialValue: formrecord.receiveTime ? moment(formrecord.receiveTime) : moment(new Date()),
              })(
                <DatePicker
                  disabled
                  showTime
                  format='YYYY-MM-DD HH:mm:ss'
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
    logbookNo: '',
    groupName: '',
    groupId: '',
    shiftName: '',
    shiftId: '',
    dutyBeginTime: '',
    dutyEndTime: '',
    dutyUserId: '',
    registerTime: '',
    monitorNotes: '',
    devopsNotes: '',
    alarmNotes: '',
    otherNotes: '',
    attachment: '',
    handoverName: '',
    heirId: '',
    handoverId: '',
    heirGroupName: '',
    heirShiftName: '',
    handoverTime: '',
    handoverItems: '',
    attention: '',
    handoverStatus: '',
    receiveTime: '',
    heirGroupId: '',
    dutyStaffName: sessionStorage.getItem('userName'),
    addUserId: sessionStorage.getItem('userauthorityid'),
  },
}

export default Form.create()(Registrat);