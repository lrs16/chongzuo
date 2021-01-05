import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Form, Input, Select, Upload, Button, Checkbox, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less';
import { phone_reg } from '@/utils/Regexp';

const { Option } = Select;
const { TextArea } = Input;

const sourcemap = [
  { key: '001', value: '用户电话申告' },
  { key: '002', value: '企信' },
];

const returnvisit = [
  { key: '001', value: '企信回访' },
  { key: '002', value: '电话回访' },
  { key: '003', value: '短信回访' },
  { key: '004', value: '邮箱回访' },
];

const degreemap = [
  { key: '001', value: '低' },
  { key: '002', value: '中' },
  { key: '003', value: '高' },
  { key: '004', value: '紧急' },
];

const objectmap = [
  { key: '001', value: '配网采集' },
  { key: '002', value: '主网采集' },
  { key: '003', value: '终端掉线' },
  { key: '004', value: '配网档案' },
  { key: '005', value: '实用化指标' },
  { key: '006', value: '账号缺陷' },
];

const typemaps = new Map([
  ['', '处理'],
  ['001', '处理'],
  ['002', '处理'],
  ['003', '处理'],
  ['004', '处理'],
  ['005', '审核'],
  ['006', '处理'],
]);

const typemap = [
  { key: '001', value: '咨询' },
  { key: '002', value: '缺陷' },
  { key: '003', value: '故障' },
  { key: '004', value: '数据处理' },
  { key: '005', value: '账号权限' },
  { key: '006', value: '其它' },
];

const Registrat = forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    ChangeShow,
    ChangeCheck,
    ChangeActiveKey,
    ChangeFlowtype,
    changeDefaultvalue,
    info,
    main,
    userinfo,
    sethandlevalue,
    location,
  } = props;
  const { register } = info;
  const { pangekey, id, mainId, validate } = location.query;
  const { getFieldDecorator, getFieldsValue } = props.form;
  const required = true;
  const [check, setCheck] = useState(false);
  const [revisitway, setRevisitway] = useState(false);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const gethandelvalue = getFieldsValue([
    'register_eventEffect',
    'main_eventType',
    'main_eventObject',
    'register_eventEmergent',
    'register_eventPrior',
  ]);

  const routerRefresh = () => {
    router.push({
      pathname: location.pathname,
      query: {
        pangekey,
        id,
        mainId,
        next: sessionStorage.getItem('Nextflowtype'),
      },
    });
  };

  useEffect(() => {
    if (register.revisitWay === '003') {
      setRevisitway(true);
    }
    if (main.eventType === '005') {
      setCheck(true);
    }
  }, [info]);

  useEffect(() => {
    sessionStorage.setItem('Nextflowtype', typemaps.get(main.eventType));
    routerRefresh();
  }, [info]);

  // 自行处理
  const handleself = e => {
    ChangeShow(e.target.checked);
    ChangeActiveKey(['registratform', 'handleform']);
    if (sethandlevalue === 'true') {
      changeDefaultvalue(gethandelvalue);
    }
  };
  // 005时走审核
  const handlcheckChange = value => {
    if (value === '005') {
      ChangeCheck(true);
      setCheck(true);
      ChangeFlowtype('3');
      sessionStorage.setItem('Nextflowtype', '审核');
    } else {
      ChangeCheck(false);
      setCheck(false);
      ChangeFlowtype('1');
      sessionStorage.setItem('Nextflowtype', '处理');
    }
    if (sethandlevalue === 'true') {
      changeDefaultvalue(gethandelvalue);
    }
    routerRefresh();
  };

  // 003手机号码必填
  const handlrevisitway = value => {
    if (value === '003') {
      setRevisitway(true);
    } else {
      setRevisitway(false);
    }
  };

  const changeHandlevalue = () => {
    if (sethandlevalue === 'true') {
      changeDefaultvalue(gethandelvalue);
    }
  };

  return (
    <Form {...formItemLayout}>
      <Row gutter={24} style={{ paddingTop: 24 }}>
        <Col span={8}>
          <Form.Item label="事件编号">
            {getFieldDecorator('main_eventNo', {
              initialValue: main.eventNo,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="建单时间">
            {getFieldDecorator('main_addTime', {
              rules: [{ required }],
              initialValue: main.addTime,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="发生时间">
            {getFieldDecorator('register_occurTime', {
              rules: [{ required, message: '请选择发生时间' }],
              initialValue: moment(register.occurTime),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="申报人">
            {getFieldDecorator('register_applicationUser', {
              rules: [{ required, message: '请输入申报人' }],
              initialValue: register.applicationUser,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="申报人id">
            {getFieldDecorator('register_applicationUserId', {
              rules: [{ required, message: '请输入申报人' }],
              initialValue: register.applicationUserId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申报人单位">
            {getFieldDecorator('register_applicationUnit', {
              rules: [{ required, message: '请选择申报人单位' }],
              initialValue: register.applicationUnit,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="申报人单位id">
            {getFieldDecorator('register_applicationUnitId', {
              initialValue: register.applicationUnitId,
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申报人部门">
            {getFieldDecorator('register_applicationDept', {
              rules: [{ required, message: '请选择申报人部门' }],
              initialValue: register.applicationDept,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="申报人部门id">
            {getFieldDecorator('register_applicationDeptId', {
              initialValue: register.applicationDeptId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="事件来源">
            {getFieldDecorator('main_eventSource', {
              rules: [{ required, message: '请选择事件来源' }],
              initialValue: main.eventSource,
            })(
              <Select placeholder="请选择">
                {sourcemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申报人电话">
            {getFieldDecorator('register_applicationUserPhone', {
              rules: [
                {
                  required,
                  message: '请输入申报人电话',
                },
              ],
              initialValue: register.applicationUserPhone,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        {revisitway === true && (
          <Col span={8}>
            <Form.Item label="手机号码">
              {getFieldDecorator('register_mobilePhone', {
                rules: [
                  {
                    required,
                    len: 11,
                    validator: phone_reg,
                    message: '请输入正确的正确的手机号码',
                  },
                ],
                initialValue: register.mobilePhone,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        )}
        {revisitway !== true && (
          <Col span={8}>
            <Form.Item label="手机号码">
              {getFieldDecorator('register_mobilePhone', {
                rules: [
                  {
                    //  required,
                    len: 11,
                    validator: phone_reg,
                    message: '请输入正确的正确的手机号码',
                  },
                ],
                initialValue: register.mobilePhone,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        )}

        <Col span={8}>
          <Form.Item label="事件分类">
            {getFieldDecorator('main_eventType', {
              rules: [{ required, message: '请选择事件分类' }],
              initialValue: main.eventType,
            })(
              <Select placeholder="请选择" onChange={handlcheckChange}>
                {typemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="事件对象">
            {getFieldDecorator('main_eventObject', {
              rules: [{ required, message: '请选择事件对象' }],
              initialValue: main.eventObject,
            })(
              <Select placeholder="请选择" onChange={changeHandlevalue}>
                {objectmap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访方式">
            {getFieldDecorator('register_revisitWay', {
              rules: [{ required, message: '请选择回访方式' }],
              initialValue: register.revisitWay,
            })(
              <Select placeholder="请选择" onChange={handlrevisitway}>
                {returnvisit.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="影响度">
            {getFieldDecorator('register_eventEffect', {
              rules: [{ required, message: '请选择影响度' }],
              initialValue: register.eventEffect,
            })(
              <Select placeholder="请选择" onChange={changeHandlevalue}>
                {degreemap.map(({ key, value }, index) => {
                  if (index < 3)
                    return (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    );
                })}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="紧急度">
            {getFieldDecorator('register_eventEmergent', {
              rules: [{ required, message: '请选择紧急度' }],
              initialValue: register.eventEmergent,
            })(
              <Select placeholder="请选择" onChange={changeHandlevalue}>
                {degreemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="优先级">
            {getFieldDecorator('register_eventPrior', {
              rules: [{ required, message: '请选择优先级' }],
              initialValue: register.eventPrior,
            })(
              <Select placeholder="请选择" onChange={changeHandlevalue}>
                {degreemap.map(({ key, value }, index) => {
                  if (index < 3)
                    return (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    );
                })}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="事件标题" {...forminladeLayout}>
            {getFieldDecorator('main_title', {
              rules: [{ required, message: '请输入事件标题' }],
              initialValue: main.title,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item label="一线标签" {...forminladeLayout}>
            {getFieldDecorator('re14')(
              <Input placeholder="请输入标签，至少两个字符，回车确认，最多输入八个标签" />,
            )}
          </Form.Item>
        </Col>
        <Col span={22} offset={2}>
          <span>您可输入相关标签（例如重点标签）</span>
          <div
            style={{
              marginBottom: 24,
              padding: '12px 12px 24px 12px',
              background: '#f1f1f1',
              borderRadius: 4,
            }}
          >
            <h5>推荐标签</h5>
            <div className={styles.margin_r}>
              <Button>重点标签</Button>
              <Button>标签1</Button>
              <Button>标签2</Button>
              <Button>标签3</Button>
              <Button>标签4</Button>
            </div>
          </div>
        </Col> */}
        <Col span={24}>
          <Form.Item label="事件描述" {...forminladeLayout}>
            {getFieldDecorator('main_content', {
              rules: [{ required, message: '请输入事件描述' }],
              initialValue: main.content,
            })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
          </Form.Item>
        </Col>
        {check === false && (
          <Col span={8}>
            <Form.Item label="自行处理">
              {getFieldDecorator('register_selfhandle', {
                valuePropName: 'checked',
                initialValue: Boolean(Number(register.selfhandle)),
              })(<Checkbox onClick={handleself} />)}
            </Form.Item>
          </Col>
        )}
        <Col span={8}>
          <Form.Item label="是否补单">
            {getFieldDecorator('register_supplement', {
              valuePropName: 'checked',
              initialValue: Boolean(Number(register.supplement)),
            })(<Checkbox />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        {/* <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('re17')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
          </Form.Item>
        </Col> */}
        <Col span={8}>
          <Form.Item label="登记人">
            {getFieldDecorator('register_registerUser', {
              rules: [{ required }],
              initialValue: userinfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="登记人ID">
            {getFieldDecorator('register_registerUserId', {
              rules: [{ required }],
              initialValue: userinfo.userId,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记人单位">
            {getFieldDecorator('register_registerUnit', {
              rules: [{ required }],
              initialValue: userinfo.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="登记人单位ID">
            {getFieldDecorator('register_registerUnitId', {
              rules: [{ required }],
              initialValue: userinfo.unitId,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记人部门">
            {getFieldDecorator('register_registerDept', {
              rules: [{ required }],
              initialValue: userinfo.deptName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="登记人部门ID">
            {getFieldDecorator('register_registerDeptId', {
              rules: [{ required }],
              initialValue: userinfo.deptId,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

Registrat.defaultProps = {
  main: {
    addTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    content: '',
    eventNo: '',
    eventObject: '',
    eventSource: '002',
    eventType: '',
  },
  info: {
    register: {
      applicationDept: '计量中心',
      applicationDeptId: '7AC3EF0F639302A2E0530A644F130365',
      applicationUnit: '南宁供电局',
      applicationUnitId: '7AC3EF0F718E02A2E0530A644F130365',
      application_user: '',
      applicationUserId: '12121212',
      applicationUserPhone: '',
      mobilePhone: '',
      eventEffect: '001',
      eventEmergent: '001',
      eventPrior: '001',
      occur_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      // registerDept: '广西电网有限责任公司',
      // registerDeptId: '7AC3EF0F701402A2E0530A644F130365',
      // registerUnit: '广西电网有限责任公司',
      // registerUnitId: '7AC3EF0F701402A2E0530A644F130365',
      // registerUser: '管理员',
      registerUserId: '1',
      revisitWay: '001',
      selfhandle: '0',
    },
  },
  userinfo: {
    deptName: '',
    deptId: '',
    unitName: '',
    unitId: '',
    userName: '',
    userId: '',
  },
};

export default Form.create()(Registrat);
