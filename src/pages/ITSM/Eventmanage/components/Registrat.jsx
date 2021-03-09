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
} from 'antd';
import { phone_reg } from '@/utils/Regexp';
// import SysUpload from '@/components/SysUpload';
// import styles from '../index.less';
import { getAndField } from '@/pages/SysManage/services/api';
import { FileDownload, FileDelete } from '@/services/upload';
import { DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

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
  const { taskName, taskId, mainId } = location.query;
  const { getFieldDecorator, getFieldsValue, setFieldsValue } = props.form;
  const required = true;
  const [check, setCheck] = useState(false);
  const [revisitway, setRevisitway] = useState(false);
  const [fileslist, setFilesList] = useState([]);
  const [titleautodata, setTitleAutoData] = useState([]);
  const [desautodata, setDestoData] = useState([]);
  const [titlerecords, setTitleRecords] = useState([]);
  const [desrecords, setDesRecords] = useState([]);

  useEffect(() => {
    if (files.length > 0) {
      setFilesList(files);
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
    router.push({
      pathname: location.pathname,
      query: {
        taskName,
        taskId,
        mainId,
        next: sessionStorage.getItem('Nextflowmane'),
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
      //  ChangeFlowtype('3');
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
    setFieldsValue({ main_eventObject: value?.slice(-1)[0] }, () => {});
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
          setTitleAutoData(titlerecords);
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
          setDesRecords(desrecords);
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

  // 数据字典
  const getTypebykey = key => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const eventObject = main.eventObject.split();
  if (main.eventObject.length === 6) {
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
    onChange(filesinfo) {
      if (filesinfo.file.status === 'done') {
        if (filesinfo.file.response.code === 200) {
          message.success(`${filesinfo.file.name} 上传成功`);
          const voice = {};
          voice.uid = filesinfo.file.response.data.id;
          voice.name = filesinfo.file.response.data.fileName;
          voice.status = 'done';
          voice.fileUrl = '';
          fileslist.push(voice);
          ChangeFiles({ arr: fileslist, ischange: true });
        }
        if (filesinfo.file.response.code === -1) {
          message.error(`${info.file.name} 上传失败`);
        }
      } else if (filesinfo.file.status === 'error') {
        message.error(`${filesinfo.file.name} 上传失败.`);
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
      ChangeFiles({ arr: newfilelist, ischange: true });
      // 删除文件
      FileDelete(filesinfo.uid);
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
                  {sourcemap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
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
                  {typemap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
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
                  {returnvisit.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>,
                  ])}
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
                  {effectmap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>,
                  ])}
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
                  {emergentmap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>,
                  ])}
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
                  {priormap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>,
                  ])}
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
      applicationDept: '计量中心',
      applicationDeptId: '7AC3EF0F639302A2E0530A644F130365',
      applicationUnit: '南宁供电局',
      applicationUnitId: '7AC3EF0F718E02A2E0530A644F130365',
      application_user: '',
      applicationUserId: '12121212',
      applicationUserPhone: '',
      mobilePhone: '',
      registerUserId: '1',
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
