import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  DatePicker,
  Cascader,
  AutoComplete,
  Upload,
  Button,
  message,
  Spin,
  Drawer,
} from 'antd';
import { phone_reg } from '@/utils/Regexp';
// import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';
import { FileDownload, FileDelete, getFileSecuritySuffix } from '@/services/upload';
import { queryDisableduserByUser, queryUnitList, queryDeptList } from '@/services/common';
import DeptSlectId from '@/components/DeptTree/SelectID';
import { DownloadOutlined, CaretRightOutlined } from '@ant-design/icons';
import styles from '../index.less';

const InputGroup = Input.Group;
const { Option } = Select;
const { TextArea, Search } = Input;

const Registrat = forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    ChangeShow,
    ChangeCheck,
    ChangeActiveKey,
    // ChangeFlowtype,
    changeDefaultvalue,
    info,
    main,
    userinfo,
    sethandlevalue,
    location,
    files,
    ChangeFiles,
    selectdata,
  } = props;
  const { register } = info;
  const { taskName, taskId, mainId, orderNo } = location.query;
  const { getFieldDecorator, getFieldsValue, setFieldsValue, validateFields, setFields, resetFields } = props.form;
  const required = true;
  const [check, setCheck] = useState(false);
  const [revisitway, setRevisitway] = useState(false);
  const [fileslist, setFilesList] = useState([]);
  const [filetype, setFileType] = useState('');
  const [titleautodata, setTitleAutoData] = useState([]);
  const [desautodata, setDestoData] = useState([]);
  const [titlerecords, setTitleRecords] = useState([]);
  const [desrecords, setDesRecords] = useState([]);
  const [disablelist, setDisabledList] = useState([]);
  const [spinloading, setSpinLoading] = useState(true);
  const [detpdrawer, SetDetpDrawer] = useState(false); // 组织
  const [treetype, setTreeType] = useState(''); // 组织类型（单位，部门）
  const [unitrecord, setUnitRecord] = useState(''); // 自动完成选择的单位信息
  const [unitdata, setUnitdata] = useState([]); // 自动完成单位下拉表
  const [deptdata, setDeptdata] = useState([]); // 自动完成部门下拉表
  const [unitopen, setUnitopen] = useState(false);
  const [deptopen, setDeptopen] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      setFilesList(files);
    };
    if (register.applicationUnitId !== '') {
      setUnitRecord({ ...unitrecord, key: register.applicationUnitId })
    };
    return () => {
      setUnitRecord('')
    }
  }, [info]);

  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const gethandelvalue = getFieldsValue(['main_eventType', 'main_eventObject']);

  const routerRefresh = () => {
    if (orderNo) {
      router.push({
        pathname: location.pathname,
        query: {
          taskName,
          taskId,
          mainId,
          next: sessionStorage.getItem('Nextflowmane'),
          orderNo: main.eventNo
        },
      });
    }
  };

  // console.log(location.query)

  useEffect(() => {
    if (main.revisitWay === '002') {
      setRevisitway(true);
    }
    if (main.eventType === '005' || main.eventType === '007' || main.eventType === '008') {
      setCheck(true);
    }
  }, [info]);

  useEffect(() => {
    if (main.eventType === '005' || main.eventType === '007' || main.eventType === '008') {
      sessionStorage.setItem('Nextflowmane', '审核');
      sessionStorage.setItem('flowtype', '3');
    } else {
      sessionStorage.setItem('Nextflowmane', '处理');
      sessionStorage.setItem('flowtype', '1');
    }
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

  // 事件分类005，007，008时走审核
  const handlcheckChange = value => {
    if (value === '005' || value === '007' || value === '008') {
      ChangeCheck(true);
      setCheck(true);
      ChangeShow(false);
      sessionStorage.setItem('Nextflowmane', '审核');
      sessionStorage.setItem('flowtype', '3');
    } else {
      ChangeCheck(false);
      setCheck(false);
      //  ChangeFlowtype('1');
      sessionStorage.setItem('Nextflowmane', '处理');
      sessionStorage.setItem('flowtype', '1');
    }
    if (sethandlevalue === 'true') {
      changeDefaultvalue(gethandelvalue);
    }
    routerRefresh();
  };

  //
  const handlobjectChange = value => {
    setFieldsValue({ main_eventObject: value?.slice(-1)[0] }, () => { });
  };

  // 002手机号码必填
  const handlrevisitway = value => {
    if (value === '002') {
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

  const displayRender = label => {
    return label[label.length - 1];
  };

  // const changenulltostr = (datas) => {
  //   for (var x in datas) {
  //     if (datas[x] === null) { // 如果是null 把直接内容转为 ''
  //       datas[x] = '';
  //     };
  //   }  
  //   return datas;
  // };
  // changenulltostr(main);
  // changenulltostr(register);

  const handletitleSearch = values => {
    getAndField(values).then(res => {
      if (res.code === 200 && res.data.length > 0) {
        const newdata = res.data.map(item => {
          return item.content;
        });
        setTitleAutoData(newdata);
        setTitleRecords(newdata);
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
        setDesRecords(newdata);
      }
    });
  };

  const handleSearch = (value, type) => {
    switch (type) {
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

  // 常用语调用
  useEffect(() => {
    handletitleSearch({ module: '事件单', field: '标题', key: '' });
    handledesSearch({ module: '事件单', field: '描述', key: '' });
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
    const { user, phone, mobile, unit, unitId, dept, deptId } = opt.props.disableuser;
    setFieldsValue({
      register_applicationUser: user,         // 申报人
      register_applicationUserId: v,          // 申报人id
      register_applicationUserPhone: phone,   // 申报人电话
      register_applicationUnit: unit,
      register_applicationUnitId: unitId,
      register_applicationDept: dept,
      register_applicationDeptId: deptId,
      applicationUnit: unit,
      applicationDept: dept,
      mobilePhone1: mobile,
      mobilePhone2: mobile,
    });
    // if (revisitway) {
    //   setFieldsValue({ mobilePhone1: mobile, })
    // } else {
    //   setFieldsValue({ mobilePhone2: mobile, })
    // }
  };

  // 关闭组织机构树抽屉
  const onDeptDrawerClose = () => {
    SetDetpDrawer(false);
  };

  // 查询单位
  const handleUnitSearch = value => {
    if (value !== '') {
      queryUnitList({ key: value }).then(res => {
        if (res.data !== undefined) {
          const arr = [...res.data];
          setUnitdata(arr);
        }
      });
    }
  };

  // 查询部门
  const handleDeptSearch = value => {
    const unit = getFieldsValue(['register_applicationUnit']);
    if (unit.register_applicationUnit === '') {
      setFields({
        'applicationUnit': {
          value: '',
          errors: [new Error('请选择申报人单位')],
        },
      })
    }
    if (value !== '' && unit.register_applicationUnit !== '') {
      queryDeptList({ key: value, unitId: unitrecord.key }).then(res => {
        if (res.data !== undefined) {
          const arr = [...res.data];
          setDeptdata(arr);
        }
      });
    }
  };

  // 选择单位树结点
  const handleUnitTreeNode = value => {
    setUnitRecord(value);
    setFieldsValue({
      register_applicationUnit: value.title,
      register_applicationUnitId: value.key,
      applicationUnit: value.title,
      register_applicationDept: '',
      register_applicationDeptId: '',
      applicationDept: '',
    });
    SetDetpDrawer(false);
  };

  // 选择部门树结点
  const handleDeptTreeNode = value => {
    setFieldsValue({
      register_applicationDept: value.title,
      register_applicationDeptId: value.key,
      applicationDept: value.title,
    });
    SetDetpDrawer(false);
  };

  // 自动完成单位
  const unitoptions = unitdata.map(opt => (
    <Option key={opt.id} value={opt.id}>
      {opt.deptName}
    </Option>
  ));

  // 自动完成部门
  const deptoptions = deptdata.map(opt => (
    <Option key={opt.id} value={opt.id}>
      {opt.deptName}
    </Option>
  ));

  // 数据字典
  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const eventObject = main.eventObject ? main.eventObject.split() : [''];
  if (eventObject[0] && main.eventObject.length === 6) {
    eventObject.unshift(main.eventObject.slice(0, 3));
  }

  const sourcemap = getTypebykey('486844540120989696'); // 事件来源
  const typemap = getTypebykey('486844495669755904'); // 事件分类
  const objectmap = getTypebykey('482599461999083520'); // 事件对象
  const returnvisit = getTypebykey('486852783895478272'); // 回访方式
  const effectmap = getTypebykey('482610561507393536'); // 影响度
  const emergentmap = getTypebykey('482610561503199232'); // 紧急度
  const priormap = getTypebykey('482610561499004928'); // 优先级



  // 附件上传下载

  // 不允许上传类型
  useEffect(() => {
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
  }, []);

  const handledownload = filesinfo => {
    FileDownload(filesinfo.uid).then(res => {
      const filename = filesinfo.name;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const uploadprops = {
    name: 'file',
    action: '/sys/file/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    showUploadList: { showDownloadIcon: true },
    defaultFileList: files,
    multiple: true,
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if (correctfiletype !== -1) {
          message.error(`${file.name}文件上传失败，不可上传${filetype.join('/')}类型文件！`);
          return reject();
        }
        return resolve(file);
      });
    },

    onChange({ file, fileList }) {
      const alldone = fileList.map(item => item.status !== 'done');
      if (file.status === 'done' && alldone.indexOf(true) === -1) {
        const arr = [...fileList];
        const newarr = [];
        for (let i = 0; i < arr.length; i += 1) {
          const vote = {};
          vote.uid =
            arr[i]?.response?.data[0]?.id !== undefined
              ? arr[i]?.response?.data[0]?.id
              : arr[i].uid;
          vote.name = arr[i].name;
          vote.fileUrl = '';
          vote.status = arr[i].status;
          newarr.push(vote);
        }
        setFilesList([...newarr]);
        ChangeFiles({ arr: [...newarr], ischange: true });
      }
    },
    onPreview(filesinfo) {
      handledownload(filesinfo);
    },
    onDownload(filesinfo) {
      handledownload(filesinfo);
    },
    onRemove(filesinfo) {
      const newfilelist = fileslist.filter(item => item.uid !== filesinfo.uid);

      // 删除文件
      FileDelete(filesinfo.uid).then(res => {
        if (res.code === 200) {
          ChangeFiles({ arr: newfilelist, ischange: true });
        }
      });
    },
  };

  return (
    <>
      <Form {...formItemLayout}>
        <Row gutter={24} style={{ paddingTop: 24 }}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="表单id">
              {getFieldDecorator('register_id', {
                initialValue: register.id,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
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
                initialValue: moment(main.addTime).format('YYYY-MM-DD HH:mm:ss'),
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
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申报人id">
              {getFieldDecorator('register_applicationUserId', {
                initialValue: register.applicationUserId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人单位">
              <InputGroup compact>
                {getFieldDecorator('applicationUnit', {
                  rules: [{ required, message: '请选择申报人单位' }],
                  initialValue: register.applicationUnit,
                })(
                  <AutoComplete
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    open={unitopen}
                    dataSource={unitoptions}
                    optionLabelProp="value"
                    style={{ width: '85%' }}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    onFocus={() => setUnitopen(true)}
                    onBlur={() => {
                      setUnitopen(false);
                      const unit = getFieldsValue(['applicationUnit', 'register_applicationUnit']);
                      if (unit.applicationUnit !== '') {
                        if (unit.applicationUnit !== unit.register_applicationUnit) {
                          setFields({ 'applicationUnit': { value: '', errors: [new Error('请选择申报人单位')] } })
                        }
                      }
                    }}
                    onSelect={(v, opt) => {
                      setUnitRecord({ ...unitrecord, title: opt.props.children, key: v });
                      setFieldsValue({
                        register_applicationUnit: opt.props.children,
                        applicationUnit: opt.props.children,
                        register_applicationUnitId: v,
                        register_applicationDept: '',
                        register_applicationDeptId: '',
                        applicationDept: '',
                      });
                      setUnitdata([]);
                      setUnitopen(false);
                    }}
                  >
                    <Search
                      placeholder="可输入关键字搜索单位"
                      onSearch={values => handleUnitSearch(values)}
                      allowClear
                    />
                  </AutoComplete>,
                )}
                <Button
                  style={{ width: '15%' }}
                  onClick={() => {
                    SetDetpDrawer(!detpdrawer);
                    setTreeType('unit');
                  }}
                >
                  <CaretRightOutlined />
                </Button>
              </InputGroup>
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申报人单位">
              {getFieldDecorator('register_applicationUnit', {
                rules: [{ required, }],
                initialValue: register.applicationUnit,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申报人单位id">
              {getFieldDecorator('register_applicationUnitId', {
                rules: [{ required, }],
                initialValue: register.applicationUnitId,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人部门">
              <InputGroup compact>
                {getFieldDecorator('applicationDept', {
                  rules: [{ message: '请输入关键字' }],
                  initialValue: register.applicationDept,
                })(
                  <AutoComplete
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    open={deptopen}
                    dataSource={deptoptions}
                    optionLabelProp="value"
                    style={{ width: '85%' }}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    onFocus={() => setDeptopen(true)}
                    onBlur={() => {
                      setDeptopen(false);
                      const dept = getFieldsValue(['applicationUnit', 'applicationDept', 'register_applicationDept']);
                      if (dept.applicationUnit !== '') {
                        if (dept.applicationDept !== dept.register_applicationDept) {
                          setFields({ 'applicationDept': { value: '', errors: [new Error('请选择申报人部门')] } });
                        }
                      } else {
                        setFieldsValue({ applicationDept: '' })
                      }
                    }}
                    onSelect={(v, opt) => {
                      setFieldsValue({
                        register_applicationDept: opt.props.children,
                        register_applicationDeptId: v,
                        applicationDept: opt.props.children,
                      });
                      setDeptdata([]);
                      setUnitopen(false);
                    }}
                  >
                    <Search
                      placeholder="可输入关键字搜索部门"
                      onSearch={values => handleDeptSearch(values)}
                      allowClear
                    />
                  </AutoComplete>,
                )}
                <Button
                  style={{ width: '15%' }}
                  onClick={() => {
                    validateFields(
                      ['applicationUnit'],
                      err => {
                        if (!err) {
                          SetDetpDrawer(!detpdrawer);
                          setTreeType('dept');
                        }
                      },
                    );
                  }}
                >
                  <CaretRightOutlined />
                </Button>
              </InputGroup>
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申报人部门">
              {getFieldDecorator('register_applicationDept', {
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
                  {sourcemap.map(obj => (
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>)
                  )}
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
                {getFieldDecorator('mobilePhone1', {
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
                {getFieldDecorator('mobilePhone2', {
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
                  {typemap.map(obj => (
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>)
                  )}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="事件对象">
              {getFieldDecorator('main_eventObject', {
                rules: [{ required, message: '请选择事件对象' }],
                initialValue: eventObject,
              })(
                <Cascader
                  fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                  options={objectmap}
                  onChange={() => handlobjectChange()}
                  placeholder="请选择"
                  expandTrigger="hover"
                  displayRender={displayRender}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访方式">
              {getFieldDecorator('main_revisitWay', {
                rules: [{ required, message: '请选择回访方式' }],
                initialValue: main.revisitWay,
              })(
                <Select placeholder="请选择" onChange={handlrevisitway}>
                  {returnvisit.map(obj => (
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>)
                  )}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="影响度">
              {getFieldDecorator('main_eventEffect', {
                rules: [{ required, message: '请选择影响度' }],
                initialValue: main.eventEffect,
              })(
                <Select placeholder="请选择" onChange={changeHandlevalue}>
                  {effectmap.map(obj => (
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>)
                  )}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="紧急度">
              {getFieldDecorator('main_eventEmergent', {
                rules: [{ required, message: '请选择紧急度' }],
                initialValue: main.eventEmergent,
              })(
                <Select placeholder="请选择" onChange={changeHandlevalue}>
                  {emergentmap.map(obj => (
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>)
                  )}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="优先级">
              {getFieldDecorator('main_eventPrior', {
                rules: [{ required, message: '请选择优先级' }],
                initialValue: main.eventPrior,
              })(
                <Select placeholder="请选择" onChange={changeHandlevalue}>
                  {priormap.map(obj => (
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>)
                  )}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="事件标题" {...forminladeLayout}>
              {getFieldDecorator('main_title', {
                rules: [{ required, message: '请输入事件标题' }],
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
          <Col span={24}>
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
            >
              <div style={{ width: 400 }}>
                <Upload {...uploadprops}>
                  <Button type="primary">
                    <DownloadOutlined /> 上传附件
                  </Button>
                </Upload>
              </div>
            </Form.Item>
          </Col>
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
      <Drawer
        title="组织机构"
        width={320}
        closable={false}
        onClose={onDeptDrawerClose}
        visible={detpdrawer}
      >
        {treetype === 'unit' && (
          <DeptSlectId
            GetTreenode={newvalue => handleUnitTreeNode(newvalue)}
            pid="1"
            deptType="1"
          />
        )}
        {treetype === 'dept' && (
          <DeptSlectId
            GetTreenode={newvalue => handleDeptTreeNode(newvalue)}
            pid={unitrecord.key}
            deptType="2"
          />
        )}
      </Drawer>
    </>
  );
});

Registrat.defaultProps = {
  main: {
    // addTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    content: '',
    eventNo: '',
    eventObject: '',
    eventSource: '001',
    eventType: '',
    revisitWay: '001',
    eventEffect: '001',
    eventEmergent: '001',
    eventPrior: '001',
  },
  info: {
    register: {
      applicationDept: '',
      applicationDeptId: '',
      applicationUnit: '',
      applicationUnitId: '1',
      applicationUser: '',
      applicationUserId: '',
      applicationUserPhone: '',
      mobilePhone: '',
      registerUserId: '',
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
