import React, { useEffect, useState } from 'react';
import FaultContext from '@/layouts/MenuContext';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Radio,
  Cascader,
  AutoComplete,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import SelectUser from '@/components/SelectUser'; // 选人组件
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import SysDict from '@/components/SysDict';
import { getAndField } from '@/pages/SysManage/services/api';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
// let selectCascader;

const registerLevelmap = new Map([
  ['一般', '001'],
  ['重大', '002'],
  ['紧急', '003'],
]);

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

const forminladeLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

function Registration(props) {
  const pagetitle = props.route.name;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState('');
  const [titleautodata, setTitleAutoData] = useState([]);
  const [desautodata, setDestoData] = useState([]);
  const [titlerecords, setTitleRecords] = useState([]);
  const [desrecords, setDesRecords] = useState([]);
  const [faultUploadStatus, setFaultUploadStatus] = useState(false);
  const [daileArea, setDaileArea] = useState(true);

  const {
    form: { getFieldDecorator, resetFields, getFieldsValue, setFieldsValue },
    dispatch,
    // newno, // 新的故障编号
    curruserinfo, // 获取登录用户信息
    // history,
    // saveuserid: { flowTaskId },
    location,
    tabnew,
    tabdata,
    loading,
  } = props;

  // const cascaderOnchange = (value, selectedOptions) => {
  //   selectCascader = selectedOptions[1].dict_code;
  // }

  // const displayRender = label => {
  //   return label[label.length - 1];
  // };

  // 接口
  // const getNewno = () => {
  //   // 获取新的故障编号
  //   dispatch({
  //     type: 'fault/getFaultRegisterNo',
  //   });
  // };

  const getCurrUserInfo = () => {
    // 获取登录用户信息
    dispatch({
      type: 'fault/fetchuser',
    });
  };

  useEffect(() => {
    //  getNewno(); // 新的故障编号
    getCurrUserInfo(); // 获取登录用户信息
    sessionStorage.setItem('Processtype', 'troub');
    sessionStorage.setItem('Nextflowmane', '处理');
  }, []);

  const close = () => {
    router.push({
      pathname: `/ITSM/faultmanage/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
    });
  };

  const handleSave = () => {
    // 保存成功后根据后端给的流程ID跳待办里的详情
    const formValues = getFieldsValue();
    dispatch({
      type: 'fault/getSaveUserId',
      payload: {
        formValues: {
          ...formValues,
          registerOccurTime: formValues.registerOccurTime.format('YYYY-MM-DD HH:mm:ss'),
          registerTime: formValues.registerTime.format('YYYY-MM-DD HH:mm:ss'),
          registerLevelCode: registerLevelmap.get(formValues.registerLevel), // 超时用：一般001，重大002，紧急003
          editState: 'add',
          registerAttachments: JSON.stringify(files.arr),
          type: formValues.type?.slice(-1)[0],
        },
      },
    });
  };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handleSave();
    }
  }, [files]);

  const required = true;

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

  // 打开多页签，表单信息传回tab
  useEffect(() => {
    if (tabnew) {
      resetFields();
    }
  }, [tabnew]);

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        const formValues = getFieldsValue();
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...formValues,
              registerOccurTime: formValues.registerOccurTime.format('YYYY-MM-DD HH:mm:ss'),
              registerTime: formValues.registerTime.format('YYYY-MM-DD HH:mm:ss'),
              registerLevelCode: registerLevelmap.get(formValues.registerLevel), // 超时用：一般001，重大002，紧急003
              editState: 'add',
              registerAttachments: JSON.stringify(files.arr),
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
    }
    resetFields();
  }, [location]);

  // 常用语调用
  useEffect(() => {
    handletitleSearch({ module: '故障单', field: '标题', key: '' });
    handledesSearch({ module: '故障单', field: '描述', key: '' });
  }, [location]);

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [location];
  };
  const faultSource = getTypebyTitle('故障来源');
  const sysmodular = getTypebyTitle('故障系统模块');
  const priority = getTypebyTitle('严重程度');
  const effect = getTypebyTitle('影响范围');
  const faultType = getTypebyTitle('故障分类');

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={handleSave}
        disabled={faultUploadStatus}
      >
        保存
      </Button>
      <Button type="default" onClick={() => close()}>
        关闭
      </Button>
    </>
  );

  const cacheinfo =
    tabdata === undefined
      ? { registerLevel: '一般', registerEffect: '', registerMaster: '' }
      : tabdata;

  const handleDoubleClick = e => {
    if (e.target) {
      if (!daileArea) {
        const textheight = e.target.scrollHeight + 2;
        e.target.style.maxHeight = '9.0072e+15px';
        e.target.style.height = `${textheight}px`;
      } else {
        e.target.style.maxHeight = '31px';
        e.target.style.height = '31px';
      }
      setDaileArea(!daileArea);
    }
  };

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <SysDict
        typeid="333"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <div className="noexplain noregpad">
        <Card>
          <FaultContext.Provider
            value={{
              getUploadStatus: v => {
                setFaultUploadStatus(v);
              },
            }}
          >
            <Form {...formItemLayout}>
              <Row gutter={24}>
                <Col xl={8} xs={12}>
                  <Form.Item label="故障编号">
                    {getFieldDecorator('no', {
                      initialValue: '',
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
                <Col xl={8} xs={12}>
                  <Form.Item label="登记时间">
                    {getFieldDecorator('registerTime', {
                      initialValue: moment(
                        cacheinfo && cacheinfo.registerTime ? cacheinfo.registerTime : undefined,
                      ),
                    })(
                      <>
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          defaultValue={moment(
                            cacheinfo && cacheinfo.registerTime
                              ? cacheinfo.registerTime
                              : undefined,
                          )}
                          onChange={v => {
                            setFieldsValue({ registerTime: moment(v) });
                          }}
                        />
                      </>,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="发生时间">
                    {getFieldDecorator('registerOccurTime', {
                      initialValue: moment(
                        cacheinfo && cacheinfo.registerOccurTime
                          ? cacheinfo.registerOccurTime
                          : undefined,
                      ),
                    })(
                      <>
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          defaultValue={moment(
                            cacheinfo && cacheinfo.registerOccurTime
                              ? cacheinfo.registerOccurTime
                              : undefined,
                          )}
                          onChange={v => {
                            setFieldsValue({ registerOccurTime: moment(v) });
                          }}
                        />
                      </>,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障来源">
                    {getFieldDecorator('source', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                      initialValue: cacheinfo.source || '',
                    })(
                      <Select getPopupContainer={e => e.parentNode} placeholder="请选择">
                        {faultSource.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="系统模块">
                    {getFieldDecorator('registerModel', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                      initialValue: cacheinfo.registerModel || '',
                    })(
                      <Select getPopupContainer={e => e.parentNode} placeholder="请选择">
                        {sysmodular.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障类型">
                    {getFieldDecorator('type', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                      initialValue: cacheinfo.type || [''],
                    })(
                      <Cascader
                        getPopupContainer={e => e.parentNode}
                        placeholder="请选择"
                        options={faultType}
                        fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障地点">
                    {getFieldDecorator('registerAddress', {
                      rules: [
                        {
                          required,
                          message: '请输入',
                        },
                      ],
                      initialValue: cacheinfo.registerAddress || '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="严重程度">
                    {getFieldDecorator('registerLevel', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                      initialValue: cacheinfo.registerLevel || '',
                    })(
                      <Select getPopupContainer={e => e.parentNode} placeholder="请选择">
                        {priority.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="影响范围">
                    {getFieldDecorator('registerScope', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                      initialValue: cacheinfo.registerScope || '',
                    })(
                      <Select getPopupContainer={e => e.parentNode} placeholder="请选择">
                        {effect.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="故障名称" {...forminladeLayout}>
                    {getFieldDecorator('title', {
                      rules: [
                        {
                          required,
                          message: '请输入',
                        },
                      ],
                      initialValue: cacheinfo.title || '',
                    })(
                      <AutoComplete
                        getPopupContainer={e => e.parentNode}
                        dataSource={titleautodata}
                        onSearch={value => handleSearch(value, 'title')}
                      >
                        <Input placeholder="请输入" />
                      </AutoComplete>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="故障概要" {...forminladeLayout}>
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required,
                          message: '请输入',
                        },
                      ],
                      initialValue: cacheinfo.content || '',
                    })(
                      <AutoComplete
                        getPopupContainer={e => e.parentNode}
                        dataSource={desautodata}
                        filterOption={(inputValue, option) =>
                          option.props.children.includes(inputValue)
                        }
                      >
                        {daileArea ? (
                          <TextArea
                            style={{ height: 31 }}
                            allowClear
                            placeholder="请输入"
                            onDoubleClick={e => handleDoubleClick(e)}
                          />
                        ) : (
                          <TextArea
                            autoSize={{ minRows: 1 }}
                            auto
                            allowClear
                            placeholder="请输入"
                            onDoubleClick={e => handleDoubleClick(e)}
                          />
                        )}
                      </AutoComplete>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="是否影响业务">
                    {getFieldDecorator('registerEffect', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                      initialValue: cacheinfo.registerEffect || '0',
                    })(
                      <RadioGroup>
                        <Radio value="0">是</Radio>
                        <Radio value="1">否</Radio>
                      </RadioGroup>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={16}>
                  <Form.Item label="是否影响计量主站" {...forminladeLayout1}>
                    {getFieldDecorator('registerMaster', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                      initialValue: cacheinfo.registerMaster || '0',
                    })(
                      <RadioGroup>
                        <Radio value="0">是</Radio>
                        <Radio value="1">否</Radio>
                      </RadioGroup>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="上传附件"
                    {...forminladeLayout}
                    // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
                  >
                    {location &&
                    location.state &&
                    !location.state.cache &&
                    !loading && ( // 位置已调
                        <div>
                          <SysUpload
                            fileslist={files.arr}
                            ChangeFileslist={newvalue => setFiles(newvalue)}
                          />
                        </div>
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerUser', {
                      initialValue: curruserinfo.userName,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人单位">
                    {getFieldDecorator('registerUnit', {
                      initialValue: curruserinfo.unitName || '',
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人部门">
                    {getFieldDecorator('registerDept', {
                      initialValue: curruserinfo.deptName || '',
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </FaultContext.Provider>
        </Card>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ fault, viewcache, loading }) => ({
    tabnew: viewcache.tabnew,
    tabdata: viewcache.tabdata,
    newno: fault.newno, // 获取新的故障编号
    curruserinfo: fault.userinfo, // 获取登录用户信息
    saveuserid: fault.saveuserid, // 保存用户数据携带的id
    html: fault.html,
    loading: loading.models.fault,
  }))(Registration),
);
