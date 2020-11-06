import { connect } from 'dva';
import { Component } from 'react';
import { Card, 
  Table, 
  Form, 
  Input, 
  Button, 
  Message, 
  Divider, 
  Select, 
  Popconfirm,
  Layout,
  Row,
  Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CommandAdd from './components/CommandAdd';

const { Option } = Select;
const { Search } = Input;
@connect(({ commandconfigurate, loading }) => ({
  commandconfigurate,
  loading:loading.models.commandconfigurate
}))
class CommandConfigurate extends Component {
  state = {
    quekey:'',
    current:1,
    pageSize:10,
  };

  componentDidMount() {
    this.getCommandlist();
  }

  getCommandlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey } = this.state;
    this.props.dispatch({
      type:'commandconfigurate/fetch',
      payload:{
        page,
        limit,
        queKey,
      },
    });
  };

  handleSearch = values => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.setState({
      queKey:values,
    });
    this.props.dispatch({
      type:'commandconfigurate/fetch',
      payload:{
        queKey:values,
        page,
        limit,
      },
    });
  };

  handleAdd = values => {
    const { dispatch } = this.props;
    return dispatch({
      type:'commandconfigurate/addSave',
      payload: values
    }).then(res => {
      if(res.code === 200) {
        Message.success(res.msg);
        this.getCommandlist();
      }else {
        Message.error((res.msg));
      }
    });
  };

  updateCommand = (values) => {
    const { dispatch } = this.props;
    return dispatch({
      type:'commandconfigurate/updateCommand',
      payload:values
    }).then(res => {
      if(res.code === 200 ){
        Message.success(res.msg);
        this.getCommandlist();
      }else {
        Message.error(res.msg);
      }
    });
  };

  handleDelete = (id) => {
    const { dispatch } = this.props;
    return dispatch({
      type:'commandconfigurate/deleteCommand',
      payload:{id}
    }).then(res =>{
      if(res.code === 200) {
        Message.success(res.msg);
        this.getCommandlist();
      }else {
        Message.error(res.msg);
      }
    });
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type:'commandconfigurate/fetch',
      payload:{
        queKey: this.state.quekey,
        page:current,
        limit:pageSize
      }
    });
    setTimeout(() => {
      this.setState({ pageSize });
    },0);
  };
  
  changePage = page => {
    this.props.dispatch({
      type:'commandconfigurate/fetch',
      payload:{
        queKey:this.state.quekey,
        page,
        limit:this.state.pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: page});
    },0);
  };

  render(){
    const { commandconfigurate:{ data }} = this.props;
    const dataSource = data.rows;
    const columns = [
      // {
      //   title:'数据编号',
      //   dataIndex:'id',
      //   key:'id'
      // },
      {
        title:'命令类型',
        dataIndex:'commandType',
        key:'commandType',
        width:100

      },
      {
        title:'命令分类',
        dataIndex:'commandClass',
        key:'commandClass',
        width:100
      },
      {
        title:'命令名称',
        dataIndex:'commandName',
        key:'commandName',
        width:100,
        ellipsis: true
      },
      {
        title:'命令源码',
        dataIndex:'commandSrc',
        key:'commandSrc',
        width:100,
        ellipsis: true
      },
      {
        title:'命令状态',
        dataIndex:'commandState',
        key:'commandState',
        width:100
      },
      {
        title:'命令排序',
        dataIndex:'commandSort',
        key:'commandSort',
        width:100
      },
      {
        title:'命令备注',
        dataIndex:'commandRemark',
        key:'commandRemark',
        width:100
      },
      {
        title:'创建者',
        dataIndex:'createUserNameExt',
        key:'createUserNameExt',
        width:100
      },
      {
        title:'更新人',
        dataIndex:'updateUserNameExt',
        key:'updateUserNameExt',
        width:150
      },
      // {
      //   title:'更新人编号',
      //   dataIndex:'updateUser',
      //   key:'updateUser',
      //   width:100
      // },
      {
        title:'创建时间',
        dataIndex:'createTime',
        key:'createTime',
        width:200
      },
      {
        title:'更新时间',
        dataIndex:'updateTime',
        key:'updateTime',
        width:200
      },
      {
        title:'操作',
        dataIndex:'',
        width:200,
        fixed:'right',
        render:(record) => (
          <div>
            <Divider type='vertical' />
            <CommandAdd
              onSumit={values => this.updateCommand(values)}
              title='编辑配置命令'
              // record={record}
              id={record.id}
            >
              <a type='link'>编辑命令</a>
            </CommandAdd>
            <Divider type='vertical' />
            <Popconfirm 
              title='确定删除此菜单吗?'
              onConfirm={() => this.handleDelete(record.id)} >
              <a type='link'>删除命令</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange:(current,pageSize) => this.onShowSizeChange(current,pageSize),
      current:this.state.current,
      pageSize:this.state.pageSize,
      total:data.total,
      onChange:page => this.changePage(page),
    }
    return (
      <PageHeaderWrapper title='命令配置'>
        <Card>
          <Form style={{ float:'right',width:'30%'}}>
            <Search placeholder='请输入关键字' onSearch={values => this.handleSearch(values)}></Search>

          </Form>
          <CommandAdd onSumit={values => this.handleAdd(values)}>
            <Button
              style={{width:'100%',margin:'16px 0 8px 0'}}
              type='dashed'
              icon='plus'
            >
              添加命令
            </Button>
          </CommandAdd>
        
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{x:1500}}
            rowKey={record => record.id}
            pagination={pagination}
          >
          </Table>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default CommandConfigurate;