import React, { Component } from 'react';
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
  TreeSelect
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import DescriptionList from '@/components/DescriptionList';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
// const { Description } = DescriptionList;
// const declarantCompany = [ // 申报人单位
//   { key: 1, value: '单位一' },
//   { key: 2, value: '单位二' },
//   { key: 3, value: '单位三' },
//   { key: 4, value: '单位四' },
//   { key: 5, value: '单位五' },
//   { key: 6, value: '单位六' },
// ];

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
  { key: 1, value: '' },
  { key: 2, value: '' },
  { key: 3, value: '' },
  { key: 4, value: '' },
  { key: 5, value: '/设备' },
  { key: 6, value: '' },
  { key: 7, value: '' },
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
class Registration extends Component {
  state = {
    value: undefined,
  };

  toTree = data => {
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

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.name} title={item.name} key={item.id} dataRef={item} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} value={item.name} title={item.name} {...item} />;
    });

  onChange = val => {
    this.setState({value: val});
  }

  normFile = e => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  saveHandle = (e) => {
    e.preventDefault();
    // fieldsValue
    this.props.form.validateFieldsAndScroll((err) => {
        if (!err) {
          const url = '/ITSM/faultmanage/faultmanagepro';
          this.props.history.push(url);
        }
    });
    
  };

  close = () => { // 重置
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };

    const treeData = this.toTree(treeDatas);

    return (
      <PageHeaderWrapper
        title={this.props.route.name}
      >
        <Card
          extra={
            <>
              <Button type="primary" style={{ marginRight: 8 }} onClick={this.saveHandle}>保 存</Button>
              <Button type="primary" style={{ marginRight: 8 }}>流 转</Button>
              <Button type="default" onClick={this.close}>关 闭</Button>
            </>
          }
        >
          <Form>
            <Row gutter={24}>
              <Col xl={8} xs={12}>
                <Form.Item label="申报人">
                  {getFieldDecorator('declarant', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="申报人单位">
                  {getFieldDecorator('declarantCompany', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    initialValue: this.state.value,
                  })(
                    // <Select placeholder="请选择">
                    //   {declarantCompany.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    // </Select>,
                    <>
                      <TreeSelect
                        defaultExpandAll
                        value={this.state.value}
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择命令"
                        onChange={this.onChange}
                        treeCheckable
                        multiple
                      >
                        {treeData && this.renderTreeNodes(treeData)}
                      </TreeSelect>

                    </>
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="申报人部门">
                  {getFieldDecorator('declarantDepart', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '', 
                  })(
                    <Select placeholder="请选择">
                      {declarantDepart.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="申报人电话">
                  {getFieldDecorator('declarantPhone', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="故障来源">
                  {getFieldDecorator('faultSource', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '', 
                  })(
                    <Select placeholder="请选择">
                      {faultSource.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="故障类型">
                  {getFieldDecorator('faultType', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {faultType.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="故障对象">
                  {getFieldDecorator('faultObj', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {faultObj.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="故障地点">
                  {getFieldDecorator('faultLocat', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="严重程度">
                  {getFieldDecorator('severity', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {severity.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="紧急程度">
                  {getFieldDecorator('degUrgen', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {degUrgen.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="故障发生时间">
                  {getFieldDecorator('faultHappentime', config)(<DatePicker showTime style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="故障名称">
                  {getFieldDecorator('faultName', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="故障概要">
                  {getFieldDecorator('faultSum', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(<TextArea rows={5} placeholder="请输入" />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="范围说明">
                  {getFieldDecorator('scopeDesc', {
                    // rules: [
                    //   {
                    //     required: true,
                    //   },
                    // ],
                    // initialValue: '',
                  })(<TextArea rows={5} placeholder="请描述范围" />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="附件列表：" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }}>
                  {getFieldDecorator('upload', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
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

        {/* <Card style={{ marginBottom: 24, marginTop: '-1px' }}>
          <DescriptionList size="large" title="故障登记">
            <Description term="故障编号">故障编号</Description>
            <Description term="故障发生时间">故障发生时间</Description>
            <Description term="故障记录时间">故障记录时间</Description>
            <Description term="故障来源">故障来源</Description>
            <Description term="系统模块">系统模块</Description>
            <Description term="故障地点"> 故障地点</Description>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term="严重程度">严重程度</Description>
            <Description term="紧急程度">紧急程度</Description>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term="故障名称">故障名称</Description>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term="故障概要">故障概要</Description>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term="范围说明">范围说明</Description>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term="上传附件">上传附件</Description>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term="填报人">填报人</Description>
            <Description term="填报人单位">填报人单位</Description>
            <Description term="填报人部门">填报人部门</Description>
          </DescriptionList>
        </Card> */}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Registration);