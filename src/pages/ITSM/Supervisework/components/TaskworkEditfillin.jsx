import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Tag } from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import FormTextArea from '@/components/FormTextArea'; // 文本域收缩: 默认展示一行

const { Option } = Select;

const categorymaps = [
  { key: '0', title: '硬件运维' },
  { key: '1', title: '软件运维' },
  { key: '2', title: '功能开发' },
  { key: '3', title: '新电力' },
  { key: '4', title: '实用化指标' },
  { key: '5', title: '其他' },
];

const TaskworkEditfillin = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue },
    formItemLayout,
    forminladeLayout,
    useInfo,
    files,
    ChangeFiles,
    main,
    type,
    status,
    superviseworkPersonSelect,
    location,
    timeVisivle,
  } = props;

  const statusContent = ['计划中', '延期中', '已超时', '已完成'];
  const color = ['blue', 'orange', 'red', 'green'];
  const [fileslist, setFilesList] = useState([]);
  const [startdates, setStartDates] = useState(undefined);
  const [enddates, setEndDates] = useState(undefined);

  // 选择计划开始时间
  const onStartChange = dateString => {
    setStartDates(dateString);
    setFieldsValue({ main_plannedStartTime: dateString });
  };

  // 选择计划结束时间
  const onEndChange = dateString => {
    setEndDates(dateString);
    setFieldsValue({ main_plannedEndTime: dateString });
  };

  // 开始时间限制
  // const disastartbledDate = (current) => {
  //     return current && current > moment();
  // }
  // // // 结束时间限制
  // const disaendbledDate = (current) => {
  //     return current && current < moment() && startdates && current < startdates;
  // }

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      getVal: () => getFieldsValue(),
      resetVal: () => resetFields(),
      Forms: props.form.validateFieldsAndScroll,
      attRef,
    }),
    [],
  );

  const selectOnchange = (value, option) => {
    const optionkey = option.map(item => {
      return item.key;
    });
    setFieldsValue({
      main_workUser: value,
      main_workUserId: optionkey,
    });
  };

  const required = true;

  const disabledendDate = current => {
    // 延期审核时间大于结束时间
    return current && current < moment(main.plannedEndTime);
  };

  const newplannedEndTime =
    main.plannedEndTime !== undefined ? main.plannedEndTime : moment().add(1, 'days'); // 延期审核时间

  return (
    <div style={{ paddingRight: 24 }}>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="表单id" style={{ display: 'none' }}>
              {getFieldDecorator('main_id', {
                initialValue: '',
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="工作任务编号">
              {getFieldDecorator('main_no', {
                initialValue: main.no,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="填报时间">
              {getFieldDecorator('main_addTime', {
                initialValue: moment(new Date()),
              })(
                <DatePicker
                  disabled
                  showTime
                  format="YYYY-MM-DD hh:mm:ss"
                  style={{ width: '100%' }}
                  allowClear
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="工作状态">
              {getFieldDecorator(
                'main_status',
                {},
              )(
                <Tag color={status ? color[statusContent.indexOf(status)] : 'blue'}>
                  {status || '计划中'}
                </Tag>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="督办类别">
              {getFieldDecorator('type', {
                rules: [
                  {
                    required,
                    message: '请选择督办类别',
                  },
                ],
                initialValue: main.type,
              })(
                <Select placeholder="请选择" allowClear>
                  {categorymaps.map(obj => (
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          {superviseworkPersonSelect && superviseworkPersonSelect.length && (
            <Col span={8}>
              <Form.Item label="工作负责人">
                {getFieldDecorator('main_workUser', {
                  rules: [
                    {
                      required,
                      message: '请输入工作负责人',
                    },
                  ],
                  initialValue: main && main.workUser ? main.workUser.split(',') : [],
                })(
                  <Select
                    mode="multiple"
                    showArrow
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    placeholder="请选择工作负责人"
                    onChange={selectOnchange}
                    disabled={type === 'delay'}
                  >
                    {superviseworkPersonSelect.map(obj => [
                      <Option key={obj.key} value={obj.value}>
                        {obj.value}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="工作负责人Id" style={{ display: 'none' }}>
                {getFieldDecorator('main_workUserId', {
                  initialValue: main.workUserId,
                })(
                  <Select
                    onChange={selectOnchange}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    mode="multiple"
                    showArrow
                    placeholder="请选择工作负责人id"
                  >
                    {superviseworkPersonSelect.map(obj => [
                      <Option key={obj.key} value={obj.value}>
                        {obj.value}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={24} style={{ marginTop: 4, marginBottom: '-10px' }}>
            <Form.Item label="工作内容" {...forminladeLayout}>
              {getFieldDecorator('main_content', {
                rules: [{ required, message: '请输入工作内容' }, {}],
                initialValue: main.content,
              })(
                <FormTextArea
                  autoSize={1}
                  indexText={main.content}
                  isEdit={type !== 'delay'}
                  getVal={v => setFieldsValue({ main_content: v })}
                  key={main.content}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计划开始时间">
              {getFieldDecorator('main_plannedStartTime', {
                rules: [
                  {
                    required,
                    message: '请输入计划开始时间',
                  },
                ],
                initialValue: main.plannedStartTime ? moment(main.plannedStartTime) : startdates,
              })(
                <>
                  {timeVisivle && (
                    <DatePicker
                      disabled={type}
                      allowClear={false}
                      onChange={onStartChange}
                      // disabledDate={disastartbledDate}
                      defaultValue={
                        main.plannedStartTime ? moment(main.plannedStartTime) : startdates
                      }
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  )}
                </>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计划结束时间">
              {getFieldDecorator('main_plannedEndTime', {
                rules: [
                  {
                    required,
                    message: '请输入计划结束时间',
                  },
                ],
                initialValue: main.plannedEndTime ? moment(main.plannedEndTime) : enddates,
              })(
                <>
                  {timeVisivle && (
                    <DatePicker
                      disabled={type}
                      onChange={onEndChange}
                      showTime
                      allowClear={false}
                      format="YYYY-MM-DD HH:mm:ss"
                      defaultValue={main.plannedEndTime ? moment(main.plannedEndTime) : enddates}
                      // disabledDate={disaendbledDate}
                    />
                  )}
                </>,
              )}
            </Form.Item>
          </Col>
          {type !== '计划中' && type && (
            <Col span={8}>
              <Form.Item label="延期结束时间">
                {getFieldDecorator('plannedEndTime', {
                  rules: [
                    {
                      required,
                      message: '请输入延期结束时间',
                    },
                  ],
                  initialValue: moment(newplannedEndTime),
                })(
                  <>
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={disabledendDate}
                      defaultValue={moment(newplannedEndTime)}
                      onChange={v => {
                        setFieldsValue({ plannedEndTime: moment(v) });
                      }}
                    />
                  </>,
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {getFieldDecorator('main_fileIds', {
                initialValue: main && main.fileIds ? main.fileIds : '',
              })(
                // 位置已调
                <div>
                  {location && (!location.state || (location.state && !location.state.cache)) && (
                    <SysUpload
                      disabled={type === 'delay'}
                      fileslist={files}
                      ChangeFileslist={newvalue => setFilesList(newvalue)}
                    />
                  )}
                </div>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="填报人">
              {getFieldDecorator('main_addUser', {
                initialValue: useInfo.userName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="填报单位">
              {getFieldDecorator('main_addUnit', {
                initialValue: useInfo.unitName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

TaskworkEditfillin.defaultProps = {
  main: {
    no: '',
    workUser: '',
    addUnit: '',
    addUser: '',
    content: '',
    plannedStartTime: undefined,
    plannedEndTime: undefined,
    status: '',
    type: '',
  },
  useInfo: {
    userName: '',
    unitName: '',
  },
};

export default Form.create({})(TaskworkEditfillin);
