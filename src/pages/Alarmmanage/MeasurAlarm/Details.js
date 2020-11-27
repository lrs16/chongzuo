import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Card, 
         Table, 
         Button, 
         Badge, 
         Form,
         Select,
         Row,
         Col,
         Input,
         DatePicker
 } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

// const gradeMap = ['red', 'orange', 'blue'];
// const grade = ['特急', '紧急', '一般'];

const ackstatusMap = ['success', 'error'];
const ackstatus = ['已确认', '未确认'];
const notification = ['已通知', '未通知'];

const eliminateMap = ['error', 'success', 'default'];
const eliminate = ['未消除', '已消除', '已取消'];

@connect(({ alarmdetails, loading }) => ({
  alarmdetails,
  loading: loading.models.alarmdetails,
}))
class Details extends Component {
  state = {
    current: 1,
    pageSize: 1,
    quekey:'',
  }
  componentDidMount() {
  //  this.getList();
  };

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmdetails/alarmList',
    });
  }

  show = () => {
    document.getElementById('generalQuery').style.display='none';
    document.getElementById('advancedQuery').style.display='block';
  }

  hide = () => {
    document.getElementById('advancedQuery').style.display='none';
    document.getElementById('generalQuery').style.display='block';
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  onShowSizeChange = (current, pageSize) => {
    setTimeout(() => {
      this.setState({ pageSize });
    },0);
  }

  changePage = page => {
    setTimeout(() => {
      this.setState({ current: page});
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs:{span:16},
        sm:{span:5},
      },
      wrapperCol:{
        xs:{span:20},
        sm:{span:12}
      },
    };
    const advanceformItemLayout = {
      labelCol: {
        xs:{span:20},
        sm:{span:8},
      },
      wrapperCol:{
        xs:{span:20},
        sm:{span:12}
      },
    };
    const alarmList = [
      {
        level:'级别',
        category:'类别',
        subclass:'子类',
        confirmStatus:'1',
        eliminationState:'0',
        warnContent:'告警内容11111111111111111111111111111111111111111111111',
        accumulated:'当月累计',
        annualCumulative:'年度累计',
        confirmwarntime:'确认警告时间',
        warningTime:'本次警告时间',
        lastWarntime:'上次警告时间',
      },
      {
        level:'级别',
        category:'类别',
        subclass:'子类',
        confirmStatus:'1',
        eliminationState:'0',
        warnContent:'告警内容11111111111111111111111111111111111111111111111',
        accumulated:'当月累计',
        annualCumulative:'年度累计',
        confirmwarntime:'确认警告时间',
        warningTime:'本次警告时间',
        lastWarntime:'上次警告时间',
      },
    ];
    const columns = [
      {
        title:'操作',
        dataIndex:'',
        width:120,
        render:() =>(
          <Link to="/alarmmanage/measuralarm/details/detailview/:detailsid">
           <Button type='primary'>工单处理</Button>
          </Link>
         
        ),
      },
      {
        title:'级别',
        dataIndex:'level',
        key:'level',
        width:120,
      },
      {
        title:'类别',
        dataIndex:'category',
        key:'category',
        width:120,
      
      },
      {
        title:'子类',
        dataIndex:'subclass',
        key:'subclass',
        width:120,
      },
      {
        title:'确认状态',
        dataIndex:'confirmStatus',
        key:'confirmStatus',
        width:120,
        render: (text, record) => (
          <span>
            <Badge status={eliminateMap[record.confirmStatus]} text={eliminate[record.confirmStatus]} />
          </span>
        ),
      },
      {
        title:'消除状态',
        dataIndex:'eliminationState',
        key:'eliminationState',
        width:120,
        render: (text, record) => (
          <span>
            <Badge status={eliminateMap[record.eliminationState]} text={ackstatus[record.eliminationState]}/>
          </span>
        ),
      },
      {
        title:'警告内容',
        dataIndex:'warnContent',
        key:'warnContent',
        width:300,
        ellipsis:true,
        // colSpan:2,
        // render: (text, record) => (
        //   <span>
        //     <Badge status={eliminateMap[record.eliminate]} text={eliminate[record.eliminate]} />
        //   </span>
        // ),
      },
      {
        title: '当月累计/年度累计',
        dataIndex: 'accumulated',
        key: 'accumulated',
        width:150,
        render: (text, record) => (
          <span>
            <Badge
              status={ackstatusMap[record.notification]}
              text={notification[record.notification]}
            />
          </span>
        ),
      },
      {
        title:'当月累计/年度累计',
        dataIndex:'annualCumulative',
        key:'annualCumulative',
        width:150,
        // width:300,
        // colSpan:2,
      },
      {
        title:'告警通知',
        dataIndex:'alarmNotification',
        key:'alarmNotification',
        width:120,
      },
      {
        title:'确认警告时间',
        dataIndex:'confirmwarntime',
        key:'confirmwarntime',
        width:120,
      },
      {
        title:'本次警告时间',
        dataIndex:'warningTime',
        key:'warningTime',
        width:120,
      },
      {
        title:'上次警告时间',
        dataIndex:'lastWarntime',
        key:'lastWarntime',
        width:120,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 280,
        render: () => (
          <span>
            <Button type="link">确认</Button>
            <Button type="link">手工消除</Button>
            <Button type="link">取消确认</Button>
          </span>
        ),
      },
    ];
 
    const rowSelection = {
      onChange: (selectedRows)=> {
        console.log(selectedRows);
      },
    };

    const pagination = {
      showSizeChanger:true,
      showQuickJumper:true,
      onShowSizeChange:(current, pageSize) => this.onShowSizeChange(current, pageSize),
      total:85,
      showTotal:(total,current)=> `共 ${total} 条记录 第${this.state.current} 页`,
      current: this.state.current,
      pageSize:this.state.pageSize,
      onChange: page => this.changePage(page), 
    };

    const { getFieldDecorator } = this.props.form;
    // const { alarmdetails:{ alarmList } } = this.props;
    const dataSource = [...alarmList];
    return (
      <PageHeaderWrapper title="告警明细信息">
        <Card>
          <Form
            style={{display:'block'}}
            id='generalQuery'
            {...formItemLayout}
          >
            <Row>
              <Col span={6}>
                <Form.Item label='类别'>
                { getFieldDecorator('category',{
                  initialValue:''
                })(<Select/>)}
              </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label='子类'>
                  { getFieldDecorator('subclass',{
                    initialValue:''
                  })(<Select/>)}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label='级别'>
                  { getFieldDecorator('level',{

                  })(<Input/>)}

                </Form.Item>
              </Col>

              <Col span={6}>
                <Button type='primary' style={{marginRight:'10px'}}>查询</Button>
                <Button style={{marginRight:'10px'}} onClick={this.handleReset}>重置</Button>
                <span onClick={this.show}>展开</span>
              </Col>
            </Row>
            <Button type='primary'>导出数据</Button>
         
          </Form>
          <Form
          style={{display:'none'}}
          id='advancedQuery'
          {...advanceformItemLayout}>
            <Row>
              <Col span={8}>
                <Form.Item label='类别'>
                { getFieldDecorator('category',{
                  initialValue:''
                })(<Select/>)}
              </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='子类'>
                  { getFieldDecorator('subclass',{
                    initialValue:''
                  })(<Select/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='级别'>
                  { getFieldDecorator('level',{

                  })(<Input/>)}

                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <Form.Item label='确认状态'>
                  { getFieldDecorator('confirmStatus',{

                  })(<Select/>)}
                </Form.Item>
              </Col>
             
              <Col span={8}>
                <Form.Item label='告警内容'>
                  { getFieldDecorator('alarmContent')(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='确认告警时间'>
                  {getFieldDecorator('confirmAlarmtime')(<DatePicker/>)}
                </Form.Item>
              </Col>
              </Row>

            <Row>
                <Col span={8}>
                  <Form.Item label='本次告警时间'>
                    { getFieldDecorator('alarmtime')(<DatePicker/>)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label='上次告警时间'>
                    { getFieldDecorator('lastAlarmtime')(<DatePicker/>)}
                  </Form.Item>
                </Col>

                {/* <Col span={8} style={{textAlign:'right'}}>
                <Button type='primary' style={{marginRight:'10px'}}>查询</Button>
                <Button style={{marginRight:'10px'}} onClick={this.handleReset}>重置</Button>
                <span onClick={this.hide}>收起</span>
              </Col> */}
                
              </Row>

            <Row>
              <Col span={22} style={{textAlign:'right'}}>
                <Button type='primary' style={{marginRight:'10px'}}>查询</Button>
                <Button style={{marginRight:'10px'}} onClick={this.handleReset}>重置</Button>
                <span onClick={this.hide}>收起</span>
              </Col>
            </Row>
            <Button type='primary'>导出数据</Button>
          </Form>
          <Table
          //  style={{'table-layout':'fixed',width:'100%','border-collapse':'collapse'}}
            dataSource={dataSource}
            // rowKey={record => record.detailsid}/
            columns={columns}
            rowSelection={rowSelection}
            scroll={{ x: 1500 }}
            pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Details);
 