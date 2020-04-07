/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Radio, Button, Divider} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DescriptionList from '@/components/DescriptionList';


const { Description } = DescriptionList;
const {TextArea,Search} = Input;
const statusoptions = [
  { label: 'shell', value: 'shell' },
  { label: 'bat', value: 'bat' },
  { label: 'perl', value: 'perl' },
  { label: 'python', value: 'python' },
  { label: 'powershell', value: 'powershell' },
];
const formItemLayout = {
  labelCol:{
      xs:{ span : 24 },
      sm:{ span :2}

  },
  wrapperCol:{
      xs:{ span : 24 },
      sm:{ span :22 }
  },
  colon : false
}
@connect(({ jobsmanage, loading }) => ({
  jobsmanage,
  loading: loading.effects['jobsmanage/fetchBasic'],
}))
class $id$ extends Component {
  constructor(props) {
    super(props);
    this.id=props.match.params.id;
  }
  
  componentDidMount() {
    if(this.id){
      const { dispatch } = this.props;
      dispatch({
        type: 'jobsmanage/fetchBasic',
         payload: this.id,       
      });
    }
    
  }

  createDownload = (fileName, content) =>{
      const blob = new Blob([content]);
      const link = document.createElement("a");
      link.innerHTML = fileName;
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      // document.getElementsByTagName("body")[0].appendChild(link);
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const { jobsmanage = {} } = this.props;
    const { jobInfo = [],  scriptInfo = [] ,jobsInfo = [] } = jobsmanage;
    const {status, subDescription} =scriptInfo;
    const {logs} =jobsInfo;
    return (
      <PageHeaderWrapper title="作业详情">
        <Card bordered={false} title="基本信息" style={{ marginBottom: 24 }}>
          <DescriptionList size="large">
            <Description term="作业ID">{jobInfo.id}</Description>
            <Description term="作业名称">{jobInfo.name}</Description>
            <Description term="执行人">{jobInfo.account}</Description>
            <Description term="作业状态">{jobInfo.state}</Description>
            <Description term="开始时间">{jobInfo.starttime}</Description>
            <Description term="结束时间">{jobInfo.endtime}</Description>
            <Description term="启动方式">{jobInfo.startingmode}</Description>
            <Description term="总耗时">{jobInfo.taking}</Description>
          </DescriptionList>
        </Card>
        <Card title="脚本信息" bordered={false} style={{ marginBottom: 24 }}>
          <Form {... formItemLayout}>
            <Form.Item label="脚本类型">
              {getFieldDecorator('status',{
                            initialValue: status,
                       })
                       (
                         <Radio.Group options={statusoptions} />
                       )}
            </Form.Item>
            <Form.Item label="脚本内容">
              {getFieldDecorator('subDescription',{
                            initialValue: subDescription,
                       })
                       (<TextArea
                         rows={8} 
                       />)}
            </Form.Item>
                   
          </Form>
        </Card>
        <Card title="执行日志" bordered={false}>
          <Form {... formItemLayout}>
            
            <Form.Item label=" ">
              {getFieldDecorator('logsearch')
                       (<Search
                         placeholder="请输入"
                         enterButton="搜索日志"
                         size="large"
                        //  onSearch={this.SearchValue}
                       />)}
            </Form.Item>
            <Form.Item label="执行日志">
              {getFieldDecorator('logs',{
                            initialValue: logs,
                       })
                       (<TextArea 
                         rows={6} 
                       />)}
            </Form.Item>
            {/* <Button onClick={this.createDownload("download.txt","{value}")} block> 导出日志</Button> */}
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create() ($id$);