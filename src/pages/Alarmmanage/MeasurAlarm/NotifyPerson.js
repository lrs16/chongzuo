import React, { Component } from 'react';
import { connect } from 'dva';
import { Card,
         Table,
         Button,
         Popconfirm,
         message
} from 'antd';
import NewContactadd from './components/NewContactadd'


@connect(({ alarminfo,loading}) =>({
  alarminfo,
  loading: loading.models.alarminfo,
}))
class NotifyPerson extends Component {
  state = {
    current:1,
    pageSize:1,
    select:[]
  }

  componentDidMount() {
    this.getsettingList();

  }

  getsettingList = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'alarminfo/fetchsettingList',
    })
  }

  handleEdit = () => {
    console.log('kok');

  }

  handleDelete = () => {
    console.log(this.state.select.length,'llp')
    if(this.state.select.length !== 1){
      message.info('请选择一条数据删除');
    }else {
      const { select } = this.state;
      const userId = select[0].id
    }
  }

  changePage = (page) => {
    setTimeout(() => {
      this.setState({
        current: page,
        select:[]
      });
    },0);
  }

  onShowSizeChange = (current,pageSize) => {
    setTimeout(() => {
      this.setState({ pageSize});
    },0)
  }

  render() {
    const columns = [
      {
        title:'姓名',
        dataIndex:'fullName',
        key:'fullName'
      },
      {
        title:'系统账号',
        dataIndex:'systemAccount',
        key:'systemAccount'
      },
      {
        title:'电话号码',
        dataIndex:'telephoneNumber',
        key:'telephoneNumber'
      },
      {
        title:'组织',
        dataIndex:'organization',
        key:'organization'
      }
    ];

    const rowSelection = {
      onChange: (selectedRowkeys,selectedRows) => {
        this.setState({
          select: selectedRows
        });
      }
    }

    const pagination = {
      showQuickJumper :true,
      current: this.state.current,
      pageSize: this.state.pageSize,
      showSizeChanger:true,
      onChange:(current) => {this.changePage(current)},
      onShowSizeChange:(current,pageSize) => {this.onShowSizeChange(current,pageSize)},
      total:85,
      showTotal:(total) => `共${total}条记录 第${this.state.current}页`

    }
    
    const { alarminfo:{ settingList }} = this.props;

    return (
    <Card>
      <div style={{marginBottom:15}}> 
        <NewContactadd
          contactId=''
          selectedRows={this.state.select}
        >
          <Button type='primary' style={{marginRight:'10px'}}>新增联系人</Button>
        </NewContactadd>
        
        <NewContactadd
          contactId='contactId'
          selectedRows={this.state.select}
          >
          <Button type='primary' style={{marginRight:'10px'}} >
            编辑联系人
            </Button>
        </NewContactadd>
          <Button onClick={this.handleDelete}>删除联系人</Button>
      

      </div>
      <Table
        columns={columns}
        dataSource={settingList}
        rowKey={record => record.id}
        rowSelection={rowSelection}
        pagination={pagination}
      />


    </Card>);
  }
}

export default NotifyPerson;
