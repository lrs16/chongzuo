import React, { useEffect, useState } from 'react';
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
  Collapse,
  Cascader
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import SelectUser from '@/components/SelectUser'; // 选人组件
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import SysDict from '@/components/SysDict';
import styles from './index.less';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
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

function Registration(props) {
  const pagetitle = props.route.name;
  const [activeKey, setActiveKey] = useState(['1']);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState([]);

  const {
    form: { getFieldDecorator, resetFields, validateFields, },
    dispatch,
    newno, // 新的故障编号
    curruserinfo, // 获取登录用户信息
    // history,
    // saveuserid: { flowTaskId },
  } = props;

  // 接口
  const getNewno = () => { // 获取新的故障编号
    dispatch({
      type: 'fault/getFaultRegisterNo'
    });
  }
  
  const getCurrUserInfo = () => {  // 获取登录用户信息
    dispatch({
      type: 'fault/fetchuser'
    });
  }

  useEffect(() => {
    getNewno(); // 新的故障编号
    getCurrUserInfo(); // 获取登录用户信息
    sessionStorage.setItem('Processtype', 'troub');
    sessionStorage.setItem('Nextflowmane', '审核');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('flowtype', '1');
  }, ['1']);

  const close = () => { // 关闭
    resetFields();
    router.push(`/ITSM/faultmanage/todolist`);
  };

  const callback = key => {
    setActiveKey(key);
  };

  const handleSave = () => { // 保存成功后根据后端给的流程ID跳待办里的详情
    validateFields((err, values) => {
      if (!err) {
        const formValues = values;
        formValues.registerOccurTime = values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.registerTime = values.registerTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.editState = 'add';
        formValues.registerAttachments = JSON.stringify(files.arr);
        formValues.type = values.type.join('/');
        dispatch({
          type: 'fault/getSaveUserId',
          payload: { formValues }
        })
      }
    });
  }

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handleSave();
    }
  }, [files]);

  const required = true;

  // const faultcircula = () => { // 流转
  //   validateFields((err, values) => {
  //     if (!err) {
  //       const formValues = values;
  //       formValues.registerOccurTime = values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
  //       formValues.registerTime = values.registerTime.format('YYYY-MM-DD HH:mm:ss');
  //       // formValues.taskId = id.flowTaskId;
  //       formValues.editState = 'add';
  //       formValues.registerEffect = String(formValues.registerEffect);
  //       dispatch({
  //         type: 'fault/getSaveUserId1',
  //         payload: { formValues }
  //       })
  //     }
  //   });
  // }

  const getTypebyTitle = (title) => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const faultSource = getTypebyTitle('故障来源');
  const sysmodular = getTypebyTitle('故障系统模块');
  const priority = getTypebyTitle('严重程度');
  const effect = getTypebyTitle('影响范围');
  const faultType = getTypebyTitle('故障分类');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1354278126724583426"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'non' }}
      />
      <Card style={{ textAlign: 'right' }}>
        <Button type="primary" style={{ marginRight: 8 }} onClick={handleSave}>
          保存
            </Button>
        {/* <SelectUser handleSubmit={() => faultcircula()}>
          <Button type="primary" style={{ marginRight: 8 }}>流转</Button>
        </SelectUser> */}
        <Button type="default" onClick={close}>关闭</Button>
      </Card>
      <div className={styles.collapse}>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          style={{ marginTop: '-25px' }}
          onChange={callback}
        >
          <Panel header="故障登记" key="1">
            <Form {...formItemLayout}>
              <Row gutter={24} style={{ paddingTop: 24 }}>
                <Col xl={8} xs={12}>
                  <Form.Item label="故障编号">
                    {getFieldDecorator('no', {
                      initialValue: newno.troubleNo || '',
                    })(<Input placeholder="请输入" disabled />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="登记时间">
                    {getFieldDecorator('registerTime', {
                      rules: [
                        {
                          required,
                          message: '请选择时间',
                        },
                      ],
                      initialValue: moment(Date.now()) || ''
                    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="发生时间">
                    {getFieldDecorator('registerOccurTime', {
                      rules: [
                        {
                          required,
                          message: '请选择时间',
                        },
                      ],
                      initialValue: moment(Date.now()) || ''
                    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label='故障来源'>
                    {getFieldDecorator('source', {
                      rules: [
                        {
                          required,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select placeholder="请选择">
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
                    })(
                      <Select placeholder="请选择">
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
                    })(
                      <Cascader
                        placeholder="请选择"
                        options={faultType}
                        fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                      />
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
                    })(
                      <Select placeholder="请选择">
                        {priority.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>
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
                    })(
                      <Select placeholder="请选择">
                        {effect.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="故障名称">
                    {getFieldDecorator('title', {
                      rules: [
                        {
                          required,
                          message: '请输入',
                        },
                      ],
                    })(<Input placeholder="请输入" allowClear />)}
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
                    })(<TextArea rows={5} placeholder="请输入" />)}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="是否影响业务" {...forminladeLayout}>
                    {getFieldDecorator('registerEffect', {
                      initialValue: 0,
                    })(
                      <RadioGroup>
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
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
                    <div style={{ width: 400 }}>
                      <SysUpload fileslist={files.arr} ChangeFileslist={newvalue => setFiles(newvalue)} />
                    </div>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerUser', {
                      initialValue: curruserinfo.userName || '',
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
          </Panel>
        </Collapse>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ fault, loading }) => ({
    newno: fault.newno, // 获取新的故障编号
    curruserinfo: fault.userinfo, // 获取登录用户信息
    saveuserid: fault.saveuserid, // 保存用户数据携带的id
    html: fault.html,
    loading: loading.models.fault,
  }))(Registration),
);