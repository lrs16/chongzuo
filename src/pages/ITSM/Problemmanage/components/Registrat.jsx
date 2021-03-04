import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Row, Col, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import SysDict from '@/components/SysDict';

const { Option } = Select;
const { TextArea } = Input;
let occurtime;


const Registrat = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles } = props;
  const { getFieldDecorator } = props.form;
  const [fileslist, setFilesList] = useState([]);
  const [selectdata, setSelectData] = useState([]);
  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    useInfo,
    register,
    main,
    // source,
    type,
    priority,
    scope,
    project,
  } = props;


  if (register) {
    if (register.registerOccurTime !== null) {
      occurtime = moment(register.registerOccurTime);
    } else {
      occurtime = moment(Date.now())
    }
  } else {
    occurtime = moment(Date.now())
  }

  const required = true;

  const getTypebyTitle = (title) => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => 
        item.title === title)[0].children;
    }
    return [];
  };
  const source = getTypebyTitle('问题来源');
  // const sysmodular = getTypebyTitle('故障系统模块');
  // const priority = getTypebyTitle('严重程度');
  // const effect = getTypebyTitle('影响范围');
  // const faultType = getTypebyTitle('故障分类');

  return (
    <>
      <Row gutter={24} style={{ paddingTop: 24, marginTop: '20px' }}>
      <SysDict
        typeid="1354278126724583426"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="问题编号">
              {getFieldDecorator('no', {
                rules: [
                  {
                    message: '请输入问题编号',
                  },
                ],
                initialValue: main.no,
              })(<Input disabled />)}
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
                initialValue: register ? moment(register.registerTime) : moment(Date.now()),
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
            <Form.Item label="问题申报人">
              {getFieldDecorator('complainUser', {
                rules: [
                  {
                    required,
                    message: '请输入问题申报人',
                  },
                ],
                initialValue: register.complainUser,
              })(<Input />)}
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
                initialValue: main.source,
              })(
                <Select placeholder="请选择">
                  {
                    source && source.length && (
                      source.map(({ key, val }) => (
                        <Option key={key} value={key}>
                          {val}
                        </Option>
                      ))
                    )
                  }
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
                initialValue: main.type,
              })(
                <Select placeholder="请选择">
                  {
                    type && type.length && (
                      type.map(({ key, val }) => (
                        <Option key={key} value={key}>
                          {val}
                        </Option>
                      ))
                    )
                  }
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="重要程度">
              {getFieldDecorator('importance', {
                rules: [
                  {
                    required,
                    message: '请选择重要程度',
                  },
                ],
                initialValue: main.importance,
              })(
                <Select placeholder="请选择">
                  {
                    priority && priority.length && (
                      priority.map(({ key, val }) => (
                        <Option key={key} value={key}>
                          {val}
                        </Option>
                      ))
                    )
                  }
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="期望完成时间">
              {getFieldDecorator('registerExpectTime', {
                rules: [
                  {
                    required,
                    message: '请选择期望完成时间',
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
            <Form.Item label="所属项目">
              {getFieldDecorator('registerProject', {
                rules: [
                  {
                    required,
                    message: '请输入所属项目',
                  },
                ],
                initialValue: register.registerProject,
              })(
                <Select placeholder="请选择">
                  {
                    project && project.length && (
                      project.map(({ key, val }) => (
                        <Option key={key} value={key}>
                          {val}
                        </Option>
                      ))
                    )
                  }
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="影响范围">
              {getFieldDecorator('registerScope', {
                rules: [
                  {
                    required,
                    message: '请选择影响范围',
                  },
                ],
                initialValue: register.registerScope,
              })(
                <Select placeholder="请选择">
                  {
                    scope && scope.length && (
                      scope.map(({ key, val }) => (
                        <Option key={key} value={key}>
                          {val}
                        </Option>
                      ))
                    )
                  }
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="联系电话">
              {getFieldDecorator('registerUserPhone', {
                rules: [
                  {
                    required,
                    message: '请输入手机号码',
                  },
                ],
                initialValue: register ? register.registerUserPhone : '',
              })(<Input placeholder='请输入' />)}
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
                initialValue: main.title,
              })(<Input placeholder='请输入' />)}
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
                initialValue: main.content,
              })(<TextArea placeholder='请输入' />)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
            >
              {
                getFieldDecorator('registerAttachments',{
                  rules: [
                    {
                      required,
                      message: '请上传附件'
                    }
                  ],
                  initialValue: register?register.registerAttachments :''
                })(<div style={{ width: 400 }}>
                  <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>)
              }

            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="填报人">
              {getFieldDecorator('registerUser', {
                initialValue: useInfo.userName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="填报人单位">
              {getFieldDecorator('registerUnit', {
                rules: [
                  {
                    message: '请输入填报人单位',
                  },
                ],
                initialValue: useInfo.unitName,
              })(
                <Input disabled />,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="填报人部门">
              {getFieldDecorator('registerDept', {
                rules: [
                  {
                    message: '请输入填报人部门',
                  },
                ],
                initialValue: useInfo.deptName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
});

Registrat.defaultProps = {
  main: {
    no: '',
    title: '',
    content: '',
  },
  register: {
    complainUser:''
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  }
}

export default Form.create({})(Registrat);
