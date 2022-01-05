import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker, Select, Checkbox } from 'antd';
import SysUpload from '@/components/SysUpload';
import { querkeyVal } from '@/services/api';

const { TextArea } = Input;
const { Option } = Select;

const newLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const options = [
  { label: '市场部领导审核', value: 3 },
  { label: '科室领导审核', value: 4 },
  { label: '中心领导审核', value: 5 },
];

const resultmap = new Map([
  [0, []],
  [1, []],
  [2, [3, 4, 5]],
  [3, [3]],
  [4, [4]],
  [5, [5]],
  [6, [3, 4]],
  [7, [4, 5]],
  [8, [3, 5]],
]);

const resulttype = new Map([
  ['""', 1],
  ['"3,4,5"', 2],
  ['"3"', 3],
  ['"4"', 4],
  ['"5"', 5],
  ['"3,4"', 6],
  ['"4,5"', 7],
  ['"3,5"', 8],
]);

const Examine = forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    userinfo,
    text,
    info,
    files,
    ChangeFiles,
    location,
  } = props;
  const { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields } = props.form;
  const { taskName, taskId, result, mainId } = location.query;
  const required = true;

  // 附件历史
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  const [selectdata, setSelectData] = useState([]); // 下拉值

  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
    }
    return () => {
      setFilesList({ arr: [], ischange: false });
    };
  }, [fileslist]);
  // 审核结果与流转类型
  const [adopt, setAdopt] = useState(1);
  useEffect(() => {
    sessionStorage.setItem('flowtype', adopt);
  }, [adopt]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const routerRefresh = () => {
    router.push({
      pathname: location.pathname,
      query: {
        taskId,
        taskName,
        mainId,
        result: sessionStorage.getItem('flowtype'),
      },
      state: { ...location.state }
    });
  };

  useEffect(() => {
    sessionStorage.setItem('flowtype', info[0].result);
    setAdopt(info[0].result);
    routerRefresh();
    querkeyVal('public', 'devdirector').then(res => {
      if (res.code === 200) {
        setSelectData(res.data.devdirector)
      }
    });
    return () => {
      setAdopt(1);
    };
  }, []);
  // 初始化流转类型

  const handleAdopt = e => {
    setAdopt(e.target.value);
    sessionStorage.setItem('flowtype', e.target.value);
    routerRefresh();
  };

  const handleChangeresult = values => {
    const resultflow = resulttype.get(JSON.stringify(values.toString()));
    setAdopt(resultflow);
    setFieldsValue({ result: resultflow }, () => { });
    sessionStorage.setItem('flowtype', resultflow);
    routerRefresh();
  };

  return (
    <>
      <Form {...formItemLayout}>
        <Row gutter={24} style={{ paddingTop: 24 }}>
          {taskName !== '自动化科业务人员确认' ? (
            <Col span={8}>
              <Form.Item label={`${text}结果`}>
                {getFieldDecorator('result', {
                  rules: [{ required: true, message: `请选择${text}结果` }],
                  initialValue: info[0].result || 1,
                })(
                  <Radio.Group onChange={handleAdopt}>
                    {(adopt === 1 || adopt === 0) && <Radio value={1}>通过</Radio>}
                    {adopt !== 1 && adopt !== 0 && <Radio value={adopt}>通过</Radio>}
                    <Radio value={0}>不通过</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          ) : (
            <Col span={12}>
              <Form.Item label={`${text}结果`} {...newLayout}>
                {getFieldDecorator('result', {
                  rules: [{ required: true, message: `请选择${text}结果` }],
                  initialValue: info[0].result,
                })(
                  <Radio.Group onChange={handleAdopt}>
                    <Radio value={1}>通过</Radio>
                    <Radio value={0}>重新处理</Radio>
                    <Radio value={2}>需求取消</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Form.Item label={`${text}时间`}>
              {getFieldDecorator('reviewTime', {
                rules: [{ required, message: `请选择${text}时间` }],
                initialValue: moment(info[0].reviewTime),
              })(<><DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                defaultValue={moment(info[0].reviewTime)}
                onChange={(v) => { setFieldsValue({ reviewTime: moment(v) }) }}
              /></>)}
            </Form.Item>
          </Col>
          {taskName === '自动化科专责审核' && adopt !== 0 && (
            <Col span={8}>
              <Form.Item>
                <Checkbox.Group
                  defaultValue={resultmap.get(info[0].result)}
                  options={options}
                  onChange={values => handleChangeresult(values)}
                />
              </Form.Item>
            </Col>
          )}
          {taskName === '系统开发商审核' && selectdata && selectdata.length > 0 && (
            <Col span={24}>
              <Form.Item label='开发负责人' {...forminladeLayout}>
                {getFieldDecorator('developmentLead', {
                  rules: [{ required: true, message: '请选择开发负责人' }],
                  initialValue: info[0].developmentLead ? info[0].developmentLead.split(',') : [],
                })(
                  <Select placeholder="请选择" mode="multiple">
                    {selectdata.map(obj => [
                      <Option key={obj.key} value={obj.val}>
                        {obj.val}
                      </Option>,
                    ])}
                  </Select>
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            {adopt !== 0 && (
              <Form.Item label={`${text}意见`} {...forminladeLayout}>
                {getFieldDecorator('opinion1', {
                  rules: [{ required: false, message: `请输入${text}意见` }],
                  initialValue: info[0].opinion,
                })(<TextArea autoSize={{ minRows: 3 }} allowClear placeholder="请输入" />)}
              </Form.Item>
            )}
            {adopt === 0 && (
              <Form.Item label={`${text}意见`} {...forminladeLayout}>
                {getFieldDecorator('opinion2', {
                  rules: [{ required: true, message: `请输入${text}意见` }],
                  initialValue: info[0].opinion,
                })(<TextArea autoSize={{ minRows: 3 }} allowClear placeholder="请输入" />)}
              </Form.Item>
            )}

            {taskName === '需求复核' && (
              <>
                <Col span={8}>
                  <Form.Item label="是否影响业务">
                    {getFieldDecorator('business', {
                      valuePropName: 'checked',
                      initialValue: Number(info[0].business),
                    })(<Checkbox />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="是否影响发布">
                    {getFieldDecorator('releases', {
                      valuePropName: 'checked',
                      initialValue: Number(info[0].releases),
                    })(<Checkbox />)}
                  </Form.Item>
                </Col>
              </>
            )}
          </Col>
          <Col span={24}>
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
            >
              <div>
                <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
              </div>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={`${text}人`}>
              {getFieldDecorator('userName', {
                rules: [{ required: true }],
                initialValue: userinfo.userName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label={`${text}人ID`}>
              {getFieldDecorator('userId', {
                rules: [{ required: true }],
                initialValue: userinfo.userId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={`${text}人单位`}>
              {getFieldDecorator('unit', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={`${text}人部门`}>
              {getFieldDecorator('department', {
                rules: [{ required: true }],
                initialValue: userinfo.deptName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
});

Examine.defaultProps = {
  info: [
    {
      // creationTime: moment().format(),
      result: 1,
      project: '',
      reason: '',
      registerPerson: '',
      registrationDepartment: '',
      registrationUnit: '',
      depleader: false,
      marketleader: false,
    },
  ],
  userinfo: {
    deptName: '',
    deptId: '',
    unitName: '',
    unitId: '',
    userName: '',
    userId: '',
  },
};

export default Form.create({})(Examine);
