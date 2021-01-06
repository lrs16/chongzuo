import React, { useState } from 'react';
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
  Steps,
  Collapse
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// eslint-disable-next-line import/no-unresolved
import creatHistory from 'history/createHashHistory'; // 返回上一页
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;
const { Panel } = Collapse;

const history = creatHistory(); // 返回上一页

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

const declarantCompany = [ // 申报人单位
  { key: 1, value: '单位一' },
  { key: 2, value: '单位二' },
  { key: 3, value: '单位三' },
  { key: 4, value: '单位四' },
  { key: 5, value: '单位五' },
  { key: 6, value: '单位六' },
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

const tabList = [
  {
    key: 'faultForm',
    tab: '故障工单',
  },
  {
    key: 'faultPro',
    tab: '故障流程',
  },
];

function ToDoregist(props) {
  const pagetitle = props.route.name;
  const [activeKey, setActiveKey] = useState(['1']);
  const [tabActiveKey, setTabActiveKey] = useState('faultForm');
  const {
    form: { getFieldDecorator },
    // location // 获取传入数据
  } = props;
  // const [registrData, setRegistrData] = useState([]);

  const handleClose = () => {
    history.goBack(); // 返回上一页
  }

  const handleTabChange = (key) => {
    setTabActiveKey(key);
  };

  const callback = key => {
    setActiveKey(key);
  };

  return (
    <PageHeaderWrapper
      extra={
        <>
          <Button type="danger">删 除</Button>
          <Button type="primary">保 存</Button>
          <Button type="primary">流 转</Button>
          <Button type="default" onClick={handleClose}>返 回</Button>
        </>
      }
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {
        (tabActiveKey === 'faultForm' &&
          <div className={styles.collapse}>

            <Card>
              <Steps size="small" current={1}>
                <Step title="故障登记（已登记）" description="到达时间: 2020-11-01处理人:张三." />
              </Steps>
            </Card>

            <Collapse
              expandIconPosition="right"
              activeKey={activeKey}
              bordered={false}
              style={{ marginTop: '-25px' }}
              onChange={callback}
            >
              <Panel header="故障登记" key="1">
                <Form {...formItemLayout}>
                  <Row gutter={24}>
                    <Col xl={8} xs={12}>
                      <Form.Item label="故障编号">
                        {getFieldDecorator('faultID', {})(<Input />)}
                      </Form.Item>
                    </Col>

                    <Col xl={8} xs={12}>
                      <Form.Item label="登记时间">
                        {getFieldDecorator('registTime')(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>

                    <Col xl={8} xs={12}>
                      <Form.Item label="故障发生时间">
                        {getFieldDecorator('faultHappentime')(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>

                    <Col xl={8} xs={12}>
                      <Form.Item label="申报人">
                        {getFieldDecorator('declarant', {})(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col xl={8} xs={12}>
                      <Form.Item label="申报人单位">
                        {getFieldDecorator('declarantCompany', {})(
                          <Select placeholder="请选择">
                            {declarantCompany.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                          </Select>,
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
                        {getFieldDecorator('regist', {})(<Input allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="登记人部门">
                        {getFieldDecorator('registDepart', {})(<Input allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="登记人单位">
                        {getFieldDecorator('registCompany', {})(<Input allowClear />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Panel>
            </Collapse>
          </div>
        )
      }
      {
        (tabActiveKey === 'faultPro' && <Card>ww22</Card>)
      }

    </PageHeaderWrapper>
  );

}

export default Form.create({})(ToDoregist);
