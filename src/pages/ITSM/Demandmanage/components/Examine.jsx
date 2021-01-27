import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useContext,
} from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker, Select, Checkbox } from 'antd';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
const { Option } = Select;

const options = [
  { label: '科室领导审核', value: 4 },
  { label: '市场部领导审核', value: 3 },
];

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
  const { getFieldDecorator, setFieldsValue } = props.form;
  const { taskName, taskId, result, mainId } = location.query;
  const required = true;
  // 附件历史
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
    }
  }, [fileslist]);
  // 审核结果与流转类型
  const [adopt, setAdopt] = useState(1);
  useEffect(() => {
    sessionStorage.setItem('flowtype', adopt);
  }, [adopt]);

  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const routerRefresh = () => {
    router.push({
      pathname: location.pathname,
      query: {
        taskId,
        taskName,
        mainId,
        result: sessionStorage.getItem('flowtype'),
      },
    });
  };

  useEffect(() => {
    sessionStorage.setItem('flowtype', info[0].result);
    setAdopt(info[0].result);
    routerRefresh();
  }, []);
  // 初始化流转类型

  const handleAdopt = e => {
    setAdopt(e.target.value);
    sessionStorage.setItem('flowtype', e.target.value);
    routerRefresh();
  };

  const handleChangeresult = values => {
    if (values.length === 2) {
      setAdopt(2);
      setFieldsValue({ result: 2 }, () => {});
      sessionStorage.setItem('flowtype', 2);
    }
    if (values.length === 1 && values[0] === 3) {
      setAdopt(3);
      setFieldsValue({ result: 3 }, () => {});
      sessionStorage.setItem('flowtype', 3);
    }
    if (values.length === 1 && values[0] === 4) {
      setAdopt(4);
      setFieldsValue({ result: 4 }, () => {});
      sessionStorage.setItem('flowtype', 4);
    }
    if (values.length === 0) {
      setAdopt(1);
      setFieldsValue({ result: 1 }, () => {});
      sessionStorage.setItem('flowtype', 1);
    }
    routerRefresh();
  };

  return (
    <Form {...formItemLayout}>
      <Row gutter={24} style={{ paddingTop: 24 }}>
        {taskName !== '自动化科负责人确认' && (
          <Col span={8}>
            <Form.Item label={`${text}结果`}>
              {getFieldDecorator('result', {
                rules: [{ required: true, message: `请选择${text}结果` }],
                initialValue: info[0].result,
              })(
                <Radio.Group onChange={handleAdopt}>
                  {(adopt === 1 || adopt === 0) && <Radio value={1}>通过</Radio>}
                  {adopt === 2 && <Radio value={2}>通过</Radio>}
                  {adopt === 3 && <Radio value={3}>通过</Radio>}
                  {adopt === 4 && <Radio value={4}>通过</Radio>}
                  <Radio value={0}>不通过</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
        )}
        {taskName === '自动化科负责人确认' && (
          <Col span={8}>
            <Form.Item label={`${text}结果`}>
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
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>
        {taskName === '自动化科专责审核' && adopt !== 0 && (
          <Col span={8}>
            <Form.Item>
              <Checkbox.Group options={options} onChange={values => handleChangeresult(values)} />
            </Form.Item>
          </Col>
        )}
        <Col span={24}>
          {adopt !== 0 && (
            <Form.Item label={`${text}意见`} {...forminladeLayout}>
              {getFieldDecorator('opinion', {
                rules: [{ required: false, message: `请输入${text}意见` }],
                initialValue: info[0].opinion,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === 0 && (
            <Form.Item label={`${text}意见`} {...forminladeLayout}>
              {getFieldDecorator('opinion', {
                rules: [{ required: true, message: `请输入${text}意见` }],
                initialValue: info[0].opinion,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
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
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            <div style={{ width: 400 }}>
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
  );
});

Examine.defaultProps = {
  info: [
    {
      creationTime: moment().format(),
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
