import React, {
  useState,
  forwardRef, useImperativeHandle
} from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, DatePicker, Switch, Card, message } from 'antd';

// const RadioGroup = Radio.Group; Radio, 
const { TextArea } = Input;

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
    form: { getFieldDecorator, getFieldsValue, resetFields,
      // setFieldsValue 
    },
    forminladeLayout
  } = props;
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
    console.log(234)
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

  return (
    <Row gutter={24}>
      <Form {...forItemLayout} >
        <Card title="值班日志信息" bordered={false}>
          <Col span={8}>
            <Form.Item label="值班日志编号">
              {getFieldDecorator('id', {
                initialValue: formrecord.id,
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="值班班组" >
              {getFieldDecorator('no', {
                initialValue: formrecord.no,
              })(<Input disabled />)}
            </Form.Item>
          </Col>


          <Col span={8}>
            <Form.Item label="值班班次">
              {getFieldDecorator('form1', {
                rules: [{ required, message: '请输入' }],
                initialValue: '',
              })(<Input placeholder="请输入" disabled allowClear />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="值班时间" >
              <Row>
                <Col span={11}>
                  {getFieldDecorator('time3', {
                    rules: [{ required, }],
                    initialValue: undefined,
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
                  {getFieldDecorator('time4', {
                    rules: [{ required, }],
                    initialValue: undefined,
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
              {getFieldDecorator('userStatus', {
                rules: [
                  {
                    required,
                    message: '请选择是否启用！',
                  },
                ],
              })(
                // <Switch
                //   defaultChecked
                //   onChange={v => onChange(v)}
                // />

                <Input disabled />
                // <RadioGroup>
                //   <Radio value="0">停用</Radio>
                //   <Radio value="1">启用</Radio>
                // </RadioGroup>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="日志登记时间">
              {getFieldDecorator('form2', {
                initialValue: '',
              })(<DatePicker
                placeholder="请输入"
                allowClear
                disabled
              />)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="巡检及监控记录" {...forminladeLayout}>
              {getFieldDecorator('11', {
                rules: [{
                  required,
                  message: '请输入巡检及监控记录'
                }]
              })(
                <TextArea
                  rows={4}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="重大运维事件" {...forminladeLayout}>
              {getFieldDecorator('22', {
                rules: [
                  {
                    required,
                    message: '请输入重大运维事件'
                  }
                ]
              })(
                <TextArea
                  rows={4}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="异常情况记录" {...forminladeLayout}>
              {getFieldDecorator('33', {
                rules: [
                  {
                    required,
                    message: '请输入异常情况记录'
                  }
                ]
              })(
                <TextArea rows={4} />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="其他情况记录" {...forminladeLayout}>
              {getFieldDecorator('44', {
                rules: [
                  {
                    required,
                    message: '请填写其他情况记录'
                  }
                ]
              })(
                <TextArea rows={4} />
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="上传附件">
              {getFieldDecorator('addTime', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Card>


        <Card title='交接班信息' bordered={false}>
          <Col span={8}>
            <Form.Item label="交班人">
              {getFieldDecorator('55', {
                // initialValue: moment(new Date()),
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接班人">
              {getFieldDecorator('66', {
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
          <Col span={8}>
            <Form.Item label="接班班组">
              {getFieldDecorator('77', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接班班次">
              {getFieldDecorator('88', {
                // initialValue: moment(new Date()),
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="交班时间">
              {getFieldDecorator('addTime', {
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
            <Form.Item label="接交接物品">
              {getFieldDecorator('LL', {
                // initialValue: moment(new Date()),
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需注意事项" {...forminladeLayout}>
              {getFieldDecorator('GG', {
              })(
                <TextArea rows={4} />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="交接状态">
              {getFieldDecorator('FF', {
                // initialValue: moment(new Date()),
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接班时间">
              {getFieldDecorator('addTime', {
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
    addUser: sessionStorage.getItem('userName'),
    addUserId: sessionStorage.getItem('userauthorityid'),
  },
}

export default Form.create()(Registrat);