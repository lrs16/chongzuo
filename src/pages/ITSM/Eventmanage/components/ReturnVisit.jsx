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
      sessionStorage.setItem('Nextflowtype', '确');
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
              {getFieldDecorator('finish_revisitWay', {
                rules: [{ required, message: '请选择回访方式' }],
                initialValue: main.revisitWay,
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
              {getFieldDecorator('main_eventResult', {
                rules: [{ required, message: '请选择处理结果' }],
                initialValue: main.eventResult,
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
            {getFieldDecorator('finish_addTime', {
              rules: [{ required }],
              initialValue: finish.addTime,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访时间">
            {getFieldDecorator('finish_revisitTime', {
              rules: [{ required, message: '请选择回访时间' }],
              initialValue: moment(finish.revisitTime),
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
            {getFieldDecorator('finish_revisitorId', {
              rules: [{ required }],
              initialValue: userinfo.userId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访人单位">
            {getFieldDecorator('finish_revisitUnit', {
              rules: [{ required }],
              initialValue: userinfo.unitName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="回访人单位ID">
            {getFieldDecorator('finish_revisitUnitId', {
              rules: [{ required }],
              initialValue: userinfo.unitId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访人部门">
            {getFieldDecorator('finish_revisitDept', {
              rules: [{ required }],
              initialValue: userinfo.deptName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="回访人部门ID">
            {getFieldDecorator('finish_revisitDeptId', {
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
      revisitWay: '',
      satisfaction: '001',
      addTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      revisitTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      content: '',
      id: '',
    },
  },
  main: {
    eventResult: '',
    revisitWay: '',
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
