import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, AutoComplete, Spin, Cascader } from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';
import { queryDisableduserByUser } from '@/services/common';
import SysDict from '@/components/SysDict';
import { querkeyVal } from '@/services/api';
import styles from '../index.less';

const { Option } = Select;
const { TextArea, Search } = Input;
let occurtime;

const Registrat = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles } = props;
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
  const [showinput, setShowinput] = useState(true);

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

  const { useInfo, register, main } = props;

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
        setPersondata(res.data.devdirector);
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

  // 选择报障用户，信息回填
  const handleDisableduser = (v, opt) => {
    const { user, phone } = opt.props.disableuser;
    setFieldsValue({ complainUser: user, selectcomplainUser: user });
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
    setFieldsValue({ type: value?.slice(-1)[0] }, () => { });
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const handleDoubleClick = (e) => {
    if (e.target) {
      if (showinput) {
        const textheight = e.target.scrollHeight + 2;
        e.target.style.maxHeight = '9.0072e+15px';
        e.target.style.height = `${textheight}px`;
      } else {
        e.target.style.maxHeight = '31px';
        e.target.style.height = '31px';
      };
      setShowinput(!showinput)
    }
  }

  const problemType = getTypebyTitle('问题分类');
  const source = getTypebyTitle('问题来源');
  const priority = getTypebyTitle('严重程度');
  const project = getTypebyTitle('所属项目');
  const scope = getTypebyTitle('影响范围');

  return (
    <>
      <SysDict
        typeid="334"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <div className='noexplain'>
        <Form {...formItemLayout}>
          <Row gutter={24}>
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
                  allowClear={false}
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
                  allowClear={false}
                />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="问题申报人">
                {getFieldDecorator('complainUser', {
                  rules: [
                    {
                      required,
                      message: '请下拉选择问题申报人',
                    },
                  ],
                  initialValue: register.complainUser,
                })(
                  <AutoComplete
                    getPopupContainer={e => e.parentNode}
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

            {/* <Col span={8} style={{ display: 'none' }}>
              <Form.Item>
                {getFieldDecorator('complainUser', {
                  initialValue: register.complainUser,
                })(<Input />)}
              </Form.Item>
            </Col> */}

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
                  <Select placeholder="请选择" getPopupContainer={e => e.parentNode}>
                    {(source || []).map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
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
                  initialValue: main.type ? main.type.split(',') : '',
                })(
                  <Cascader
                    fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                    options={problemType}
                    placeholder="请选择"
                    onChange={() => handlobjectChange()}
                  />,
                  <Input />,
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
                  <Select placeholder="请选择" getPopupContainer={e => e.parentNode}>
                    {(priority || []).map(obj => [
                      <Option key={obj.title} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
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
                    initialValue:
                      (register.developmentLead && register.developmentLead.split(',')) || undefined,
                  })(
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                    // getPopupContainer={e => e.parentNode}
                    >
                      {persondata.map(obj => [
                        <Option key={obj.key} value={obj.val}>
                          {obj.val}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            )}

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
                  <Select
                    placeholder='请选择'
                  // getPopupContainer={e => e.parentNode}
                  >
                    {(scope || []).map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>


            <Col span={8}>
              <Form.Item label="所属项目">
                {getFieldDecorator('registerProject', {
                  initialValue: register.registerProject,
                })(
                  <Select placeholder="请选择" getPopupContainer={e => e.parentNode}>
                    {(project || []).map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
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

            <Col span={8}>
              <Form.Item label="期望完成时间">
                {getFieldDecorator('registerExpectTime', {
                  rules: [
                    {
                      required,
                      message: '请选择期望完成时间',
                    },
                  ],
                  initialValue: (register && register.registerExpectTime) ? moment(register.registerExpectTime) : moment(new Date()),
                })(<DatePicker
                 showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  allowClear={false}
                   />)}
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
                })(
                  <AutoComplete
                    allowClear
                    getPopupContainer={e => e.parentNode}
                    dataSource={titleautodata}
                    onSearch={value => handleSearch(value, 'title')}
                  >

                    <Input placeholder="请输入" />
                  </AutoComplete>,
                )}
              </Form.Item>
            </Col>

            <div className={styles.autoCompleteallowclear}>
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
                      allowClear
                      getPopupContainer={e => e.parentNode}
                      dataSource={desautodata}
                      filterOption={(inputValue, option) =>
                        option.props.children.includes(inputValue)
                      }
                      onSearch={value => handleSearch(value, 'des')}
                    >
                      <TextArea
                        style={{ height: 31 }}
                        placeholder="请输入"
                        onDoubleClick={(e) => handleDoubleClick(e)}
                      />
                    </AutoComplete>
                  )}
                </Form.Item>
              </Col>
            </div>

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
                  <div>
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
          </Row>
        </Form>
      </div>
    </>
  );
});

Registrat.defaultProps = {
  main: {
    no: '',
    title: '',
    content: '',
    type: '',
  },
  register: {
    complainUser: '',
    developmentLead: undefined,
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  },
};

export default Form.create({})(Registrat);
