import React, { useEffect, useState } from 'react';
// import { connect } from 'dva';
// import Link from 'umi/link';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Upload,
  Icon,
  TreeSelect,
  message
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import ModelCircula from './components/ModelCircula';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
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

const treeDatas = [
  {
    "id": "-1",
    "parentId": "0",
    "weight": 0,
    "name": "广西博联公司",
    "children": [
      {
        "id": "1",
        "parentId": "-1",
        "weight": 0,
        "name": "运行维护部",
        "children": [
          {
            "id": "1323886017773572097",
            "parentId": "1",
            "weight": 0,
            "name": "部门领导"
          },
          {
            "id": "1324152080692154370",
            "parentId": "1",
            "weight": 0,
            "name": "运维服务一组"
          },
          {
            "id": "1324166627062714370",
            "parentId": "1",
            "weight": 0,
            "name": "运维服务二组"
          }
        ]
      },
      {
        "id": "2",
        "parentId": "-1",
        "weight": 0,
        "name": "办公室"
      },
      {
        "id": "3",
        "parentId": "-1",
        "weight": 0,
        "name": "人力资源部"
      },
      {
        "id": "4",
        "parentId": "-1",
        "weight": 0,
        "name": "财务部"
      },
      {
        "id": "5",
        "parentId": "-1",
        "weight": 0,
        "name": "市场营销部"
      },
      {
        "id": "6",
        "parentId": "-1",
        "weight": 0,
        "name": "集成部"
      },
      {
        "id": "7",
        "parentId": "-1",
        "weight": 0,
        "name": "研发部"
      }
    ]
  }
];

const declarantDepart = [ // 申报人部门
  { key: 1, value: '部门一' },
  { key: 2, value: '部门二' },
  { key: 3, value: '部门三' },
  { key: 4, value: '部门四' },
  { key: 5, value: '部门五' },
  { key: 6, value: '部门六' },
];

const faultSource = [ // 故障来源
  { key: 1, value: '用户电话申告' },
  { key: 2, value: '用户自助申告' },
  { key: 3, value: '巡检发现' },
  { key: 4, value: '系统监控发现' },
  { key: 5, value: '企信' },
  { key: 6, value: '值班' },
  { key: 7, value: '其它' },
  { key: 8, value: '春风行动' },
];

const faultType = [ // 故障类型
  { key: 1, value: '系统应用' },
  { key: 2, value: '网络安全' },
  { key: 3, value: '数据库' },
  { key: 4, value: '中间件' },
  { key: 5, value: '环境/设备' },
  { key: 6, value: '软件' },
  { key: 7, value: '其他' },
];

const faultObj = [ // 故障对象
  { key: 1, value: 'ss' },
  { key: 2, value: 'ss' },
  { key: 3, value: 'ss' },
  { key: 4, value: 'ss' },
  { key: 5, value: '/设备' },
  { key: 6, value: 'ss' },
  { key: 7, value: 'ss' },
];

const severity = [ // 严重程度
  { key: 1, value: '一般缺陷' },
  { key: 2, value: '紧急缺陷' },
  { key: 3, value: '严重缺陷' },
];

const degUrgen = [ // 紧急程度
  { key: 1, value: '低' },
  { key: 2, value: '中' },
  { key: 3, value: '高' },
  { key: 4, value: '紧急' },
];

function Registration(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, resetFields, validateFields },
    history
  } = props;

  const [treevalue, setTreevalue] = useState('');

  useEffect(() => {
  }, []);

  const close = () => { // 关闭
    resetFields();
  };

  const handleSave = () => { // 保存
    validateFields((err, values) => {
      if (!err) {
        const url = '/ITSM/faultmanage/registration/record/1';
        const state = values;
        history.push(url,state);
        message.success('保存成功！');
      }

      // <Link
      //   to={{
      //     pathname: `/ITSM/faultmanage/registration/record/1`,
      //   }}
      // />
    });
  }

  const handleCircula = () => { // 流转
  }

  const normFile = e => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onChange = val => {
    setTreevalue(val);
  }

  const toTree = data => {
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    const map = {};
    data.forEach(item => {
      map[item.weight] = item;
    });
    data.forEach(item => {
      const parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        result.push(item);
      }
    });
    return result;
  };

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.name} title={item.name} key={item.id} dataRef={item} >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} value={item.name} title={item.name} {...item} />;
    });

  const treeData = toTree(treeDatas);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card
        extra={
          <>
            <Button type="primary" style={{ marginRight: 8 }} onClick={handleSave}>
              保 存
            </Button>
            <ModelCircula title="流转" onSubmit={handleCircula}>
              <Button type="primary" style={{ marginRight: 8 }}>流 转</Button>
            </ModelCircula>
            <Button type="default" onClick={close}>关 闭</Button>
          </>
        }
      >
        <Form {...formItemLayout}>
          <Row gutter={24}>
            <Col xl={8} xs={12}>
              <Form.Item label="申报人">
                {getFieldDecorator('declarant', {})(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="申报人单位">
                {getFieldDecorator('declarantCompany', {
                  initialValue: treevalue,
                })(
                  <>
                    <TreeSelect
                      defaultExpandAll
                      // value={treevalue}
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择单位"
                      onChange={onChange}
                      treeCheckable
                      multiple
                    >
                      {treeData && renderTreeNodes(treeData)}
                    </TreeSelect>
                  </>
                )}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="申报人部门">
                {getFieldDecorator('declarantDepart', {})(
                  <Select placeholder="请选择">
                    {declarantDepart.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="申报人电话">
                {getFieldDecorator('declarantPhone', {})(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="故障来源">
                {getFieldDecorator('faultSource', {})(
                  <Select placeholder="请选择">
                    {faultSource.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="故障类型">
                {getFieldDecorator('faultType', {})(
                  <Select placeholder="请选择">
                    {faultType.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="故障对象">
                {getFieldDecorator('faultObj', {})(
                  <Select placeholder="请选择">
                    {faultObj.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="故障地点">
                {getFieldDecorator('faultLocat', {})(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="严重程度">
                {getFieldDecorator('severity', {})(
                  <Select placeholder="请选择">
                    {severity.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="紧急程度">
                {getFieldDecorator('degUrgen', {})(
                  <Select placeholder="请选择">
                    {degUrgen.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="故障发生时间">
                {getFieldDecorator('faultHappentime')(<DatePicker showTime style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="故障名称" {...forminladeLayout}>
                {getFieldDecorator('faultName', {})(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="故障概要" {...forminladeLayout}>
                {getFieldDecorator('faultSum', {})(<TextArea rows={5} placeholder="请输入" />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="范围说明" {...forminladeLayout}>
                {getFieldDecorator('scopeDesc', {})(<TextArea rows={5} placeholder="请描述范围" />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="附件列表：" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }} {...forminladeLayout}>
                {getFieldDecorator('upload', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                })(
                  <Upload name="logo" action="" listType="picture">
                    <Button type="primary">
                      <Icon type="upload" style={{ fontSize: 18 }} /> 添加附件
                      </Button>
                  </Upload>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="登记人">
                {getFieldDecorator('regist', {
                  initialValue: '管理员',
                })(<Input allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="登记人部门">
                {getFieldDecorator('registDepart', {
                  initialValue: '广西电网有限责任公司',
                })(<Input allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="登记人单位">
                {getFieldDecorator('registCompany', {
                  initialValue: '广西电网有限责任公司',
                })(<Input allowClear />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(Registration);
