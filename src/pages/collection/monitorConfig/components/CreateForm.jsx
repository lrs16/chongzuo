import { Input, Form, Row, Col, Checkbox, Card, Radio, Button, Tabs, Select, Drawer } from 'antd';
import React, { useState } from 'react';

const { Option, OptGroup } = Select;
const FormItem = Form.Item;

let agentNumber = 1;
let snmpNumber = 1;
let jmxNumber = 1;
let ipmiNumber = 1;

const CreateForm = (props) => {
  const { darwerlVisible, form, onSubmit: handleAdd, onCancel, sorts, data } = props;
  const [agent, setAgent] = useState({
    visible: data ? (data.agents ? true : false) : false,
    keys: data ? new Array(data.agents).fill(1).map((_,index) => index) : [0],
  });
  const [snmpVisible, setSnmpVisivle] = useState(false);
  const [jmxVisible, setJmxVisible] = useState(false);
  const [ipmiVisible, setIpmiVisible] = useState(false);;
  const [snmpKeys,setSnmpKeys] = useState(
    data ? new Array(data.snmps).fill(1).map((_,index) => index) : [0]
  );
  const [jmxKeys, setJmxKeys] = useState(
    data ? new Array(data.jmxs).fill(1).map((_,index) => index) : [0],
  );
  const [ipmiKeys, setIpmiKeys] = useState(
    data ? new Array(data.ipmis).fill(1).map((_,index) => index) : [0],
  );

  const saveHandle = () => {
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const create = (param, list, onClick) => {
      return param.map((key, index) => (
        <Row gutter={16} key={key}>
          <Col span={8}>
            <FormItem label="IP地址" >
              {form.getFieldDecorator(`${list}[${key}].ip`,{
                rules :[
                  {
                    required: true,
                    message: '请输入IP地址！',
                    pattern: '((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))',
                    message: '请输入正确IP地址！',
                  },
                ]
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="端口">
              {form.getFieldDecorator(`${list}[${key}].port`,{
                rules :[
                  {
                    required: true,
                    message: '请输入端口号！',
                    pattern: /^[1-9]\d{0,4}$/,
                    message: '请输入正确的端口号！'
                  },
                ]
                })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="默认">
              {form.getFieldDecorator(`${list}[${key}].main`,{
                initialValue: index >= 1 ? undefined : 1,
              })(<Radio.Group onChange={() => {
                form.getFieldValue(list).map((current,index) => {
                  if(index !== key) {
                    form.setFieldsValue({[`${list}[${index}].main`]: 0})
                  }
                });
              }}>
                <Radio value={1} /></Radio.Group>)}
              {param.length > 1 && 
              <Button type="link" onClick={()=> onClick(key)} >移除</Button>}
            </FormItem>
          </Col>
        </Row>
      ))
    };

  const sortSelect = sorts && sorts.map((value, index) => (
    <OptGroup key={index} label={value.sortName}>
      {value.cheld.map((v, x) => (
        <Option key={v.id} value={v.id}>{v.sortName}</Option>
      ))}
    </OptGroup>
  ));

  return (
    <Drawer 
    title="添加配置"
    width={800}
    destroyOnClose={true} 
    visible={darwerlVisible}
    onClose={onCancel}
    >
      <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="基本信息" key="1">
      <Form>
        <Card>
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label="设备名称" >
              {form.getFieldDecorator('deviceName', {
                rules: [{
                  required: true,
                  message: '请输入设备名称！',
                }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="监控分类">
              {form.getFieldDecorator('monitorSortId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择监控分类！',
                    },
                  ],
                })(<Select labelInValue={true} mode="tags">{sortSelect}</Select>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="描述">
              {form.getFieldDecorator('desc')
                (<Input placeholder="请输入" />)
              }
             </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="监控方式/协议">
              {form.getFieldDecorator('interFace', {
                rules: [{
                  required: true,
                  message: '请至少选择一种监控方式/协议！',
                }],
              })
              (<Checkbox.Group>
                <Checkbox value='agent' onChange={e => setAgent({...agent,visible:!agent.visible})}>
                  agent代理程序接口
                </Checkbox>
                <Checkbox value='snmp' onChange={e => setSnmpVisivle(e.target.checked)}>
                  SNMP接口
                </Checkbox>
                <Checkbox value='jmx' onChange={e => setJmxVisible(e.target.checked)}>
                  JMX接口
                </Checkbox>
                <Checkbox value='ipmi' onChange={e => setIpmiVisible(e.target.checked)}>
                  IPMI接口
                </Checkbox>
              </Checkbox.Group>
              )}
            </FormItem>
          </Col>
        </Row>
        </Card>
        <br />
        {agent.visible && <Card title="agent代理程序接口">
          <Button type="primary" onClick={() => setAgent({...agent, keys:agent.keys.concat(agentNumber++)})}>
            添加
          </Button>
          {create(agent.keys, 'agents', k => {
            setAgent({...agent, keys: agent.keys.filter((key) => key !== k)})})}
        </Card>}
        <br />
        {snmpVisible && <Card title="SNMP接口">
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="团体名">
              {form.getFieldDecorator('community', {
                rules: [{
                  required: true,
                  message: '请输入团体名！',
                  }],
              })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="密码">
              {form.getFieldDecorator('communityPwd', {
                rules: [{
                  required: true,
                  message: '请输入团体名！',
                  }],
              })(<Input.Password />)}
              </FormItem>
            </Col>
          </Row>
          <Button type="primary" onClick={() => setSnmpKeys(snmpKeys.concat(snmpNumber++))}>添加</Button>
          {create(snmpKeys, 'snmps', k => {setSnmpKeys(snmpKeys.filter(key => key !== k))})}
        </Card>}
        <br />
        {jmxVisible && <Card title="JMX接口">
          <Button type="primary" onClick={() => setJmxKeys(jmxKeys.concat(jmxNumber++))} >添加</Button>
          {create(jmxKeys, 'jxms', k => {setJmxKeys(jmxKeys.filter(key => key !== k))})}
        </Card>}
        <br />
        {ipmiVisible && <Card title="IPMI接口">
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="用户名">
                {form.getFieldDecorator('ipmiUerName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名！',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="密码">
                {form.getFieldDecorator('ipmiPwd', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码！',
                      },
                    ],
                  })(<Input.Password />)}
              </FormItem>
            </Col>
          </Row>
          <Button type="primary" onClick={() => setIpmiKeys(ipmiKeys.concat(ipmiNumber++))} >添加</Button>
          {create(ipmiKeys, 'ipmis', k => setIpmiKeys(ipmiKeys.filter(key => key !== k)))}
        </Card>}
      </Form>
      </Tabs.TabPane>
      <Tabs.TabPane tab="模板信息" key="2">
      <Form>
        <Card>
          <FormItem label="模板名称">
            {form.getFieldDecorator('monitorSortId', {})(<Select mode="multiple">{sortSelect}</Select>)}
          </FormItem>
        </Card>
      </Form>
      </Tabs.TabPane>
      </Tabs>

        <div　
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
        >
        <Button　style={{ marginRight: 8 }} onClick={onCancel} >取消</Button>
        <Button type="primary" onClick={() => saveHandle() }>保存</Button>
      </div> 
  </Drawer>
  );
};

export default Form.create({
  mapPropsToFields(props) {
    if(!props.data) return;

    const { data } = props;
    let formFilds = [];
    let interFace = [];

    const forArrary = (list, name) => {
      list.forEach((item,index) => {
        formFilds[`${name}[${index}].ip`] = Form.createFormField({ value: item.ip });
        formFilds[`${name}[${index}].port`] = Form.createFormField({ value: item.port });
        formFilds[`${name}[${index}].main`] = Form.createFormField({ value: item.main });
      });
    }

    if(data.agents) {
      agentNumber = data.agents.lenght;
      interFace.push('agent');
      forArrary(data.agents, 'agents'); 
    }

    if(data.snmps) {
      snmpNumber = data.snmps.length;
      interFace.push('snmp');
      forArrary(data.snmps, 'snmps');
    }

    if(data.ipmis) {
      ipmiNumber = data.ipmis.length;
      interFace.push('ipmi');
      forArrary(data.ipmis, 'ipmis');
    }

    if(data.jxms) {
      ipmiNumber = data.jxms.length;
      interFace.push('jxm');
      forArrary(data.jxms, 'jxms');
    }

    return  {　
      ...formFilds,
      deviceName: Form.createFormField({
        value: props.data.deviceName
      }),
      monitorSortId: Form.createFormField({
        value: props.data.monitorSortId
      }),
      desc: Form.createFormField({
        value: props.data.description
      }),
      interFace: Form.createFormField({
        value: interFace
      }),
    }
  }
})(CreateForm);
