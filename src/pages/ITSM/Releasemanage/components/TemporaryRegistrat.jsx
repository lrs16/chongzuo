import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, AutoComplete, Button, Select, Drawer, DatePicker, Radio, Spin } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import DeptSlectId from '@/components/DeptTree/SelectID';
import { queryDisableduserByUser, queryUnitList, queryDeptList } from '@/services/common';
import SysUpload from '@/components/SysUpload/Upload';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import EditeTable from './TempEditeTable';
import styles from '../index.less';

const InputGroup = Input.Group;
const { Option } = Select;
const { TextArea, Search } = Input;
const RadioGroup = Radio.Group;

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

const formuintLayout = {
  labelCol: { sm: { span: 24 } },
  wrapperCol: { sm: { span: 24 } },
};

const formLayout = {
  labelCol: { sm: { span: 2 } },
  wrapperCol: { sm: { span: 22 } },
};

function TemporaryRegistrat(props, ref) {
  const { taskName, info, userinfo, selectdata, isEdit, uploadStatus, loading, operationList, location, taskId } = props;
  const { getFieldDecorator, setFieldsValue, validateFields, setFields, getFieldsValue, resetFields } = props.form;
  const required = true;
  const [disablelist, setDisabledList] = useState([]); // 自动完成下拉列表
  const [spinloading, setSpinLoading] = useState(true); // 自动完成加载
  const [detpdrawer, SetDetpDrawer] = useState(false); // 组织
  const [treetype, setTreeType] = useState(''); // 组织类型（单位，部门）
  const [unitrecord, setUnitRecord] = useState(''); // 自动完成选择的单位信息
  const [unitdata, setUnitdata] = useState([]); // 自动完成单位下拉表
  const [deptdata, setDeptdata] = useState([]); // 自动完成部门下拉表
  const [unitopen, setUnitopen] = useState(false);
  const [deptopen, setDeptopen] = useState(false);

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  // 校验发布清单
  const releaseListsValidator = (rule, value, callback) => {
    if (!value || value.length === 0) {
      callback()
    } if (operationList) {
      let target = []
      if (taskName === '新建' || taskName === '出厂测试') {
        target = value.filter(item => !item.module || !item.abilityType || !item.module || !item.appName || !item.problemType || !item.testMenu || !item.testResult || !item.testStep || !item.developer || !item.responsible);
        if (target.length > 0) {
          callback(`请填写完整的发布清单信息`);
        } else {
          callback()
        }
      } else if (taskName === '平台验证') {
        target = value.filter(item => !item.tempPlatformResult || !item.tempPlatformVerifier);
        if (target.length > 0) {
          callback(`发布清单未全部验证`);
        } else {
          callback();
        };
      } else if (taskName === '科室负责人审核') {
        target = value.filter(item => !item.tempDirectorResult || !item.tempDirector);
        if (target.length > 0) {
          callback(`发布清单未全部审核`);
        } else {
          callback();
        };
      } else if (taskName === '发布验证') {
        target = value.filter(item => !item.tempValidateResult || !item.tempValidateVerifier);
        if (target.length > 0) {
          callback(`发布清单未全部验证`);
        } else {
          callback();
        };
      } else if (taskName === '业务复核') {
        target = value.filter(item => !item.tempReviewResult || !item.tempReviewVerifier);
        if (target.length > 0) {
          callback(`发布清单未全部复核`);
        } else {
          callback();
        };
      };
    } else {
      callback()
    }
  }
  // 自动完成报障用户
  const disableduser = disablelist.map(opt => {
    return (
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
    )
  })

  // 请求报障用户
  const SearchDisableduser = value => {
    queryDisableduserByUser({ user: value || '' }).then(res => {
      if (res) {
        const arr = res.map(item => ({ ...item }));
        setSpinLoading(false);
        setDisabledList(arr);
      }
    });
  };

  // 选择报障用户，信息回填
  const handleDisableduser = (v, opt) => {
    const { user, phone, unit, unitId, dept, deptId } = opt.props.disableuser;
    setFieldsValue({
      applicant: user,
      applicantId: v,
      tel: phone,
      applicantUnit: unit,
      Unit: unit,
      applicantUnitId: unitId,
      applicantDept: dept,
      applicantDeptId: deptId,
      Department: dept,
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
    const u = getFieldsValue(['applicantUnit']);
    if (!u.applicantUnit) {
      setFields({
        'Unit': {
          value: '',
          errors: [new Error('请选择申报人单位')],
        },
      })
    }
    if (!value && !u.applicantUnit) {
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
      applicantUnit: value.title,
      applicantUnitId: value.key,
      Unit: value.title,
      applicantDept: '',
      applicantDeptId: '',
      Department: '',
    });
    SetDetpDrawer(false);
  };

  // 选择部门树结点
  const handleDeptTreeNode = value => {
    setFieldsValue({
      applicantDept: value.title,
      applicantDeptId: value.key,
      Department: value.title,
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

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0]?.children || [];
    }
    return [];
  };

  const unitmap = getTypebyId(1052);       // 责任单位
  const grademap = getTypebyId(514);      // 发布等级
  const reasonmap = getTypebyId(13277);      // 变更原因
  const functionmap = getTypebyId(451);   // 功能类型
  const modulamap = getTypebyId(466);     // 模块

  return (
    <>
      <Row gutter={12} style={{ marginTop: 24, }}>
        <Form ref={formRef} {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="临时发布编号">
              {getFieldDecorator('releaseNo', {
                initialValue: info.releaseMain?.releaseNo || '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="程序版本号">
              {getFieldDecorator('versionNo', {
                initialValue: info?.releaseMain?.currentVersion || '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请发布等级">
              {getFieldDecorator('releaseLevel', {
                rules: [{ required, message: `请选择发布等级` }],
                initialValue: info?.tempRegister?.releaseLevel || '',
              })(
                <Select placeholder="请选择" disabled={!isEdit}>
                  {grademap.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('applicant', {
                rules: [{ required, message: '请输入申请人' }],
                initialValue: info?.tempRegister?.applicant || '',
              })(
                <AutoComplete
                  dataSource={disableduser}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 600 }}
                  onSelect={(v, opt) => handleDisableduser(v, opt)}
                  disabled={!isEdit}
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
            <Form.Item label="申请人id">
              {getFieldDecorator('applicantId', {
                initialValue: info?.tempRegister?.applicantId || '',
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人单位">
              <InputGroup compact>
                {getFieldDecorator('Unit', {
                  rules: [{ required, message: '请选择申请人单位' }],
                  initialValue: info?.tempRegister?.applicantUnit || '',
                })(
                  <AutoComplete
                    disabled={!isEdit}
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
                      const unit = getFieldsValue(['Unit', 'applicantUnit']);
                      if (unit.Unit !== '') {
                        if (unit.Unit !== unit.applicantUnit) {
                          setFields({ 'Unit': { value: '', errors: [new Error('请选择申请人单位')] } })
                        }
                      }
                    }}
                    onSelect={(v, opt) => {
                      setUnitRecord({ ...unitrecord, title: opt.props.children, key: v });
                      setFieldsValue({
                        applicantUnit: opt.props.children,
                        applicantUnitId: v,
                        Unit: opt.props.children,
                        applicantDept: '',
                        applicantDeptId: '',
                        Department: '',
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
                  disabled={!isEdit}
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
            <Form.Item label="申请单位">
              {getFieldDecorator('applicantUnit', {
                rules: [{ required, message: '请通过选择获取申请单位' }],
                initialValue: info?.tempRegister?.applicantUnit || '',
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请单位ID">
              {getFieldDecorator('applicantUnitId', {
                rules: [{ required, message: '请选择申请单位获取申请单位ID' }],
                initialValue: info?.tempRegister?.applicantUnitId || '',
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人部门">
              <InputGroup compact>
                {getFieldDecorator('Department', {
                  rules: [{ message: '请选择申请人部门' }],
                  initialValue: info?.tempRegister?.applicantDept || '',
                })(
                  <AutoComplete
                    disabled={!isEdit}
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
                      const dept = getFieldsValue(['Unit', 'Department', 'applicantDept']);
                      if (dept.Unit !== '') {
                        if (dept.Department !== dept.applicantDept) {
                          setFields({ 'Department': { value: '', errors: [new Error('请选择申报人部门')] }, })
                        };
                      } else {
                        setFieldsValue({ Department: '' })
                      }
                    }}
                    onSelect={(v, opt) => {
                      setFieldsValue({
                        applicantDept: opt.props.children,
                        applicantDeptId: v,
                        Department: opt.props.children,
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
                  disabled={!isEdit}
                  style={{ width: '15%' }}
                  onClick={() => {
                    validateFields(['Unit'], err => {
                      if (!err) {
                        SetDetpDrawer(!detpdrawer);
                        setTreeType('dept');
                      }
                    });
                  }}
                >
                  <CaretRightOutlined />
                </Button>
              </InputGroup>
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请部门">
              {getFieldDecorator('applicantDept', {
                initialValue: info?.tempRegister?.applicantDept || '',
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请部门ID">
              {getFieldDecorator('applicantDeptId', {
                initialValue: info?.tempRegister?.applicantDeptId || '',
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="联系电话">
              {getFieldDecorator('tel', {
                rules: [{ required, message: '请输入联系电话' }],
                initialValue: info?.tempRegister?.tel || '',
              })(<Input placeholder="请输入" disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计划工作开始时间" >
              {getFieldDecorator('planStart', {
                rules: [{ required, message: `请选择计划工作开始时间` }],
                initialValue: moment(info?.tempRegister?.planStart),
              })(
                <div>
                  {info.tempRegister?.planStart && (<DatePicker
                    disabled={!isEdit}
                    showTime
                    placeholder="请选择时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    // disabled={!isEdit}
                    style={{ width: '100%' }}
                    defaultValue={moment(info?.tempRegister?.planStart)}
                    onChange={(v) => { setFieldsValue({ planStart: moment(v).format('YYYY-MM-DD HH:mm:ss') }) }}
                    disabledDate={(v) => {
                      const dates = getFieldsValue(['planEnd']);
                      return v && v > moment(dates.planEnd);
                    }}
                  />)}
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计划工作结束时间">
              {getFieldDecorator('planEnd', {
                rules: [{ required, message: `请选择计划工作结束时间` }],
                initialValue: moment(info?.tempRegister?.planEnd),
              })(
                <div>
                  {info.tempRegister?.planEnd && (<DatePicker
                    disabled={!isEdit}
                    showTime
                    placeholder="请选择时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    // disabled={!isEdit}
                    style={{ width: '100%' }}
                    defaultValue={moment(info?.tempRegister?.planEnd)}
                    onChange={(v) => { setFieldsValue({ planEnd: moment(v).format('YYYY-MM-DD HH:mm:ss') }) }}
                    disabledDate={(v) => {
                      const dates = getFieldsValue(['planStart']);
                      return v && v < moment(dates.planStart);
                    }}
                  />)}
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="停止业务访问" >
              {getFieldDecorator('stopBiz', {
                rules: [{ required, message: `请选择是否停止业务访问` }],
                initialValue: info.tempRegister ? info.tempRegister.stopBiz : '',
              })(
                <RadioGroup disabled={!isEdit} >
                  <Radio value='是'>是</Radio>
                  <Radio value='否'>否</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="变更原因" >
              {getFieldDecorator('changeReason', {
                rules: [{ required, message: `请选择变更原因` }],
                initialValue: info?.tempRegister?.changeReason && info.tempRegister.changeReason.length > 0 ? info.tempRegister.changeReason.split(',') : [],
              })(
                <Select placeholder="请选择" mode="multiple" disabled={!isEdit}>
                  {reasonmap.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="责任单位">
              {getFieldDecorator('dutyUnit', {
                rules: [{ required, message: `请选择责任单位` }],
                initialValue: info?.releaseMain?.dutyUnit || '',
              })(
                <Select placeholder="请选择" disabled={!isEdit}>
                  {unitmap.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24} >
            <Form.Item label="受影响业务范围" {...formuintLayout} labelAlign='left'>
              {getFieldDecorator('affectedScope', {
                rules: [{ required, message: `请填写受影响业务范围` }],
                initialValue: info?.tempRegister?.affectedScope || '',
              })(
                <TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <EditeTable
              key={location?.query?.tabid || taskId}
              title='发布清单'
              functionmap={functionmap}
              modulamap={modulamap}
              isEdit={operationList}
              taskName={taskName}
              dataSource={info.releaseListList}
              ChangeValue={v => { setFieldsValue({ releaseListList: v }); }}
              listmsg={info.releaseMsg}
              location={location}
            />
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('releaseListList', {
                rules: [{ required, message: '请填写发布清单' }, {
                  validator: releaseListsValidator
                }],
                initialValue: info.releaseListList,
              })(
                <></>
              )}
            </Form.Item>
          </Col>
          <Col span={24} >
            <Form.Item label="实施负责人" {...formuintLayout} labelAlign='left'>
              {getFieldDecorator('practicer', {
                rules: [{ required, message: `请填写实施负责人` }],
                initialValue: info?.tempRegister?.practicer || '',
              })(
                <TextArea autoSize={{ minRows: 1 }} disabled={!isEdit} />
              )}
            </Form.Item>
          </Col>
          <Col span={24} >
            <Form.Item label="实施监护人" {...formuintLayout} labelAlign='left'>
              {getFieldDecorator('guarder', {
                rules: [{ required, message: `请填写实施监护人` }],
                initialValue: info?.tempRegister?.guarder || '',
              })(
                <TextArea autoSize={{ minRows: 1 }} disabled={!isEdit} />
              )}
            </Form.Item>
          </Col>
          <Col span={24} >
            <Form.Item label="实施人员" {...formuintLayout} labelAlign='left'>
              {getFieldDecorator('member', {
                rules: [{ required, message: `请填写实施人员` }],
                initialValue: info?.tempRegister?.member || '',
              })(
                <TextArea autoSize={{ minRows: 1 }} disabled={!isEdit} />
              )}
            </Form.Item>
          </Col>
          <Col span={24} >
            <Form.Item label="发布操作关键步骤" {...formuintLayout} labelAlign='left'>
              {getFieldDecorator('releaseStep', {
                rules: [{ required, message: `请填写发布操作关键步骤` }],
                initialValue: info?.tempRegister?.releaseStep || '',
              })(
                <TextArea autoSize={{ minRows: 3 }} disabled={!isEdit} />
              )}
            </Form.Item>
          </Col>
          <Col span={24} >
            <Form.Item label='风险预估及防范措施' {...formuintLayout} labelAlign='left'>
              {getFieldDecorator('risks', {
                rules: [{ required, message: `请填写风险预估及防范措施` }],
                initialValue: info?.tempRegister?.risks || '',
              })(
                <TextArea autoSize={{ minRows: 3 }} disabled={!isEdit} />
              )}
            </Form.Item>
          </Col>
          {isEdit && (<Col span={24}>
            <Form.Item label='上传附件' {...formLayout}>
              {getFieldDecorator('attach', {
                initialValue: info?.tempRegister?.attach || '[]',
              })(
                <>{!loading && (
                  <SysUpload
                    banOpenFileDialog={uploadStatus}
                    filelist={info?.tempRegister?.attach ? JSON.parse(info.tempRegister.attach) : []}
                  />
                )}</>
              )}
            </Form.Item>
          </Col>)}
          {info.tempRegister.attach && !isEdit && <Col span={24}>
            <Downloadfile files={info.tempRegister.attach || '[]'} />
          </Col>}
          <Col span={8}>
            <Form.Item label="登记人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('register', {
                rules: [{ required, message: `请输入登记人` }],
                initialValue: userinfo && (taskName === '出厂测试' || taskName === '新建') ? userinfo.userName : info.tempRegister.register,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('registerTime', {
                rules: [{ required, message: `请选择登记时间` }],
                initialValue: moment(info?.tempRegister?.registerTime || undefined).format('YYYY-MM-DD HH:mm:ss'),
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记单位" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('registerUnit', {
                rules: [{ required, message: `请选择登记单位` }],
                initialValue: userinfo && (taskName === '出厂测试' || taskName === '新建') ? userinfo.unitName : info.tempRegister.registerUnit,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
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
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(TemporaryRegistrat))

WrappedForm.defaultProps = {
  info: {
    releaseMain: {
      id: '',
      releaseNo: '',
      releaseType: '',
      dutyUnit: '',
      releaseStatus: '',
      timeoutTime: undefined,
      remindTime: undefined,
      revisitWay: ''
    },
    tempRegister: {
      applicant: "",
      applicantId: "",
      applicantUnit: "",
      applicantUnitId: "",
      tel: "",
      versionNo: "",
      releaseLevel: "",
      planStart: "",
      planEnd: "",
      stopBiz: "",
      changeReason: "",
      dutyUnit: "",
      dutyUnitId: "",
      affectedScope: "",
      practicer: "",
      guarder: "",
      member: "",
      releaseStep: "",
      risks: "",
      attach: ""
    },
  },
};

export default WrappedForm;