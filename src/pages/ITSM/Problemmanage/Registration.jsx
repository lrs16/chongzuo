import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Icon,
  DatePicker,
  Select,
  message,
} from 'antd';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Regexp, { phone_reg } from '@/utils/Regexp';
import Circulation from './components/Circulation';

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

const { TextArea } = Input;
const { Option } = Select;
let formatdatetime;
let createDatetime;
let jumpType = 0;
const Registration = props => {
  const [next, setNext] = useState(false);
  const [save, setSave] = useState({});
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    id,
    newno,
    list,
    useInfo,
  } = props;
  const required = true;
  const data = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
  };

  const onFinish = jumpType => {
    props.form.validateFields((err, values) => {
      //  登记时间
      const addDateZero = num => {
        return num < 10 ? '0' + num : num;
      };
      const d = new Date(values.registerTime);
      formatdatetime =
        d.getFullYear() +
        '-' +
        addDateZero(d.getMonth() + 1) +
        '-' +
        addDateZero(d.getDate()) +
        ' ' +
        addDateZero(d.getHours()) +
        ':' +
        addDateZero(d.getMinutes()) +
        ':' +
        addDateZero(d.getSeconds());
      //  建单时间
      const createDateZero = num => {
        return num < 10 ? '0' + num : num;
      };
      const create = new Date(values.now);
      createDatetime =
        create.getFullYear() +
        '-' +
        createDateZero(create.getMonth() + 1) +
        '-' +
        createDateZero(create.getDate()) +
        ' ' +
        createDateZero(create.getHours()) +
        ':' +
        createDateZero(create.getMinutes()) +
        ':' +
        createDateZero(create.getSeconds());

      if (!err) {
        const saveData = values;
        saveData.registerTime = formatdatetime;
        saveData.now = createDatetime;
        // saveData.taskId = id.flowTaskId;
        saveData.editState = 'add';
        dispatch({
          type: 'problemmanage/getAddid',
          payload: { saveData, jumpType },
        });
      }
    });
  };

  const getADDid = () => {
    dispatch({
      type: 'problemmanage/getAddid',
    });
  };

  const getNewno = () => {
    dispatch({
      type: 'problemmanage/getregisterNo',
    });
  };

  const getUserinfo = () => {
    dispatch({
      type: 'problemmanage/fetchUseinfo',
    });
  };

  useEffect(() => {
    // dispatch({
    //   type:'problemmanage/fetchlist',
    // });
    // getADDid();
    getUserinfo();
    getNewno();
  }, []);

  const handleCirculation = () => {
    onFinish(1);
  };

  const gotoApi = () => {
    const result = 1;
    const taskId = id;
    return dispatch({
      type: 'problemmanage/gotoCirculation',
      payload: { taskId, result },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        props.history.push('/ITSM/problemmanage/besolved');
      } else {
        message.error(res.msg);
      }
    });
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card
        extra={
          <>
            <Button
              type="primary"
              style={{ marginRight: '8px' }}
              htmlType="submit"
              onClick={() => onFinish(0)}
            >
              保存
            </Button>

            {/* <Circulation
              target='问题登记'
              taskId={id.flowTaskId}
            > */}
            <Button type="primary" style={{ marginRight: 8 }} onClick={handleCirculation}>
              流转
            </Button>

            {/* </Circulation> */}

            <Button type="primary">关闭</Button>
          </>
        }
      >
        <Row>
          <Form {...formItemLayout} onSubmit={onFinish}>
            <Col span={8}>
              <Form.Item label="问题编号">
                {getFieldDecorator('no', {
                  rules: [
                    {
                      // required,
                      message: '请输入问题编号',
                    },
                  ],
                  initialValue: newno.problemNo || '',
                })(<Input disabled />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="问题来源">
                {getFieldDecorator('source', {
                  rules: [
                    {
                      required,
                      message: '请输入问题来源',
                    },
                  ],
                  initialValue: list.questionSource || '',
                })(
                  <Select>
                    <Option value="重复性分析事件">重复性分析事件</Option>
                    <Option value="事件升级">事件升级</Option>
                    <Option value="巡检发现">巡检发现</Option>
                    <Option value="系统监控发现">系统监控发现</Option>
                    <Option value="其他">其他</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="问题分类">
                {getFieldDecorator('type', {
                  rules: [
                    {
                      required,
                      message: '请输入问题分类',
                    },
                  ],
                  initialValue: list.questionClass || '',
                })(
                  <Select>
                    <Option value="功能">功能</Option>
                    <Option value="程序">程序</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="紧急度">
                {getFieldDecorator('emergent', {
                  rules: [
                    {
                      required,
                      message: '请输入紧急度',
                    },
                  ],
                  initialValue: list.urgency || '',
                })(
                  <Select>
                    <Option value="低">低</Option>
                    <Option value="中">中</Option>
                    <Option value="高">高</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="影响度">
                {getFieldDecorator('effect', {
                  rules: [
                    {
                      required,
                      message: '请输入影响度',
                    },
                  ],
                  initialValue: list.influenceDegree || '',
                })(
                  <Select>
                    <Option value="低">低</Option>
                    <Option value="中">中</Option>
                    <Option value="高">高</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="优先级">
                {getFieldDecorator('priority', {
                  rules: [
                    {
                      required,
                      message: '请输入优先级',
                    },
                  ],
                  initialValue: list.priority || '',
                })(
                  <Select>
                    <Option value="低">低</Option>
                    <Option value="中">中</Option>
                    <Option value="高">高</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="填报人单位">
                {getFieldDecorator('registerUnit', {
                  rules: [
                    {
                      // required,
                      message: '请输入填报人单位',
                    },
                  ],
                  initialValue: list.applicant || '',
                })(
                  <Select>
                    <Option value="单位">单位</Option>
                    <Option value="部门">部门</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="填报人部门">
                {getFieldDecorator('registerDept', {
                  rules: [
                    {
                      // required,
                      message: '请输入填报人部门',
                    },
                  ],
                  initialValue: useInfo.deptNameExt || '',
                })(<Input disabled />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="填报人">
                {getFieldDecorator('registerUser', {
                  rules: [
                    {
                      required,
                      message: '请输入填报人',
                    },
                  ],
                  initialValue: list.filledBy || '',
                })(<Input />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="联系电话">
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required,
                      len: 11,
                      validator: phone_reg,
                      message: '请输入正确的手机号码',
                    },
                  ],
                  initialValue: list.contactNumber || '',
                })(<Input />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="登记时间">
                {getFieldDecorator('registerTime', {
                  rules: [
                    {
                      required,
                      message: '请输入登记时间',
                    },
                  ],
                  initialValue: moment(list.registTime) || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="建单时间">
                {getFieldDecorator('now', {
                  rules: [
                    {
                      required,
                      message: '请输入紧急度',
                    },
                  ],
                  initialValue: moment(list.orderCreationtime) || '',
                })(<DatePicker format="YYYY-MM-DD HH:mm" showTime />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="问题标题" {...forminladeLayout}>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required,
                      message: '请输入紧急度',
                    },
                  ],
                  initialValue: list.questionTitle || '',
                })(<Input />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="问题描述" {...forminladeLayout}>
                {getFieldDecorator('content', {
                  rules: [
                    {
                      required,
                      message: '请输入问题描述',
                    },
                  ],
                  initialValue: list.problemDescription || '',
                })(<TextArea />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="上传附件" {...forminladeLayout}>
                {getFieldDecorator('uploadAttachment', {
                  rules: [
                    {
                      // required,
                      message: '请输入问题描述',
                    },
                  ],
                })(
                  <Upload {...data}>
                    <Button type="primary">
                      <Icon type="upload" /> Click to Upload
                    </Button>
                  </Upload>,
                )}
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    list: problemmanage.list,
    id: problemmanage.id,
    newno: problemmanage.newno,
    useInfo: problemmanage.useInfo,
    loading: loading.models.problemmanage,
  }))(Registration),
);
