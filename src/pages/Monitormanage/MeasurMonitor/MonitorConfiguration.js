import react, { Component } from 'react';
import { connect } from 'dva';
import { Layout,
         Card,
         Table,
         Form,
         Input,
        Button,
        Row,
        Col,
        Radio,
        message,
        DatePicker   } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Link from 'umi/link';
const { Header, Footer, Sider, Content } = Layout;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const statusMap = ['#D3D3D3', '#1E90FF'];
const status = ['已停用','已启用'];
const colSql = {
    overflow: 'hidden',
    textOverflow:'ellipsis',
    whiteSpace:'nowrap',
    display:'inline-block',
    color:'red' 
  }
let idstr = '';
@connect(({monitorconfiguration, loading}) =>({
  monitorconfiguration,
  loading:loading.models.monitorconfiguration
}))
class MonitorConfiguration extends Component {
  state = {
    selectedRows:[],
    idlist:''
  }
  componentDidMount() {
    this.getList()
  }

  getList = () => {
    this.props.dispatch({
      type:'monitorconfiguration/fetch'
    })

  }
  show = () =>{
    document.getElementById('generalQuery').style.display = 'none';
    document.getElementById('advancedQuery').style.display = 'block';
  }

  hide = () => {
    document.getElementById('generalQuery').style.display = 'block';
    document.getElementById('advancedQuery').style.display = 'none';
  }

  monitorAdd = (e) => {
    console.log(this.state,'state');
    console.log(this.state.selectedRows,'this.state.selectedRows');
    if(this.state.selectedRows.length) {
      message.info('新建不能选中数据');
      e.preventDefault();
    }

  }
  
  render(){
    // const components = {
    //   body: {
    //     row: EditableFormRow,
    //     cell: MonitorConfiguration,
    //   },
    // };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows,'selectedRows');
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        selectedRows.forEach(function(item){
          idstr = item.id;
        });
        this.setState({
          selectedRows: selectedRows,
          idlist: idstr
        });
      },
    };
    const configurationList = [
      {
        id:1,
        serialNumber:1,
        IndicatorID:'zb202005130001',
        indicatorName:'采集完整率1',
        maximumValue:60,
        minimum:10,
        remark:'采集完整率的备注备注备注1',
        setPerson:'朱三三',
        setTime:'2020-05-11  09:46',
        enableStatus:'0'
      },
      {
        id:2,
        serialNumber:2,
        IndicatorID:'zb202005130001',
        indicatorName:'采集完整率2',
        maximumValue:60,
        minimum:10,
        remark:'采集完整率的备注备注备注2',
        setPerson:'朱三三',
        setTime:'2020-05-11  09:46',
        enableStatus:'1'
      },
      {
        id:3,
        serialNumber:3,
        IndicatorID:'zb202005130001',
        indicatorName:'采集完整率3',
        maximumValue:60,
        minimum:10,
        remark:'采集完整率的备注备注备注',
        setPerson:'朱三三',
        setTime:'2020-05-11  09:46',
        enableStatus:'1'
      },
    ];

    const { getFieldDecorator } = this.props.form;
   
    const columns = [
      {
        title:'序号',
        dataIndex:'serialNumber',
        key:'serialNumber'
      },
      {
        title:'指标ID',
        dataIndex:'IndicatorID',
        key:'IndicatorID'
      },
      {
        title:'指标名称',
        dataIndex:'indicatorName',
        key:'indicatorName',
        render:(text) =>(
        <span style={{color:'#1E90FF'}}>
          {text}
          </span>
        ),
      },
      {
        title:'最高值',
        dataIndex:'maximumValue',
        key:'maximumValue'
      },
      {
        title:'最低值',
        dataIndex:'minimum',
        key:'minimum'
      },
      {
        title:'备注',
        dataIndex:'remark',
        key:'remark',
        // width: 10,
        render:(text)=>(
          <span style={{overflow: 'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'inline-block',color:'red',width:'150px' }}>
            {text}
          </span>
        ),
      },
      {
        title:'设置人',
        dataIndex:'setPerson',
        key:'setPerson'
      },
      {
        title:'设置时间',
        dataIndex:'setTime',
        key:'setTime'
      },
      {
        title:'启用状态',
        dataIndex:'enableStatus',
        key:'enableStatus',
        render: (text, record) => (
          <span style={{ color: statusMap[record.enableStatus], textDecoration:'underline' }}>
          {status[record.enableStatus]}
          </span>
         )
        
      }
    ]
    return(
      <PageHeaderWrapper title='计量业务监控配置'>
        <Card>
        <Row gutter={24} id='generalQuery'>
            <Form {...formItemLayout}>
              <Col xl={8} xs={12}>
                <Form.Item label="指标名称">
                  {getFieldDecorator('IndicatoName', {})(<Input />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="设置时间">
                  {getFieldDecorator(
                    'setTime',
                    {},
                  )(
                    <DatePicker />
                  )}
                </Form.Item>
              </Col>
            
              <Col xl={4} xs={12} style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 12 }} type="primary">
                  查询
                </Button>
                <Button>重置</Button>
           
              </Col>
              
              <Col xl={4} xs={12} >
                <p onClick={this.show}>展开</p>
              </Col>
            </Form>
          </Row>
        <Row gutter={24} style={{display:'none'}} id='advancedQuery'>
            <Form {...formItemLayout}>
              <Col xl={8} xs={12}>
                <Form.Item label="指标名称">
                  {getFieldDecorator('IndicatoName', {})(<Input placeholder="输入名称/IP" />)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="设置时间">
                  {getFieldDecorator(
                    'monitorType',
                    {},
                  )(
                    <DatePicker />
                  )}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="备注">
                  {getFieldDecorator('remark', {})(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="设置人">
                  {getFieldDecorator(
                    'setMan',
                    {},
                  )(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="警戒值">
                  {getFieldDecorator(
                    'warnValue',
                    {},
                  )(
                     <Input />,
                  )}
                </Form.Item>
              </Col>
              <Col xl={4} xs={12}>
                <Button style={{ marginRight: 12 }} type="primary">
                  查询
                </Button>
                <Button>重置</Button>
              </Col>

              <Col xl={2} xs={12} >
                <p onClick={this.hide}>收起</p>
              </Col>
            </Form>
          </Row>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <div>
                <Button type='primary' style={{marginRight:'10px'}}>
                  <Link 
                    to={`/monitormanage/measurmonitor/monitoraddedit`}
                    onClick={this.monitorAdd}>新增
                  </Link>
                </Button>
             
              <Button type='primary' style={{marginRight:'10px'}}>编辑</Button>
              <Button type='primary' style={{marginRight:'10px'}}>
                <Link 
                  to={{
                      pathname:'/monitormanage/measurmonitor/monitoraddedit',
                      state: {
                        data:this.state.selectedRows
                      },
                    }}
                  onclick={this.monitorAdd}>批量编辑
                </Link>
                {/* <Link to={{pathname:`/breakpromise-manager/${record.id}/detail`,
                      state:{typeId:record.orgType}}}>{text}</Link> */}
              </Button>
              <Button type="danger" ghost style={{marginRight:'10px'}}>删除</Button>
              <Button type='primary' style={{marginRight:'10px'}}>启用</Button>
              <Button>停用</Button>
            </div>
          
          <div>
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">全部</Radio.Button>
            <Radio.Button value="b">已启用</Radio.Button>
            <Radio.Button value="c">停用</Radio.Button>
          </Radio.Group>

          </div>

          </div>

            
        
       

          <Table
            // components={components}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={configurationList}
            // rowkey={record => record.id}
          >
            

          </Table>

        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create()(MonitorConfiguration);