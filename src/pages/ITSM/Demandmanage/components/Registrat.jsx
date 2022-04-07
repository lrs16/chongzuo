import React, { useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Cascader,
  AutoComplete,
  Spin,
  Button,
  Drawer,
} from 'antd';
import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';
import { queryDisableduserByUser, queryUnitList, queryDeptList } from '@/services/common';
import DeptSlectId from '@/components/DeptTree/SelectID';
import { CaretRightOutlined } from '@ant-design/icons';
import { querkeyVal } from '@/services/api';
import FormTextArea from '@/components/FormTextArea';
import styles from './style.less';

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

const Registrat = forwardRef((props, ref) => {
  const { register, userinfo, files, ChangeFiles, location, selectdata, loading } = props;
  const { getFieldDecorator, setFieldsValue, validateFields, setFields, getFieldsValue, resetFields } = props.form;
  const required = true;
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 附件上传下载
  const [titleautodata, setTitleAutoData] = useState([]); // 预加载标题常用语
  const [desautodata, setDestoData] = useState([]); // 预加载描述常用语
  const [titlerecords, setTitleRecords] = useState([]); // 标题常用语
  const [desrecords, setDesRecords] = useState([]); // 描述常用语
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
  const [daileArea, setDaileArea] = useState(true);

  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
    }
  }, [fileslist]);

  useEffect(() => {
    setFilesList({ ...fileslist, arr: files });
    if (register.proposingUnitId !== '') {
      setUnitRecord({ ...unitrecord, key: register.proposingUnitId })
    }
    return () => {
      setUnitRecord('')
    }
  }, [register]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  useEffect(() => {
    if (location && location.query && location.query.mainId) {
      const { taskName, taskId, mainId } = location.query;
      router.push({
        pathname: location.pathname,
        query: {
          taskId,
          taskName,
          mainId,
          result: '1',
        },
        state: { ...location.state, reset: false }
      });
    }
    sessionStorage.setItem('flowtype', 1);
  }, []);

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
      proposer: user,
      proposerId: v,
      proposerPhone: phone,
      proposingUnit: unit,
      Unit: unit,
      proposingUnitId: unitId,
      proposingDepartment: dept,
      proposingDepartmentId: deptId,
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
    const u = getFieldsValue(['proposingUnit']);
    if (u.proposingUnit === '') {
      setFields({
        'Unit': {
          value: '',
          errors: [new Error('请选择申报人单位')],
        },
      })
    }
    if (value !== '' && u.proposingUnit !== '') {
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
      proposingUnit: value.title,
      proposingUnitId: value.key,
      Unit: value.title,
      proposingDepartment: '',
      proposingDepartmentId: '',
      Department: '',
    });
    SetDetpDrawer(false);
  };

  // 选择部门树结点
  const handleDeptTreeNode = value => {
    setFieldsValue({
      proposingDepartment: value.title,
      proposingDepartmentId: value.key,
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

  useEffect(() => {
    handletitleSearch({ module: '需求单', field: '标题', key: '' });
    handledesSearch({ module: '需求单', field: '描述', key: '' });
    querkeyVal('demand', 'workload').then(res => {
      if (res.code === 200) {
        setWorkLoad(res.data.workload)
      }
    });
  }, []);

  const getTypebyTitle = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const demandtype = getTypebyTitle(195);   // 需求类型
  const prioritymap = getTypebyTitle(270);  // 需求优先级
  const projectmap = getTypebyTitle(329);   // 所属项目
  const modulemap = getTypebyTitle(198);    // 功能模块

  const disabledDate = (current) => {
    return current && current < moment().add(45, 'days').endOf('day');
  }

  const newcompleteTime = register.completeTime ? register.completeTime : moment().add(90, 'days');

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
              {getFieldDecorator('id', {
                initialValue: register.id,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="需求编号">
              {getFieldDecorator('demandId', {
                initialValue: register.demandId,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="开发工作量">
              {getFieldDecorator('workLoad', {
                rules: [{ required, message: '请选择开发工作量' }],
                initialValue: register.workLoad,
              })(
                <Select placeholder="请选择">
                  {workload.length > 0 && workload.map(obj => [
                    <Option key={obj.key} value={obj.val}>
                      {obj.val}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="建单时间">
              {getFieldDecorator('creationTime', {
                rules: [{ required }],
                initialValue: moment(register.creationTime),
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请时间">
              {getFieldDecorator('registerTime', {
                rules: [{ required, message: '请选择申请时间' }],
                initialValue: moment(register.registerTime),
              })(<><DatePicker
                showTime
                placeholder="请选择时间"
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                defaultValue={moment(register.registerTime)}
                onChange={(v) => { setFieldsValue({ registerTime: moment(v) }) }}
              /></>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="期待完成时间">
              {getFieldDecorator('completeTime', {
                rules: [{ required, message: '请选择期待完成时间' }],
                initialValue: moment(newcompleteTime),
              })(<><DatePicker
                showTime
                placeholder="请选择时间"
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                defaultValue={moment(newcompleteTime)}
                onChange={(v) => { setFieldsValue({ completeTime: moment(v) }) }}
                style={{ width: '100%' }}
              /></>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('proposer', {
                rules: [{ required, message: '请输入申请人' }],
                initialValue: register.proposer,
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
              {getFieldDecorator('proposerId', {
                initialValue: register.proposerId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人单位">
              <InputGroup compact>
                {getFieldDecorator('Unit', {
                  rules: [{ required, message: '请选择申请人单位' }],
                  initialValue: register.proposingUnit,
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
                      const unit = getFieldsValue(['Unit', 'proposingUnit']);
                      if (unit.Unit !== '') {
                        if (unit.Unit !== unit.proposingUnit) {
                          setFields({ 'Unit': { value: '', errors: [new Error('请选择申报人单位')] } })
                        }
                      }
                    }}
                    onSelect={(v, opt) => {
                      setUnitRecord({ ...unitrecord, title: opt.props.children, key: v });
                      setFieldsValue({
                        proposingUnit: opt.props.children,
                        proposingUnitId: v,
                        Unit: opt.props.children,
                        proposingDepartment: '',
                        proposingDepartmentId: '',
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
              {getFieldDecorator('proposingUnit', {
                rules: [{ required, message: '请通过选择获取申请人单位' }],
                initialValue: register.proposingUnit,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请单位ID">
              {getFieldDecorator('proposingUnitId', {
                rules: [{ required, message: '请选择申请人单位获取申请人单位ID' }],
                initialValue: register.proposingUnitId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人部门">
              <InputGroup compact>
                {getFieldDecorator('Department', {
                  rules: [{ message: '请选择申请人部门' }],
                  initialValue: register.proposingDepartment,
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
                      const dept = getFieldsValue(['Unit', 'Department', 'proposingDepartment']);
                      if (dept.Unit !== '') {
                        if (dept.Department !== dept.proposingDepartment) {
                          setFields({ 'Department': { value: '', errors: [new Error('请选择申报人部门')] }, })
                        };
                      } else {
                        setFieldsValue({ Department: '' })
                      }
                    }}
                    onSelect={(v, opt) => {
                      setFieldsValue({
                        proposingDepartment: opt.props.children,
                        proposingDepartmentId: v,
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
              {getFieldDecorator('proposingDepartment', {
                initialValue: register.proposingDepartment,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请部门ID">
              {getFieldDecorator('proposingDepartmentId', {
                initialValue: register.proposingDepartmentId,
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
                initialValue: register.proposerPhone,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属项目">
              {getFieldDecorator('project', {
                // rules: [{ required, message: '请选择所属项目' }],
                initialValue: register.project,
              })(
                <Select placeholder="请选择">
                  {projectmap.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="需求类型">
              {getFieldDecorator('demandType', {
                rules: [{ required, message: '请选择需求类型' }],
                initialValue: register.demandType,
              })(
                <Select placeholder="请选择">
                  {demandtype.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="功能模块" {...forminladeLayout}>
              {getFieldDecorator('functionalModule', {
                rules: [{ required, message: '请选择功能模块' }],
                initialValue: register.functionalModule.split('/'),
              })(
                <Cascader
                  fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                  options={modulemap}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需求优先级" {...forminladeLayout}>
              {getFieldDecorator('priority', {
                rules: [{ required, message: '请选择需求优先级' }],
                initialValue: register.priority,
              })(
                <Select placeholder="请选择">
                  {prioritymap.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ paddingBottom: 4 }}>
            <Form.Item label="需求标题" {...forminladeLayout}>
              {getFieldDecorator('title', {
                rules: [{ required, message: '请输入需求标题' }],
                initialValue: register.title,
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
            <Form.Item label="需求原因" {...forminladeLayout}>
              {getFieldDecorator('reason', {
                rules: [{ required, message: '请输入需求原因' }],
                initialValue: register.reason,
              })(
                <FormTextArea
                  autoSize={1}
                  indexText={register.reason}
                  isEdit
                  getVal={v => setFieldsValue({ reason: v })}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginTop: '-10px' }} id='detail'>
            <Form.Item label="需求描述" {...forminladeLayout}>
              {getFieldDecorator('detail', {
                rules: [{ required, message: '请输入需求描述' }],
                initialValue: register.detail,
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
                    allowClear
                    placeholder="请输入"
                    onDoubleClick={(e) => handleDoubleClick(e)}
                  />) : (
                    <TextArea
                      autoSize={{ minRows: 1 }}
                      auto
                      allowClear
                      placeholder="请输入"
                      onDoubleClick={(e) => handleDoubleClick(e)}
                    />)}
                </AutoComplete>,
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginTop: '-6px' }}>
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
            >
              <div>
                {location && ((location.state && !location.state.cache) || (location.query && location.query.mainId)) && !loading && (
                  <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                )}
              </div>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人">
              {getFieldDecorator('registerPerson', {
                rules: [{ required }],
                initialValue: userinfo.userName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="登记人ID">
              {getFieldDecorator('registerPersonId', {
                rules: [{ required }],
                initialValue: userinfo.userId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人单位">
              {getFieldDecorator('registrationUnit', {
                rules: [{ required }],
                initialValue: userinfo.unitName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人部门">
              {getFieldDecorator('registrationDepartment', {
                rules: [{ required }],
                initialValue: userinfo.deptName,
              })(<Input placeholder="请输入" disabled />)}
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
  register: {
    // creationTime: moment().format(),
    // completeTime: moment().format(),
    demandId: '',
    demandType: '',
    detail: '',
    functionalModule: '',
    proposer: '',
    proposerId: '',
    proposerPhone: '',
    proposingDepartment: '',
    proposingDepartmentId: '',
    proposingUnit: '',
    proposingUnitId: '1',
    reason: '',
    // registerTime: moment().format(),
    title: '',
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
