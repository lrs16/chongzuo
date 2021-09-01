import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, AutoComplete, Spin, Cascader, } from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';
import { queryDisableduserByUser } from '@/services/common';
import styles from '../index.less';
import SysDict from '@/components/SysDict';
import { querkeyVal } from '@/services/api';

const { Option } = Select;
const { TextArea, Search } = Input;
let occurtime;

const Registrat = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles, location } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;
  const [fileslist, setFilesList] = useState([]);
  const [titleautodata, setTitleAutoData] = useState([]);
  const [titlerecords, setTitleRecords] = useState([]);
  const [desrecords, setDesRecords] = useState([]);
  const [desautodata, setDestoData] = useState([]);
  const [disablelist, setDisabledList] = useState([]); // 自动完成下拉列表
  const [spinloading, setSpinLoading] = useState(true); // 自动完成加载
  const [persondata, setPersondata] = useState('');
  const [selectdata, setSelectData] = useState('');

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

  const { useInfo, register, main, source, type, priority, scope, project } = props;

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
    querkeyVal('public', 'devdirector').then(res => {
      if (res.code === 200) {
        setPersondata(res.data.devdirector)
      }
    });
  }, []);

  // 自动完成报障用户
  const disableduser = disablelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.user}</span>
          <span>{opt.phone}</span>
          <span>{opt.unit}</span>
          <span>{opt.dept}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 请求报障用户
  const SearchDisableduser = value => {
    queryDisableduserByUser({ user: value }).then(res => {
      if (res) {
        const arr = [...res];
        setSpinLoading(false);
        setDisabledList(arr);
      }
    });
  };

  console.log(register.developmentLead, 'register.developmentLead')

  // 选择报障用户，信息回填
  const handleDisableduser = (v, opt) => {
    const { user, phone } = opt.props.disableuser;
    setFieldsValue({ complainUser: user });
    setFieldsValue({ registerUserPhone: phone });
  };

  const handleSearch = (value, selectType) => {
    switch (selectType) {
      case 'title': {
        const newArr = titlerecords.filter(item => {
          return item.includes(value);
        });
        if (newArr.length > 0) {
          setTitleAutoData(newArr);
        } else {
          setTitleAutoData([]);
        }
        break;
      }
      case 'des': {
        const newArr = desrecords.filter(item => {
          return item.includes(value);
        });
        if (newArr.length > 0) {
          setDestoData(newArr);
        } else {
          setDesRecords([]);
        }
        break;
      }
      default:
        break;
    }
  };

  const handlobjectChange = value => {
    setFieldsValue({ type: value?.slice(-1)[0] }, () => { })
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const problemType = getTypebyTitle('问题分类');

  return (
    <>
      <SysDict
        typeid="1354287742015508481"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Row gutter={24} style={{ paddingTop: 24 }}>
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
              })(
                <AutoComplete
                  dataSource={disableduser}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 600 }}
                  onSelect={(v, opt) => handleDisableduser(v, opt)}
                >
                  <Search
                    placeholder="可输入姓名搜索"
                    onSearch={values => SearchDisableduser(values)}
                    allowClear
                  />
                </AutoComplete>,
              )}
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
                initialValue: main.type ? (main.type).split(',') : '',
              })(
                <Cascader
                  fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                  options={problemType}
                  placeholder="请选择"
                  onChange={() => handlobjectChange()}
                />,
                <Input />
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
                initialValue: main.importance ? main.importance : '一般',
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

          {persondata && persondata.length > 0 && (
            <Col span={8}>
              <Form.Item label="开发负责人">
                {getFieldDecorator('developmentLead', {
                  rules: [
                    {
                      required,
                      message: '请输入开发负责人',
                    },
                  ],
                  initialValue: register.developmentLead || undefined,
                })(
                  <Select placeholder="请选择" mode="multiple">
                    {(persondata).map(obj => [
                      <Option key={obj.key} value={obj.val}>
                        {obj.val}
                      </Option>,
                    ])}
                  </Select>
                )}
              </Form.Item>
            </Col>
          )}


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
              })(
                <AutoComplete
                  dataSource={titleautodata}
                  onSearch={value => handleSearch(value, 'title')}
                >
                  <Input placeholder="请输入" />
                </AutoComplete>,
              )}
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
                  onSearch={value => handleSearch(value, 'des')}
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
                initialValue:
                  register && register.registerAttachments !== '[]'
                    ? register.registerAttachments
                    : '',
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
    type: ''
  },
  register: {
    complainUser: '',
    developmentLead: undefined
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  },
};

export default Form.create({})(Registrat);
