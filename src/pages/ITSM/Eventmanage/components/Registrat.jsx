import React, { useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
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
import UploadContext from '@/layouts/MenuContext';
import { getAndField } from '@/pages/SysManage/services/api';
import { FileDownload, FileDelete, getFileSecuritySuffix } from '@/services/upload';
import { queryDisableduserByUser, queryUnitList, queryDeptList } from '@/services/common';
import DeptSlectId from '@/components/DeptTree/SelectID';
import { DownloadOutlined, CaretRightOutlined } from '@ant-design/icons';

const InputGroup = Input.Group;
const { Option } = Select;
const { TextArea, Search } = Input;

const Registrat = forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    ChangeShow,
    // ChangeCheck,
    ChangeActiveKey,
    // ChangeFlowtype,
    info,
    main,
    userinfo,
    location,
    files,
    ChangeFiles,
    selectdata,
    loading,
    getUploadStatus,
  } = props;
  const { register } = info;
  const { orderNo } = location.query;
  const { getFieldDecorator, getFieldsValue, setFieldsValue, validateFields, setFields, resetFields } = props.form;
  const required = true;
  // const [check, setCheck] = useState(false);
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
  const [showIcon, setShowIcon] = useState(true);
  const [daileArea, setDaileArea] = useState(true);
  const [banOpenFileDialog, setBanOpenFileDialog] = useState(true);

  const { getRegistUploadStatus, handleUploadStatus, ChangeSubmitType, ChangeButtonName, ChangeUserChoice } = useContext(UploadContext);

  useEffect(() => {
    if (files && files.length > 0) {
      setFilesList(files);
    };
    if (register && register.applicationUnitId !== '') {
      setUnitRecord({ ...unitrecord, key: register.applicationUnitId })
    };
    return () => {
      setUnitRecord('')
    }
  }, [info]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
    geteventObject: props.form.validateFields,
  }), []);

  useEffect(() => {
    if (main.revisitWay === '002') {
      setRevisitway(true);
    }
  }, [info]);

  useEffect(() => {
    if (info && info.register) {
      if (register.isCheck === '1') {
        // ChangeSubmitType((main?.eventObject?.slice(0, 3) === '001' || main?.eventObject?.slice(0, 3) === '005') ? '3' : '4');
        ChangeSubmitType('3');
        ChangeButtonName('审核');
        // sessionStorage.setItem('flowtype', (main?.eventObject?.slice(0, 3) === '001' || main?.eventObject?.slice(0, 3) === '005') ? '3' : '4');
        sessionStorage.setItem('flowtype', '3')
      } else {
        ChangeSubmitType('1');
        ChangeButtonName('处理');
        sessionStorage.setItem('flowtype', '1');
      };
    };
  }, [info]);

  // 自行处理
  const handleself = checked => {
    ChangeShow(checked);
    ChangeSubmitType('1');
    // sessionStorage.setItem('Nextflowmane', checked ? '确认' : '处理');
    sessionStorage.setItem('flowtype', '1');
    if (checked) {
      ChangeButtonName('回访')
      setFieldsValue({ register_isCheck: false });
      ChangeActiveKey(['registratform', 'handleform']);
    } else {
      ChangeButtonName('处理');
      ChangeActiveKey(['registratform']);
    };
    // routerRefresh();
  };

  // 事件分类005，007，008时走审核
  const handlcheckChange = (checked) => {
    // const object = getFieldsValue(['main_eventObject'])?.main_eventObject[0];
    ChangeButtonName(checked ? '审核' : '处理')
    if (checked) {
      // ChangeSubmitType((object === '001' || object === '005') ? '3' : '4');
      ChangeSubmitType('3');
      // sessionStorage.setItem('flowtype', (object === '001' || object === '005') ? '3' : '4');
      sessionStorage.setItem('flowtype', '3')
    } else {
      ChangeSubmitType('1')
      sessionStorage.setItem('flowtype', '1');
    }

    if (checked) {
      ChangeShow(false);
      setFieldsValue({ register_selfhandle: false })
    };
  };

  // 勾选审核时事件对象，档案与高级功能 flowtype:3,其它选项4
  const handlobjectChange = value => {
    setFieldsValue({ main_eventObject: value?.slice(-1)[0] }, () => { });
    const isCheck = getFieldsValue(['register_isCheck'])?.register_isCheck;
    if (isCheck) {
      // ChangeSubmitType((value[0] === '001' || value[0] === '005') ? '3' : '4')
      ChangeSubmitType('3');
      ChangeButtonName('审核');
      // sessionStorage.setItem('flowtype', isCheck ? '3' : '4');
      sessionStorage.setItem('flowtype', '3')
    } else {
      ChangeSubmitType('1');
      ChangeButtonName('处理');
      sessionStorage.setItem('flowtype', '1');
    };
  };

  // 002手机号码必填
  const handlrevisitway = value => {
    if (value === '002') {
      setRevisitway(true);
    } else {
      setRevisitway(false);
    }
  };


  const displayRender = label => {
    return label[label.length - 1];
  };

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
        <div className='disableuser'>
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
  const eventObject = main.eventObject ? main.eventObject.split() : [];
  if (eventObject[0] && main.eventObject.length === 6) {
    eventObject.unshift(main.eventObject.slice(0, 3));
  }

  const sourcemap = getTypebykey(1107); // 事件来源
  const typemap = getTypebykey(1106); // 事件分类
  const objectmap = getTypebykey(1087); // 事件对象
  const returnvisit = getTypebykey(1116); // 回访方式
  const effectmap = getTypebykey(1096); // 影响度
  const emergentmap = getTypebykey(1095); // 紧急度
  const priormap = getTypebykey(1094); // 优先级

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
    showUploadList: { showDownloadIcon: showIcon, showRemoveIcon: showIcon },
    defaultFileList: files,
    multiple: true,
    openFileDialogOnClick: !banOpenFileDialog,

    beforeUpload(file, fileList) {
      return new Promise((resolve, reject) => {
        setShowIcon(false);
        if (getUploadStatus) { getUploadStatus(true) };
        if (getRegistUploadStatus) { getRegistUploadStatus(true) };
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if ((!fileslist && fileList.length > 20) || (fileslist && (fileslist.length + fileList.length) > 20)) {
          if (getUploadStatus) { getUploadStatus(false) };
          message.error(`最多可上传20个文件`);
          setShowIcon(true);
          return reject();
        } if (type > 100) {
          message.error('附件名过长，附件名称最长100个字符');
          return reject();
        } if (correctfiletype === -1) {
          message.error(`${file.name}文件不符合上传规则,禁止上传...`);
          return reject();
        }
        return resolve(file);
      }
      );
    },

    onChange({ file, fileList }) {
      const allsuccess = fileList.map(item => item.response && item.response.fileUploadInfo && item.response.fileUploadInfo.length > 0);
      const alldone = fileList.map(item => item.status !== 'done');
      if (file.status === 'done' && alldone.indexOf(true) === -1 && file.response && file.response.code === 200 && allsuccess.indexOf(true) === -1) {
        const arr = [...fileList];
        const newarr = [];
        for (let i = 0; i < arr.length; i += 1) {
          const vote = {};
          vote.uid = arr[i]?.response?.data[0]?.id !== undefined ? arr[i]?.response?.data[0]?.id : arr[i].uid;
          vote.name = arr[i].name;
          vote.fileUrl = '';
          vote.status = arr[i].status;
          newarr.push(vote);
        }
        setFilesList([...newarr]);
        ChangeFiles({ arr: [...newarr], ischange: true });
        setShowIcon(true);
        if (getUploadStatus) { getUploadStatus(false) };
        if (getRegistUploadStatus) { getRegistUploadStatus(false) };
      }
    },
    onPreview(filesinfo) {
      if (showIcon) {
        handledownload(filesinfo);
      }

    },
    onDownload(filesinfo) {
      handledownload(filesinfo);
    },
    onRemove(filesinfo) {
      const newfilelist = fileslist.filter(item => item.uid !== filesinfo.uid);
      // 删除文件
      if (filesinfo && !filesinfo.lastModified) {
        FileDelete(filesinfo.uid).then(res => {
          if (res.code === 200) {
            ChangeFiles({ arr: newfilelist, ischange: true });
          }
        });
      } else {
        message.success('已中止文件上传');
        setShowIcon(true);
        if (getUploadStatus) { getUploadStatus(false) };
        if (getRegistUploadStatus) { getRegistUploadStatus(false) };
      }
    },
  };

  const handleDoubleClick = (e) => {
    if (e.target) {
      if (!daileArea) {
        const textheight = e.target.scrollHeight + 2;
        e.target.style.maxHeight = '9.0072e+15px';
        e.target.style.height = `${textheight}px`;
      } else {
        e.target.style.maxHeight = '31px';
        e.target.style.height = '31px';
      };
      setDaileArea(!daileArea)
    }
  }

  return (
    <>
      <Form {...formItemLayout}>
        <Row gutter={24}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="表单id">
              {getFieldDecorator('register_id', {
                initialValue: register?.id || '',
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
            <div onClick={e => e.stopPropagation()}>
              <Form.Item label="发生时间">
                {getFieldDecorator('register_occurTime', {
                  rules: [{ required, message: '请选择发生时间' }],
                  initialValue: moment(register?.occurTime || undefined),
                })(<DatePicker
                  showTime
                  placeholder="请选择时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                  allowClear={false}
                />)}
              </Form.Item>
            </div>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人">
              {getFieldDecorator('register_applicationUser', {
                rules: [{ required, message: '请输入申报人' }],
                initialValue: register?.applicationUser,
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
                initialValue: register?.applicationUserId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人单位">
              <InputGroup compact>
                {getFieldDecorator('applicationUnit', {
                  rules: [{ required, message: '请选择申报人单位' }],
                  initialValue: register?.applicationUnit,
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
                rules: [{ required, message: '请通过选择获取申请人单位' }],
                initialValue: register?.applicationUnit,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申报人单位id">
              {getFieldDecorator('register_applicationUnitId', {
                rules: [{ required, message: '请选择申请人单位获取申请单位ID' }],
                initialValue: register?.applicationUnitId,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人部门">
              <InputGroup compact>
                {getFieldDecorator('applicationDept', {
                  rules: [{ message: '请输入关键字' }],
                  initialValue: register?.applicationDept,
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
                initialValue: register?.applicationDept,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申报人部门id">
              {getFieldDecorator('register_applicationDeptId', {
                initialValue: register?.applicationDeptId,
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
                initialValue: register?.applicationUserPhone,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {revisitway && (
            <Col span={8} >
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
                  initialValue: register?.mobilePhone,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          )}
          {!revisitway && (
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
                  initialValue: register?.mobilePhone,
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
                <Select placeholder="请选择" >
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
                  onChange={handlobjectChange}
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
                <Select placeholder="请选择">
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
                <Select placeholder="请选择">
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
                <Select placeholder="请选择">
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
          <Col span={24} style={{ marginBottom: '-10px' }}>
            <Form.Item label="事件描述" {...forminladeLayout}>
              {getFieldDecorator('main_content', {
                rules: [{ required, message: '请输入事件描述' }],
                initialValue: main.content,
              })(
                <AutoComplete
                  dataSource={desautodata}
                  filterOption={(inputValue, option) =>
                    option.props.children.includes(inputValue)
                  }
                //  onSelect={value => handleSearch(value, 'des')}
                >
                  {daileArea ? (<TextArea
                    style={{ height: 31 }}
                    // allowClear
                    placeholder="请输入"
                    onDoubleClick={(e) => handleDoubleClick(e)}
                  />) : (
                    <TextArea
                      autoSize={{ minRows: 1 }}
                      auto
                      // allowClear
                      placeholder="请输入"
                      onDoubleClick={(e) => handleDoubleClick(e)}
                    />)}
                </AutoComplete>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="自行处理">
              {getFieldDecorator('register_selfhandle', {
                valuePropName: 'checked',
                initialValue: Boolean(Number(register?.selfhandle)),
              })(<Checkbox onClick={(e) => handleself(e.target.checked)} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否补单">
              {getFieldDecorator('register_supplement', {
                valuePropName: 'checked',
                initialValue: Boolean(Number(register?.supplement)),
              })(<Checkbox />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否审核">
              {getFieldDecorator('register_isCheck', {
                valuePropName: 'checked',
                initialValue: Boolean(Number(register?.isCheck)),
              })(<Checkbox onChange={(e) => handlcheckChange(e.target.checked)} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="上传附件"  {...forminladeLayout}>
              <div onMouseDown={() => { if (ChangeUserChoice) { ChangeUserChoice(false) } }}>
                {((location && location.state && !location.state.cache) || orderNo) && !loading && (
                  <Upload {...uploadprops} key={localStorage.getItem('tabid')}>
                    <Button
                      type="primary"
                      onMouseDown={() => {
                        setBanOpenFileDialog(true);
                        validateFields(['main_eventObject'], err => {
                          if (err) {
                            message.error('请先选择事件对象');
                          } else if (handleUploadStatus) {
                            message.info('文件正在上传中，请稍后再上传');
                          } else {
                            setBanOpenFileDialog(false);
                          }
                        })
                      }}>
                      <DownloadOutlined /> 上传附件
                    </Button>
                    {filetype && filetype.length > 0 && (
                      <span style={{ color: '#ccc', lineHeight: '20px', paddingLeft: 16 }}>
                        1、仅能上传{filetype.join('，')}类型文件；2、最多可上传20个文件；3、附件名称最长100个字符；
                      </span>
                    )}
                  </Upload>
                )}
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
