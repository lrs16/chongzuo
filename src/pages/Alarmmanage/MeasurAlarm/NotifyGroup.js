import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Table,
  Row,
  Col,
  Button,
  Popconfirm,
  message
} from 'antd';

import AlarmInfoTree from '@/components/AlarmInfoTree';
import NotifiGroupadd from './components/NotifiGroupadd';
import AddGroupmembers from './components/AddGroupmembers';

@connect(({ alarminfo, loading}) => ({
  alarminfo,
  loading: loading.models.alarminfo,
}))
class NotifyGroup extends Component {
  state ={
    current:1,
    pageSize:1,
    quekey:'',
    select:[]
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { quekey } = this.state;
    this.props.dispatch({
      type:'alarminfo/fetchlist',
      payload: {
        page,
        limit,
        quekey
      }
    });
     
  }

  getChildValue = (val) => {
    // console.log(val);
  }

  changePage = (page) => {
    setTimeout(() => {
      this.setState({current: page});
    })
  }

  onShowSizeChange = (current,pageSize) =>{
    setTimeout(() =>{
      this.setState({
        pageSize
      })
    })
  }

  handleConfirm = () => {
    const { select } = this.state;
    if(select.length !==1) {
      message.info('请选择一条数据');
    } else {
      const {id} = select[0];
      console.log(id);
    }
  }



  render() {
  
    const columns = [
      {
        title:'告警通知人',
        dataIndex:'alertNotifier',
      },
      {
        title:'手机',
        dataIndex:'mobilePhone',
      },
      {
        title:'通知方式',
        dataIndex:'notiMethod',
      },
    ];

    const rowSelection = {
      onChange:(selectedRowkeys,selectedRows) => {
        this.setState({
          select:selectedRows
        });
      }
    }

    const pagination = {
      showQuickJumper: true,
      showSizeChange:true,
      current: this.state.current,
      pageSize: this.state.current,
      onChange:(current) => {this.changePage(current)},
      onShowSizeChange:(current,pageSize) => {this.onShowSizeChange(current,pageSize)},
      total:85,
      showTotal:(total) => `共${total}条记录 第${this.state.current}页`
    }

    const { alarminfo: { notifiGroup }} = this.props;
    return (
      <Row style={{ background: '#f1f1f1' }}>
          <Col span={5}>
            <Card>
              <p>已订阅通知</p>
              <NotifiGroupadd>
                <Button 
                  style={{width:'100%'}}
                  type='dashed'
                  icon='plus'>
                    创建通知组
                </Button>
              </NotifiGroupadd>
            
              <AlarmInfoTree
                toFatherValue={this.getChildValue}/>
             </Card>
          </Col>

          <Col span={19}>
           
            <Card style={{ marginLeft: 8 }}>
              <div style={{marginBottom:'10px'}}>
                <AddGroupmembers>
                  <Button type='primary' icon='plus'>添加组成员</Button>
                </AddGroupmembers>
                {/* <Popconfirm title='确定删除该组成员吗?' onConfirm={this.handleConfirm}> */}
                  <Button type='danger' ghost style={{marginLeft:'10px'}} onClick={this.handleConfirm}>删除组成员</Button>
                {/* </Popconfirm> */}
              </div>
             
              <Table
                columns={columns}
                dataSource={notifiGroup}
                rowSelection={rowSelection}
                pagination={pagination}
                rowKey={record =>record.id}
              />
            </Card>
          </Col>
      </Row>
    
    )
  }
}

export default NotifyGroup;
