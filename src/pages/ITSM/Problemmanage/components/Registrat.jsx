import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
<<<<<<< HEAD
import { Row, Col, Form, Input, Select, DatePicker,AutoComplete } from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
=======
import { Row, Col, Form, Input, Select, DatePicker, AutoComplete } from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';
>>>>>>> 故障、问题常用语

const { Option } = Select;
const { TextArea } = Input;
let occurtime;

const Registrat = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles } = props;
  const { getFieldDecorator } = props.form;
  const [fileslist, setFilesList] = useState([]);
  const [titleautodata, setTitleAutoData] = useState([]);
  const [desautodata, setDestoData] = useState([]);

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

<<<<<<< HEAD
  const {
    useInfo,
    register,
    main,
    source,
    type,
    priority,
    scope,
    project,
    antoArr
  } = props;

=======
  const { useInfo, register, main, source, type, priority, scope, project } = props;
>>>>>>> 故障、问题常用语

  if (register) {
    if (register.registerOccurTime !== null) {
      occurtime = moment(register.registerOccurTime);
    } else {
      occurtime = moment(Date.now());
    }
  } else {
    occurtime = moment(Date.now());
  }

  const required = true;

  const handletitleSearch = values => {
    getAndField(values).then(res => {
      if (res.code === 200 && res.data.length > 0) {
        const newdata = res.data.map(item => {
          return item.content;
        });
        setTitleAutoData(newdata);
      }
    });
  };
  const handledesSearch = values => {
    getAndField(values).then(res => {
      if (res.code === 200) {
        const newdata = res.data.map(item => {
          return item.content;
        });
        setDestoData(newdata);
      }
    });
  };

  // 常用语调用
  useEffect(() => {
    handletitleSearch({ module: '问题单', field: '标题', key: '' });
    handledesSearch({ module: '问题单', field: '描述', key: '' });
  }, []);

  return (
    <>
      <Row gutter={24} style={{ paddingTop: 24, marginTop: '20px' }}>
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
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
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
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
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
                  {source &&
                    source.length &&
                    source.map(({ key, val }) => (
                      <Option key={key} value={key}>
                        {val}
                      </Option>
                    ))}
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
                  {type &&
                    type.length &&
                    type.map(({ key, val }) => (
                      <Option key={key} value={key}>
                        {val}
                      </Option>
                    ))}
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
                  {priority &&
                    priority.length &&
                    priority.map(({ key, val }) => (
                      <Option key={key} value={key}>
                        {val}
                      </Option>
                    ))}
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
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
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
                  {project &&
                    project.length &&
                    project.map(({ key, val }) => (
                      <Option key={key} value={key}>
                        {val}
                      </Option>
                    ))}
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
                  {scope &&
                    scope.length &&
                    scope.map(({ key, val }) => (
                      <Option key={key} value={key}>
                        {val}
                      </Option>
                    ))}
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
              })(<Input placeholder="请输入" />)}
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
<<<<<<< HEAD
              })
              (<AutoComplete  dataSource={antoArr}/>)}
=======
              })(
                <AutoComplete
                  dataSource={titleautodata}
                  // onSearch={value => handleSearch(value)}
                >
                  <Input placeholder="请输入" />
                </AutoComplete>,
              )}
>>>>>>> 故障、问题常用语
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
              })(
                <AutoComplete
                  dataSource={desautodata}
                  // onSearch={value => handleSearch(value)}
                >
                  <TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />
                </AutoComplete>,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {getFieldDecorator('registerAttachments', {
                rules: [
                  {
                    required,
                    message: '请上传附件',
                  },
                ],
                initialValue: register ? register.registerAttachments : '',
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
              })(<Input disabled />)}
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
    complainUser: '',
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  },
};

export default Form.create({})(Registrat);
