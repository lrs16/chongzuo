import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Form, Input, Select, DatePicker, Cascader, AutoComplete } from 'antd';
import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';

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
  const { register, userinfo, files, ChangeFiles, location, selectdata } = props;
  const { getFieldDecorator } = props.form;
  const required = true;
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  const [titleautodata, setTitleAutoData] = useState([]);
  const [desautodata, setDestoData] = useState([]);
  const [titlerecords, setTitleRecords] = useState([]);
  const [desrecords, setDesRecords] = useState([]);

  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
    }
  }, [fileslist]);

  useEffect(() => {
    setFilesList({ ...fileslist, arr: files });
  }, [register]);

  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  useEffect(() => {
    if (location !== undefined) {
      const { taskName, taskId, mainId } = location.query;
      router.push({
        pathname: location.pathname,
        query: {
          taskId,
          taskName,
          mainId,
          result: '1',
        },
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

  useEffect(() => {
    handletitleSearch({ module: '需求单', field: '标题', key: '' });
    handledesSearch({ module: '需求单', field: '描述', key: '' });
  }, []);

  const proposer = register.proposer === '' ? userinfo.userName : register.proposer;
  const proposingUnit = register.proposingUnit === '' ? userinfo.unitName : register.proposingUnit;
  const proposingDepartment =
    register.proposingDepartment === undefined ? userinfo.deptName : register.proposingDepartment;

  const getTypebyTitle = key => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const demandtype = getTypebyTitle('1352069854860939266');
  const prioritymap = getTypebyTitle('1352166246400921601');
  const projectmap = getTypebyTitle('1354241446307172354');
  const modulemap = getTypebyTitle('1352070663392727041');

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
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="建单时间">
              {getFieldDecorator('creationTime', {
                rules: [{ required }],
                initialValue: moment(register.creationTime),
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请时间">
              {getFieldDecorator('registerTime', {
                rules: [{ required, message: '请选择申请时间' }],
                initialValue: moment(register.registerTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="期待完成时间">
              {getFieldDecorator('completeTime', {
                rules: [{ required, message: '请选择期待完成时间' }],
                initialValue: moment(register.completeTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('proposer', {
                rules: [{ required, message: '请输入申请人' }],
                initialValue: proposer,
              })(<Input placeholder="请输入" allowClear />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人单位">
              {getFieldDecorator('proposingUnit', {
                rules: [{ required, message: '请输申请人单位' }],
                initialValue: proposingUnit,
              })(<Input placeholder="请输入" allowClear />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人部门">
              {getFieldDecorator('proposingDepartment', {
                rules: [{ required, message: '请输入申请人部门' }],
                initialValue: proposingDepartment,
              })(<Input placeholder="请输入" allowClear />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="联系电话">
              {getFieldDecorator('proposerPhone', {
                rules: [
                  {
                    required,
                    // len: 11,
                    // validator: phone_reg,
                    message: '请输入联系电话',
                  },
                ],
                initialValue: register.proposerPhone,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属项目">
              {getFieldDecorator('project', {
                rules: [{ required, message: '请选择所属项目' }],
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
            <Form.Item label="所属模块" {...forminladeLayout}>
              {getFieldDecorator('functionalModule', {
                rules: [{ required, message: '请选择所属模块' }],
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
          <Col span={24}>
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
              })(<TextArea autoSize={{ minRows: 3 }} allowClear placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需求详述" {...forminladeLayout}>
              {getFieldDecorator('detail', {
                rules: [{ required, message: '请输入需求详述' }],
                initialValue: register.detail,
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
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
              // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
            >
              <div style={{ width: 400 }}>
                <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
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
    proposerPhone: '',
    proposingDepartment: '计量中心',
    proposingUnit: '广西电网有限责任公司',
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
