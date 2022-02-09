import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, AutoComplete, Button, Select, Drawer, message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import SubmitTypeContext from '@/layouts/MenuContext';
import DeptSlectId from '@/components/DeptTree/SelectID';
import { queryDisableduserByUser, queryUnitList, queryDeptList } from '@/services/common';
import styles from '../index.less';

const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;
const { TextArea, Search } = Input;

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
  labelCol: { sm: { span: 2 } },
  wrapperCol: { sm: { span: 22 } },
};

function TemporaryRegistrat(props, ref) {
  const { taskName, info, userinfo, selectdata, isEdit, listmsg, timeoutinfo } = props;
  const { getFieldDecorator, setFieldsValue, validateFields, setFields, getFieldsValue, resetFields, Spin } = props.form;
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
  const [workload, setWorkLoad] = useState(false);
  const formRef = useRef();


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
    const { user, phone, unit, unitId, dept, deptId } = opt.props.disableuser;
    setFieldsValue({
      applicant: user,
      applicantId: v,
      proposerPhone: phone,
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

  return (
    <>
      <Row gutter={12} style={{ marginTop: 24, }}>
        <Form ref={formRef} {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="临时发布编号">
              {getFieldDecorator('from1', {
                initialValue: info.releaseNo || info.releaseMain.releaseNo || '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('applicant', {
                rules: [{ required, message: '请输入申请人' }],
                initialValue: info.applicant,
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
            <Form.Item label="申请人id">
              {getFieldDecorator('applicantId', {
                initialValue: info.applicantId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人单位">
              <InputGroup compact>
                {getFieldDecorator('Unit', {
                  rules: [{ required, message: '请选择申请人单位' }],
                  initialValue: info.applicantUnit,
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
                rules: [{ required }],
                initialValue: info.applicantUnit,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请单位ID">
              {getFieldDecorator('applicantUnitId', {
                rules: [{ required }],
                initialValue: info.applicantUnitId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人部门">
              <InputGroup compact>
                {getFieldDecorator('Department', {
                  rules: [{ message: '请选择申请人部门' }],
                  initialValue: info.applicantDept,
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
                initialValue: info.applicantDept,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请部门ID">
              {getFieldDecorator('applicantDeptId', {
                initialValue: info.applicantDeptId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="联系电话">
              {getFieldDecorator('proposerPhone', {
                // rules: [
                //   {
                //     required,
                //     // len: 11,
                //     // validator: phone_reg,
                //     message: '请输入联系电话',
                //   },
                // ],
                initialValue: info.proposerPhone,
              })(<Input placeholder="请输入" />)}
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
      releaseNo: '',
      releaseType: '',
      dutyUnit: '',
      releaseStatus: '',
      timeoutTime: undefined,
      remindTime: undefined,
      revisitWay: ''
    },
    releaseRegister: {
      testStart: undefined,
      testEnd: undefined,
      testPlace: '',
      testUnit: '',
      testOperator: '',
      influenceScope: '',
      testResult: ''
    },
  },
};

export default WrappedForm;