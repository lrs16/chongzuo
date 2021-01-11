import React, { useContext, useRef, useImperativeHandle } from 'react';
import { Row, Col, Form, Input, Select, Upload, Button, Checkbox, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less';
import moment from 'moment';
import Link from 'umi/link';
import { RegistratContext } from '../Registration';
import { phone_reg } from '@/utils/Regexp';

const { Option } = Select;
const { TextArea } = Input;
let occurtime;


const Registrat = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, show } = props;
  const { getFieldDecorator } = props.form;
  // const { setActiveKey, setShow } = useContext(RegistratContext);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const {
    list,
    newno,
    useInfo,
    register,
    main,
  } = props;
  if(register) {
    if(register.registerOccurTime !== null) {
      occurtime = moment(register.registerOccurTime);
    } else {
      occurtime = moment(Date.now())
    }
  } else {
    occurtime = moment(Date.now())
  }


  const required = true;

  return (
    <Row gutter={24} style={{ paddingTop: 24,marginTop:'20px' }}>
        <Form {...formItemLayout}>
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
{/* 
            
            <Col span={8}>
              <Form.Item label="影响范围">
                {getFieldDecorator('now', {
                  rules: [
                    {
                      required,
                      message: '请输入影响范围',
                    },
                  ],
                  initialValue: '',
                })(<Select 
                    >
                      <Option>FF</Option>
                    </Select>
                 )}
              </Form.Item>
            </Col> */}

            
            <Col span={8}>
              <Form.Item label="登记时间">
                {getFieldDecorator('registerTime', {
                  rules: [
                    {
                      required,
                      message: '请输入登记时间',
                    },
                  ],
                  initialValue: register?moment(register.registerTime):moment(Date.now()),
                })(<DatePicker 
                     showTime 
                     format="YYYY-MM-DD HH:mm:ss"
                 />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="发生时间">
                {getFieldDecorator('registerOccurTime', {
                  rules: [
                    {
                      required,
                      message: '请输入登记时间',
                    },
                  ],
                  initialValue: occurtime,
                })(<DatePicker 
                     showTime 
                     format="YYYY-MM-DD HH:mm:ss"
                 />)}
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
                  initialValue: main?main.source:'重复性分析事件',
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
                  initialValue: main?main.type:'功能',
                })(
                  <Select>
                    <Option value="功能">功能</Option>
                    <Option value="程序">程序</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8} {...formItemLayout}>
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
                  initialValue: register?register.phone:'',
                })(<Input />)}
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
                  initialValue: main?main.emergent:'低',
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
                  initialValue: main?main.effect:'低',
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
                  initialValue: main?main.priority:'低',
                })(
                  <Select>
                    <Option value="低">低</Option>
                    <Option value="中">中</Option>
                    <Option value="高">高</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="问题标题" {...forminladeLayout}>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required,
                      message: '请输入问题标题',
                    },
                  ],
                  initialValue: main?main.title:'',
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
                  initialValue: main?main.content:'',
                })(<TextArea />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="填报人">
                {getFieldDecorator('registerUser', {
                  initialValue: useInfo?useInfo.loginCode:'',
                })(<Input disabled/>)}
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
                  initialValue: '单位',
                })(
                  <Select disabled>
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
                  initialValue: useInfo?useInfo.deptNameExt:'',
                })(<Input disabled/>)}
              </Form.Item>
            </Col>

{/* 
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
            </Col> */}
          </Form>
       
    </Row>
  );
});

export default Form.create({})(Registrat);
