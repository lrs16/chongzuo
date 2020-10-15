import react, { Component } from 'react';
import { connect } from 'dva';
import { Layout,Card,Table,Form,Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout'
const { Header, Footer, Sider, Content } = Layout;
@connect(({monitorconfiguration, loading}) =>({
  monitorconfiguration,
  loading:loading.models.monitorconfiguration
}))
class MonitorConfiguration extends Component {
  render(){
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
    
    };
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
        key:'indicatorName'
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
        key:'remark'
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
        key:'enableStatus'
      }
    ]
    return(
      <PageHeaderWrapper title='计量业务监控配置'>
        <Card>
          <Form>
            <Form.Item label='指标名称'>
              {getFieldDecorator('indicatorName',{
                
              })(<Input />)}
            </Form.Item>
            <Form.Item label='设置时间'>
              {
                getFieldDecorator('setTime',{

                })(<Input/>)}
            </Form.Item>
            <Form.Item></Form.Item>
            <Form.Item></Form.Item>
            <Form.Item></Form.Item>
            <Form.Item></Form.Item>
            <Form.Item></Form.Item>
          </Form>

          <Table
            columns={columns}
            rowSelection={rowSelection}
            // rowkey={record => record.id}
          >
            

          </Table>

        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create()(MonitorConfiguration);