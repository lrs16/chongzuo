import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import Link from 'umi/link';
// import router from 'umi/router';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Upload,
  Icon,
  message,
  Radio,
  Collapse
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import SelectUser from './components/SelectUser';
// import ModelCircula from './components/ModelCircula';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const faultSource = [ // 故障来源
  { key: 0, value: '系统告警' },
  { key: 1, value: '巡检发现' }
];

const faultType = [ // 故障类型
  { key: 0, value: '系统应用' },
  { key: 1, value: '网络安全' },
  { key: 2, value: '数据库' },
  { key: 3, value: '中间件' },
  { key: 4, value: '环境/设备' },
  { key: 5, value: '软件' },
  { key: 6, value: '其他' },
];

const severity = [ // 严重程度
  { key: 0, value: '紧急' },
  { key: 1, value: '重大' },
  { key: 2, value: '一般' },
];

// const yxfw = [ // 影响范围
// { key: 0, value: '自动抄表率' },
// { key: 1, value: '服务器' },
// { key: 2, value: '数据传输' },
// { key: 3, value: '网络通道' },
// { key: 4, value: 'VNC' },
// { key: 5, value: '专变自动抄表率' },
// { key: 6, value: '费控、召测' },
// ];

const sysmodular = [ // 系统模块
  { key: 0, value: '配网采集' },
  { key: 1, value: '主网采集' },
  { key: 2, value: '终端掉线' },
  { key: 3, value: '配网档案' },
  { key: 4, value: '实用化指标' },
  { key: 5, value: '账号缺陷' },
];

// 故障登记时间 registerOccurTime
// 故障发生时间 registerTime
const registerOccurTime = new Date();
const registerTime = new Date();

function Registration(props) {
  const pagetitle = props.route.name;
  const [activeKey, setActiveKey] = useState(['1']);
  const [openModal, setOpenModal] = useState(false);
  // const [ischeck, setIscheck] = useState();
  const {
    form: { getFieldDecorator, resetFields, validateFields, },
    dispatch,
    newno, // 新的故障编号
    curruserinfo, // 获取登录用户信息
    // history,
    // saveuserid: { flowTaskId },
  } = props;

  // 接口
  const getNewno = () => { // 获取新的故障编号
    dispatch({
      type: 'fault/getFaultRegisterNo'
    });
  }

  const getCurrUserInfo = () => {  // 获取登录用户信息
    dispatch({
      type: 'fault/getCurrUserInfo'
    });
  }

  useEffect(() => {
    getNewno(); // 新的故障编号
    getCurrUserInfo(); // 获取登录用户信息
  }, []);

  const close = () => { // 关闭
    resetFields();
  };

  const callback = key => {
    setActiveKey(key);
  };

  const handleSave = () => { // 保存成功后根据后端给的流程ID跳待办里的详情
    let happentime;
    let registtime;
    validateFields((err, values) => {
      // 时间转换
      const addDateZero = (num) => {
        return (num < 10 ? `0${num}` : num);
      }
      const d = new Date(values.registerOccurTime);
      const d1 = new Date(values.registerTime);
      happentime = `${d.getFullYear()}-${addDateZero(d.getMonth() + 1)}-${addDateZero(d.getDate())} ${addDateZero(d.getHours())}:${addDateZero(d.getMinutes())}:${addDateZero(d.getMinutes())}`; // :${  addDateZero(d1.getSeconds())
      registtime = `${d1.getFullYear()}-${addDateZero(d1.getMonth() + 1)}-${addDateZero(d1.getDate())} ${addDateZero(d1.getHours())}:${addDateZero(d1.getMinutes())}:${addDateZero(d1.getMinutes())}`;
      if (!err) {
        const formValues = values;
        formValues.registerOccurTime = happentime;
        formValues.registerTime = registtime;
        // formValues.taskId = id.flowTaskId;
        formValues.editState = 'add';
        dispatch({
          type: 'fault/getSaveUserId',
          payload: { formValues }
        })
      }
    });
  }

  const normFile = e => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const required = true;

  const handleUpload = (info) => {
    // if (info.file.status !== 'uploading') {
    //   console.log("file info--->>", info.file);
    // }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功！`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败！`);
    }
  };

  const fileProps = {
    name: 'file',
    // action: fileUrl,
    action: '',
    accept: '',
    multiple: false,
    withCredentials: true,
    onChange: handleUpload,
  }

  const faultcircula = () => { // 流转
    let happentime;
    let registtime;
    validateFields((err, values) => {
      // 时间转换
      const addDateZero = (num) => {
        return (num < 10 ? `0${num}` : num);
      }
      const d = new Date(values.registerOccurTime);
      const d1 = new Date(values.registerTime);
      happentime = `${d.getFullYear()}-${addDateZero(d.getMonth() + 1)}-${addDateZero(d.getDate())} ${addDateZero(d.getHours())}:${addDateZero(d.getMinutes())}:${addDateZero(d.getMinutes())}`; // :${  addDateZero(d1.getSeconds())
      registtime = `${d1.getFullYear()}-${addDateZero(d1.getMonth() + 1)}-${addDateZero(d1.getDate())} ${addDateZero(d1.getHours())}:${addDateZero(d1.getMinutes())}:${addDateZero(d1.getMinutes())}`;
      if (!err) {
        setOpenModal(true);
        const formValues = values;
        formValues.registerOccurTime = happentime;
        formValues.registerTime = registtime;
        // formValues.taskId = id.flowTaskId;
        formValues.editState = 'add';
        formValues.registerEffect = String(formValues.registerEffect);
        dispatch({
          type: 'fault/getSaveUserId1',
          payload: { formValues }
        })
      }
    });
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card style={{ textAlign: 'right' }}>
        <Button type="primary" style={{ marginRight: 8 }} onClick={handleSave}>
          保存
            </Button>
        <SelectUser handleSubmit={() => faultcircula()} visible={openModal}>
          <Button type="primary" style={{ marginRight: 8 }}>流转</Button>
        </SelectUser>
        <Button type="default" onClick={close}>关闭</Button>
      </Card>
      <div className={styles.collapse}>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          style={{ marginTop: '-25px' }}
          onChange={callback}
        >
          <Panel header="故障登记" key="1">
            <Form {...formItemLayout}>
              <Row gutter={24}>
                <Col xl={8} xs={12}>
                  <Form.Item label="故障编号">
                    {getFieldDecorator('no', {
                      initialValue: newno.troubleNo || '',
                    })(<Input placeholder="请输入" disabled />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障发生时间">
                    {getFieldDecorator('registerOccurTime', {
                      rules: [
                        {
                          required,
                          message: '请选择时间',
                        },
                      ],
                      initialValue: moment(registerOccurTime) || ''
                    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障登记时间">
                    {getFieldDecorator('registerTime', {
                      rules: [
                        {
                          required,
                          message: '请选择时间',
                        },
                      ],
                      initialValue: moment(registerTime) || ''
                    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障来源">
                    {getFieldDecorator('source', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select placeholder="请选择">
                        {faultSource.map(({ value }) => [<Option key={value}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="系统模块">
                    {getFieldDecorator('registerModel', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select placeholder="请选择">
                        {sysmodular.map(({ value }) => [
                          <Option key={value}>
                            {value}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障类型">
                    {getFieldDecorator('type', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select placeholder="请选择">
                        {faultType.map(({ value }) => [<Option key={value}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障地点">
                    {getFieldDecorator('registerAddress', {
                      rules: [
                        {
                          required,
                          message: '请输入',
                        },
                      ],
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="严重程度">
                    {getFieldDecorator('registerLevel', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select placeholder="请选择">
                        {severity.map(({ value }) => [<Option key={value}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                {/* <Col xl={8} xs={12}>
                  <Form.Item label="影响范围">
                    {getFieldDecorator('yxfw', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select placeholder="请选择">
                        {yxfw.map(({ value }) => [<Option key={value}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col> */}

                <Col span={8}>
                  <Form.Item label="故障名称">
                    {getFieldDecorator('title', {
                      rules: [
                        {
                          required,
                          message: '请输入',
                        },
                      ],
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="故障概要" {...forminladeLayout}>
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required,
                          message: '请输入',
                        },
                      ],
                    })(<TextArea rows={5} placeholder="请输入" />)}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="是否影响业务" {...forminladeLayout}>
                    {getFieldDecorator('registerEffect', {
                      initialValue: '',
                    })(
                      <RadioGroup>
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
                      </RadioGroup>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="附件上传：" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }} {...forminladeLayout}>
                    {getFieldDecorator('upload', {
                      valuePropName: 'fileList',
                      getValueFromEvent: normFile,
                    })(
                      <Upload name="logo" action="" {...fileProps}>
                        <Button type="primary">
                          <Icon type="upload" style={{ fontSize: 18 }} /> 添加附件
                      </Button>
                      </Upload>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerUser', {
                      rules: [
                        {
                          required,
                        },
                      ],
                      initialValue: curruserinfo.loginCode || '',
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人部门">
                    {getFieldDecorator('registerDept', {
                      rules: [
                        {
                          required,
                        },
                      ],
                      initialValue: curruserinfo.deptNameExt || '',
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人单位">
                    {getFieldDecorator('registerUnit', {
                      rules: [
                        {
                          required,
                        },
                      ],
                      initialValue: '广西电网有限责任公司',
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Panel>
        </Collapse>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ fault, loading }) => ({
    newno: fault.newno, // 获取新的故障编号
    curruserinfo: fault.curruserinfo, // 获取登录用户信息
    saveuserid: fault.saveuserid, // 保存用户数据携带的id
    html: fault.html,
    loading: loading.models.fault,
  }))(Registration),
);