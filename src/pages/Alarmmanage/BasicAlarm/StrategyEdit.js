import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Card,
  Table,
  Descriptions,
  Input,
  Checkbox,
  Tag,
  Form,
  Select,
  Button,
  TimePicker,
  Popconfirm,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditResources from './components/EditResources';

const { TextArea } = Input;
const { CheckableTag } = Tag;
const { Option } = Select;
const format = 'HH:mm';
const tagsData = ['皖苏', '李东东', '吴西西'];
const config = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};
const formStyle = {
  marginLeft: 50,
  display: 'block',
};
@connect(({ strategyedit, loading }) => ({
  strategyedit,
  loading: loading.models.loading,
}))
class $detailsid$ extends Component {
  state = {
    selectedRows: [],
  };
  constructor(props) {
    super(props);
    this.detailsid = props.match.params.detailsid;
    console.log(this.detailsid);
  }

  componentDidMount() {
    this.getDetail();
    this.getTableone();
    this.getTabletwo();
  }

  getDetail = () => {
    this.props.dispatch({
      type: 'strategyedit/strategyDetail',
      payload: this.detailsid,
    });
  };

  getTableone = () => {
    this.props.dispatch({
      type: 'strategyedit/strategyTableone',
      payload: this.detailsid,
    });
  };

  getTabletwo = () => {
    // cons {detailsid = this.detailsid;
    this.props.dispatch({
      type: 'strategyedit/strategyTabletwo',
      payload: this.detailsid,
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      // if(!err) {
      //   const { dispatch } = this.props;
      //   return dispatch({
      //     type: '/strategyadd/strategyAdd',
      //     payload: values,
      //   }).then();
      // };
    });
  };

  handleDeleteOk = () => {
    // confirm({
    // title:'确定要删除吗',
    // onOk() {
    if (this.state.selectedRows) {
      const idList = [];
      this.state.selectedRows.forEach(item => {
        const id = item.detailsid;
        idList.push(id);
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'alarmstrategy/strategyList',
        payload: {
          alarmstrategyList: idList,
        },
      }).then(() => {
        this.getDetail();
      });
    } else {
      message.info('至少选择一条数据');
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const required = true;

    const { strategyedit } = this.props;
    const { list, tableone, tabletwo } = strategyedit;
    const dataSource = [...tableone];
    const tabletwoSource = [...tabletwo];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRows: selectedRows,
        });
        // console.log(this.state.detailsid);
      },
    };

    const columns = [
      {
        title: '告警指标',
        dataIndex: 'warnIndex',
        key: 'warnIndex',
      },
      {
        title: '聚合算法',
        dataIndex: 'aggreGorithm',
        key: 'aggreGorithm',
      },
      {
        title: '指标值',
        dataIndex: 'indexValue',
        key: 'indexValue',
      },
      {
        title: '阈值',
        dataIndex: 'threshold',
        key: 'threshold',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '告警级别',
        dataIndex: 'alarmLevel',
        key: 'alarmLevel',
      },
    ];

    const editResources = values => {
      const { dispatch } = this.props;
      return dispatch({}).then();
    };
    //适用对象的列
    const objColumns = [
      {
        title: 'IP地址',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: '监测对象',
        dataIndex: 'monitorObj',
        key: 'monitorObj',
      },
    ];

    return (
      <PageHeaderWrapper title="告警详细信息">
        <Card>
          <Descriptions>
            <Descriptions.Item label="告警ID">{list.id}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card>
          <Descriptions title="告警内容"></Descriptions>
          <Form
            layout="inline"
            labelAlign="right"
            style={{ paddingTop: 10 }}
            onSubmit={this.handleSubmit}
          >
            <Form.Item label="告警标题" style={{ marginLeft: 50 }}>
              {getFieldDecorator('alatitle', {
                rules: [
                  {
                    required,
                    message: '请输入 ',
                  },
                ],
                initialValue: list.alatitle,
              })(<Input placeholder="请输入" style={{ width: 550 }} />)}
            </Form.Item>

            <Form.Item label="描述" style={{ marginLeft: 150 }}>
              {getFieldDecorator('describe', {
                rules: [
                  {
                    message: '请输入',
                  },
                ],
                initialValue: list.describe,
              })(<Input placeholder="请输入" style={{ width: 550 }} />)}
            </Form.Item>

            <Form.Item>
              <Button style={{ position: 'relative', bottom: 60 }}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ position: 'relative', bottom: 60, left: 10 }}
              >
                提交
              </Button>
            </Form.Item>

            <Descriptions title="触发条件"></Descriptions>
            {/* <Descriptions.Item label='在过去的:'></Descriptions.Item> */}
            <Form.Item label="在过去的" style={{ marginLeft: 50 }}>
              {getFieldDecorator('past', {
                rules: [
                  {
                    required,
                  },
                ],
                initialValue: list.past,
              })(
                <Select style={{ width: 200 }}>
                  <Option value="1">过去一分钟</Option>
                  <Option value="2">过去五分钟</Option>
                  <Option value="3">过去半小时</Option>
                  <Option value="4">过去一小时</Option>
                  <Option value="5">过去两小时</Option>
                  <Option value="6">过去三小时</Option>
                  <Option value="7">过去四小时</Option>
                  <Option value="8">过去五小时</Option>
                  <Option value="9">过去六小时</Option>
                </Select>,
              )}
            </Form.Item>

            <Table
              style={{ marginLeft: 130, marginRight: 30 }}
              columns={columns}
              dataSource={dataSource}
            ></Table>

            <Descriptions title="执行动作"></Descriptions>
            {/* <Descriptions column={1}>
            <Descriptions.Item label='通知方式:' style={{marginLeft:50}}>
              <Checkbox value='shortMessage'>短信</Checkbox>
              <Checkbox value='mail'>邮件</Checkbox>
              <Checkbox value='enterpriseCredit'>企信</Checkbox>
            </Descriptions.Item> */}
            <Form.Item label="通知方式" style={{ marginLeft: 50, marginTop: 10 }}>
              {getFieldDecorator('notiMethod', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: list.notiMethod,
              })(
                <Checkbox.Group>
                  <Checkbox value="shortMessage">短信</Checkbox>
                  <Checkbox value="mail">邮件</Checkbox>
                  <Checkbox value="enterprise">企信</Checkbox>
                </Checkbox.Group>,
              )}
            </Form.Item>

            <Form.Item label="通知对象" style={{ display: 'block', marginLeft: 50, marginTop: 20 }}>
              {getFieldDecorator('notiObj', {
                rules: [
                  {
                    required,
                  },
                ],
                initialValue: '',
              })(
                <Select style={{ width: 400 }}>
                  <Option value="">全部</Option>
                  <Option value="a">皖苏</Option>
                  <Option value="b">李东东</Option>
                  <Option value="c">吴西西</Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="告警频率" style={{ display: 'block', marginLeft: 50, marginTop: 20 }}>
              {getFieldDecorator('alafrequency', {
                rules: [
                  {
                    required,
                  },
                ],
                initialValue: list.alafrequency,
              })(
                <Select style={{ width: 200 }}>
                  <Option value="">五分钟</Option>
                  <Option value="11">一小时</Option>
                  <Option value="22">两小时</Option>
                  <Option value="33">三小时</Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="生效时间" style={{ display: 'block', marginLeft: 50, marginTop: 10 }}>
              {getFieldDecorator('forcetime', {
                rules: [
                  {
                    required,
                  },
                ],
                initialValue: moment(list.forcetime),
              })(<TimePicker format={format} />)}
            </Form.Item>

            <Form.Item label="延迟策略" style={{ display: 'block', marginLeft: 50, marginTop: 15 }}>
              {getFieldDecorator('delaystrate', {
                rules: [
                  {
                    required,
                  },
                ],
                initialValue: list.delaystrate,
              })(
                <Select style={{ width: 200 }}>
                  <Option value="">五分钟</Option>
                  <Option value="11">一小时</Option>
                  <Option value="22">两小时</Option>
                  <Option value="33">三小时</Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="通知内容" style={{ display: 'block', marginLeft: 50, marginTop: 10 }}>
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required,
                  },
                ],
                initialValue: '',
              })(<Input style={{ width: 1000 }} />)}
            </Form.Item>

            <Descriptions title="适用对象"></Descriptions>
            <Popconfirm title="确定删除吗？" onConfirm={this.handleDeleteOk}>
              <Button style={{ float: 'right' }}>删除</Button>
              {/* <Button>批量删除</Button> */}
            </Popconfirm>
            {/* <Button  style={{float:'right'}}>批量删除</Button> */}
            <EditResources
              onSumit={values => editResources(values)}
              record={this.state.selectedRows}
            >
              <Button style={{ float: 'right', marginRight: 10, zIndex: 999 }}>编辑资源</Button>
            </EditResources>
            <Table
              columns={objColumns}
              dataSource={tabletwoSource}
              rowSelection={rowSelection}
            ></Table>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()($detailsid$);
