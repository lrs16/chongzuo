import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import { Row, Col, Form, Input, DatePicker, Select, Card } from 'antd';
import SysDict from '@/components/SysDict';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import FormTextArea from '../../../OperationPlan/components/FormTextArea';

import styles from '../index.less';

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
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue },
    forminladeLayout,
    currentUserarr,
    shiftinfo,
    successioninfo,
    statue,
    files,
    ChangeFiles,
    type,
    loading
  } = props;

  const [fileslist, setFilesList] = useState([]);
  const [selectdata, setSelectData] = useState('');

  const [time, setTime] = useState({
    startValue: null,
    endValue: null,
    endOpen: false,
  });

  const required = true;

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  useImperativeHandle(
    ref,
    () => ({
      getVal: () => getFieldsValue(),
      resetVal: () => resetFields(),
      Forms: props.form.validateFieldsAndScroll,
    }),
    [],
  );

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
    obj.endOpen = open;
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
    const nextDate = moment()
      .add(1, 'd')
      .format('YYYY-MM-DD');
    let end;
    const { id, begintime, endtime, userid, groupId } = option.props;
    const start = `${currentDate} ${begintime}`;
    if (
      moment(new Date())
        .format(`YYYY-MM-DD ${begintime}`)
        .valueOf() >
      moment(new Date())
        .format(`YYYY-MM-DD ${endtime}`)
        .valueOf()
    ) {
      end = `${nextDate} ${endtime}`;
    } else {
      end = `${currentDate} ${endtime}`;
    }
    switch (types) {
      case 'shiftName':
        setFieldsValue({
          dutyBeginTime: moment(start),
          dutyEndTime: moment(end),
          shiftId: id,
          dutyStaffId: groupId,
          dutyUserId: userid,
        });
        break;
      case 'heirName':
        setFieldsValue({
          heirName: value,
          heirId: id,
          heirUserId: userid,
        });
        break;
      case 'heirShiftName':
        setFieldsValue({
          heirShiftName: value,
          // heirUserId: userId
        });
        break;
      default:
        break;
    }
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const handoveritems = getTypebyTitle('交接物品');

  return (
    <Row gutter={24} >
      <SysDict
        typeid='1021'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <div className='noexplain'>
        <div className={styles.headcolor}>
          <div className={styles.allowClearicon}>
            <Form {...forItemLayout}>
              {type && (
                <Card title="接班说明" bordered={false}>
                  <Col span={24} style={{ marginTop: 4 }}>
                    <Form.Item label="接班说明" {...forminladeLayout}>
                      {getFieldDecorator('receiveRemark', {
                        rules: [
                          {
                            required,
                            message: '请输入接班说明',
                          },
                        ],
                        initialValue: formrecord.receiveRemark,
                      })(
                        <FormTextArea
                          autoSize={1}
                          indexText={formrecord.receiveRemark}
                          isEdit={type === 'listButton'}
                          getVal={v => setFieldsValue({ receiveRemark: v })}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Card>
              )}

              <Card title="值班日志信息" bordered={false}>
                <Col span={8}>
                  <Form.Item label="值班日志编号">
                    {getFieldDecorator('logbookNo', {
                      initialValue: formrecord.logbookNo,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="值班班组">
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
                  <Form.Item label="日志登记时间">
                    {getFieldDecorator('registerTime', {
                      initialValue: formrecord.registerTime
                        ? moment(formrecord.registerTime)
                        : moment(new Date()),
                    })(
                      <DatePicker
                        placeholder="请输入"
                        format="YYYY-MM-DD HH:mm:ss"
                        allowClear
                        disabled
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Form.Item label="值班班次id" style={{ display: 'none' }}>
                  {getFieldDecorator('shiftId', {
                    initialValue: formrecord.shiftId,
                  })(<Input disabled />)}
                </Form.Item>

                <Col span={8}>
                  <Form.Item label="值班班次">
                    {getFieldDecorator('shiftName', {
                      rules: [
                        {
                          required,
                          message: '请选择值班班次',
                        },
                      ],
                      initialValue: formrecord.shiftName,
                    })(
                      <Select
                        placeholder="请选择"
                        onChange={(value, option) => handleChange(value, option, 'shiftName')}
                        disabled={statue}
                      >
                        {(shiftinfo || []).map((obj) => [
                          <Option
                            key={obj.id}
                            value={obj.shiftName}
                            begintime={obj.beginTime}
                            endtime={obj.endTime}
                            groupId={obj.groupId}
                          >
                            {obj.shiftName}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="值班时间">
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('dutyBeginTime', {
                          initialValue: formrecord.dutyBeginTime ? moment(formrecord.dutyBeginTime) : undefined,
                        })(
                          <DatePicker
                            disabled
                            allowClear
                            disabledDate={disabledStartDate}
                            onChange={onStartChange}
                            onOpenChange={handleStartOpenChange}
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: moment('00:00:00', 'HH:mm:ss'),
                            }}
                            // value={time.startValue}
                            placeholder="开始时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ minWidth: 120, width: '100%' }}
                          />,
                        )}
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        -
                      </Col>
                      <Col span={11}>
                        {getFieldDecorator('dutyEndTime', {
                          initialValue: formrecord.dutyEndTime ? moment(formrecord.dutyEndTime) : undefined,
                        })(
                          <DatePicker
                            allowClear
                            disabled
                            disabledDate={disabledEndDate}
                            onChange={onEndChange}
                            open={time.endOpen}
                            onOpenChange={handleEndOpenChange}
                            // value={time.endValue}
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: moment('23:59:59', 'HH:mm:ss'),
                            }}
                            placeholder="结束时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ minWidth: 120, width: '100%' }}
                          />,
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
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Form.Item label="值班人" style={{ display: 'none' }}>
                  {getFieldDecorator('dutyUserId', {
                    initialValue: formrecord.dutyUserId || (currentUserarr && currentUserarr.userId),
                  })(<Input disabled />)}
                </Form.Item>

                <Col span={24} style={{ marginTop: 4 }}>
                  <Form.Item label="巡检及监控记录" {...forminladeLayout}>
                    {getFieldDecorator('monitorNotes', {
                      rules: [
                        {
                          required,
                          message: '请输入巡检及监控记录',
                        },
                      ],
                      initialValue: formrecord.monitorNotes,
                    })(
                      <FormTextArea
                        autoSize={1}
                        indexText={formrecord.monitorNotes}
                        isEdit={!statue}
                        getVal={v => setFieldsValue({ monitorNotes: v })}
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
                          message: '请输入重大运维事件',
                        },
                      ],
                      initialValue: formrecord.devopsNotes,
                    })(
                      <FormTextArea
                        autoSize={1}
                        indexText={formrecord.devopsNotes}
                        isEdit={!statue}
                        getVal={v => setFieldsValue({ devopsNotes: v })}
                      />)}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="异常情况记录" {...forminladeLayout}>
                    {getFieldDecorator('alarmNotes', {
                      rules: [
                        {
                          required,
                          message: '请输入异常情况记录',
                        },
                      ],
                      initialValue: formrecord.alarmNotes,
                    })(<FormTextArea
                      autoSize={1}
                      indexText={formrecord.alarmNotes}
                      isEdit={!statue}
                      getVal={v => setFieldsValue({ alarmNotes: v })}
                    />)}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="其他情况记录" {...forminladeLayout}>
                    {getFieldDecorator('otherNotes', {
                      rules: [
                        {
                          required,
                          message: '请填写其他情况记录',
                        },
                      ],
                      initialValue: formrecord.otherNotes,
                    })(<FormTextArea
                      autoSize={1}
                      indexText={formrecord.otherNotes}
                      isEdit={!statue}
                      getVal={v => setFieldsValue({ otherNotes: v })}
                    />)}
                  </Form.Item>
                </Col>

                {!statue && loading === false && (
                  <Col span={24}>
                    <Form.Item label="上传附件" {...forminladeLayout}>
                      {getFieldDecorator('attachment', {
                        initialValue: formrecord.attachment || [],
                      })(
                        <div>
                          <SysUpload
                            fileslist={files}
                            ChangeFileslist={newvalue => setFilesList(newvalue)}
                          />
                        </div>,
                      )}
                    </Form.Item>
                  </Col>
                )}

                {statue && (
                  <Col span={24}>
                    <Form.Item label="上传附件" {...forminladeLayout}>
                      {getFieldDecorator('attachment', {
                        initialValue: formrecord.attachment,
                      })(
                        <span style={{ color: 'blue', textDecoration: 'underline' }}>
                          {formrecord && formrecord.attachment && (
                            <Downloadfile files={formrecord.attachment} />
                          )}
                        </span>,
                      )}
                    </Form.Item>
                  </Col>
                )}
              </Card>

              <Card title="交接班信息" bordered={false}>
                <Col span={8}>
                  <Form.Item label="交班人">
                    {getFieldDecorator('handoverName', {
                      initialValue: formrecord.handoverName || sessionStorage.getItem('userName'),
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="接班人">
                    {getFieldDecorator('heirName', {
                      rules: [
                        {
                          required,
                          message: '请选择接班人',
                        },
                      ],
                      initialValue: formrecord.heirName,
                    })(
                      <Select
                        disabled={statue}
                        placeholder="请选择"
                        onChange={(value, option) => handleChange(value, option, 'heirName')}
                        getPopupContainer={e => e.parentNode}
                      >
                        {(successioninfo || []).map((obj) => [
                          <Option key={obj.id} value={obj.heirName} userid={obj.userId}>
                            {obj.heirName}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Form.Item label="接班人" style={{ display: 'none' }}>
                  {getFieldDecorator('heirId', {
                    initialValue: formrecord.heirId,
                  })(<Input disabled={statue} />)}
                </Form.Item>

                <Form.Item label="接班人" style={{ display: 'none' }}>
                  {getFieldDecorator('heirUserId', {
                    initialValue: formrecord.heirUserId,
                  })(<Input />)}
                </Form.Item>

                <Col span={8}>
                  <Form.Item label="接班班组">
                    {getFieldDecorator('heirGroupName', {
                      initialValue: (currentUserarr && currentUserarr.groupName) || formrecord.groupName,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item label="接班班组">
                    {getFieldDecorator('heirGroupId', {
                      initialValue: (currentUserarr && currentUserarr.groupId) || formrecord.heirGroupId,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="接班班次">
                    {getFieldDecorator('heirShiftName', {
                      rules: [
                        {
                          required,
                          message: '请选择接班班次',
                        },
                      ],
                      initialValue: formrecord.heirShiftName,
                    })(
                      <Select
                        disabled={statue}
                        placeholder="请选择"
                        getPopupContainer={e => e.parentNode}
                        onChange={(value, option) => handleChange(value, option, 'heirShiftName')}
                      >
                        {(shiftinfo || []).map((obj) => [
                          <Option key={obj.id} value={obj.shiftName}>
                            {obj.shiftName}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="交班时间">
                    {getFieldDecorator('handoverTime', {
                      initialValue: formrecord.handoverTime
                        ? moment(formrecord.handoverTime)
                        : moment(new Date()),
                    })(
                      <DatePicker
                        disabled
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="交接物品" {...forminladeLayout}>
                    {getFieldDecorator('handoverItems', {
                      rules: [
                        {
                          required,
                          message: '请选择交接物品',
                        },
                      ],
                      initialValue: formrecord.handoverItems && (formrecord.handoverItems).split(',') || undefined,
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
                      rules: [
                        {
                          required,
                          message: '请输入需注意事项',
                        },
                      ],
                      initialValue: formrecord.attention,
                    })(<FormTextArea
                      autoSize={1}
                      indexText={formrecord.attention}
                      isEdit={!statue}
                      getVal={v => setFieldsValue({ attention: v })}
                    />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="交接状态">
                    {getFieldDecorator('handoverStatus', {
                      initialValue: formrecord.handoverStatus,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="接班时间">
                    {getFieldDecorator('receiveTime', {
                      initialValue: formrecord.receiveTime
                        ? moment(formrecord.receiveTime)
                        : moment(new Date()),
                    })(
                      <DatePicker
                        disabled
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </Row>
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
};

export default Form.create()(Registrat);
