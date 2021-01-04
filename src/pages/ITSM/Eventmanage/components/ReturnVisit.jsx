import React, { useRef, useImperativeHandle, useEffect } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Form, Input, Select, Upload, Button, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const sourcemap = [
  { key: '001', value: '用户电话申告' },
  { key: '002', value: '企信' },
];

const returnvisit = [
  { key: '001', value: '企信回访' },
  { key: '002', value: '电话回访' },
  { key: '003', value: '短信回访' },
  { key: '004', value: '邮箱回访' },
];

const satisfactions = [
  { key: '001', value: '满意' },
  { key: '002', value: '一般' },
  { key: '003', value: '不满意' },
];

const nextsmap = new Map([
  ['001', '结束'],
  ['002', '结束'],
  ['003', '确认'],
]);

const result = [
  { key: '001', value: '误报' },
  { key: '002', value: '根本解决' },
  { key: '003', value: '代替方法' },
  { key: '004', value: '自动消失' },
  { key: '005', value: '转问题解决' },
];

const ReturnVisit = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    info,
    main,
    ChangeFlowtype,
    userinfo,
    location,
  } = props;
  const { pangekey, id, mainId } = location.query;
  const { finish } = info;
  const { getFieldDecorator } = props.form;
  const attRef = useRef();
  const required = true;
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
        pangekey,
        id,
        mainId,
        next: sessionStorage.getItem('Nextflowtype'),
      },
    });
  };
  useEffect(() => {
    sessionStorage.setItem('Nextflowtype', nextsmap.get(finish.satisfaction));
    routerRefresh();
  }, [info]);

  const handlcheckChange = value => {
    if (value === '003') {
      ChangeFlowtype('3');
      sessionStorage.setItem('Nextflowtype', '处理');
    } else {
      ChangeFlowtype('1');
      sessionStorage.setItem('Nextflowtype', '结束');
    }
    routerRefresh();
  };

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="回访表单id">
              {getFieldDecorator('finish_id', {
                initialValue: finish.id,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访方式">
              {getFieldDecorator('finish_revisit_way', {
                rules: [{ required, message: '请选择回访方式' }],
                initialValue: main.revisit_way,
              })(
                <Select placeholder="请选择">
                  {returnvisit.map(({ key, value }) => [
                    <Option key={key} value={key}>
                      {value}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理结果">
              {getFieldDecorator('main_event_result', {
                rules: [{ required, message: '请选择处理结果' }],
                initialValue: main.event_result,
              })(
                <Select placeholder="请选择">
                  {result.map(({ key, value }) => [
                    <Option key={key} value={key}>
                      {value}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </>
        <Col span={8}>
          <Form.Item label="满意度">
            {getFieldDecorator('finish_satisfaction', {
              rules: [{ required, message: '请选择满意度' }],
              initialValue: finish.satisfaction,
            })(
              <Select placeholder="请选择" onChange={handlcheckChange}>
                {satisfactions.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="回访内容" {...forminladeLayout}>
            {getFieldDecorator('finish_content', {
              rules: [{ required, message: '请输入回访内容' }],
              initialValue: finish.content,
            })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="填单时间">
            {getFieldDecorator('finish_add_time', {
              rules: [{ required }],
              initialValue: finish.add_time,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访时间">
            {getFieldDecorator('finish_revisit_time', {
              rules: [{ required, message: '请选择回访时间' }],
              initialValue: moment(finish.revisit_time),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('visit17')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访人">
            {getFieldDecorator('finish_revisitor', {
              rules: [{ required }],
              initialValue: userinfo.userName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="回访人ID">
            {getFieldDecorator('finish_revisitor_id', {
              rules: [{ required }],
              initialValue: userinfo.userId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访人单位">
            {getFieldDecorator('finish_revisit_unit', {
              rules: [{ required }],
              initialValue: userinfo.unitName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="回访人单位ID">
            {getFieldDecorator('finish_revisit_unit_id', {
              rules: [{ required }],
              initialValue: userinfo.unitId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访人部门">
            {getFieldDecorator('finish_revisit_dept', {
              rules: [{ required }],
              initialValue: userinfo.deptName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="回访人部门ID">
            {getFieldDecorator('finish_revisit_dept_id', {
              rules: [{ required }],
              initialValue: userinfo.deptId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

ReturnVisit.defaultProps = {
  info: {
    finish: {
      revisit_way: '',
      satisfaction: '001',
      add_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      revisit_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      content: '',
      revisitor: '管理员',
      revisitor_id: '1',
      revisit_unit: '广西电网有限责任公司',
      revisit_unit_id: '7AC3EF0F718E02A2E0530A644F130365',
      revisit_dept: '广西电网有限责任公司',
      revisit_dept_id: '7AC3EF0F639302A2E0530A644F130365',
      id: '',
    },
  },
  main: {
    event_result: '',
    revisit_way: '',
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

export default Form.create({})(ReturnVisit);
