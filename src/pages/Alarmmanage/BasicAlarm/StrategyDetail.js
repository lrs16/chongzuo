import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Descriptions, Input, Checkbox, Tag, Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { TextArea } = Input;
const { CheckableTag } = Tag;
const tagsData = ['皖苏', '李东东', '吴西西'];
@connect(({ strategydetail, loading }) => ({
  strategydetail,
  loading: loading.effects['strategydetail/strategyDetail'],
}))
class $detailsid$ extends Component {
  constructor(props) {
    super(props);
    this.detailsid = props.match.params.detailsid;
  }

  componentDidMount() {
    this.getDetail();
    this.getTableone();
    this.getTabletwo();
  }

  getDetail = () => {
    this.props.dispatch({
      type: 'strategydetail/strategyDetail',
      payload: this.detailsid,
    });
  };

  getTableone = () => {
    this.props.dispatch({
      type: 'strategydetail/strategyTableone',
      payload: this.detailsid,
    });
  };

  getTabletwo = () => {
    this.props.dispatch({
      type: 'strategydetail/strategyTabletwo',
      payload: this.detailsid,
    });
  };

  render() {
    const { strategydetail } = this.props;
    const { list, tableone, tabletwo } = strategydetail;
    const { getFieldDecorator } = this.props.form;
    const dataSource = [...tableone];
    const notiMethod = list.notiMethod;

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

        <Card style={{ paddingLeft: 10 }}>
          <Descriptions title="告警内容">
            {/* <div style={{marginLeft:300}}> */}
            {/* <span style={{marginLeft:50}}>告警标题:{list.alatitle}</span>
              <span>描述:{list.describe}</span> */}
            {/* <Descriptions.Item label='告警标题' >{list.alatitle}</Descriptions.Item>
              <Descriptions.Item label='描述'>{list.describe}</Descriptions.Item> */}
            {/* </div> */}
          </Descriptions>
          <Form layout="inline">
            <Form.Item label="告警标题" style={{ marginLeft: 50 }}>
              {getFieldDecorator('alatitle', {
                initialValue: list.alatitle,
              })(<span>{list.alatitle}</span>)}
            </Form.Item>

            <Form.Item label="描述" style={{ marginLeft: 700 }}>
              {getFieldDecorator('describe', {
                initialValue: list.describe,
              })(<span>{list.describe}</span>)}
            </Form.Item>

            <Descriptions title="触发条件">
              {/* <Descriptions.Item label='在过去的:'>{list.past}</Descriptions.Item> */}
            </Descriptions>
            <Form.Item label="在过去的" style={{ marginLeft: 50 }}>
              {getFieldDecorator('past', {
                initialValue: list.past,
              })(<span>{list.past}</span>)}
            </Form.Item>

            <Table
              style={{ marginLeft: 100, marginRight: 30 }}
              columns={columns}
              dataSource={dataSource}
            ></Table>

            <Descriptions title="执行动作"></Descriptions>
            <div style={{ marginLeft: 50 }}>
              <Form.Item label="通知方式">
                {getFieldDecorator('notiMethod', {
                  initialValue: notiMethod,
                })(
                  <Checkbox.Group>
                    <Checkbox value="shortMessage">短信</Checkbox>
                    <Checkbox value="mail">邮件</Checkbox>
                    <Checkbox value="enterprise">企信</Checkbox>
                  </Checkbox.Group>,
                )}
              </Form.Item>
              <br></br>
              <Form.Item label="通知对象">
                {tagsData.map(tag => (
                  <CheckableTag
                    key={tag}
                    // checked={selectedTags.indexOf(tag) > -1}
                    // onChange={checked => this.handleChange(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Form.Item>
              <br></br>
              <Form.Item label="告警频率">{list.alafrequency}</Form.Item>
              <br></br>
              <Form.Item label="告警频率:">{list.alafrequency}</Form.Item>
              <br></br>
              <Form.Item label="生效时间:">{list.forcetime}</Form.Item>
              <br></br>
              <Form.Item label="延迟策略:">{list.delaystrate}</Form.Item>
              <br></br>
            </div>
            {/* <Descriptions.Item label='通知内容'></Descriptions.Item> */}

            {/* <div style={{border:'1px solid 	#B0C4DE' ,width:700, marginLeft:80 , position:'relative',bottom:30,paddingTop:10,paddingBottom:10,paddingLeft:10}}> */}
            {/* 级别: {list.remark.level}
              <br></br>
              告警对象: {list.remark.obj}
              <br></br>
              告警标题: {list.remark.alarmTitle}
              <br></br>
              告警时间: {list.remark.alarmTime}
              <br></br>
              告警详情: {list.remark.alarmDetail}
              <br></br>
              注意: {list.remark.careful}  */}
            {/* </div> */}

            <Descriptions title="适用对象"></Descriptions>
            <Table columns={objColumns} dataSource={tabletwo} style={{ marginLeft: 50 }}></Table>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()($detailsid$);
