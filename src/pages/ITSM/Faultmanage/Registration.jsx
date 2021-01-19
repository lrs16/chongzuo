import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Radio,
  Collapse
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SelectUser from '@/components/SelectUser'; // 选人组件
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import styles from './index.less';

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

const registerScope = [ // 影响范围
  { key: 0, value: '自动抄表率' },
  { key: 1, value: '服务器' },
  { key: 2, value: '数据传输' },
  { key: 3, value: '网络\\通道' },
  { key: 4, value: 'VNC' },
  { key: 5, value: '专变自动抄表率' },
  { key: 6, value: '费控、召测' },
];

const sysmodular = [ // 系统模块
  { key: 0, value: '配网采集' },
  { key: 1, value: '主网采集' },
  { key: 2, value: '终端掉线' },
  { key: 3, value: '配网档案' },
  { key: 4, value: '实用化指标' },
  { key: 5, value: '账号缺陷' },
];

function Registration(props) {
  const pagetitle = props.route.name;
  const [activeKey, setActiveKey] = useState(['1']);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

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
    sessionStorage.setItem('Processtype', 'troub');
    sessionStorage.setItem('Nextflowmane', '审核');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('flowtype', '1');
  }, ['1']);

  const close = () => { // 关闭
    resetFields();
    router.push(`/ITSM/faultmanage/todolist`);
  };

  const callback = key => {
    setActiveKey(key);
  };

  const handleSave = () => { // 保存成功后根据后端给的流程ID跳待办里的详情
    validateFields((err, values) => {
      if (!err) {
        const formValues = values;
        formValues.registerOccurTime = values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.registerTime = values.registerTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.editState = 'add';
        formValues.registerAttachments = JSON.stringify(files.arr);
        dispatch({
          type: 'fault/getSaveUserId',
          payload: { formValues }
        })
      }
    });
  }

  const required = true;

  const faultcircula = () => { // 流转
    validateFields((err, values) => {
      if (!err) {
        const formValues = values;
        formValues.registerOccurTime = values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.registerTime = values.registerTime.format('YYYY-MM-DD HH:mm:ss');
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
        <SelectUser handleSubmit={() => faultcircula()}>
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
                  <Form.Item label="登记时间">
                    {getFieldDecorator('registerTime', {
                      rules: [
                        {
                          required,
                          message: '请选择时间',
                        },
                      ],
                      initialValue: moment(Date.now()) || ''
                    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="发生时间">
                    {getFieldDecorator('registerOccurTime', {
                      rules: [
                        {
                          required,
                          message: '请选择时间',
                        },
                      ],
                      initialValue: moment(Date.now()) || ''
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

                <Col xl={8} xs={12}>
                  <Form.Item label="影响范围">
                    {getFieldDecorator('registerScope', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select placeholder="请选择">
                        {registerScope.map(({ value }) => [<Option key={value}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

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
                      initialValue: 0,
                    })(
                      <RadioGroup>
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
                      </RadioGroup>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="上传附件"
                    {...forminladeLayout}
                    extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
                  >
                    <div style={{ width: 400 }}>
                      <SysUpload  fileslist={files.arr} ChangeFileslist={newvalue => setFiles(newvalue)}/>
                    </div>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerUser', {
                      // rules: [
                      //   {
                      //     required,
                      //   },
                      // ],
                      initialValue: curruserinfo.loginCode || '',
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记单位">
                    {getFieldDecorator('registerUnit', {
                      // rules: [
                      //   {
                      //     required,
                      //   },
                      // ],
                      initialValue: '广西电网有限责任公司',
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记部门">
                    {getFieldDecorator('registerDept', {
                      // rules: [
                      //   {
                      //     required,
                      //   },
                      // ],
                      initialValue: curruserinfo.deptNameExt || '',
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