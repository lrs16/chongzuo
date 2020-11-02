import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Divider, Popconfirm, Table, Message, message, Row, Col, Button } from 'antd';
import SshInfoAdd from './SshInfoAdd';
import SshInfoEdit from './SshInfoEdit';

// 克隆子元素按钮，并添加事件
function withClick(element, handleClick = () => { }) {
  return <element.type {...element.props} onClick={handleClick} />;
}

@connect(({ softexetute, loading }) => ({
    softexetute,
    loading: loading.models.softexetute,
}))

class SshconfigModal extends Component {

    state = {
        visible: false,
        current: 1,
        pageSize: 10,
        queKey: '',
        hostIp:'',
    };

    handleopenClick = () => {
      const { hostsIp } = this.props.softexetute.treehostdata;
      this.setState({hostIp: hostsIp});
      if(hostsIp) {
          const page = this.state.current;
          const limit = this.state.pageSize;
          const { queKey } = this.state;
          
          this.props.dispatch({
            type: 'softexetute/getSshInfoList',
            payload: {
              page,
              limit,
              queKey,
              hostIp: hostsIp
            },
          });

          this.setState({
              visible: true,
          });
          
      } else {
          message.error('请选择主机信息！');
      }
  };


    changePage = (page) => {
      this.props.dispatch({
        type: 'softexetute/getSshInfoList',
        payload: {
          queKey: this.state.queKey,
          page,
          limit: this.state.pageSize,
          hostIp: this.state.hostIp
        },
      });
      setTimeout(() => {
        this.setState({ current: page });
      }, 0);
    };
  
    onShowSizeChange = (current, pageSize) => {
      this.props.dispatch({
        type: 'softexetute/getSshInfoList',
        payload: {
          queKey: this.state.queKey,
          page: current,
          limit: pageSize,
          hostIp: this.state.hostIp
        },
      });
      setTimeout(() => {
        this.setState({ pageSize });
      }, 0);
    };
    

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    // 配置SSH添加，删除，编辑操作
    handleAdd = values => {
        const { hostsIp,  hostsSshUsername, hostsSshPassword, hostsSshPort } = values;
        const { dispatch } = this.props;
        return dispatch({
          type: 'softexetute/add',
          payload: { hostsIp,  hostsSshUsername, hostsSshPassword, hostsSshPort },
        }).then(res => {
          if (res.code === 200) {
            Message.success('添加'+ res.msg);
            this.handleopenClick();
          } else {
            Message.error('添加'+ res.msg);
          }
        });
    };

    handleDelete = id => {
        const { dispatch } = this.props;
        return dispatch({
          type: 'softexetute/remove',
          payload: { id },
        }).then(res => {
           if(res.code === 200) {
              Message.success('删除'+ res.msg);
              this.handleopenClick();
           }
        });
    };

    handleEdite = (values, record) => {
        const id = record.id;
        const { hostsIp,  hostsSshUsername, hostsSshPassword, hostsSshPort } = values;
        const { dispatch } = this.props;
        return dispatch({
          type: 'softexetute/edite',
          payload: { hostsIp,  hostsSshUsername, hostsSshPassword, hostsSshPort, id },
        }).then(res => {
            if (res.code === 200) {
              Message.success('编辑'+ res.msg);
              this.handleopenClick();
            } else {
              Message.error('编辑'+ res.msg);
            }
        });
    };

    // 查看密码，检测链接按钮
    getSecretThief = (record) => {
      const id = record.id;
      const { dispatch } = this.props;
      dispatch({
        type: 'softexetute/getSecretThief',
        payload: {id},
      }).then(res => {
        setTimeout(() => {
          if (res.state && res.code === 200) {
            message.success(res.msg);
          } else {
            message.error(res.msg);
          }
        }, 500);
      });
    };

    getCheckSshLink = (record) => {
      const id = record.id;
      const { dispatch } = this.props;
      dispatch({
        type: 'softexetute/getCheckSshLink',
        payload: {id},
      }).then(res => {
        setTimeout(() => {
          if (res.state && res.code === 200) {
            message.success(res.msg);
          } else {
            message.error(res.msg);
          }
        }, 500);
      });
    };
 
    render() {
        const columns = [
            {
              title: '数据编号',
              dataIndex: 'id',
              key: 'id',
              width: 200,
            },
            {
                title: '主机IP',
                dataIndex: 'hostsIp',
                key: 'hostsIp',
                width: 150,
            },
            {
                title: '帐号名称',
                dataIndex: 'hostsSshUsername',
                key: 'hostsSshUsername',
                width: 150,
            },
            {
                title: '帐号密码',
                dataIndex: 'hostsSshPassword',
                key: 'hostsSshPassword',
                width: 250,
                ellipsis: true,
            },
            {
                title: '使用端口',
                dataIndex: 'hostsSshPort',
                key: 'hostsSshPort',
                width: 100,
                editable: true,
            },
            // {
            //     title: '密码盐',
            //     dataIndex: 'hostsSshPassSalt',
            //     key: 'hostsSshPassSalt',
            // },
            {
                title: '创建人',
                dataIndex: 'createUserNameExt',
                key: 'createUserNameExt',
                width: 150,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
                width: 200,
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime ',
                key: 'updateTime ',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
                width: 200,
            },
            {
              title: '操作',
              dataIndex: 'action',
              key: 'action',
              width: 260,
              fixed: 'right',
              render: (text, record) => (
                <div>
                    {/* <SshInfoAdd
                      record={record}
                      onSumit={values => this.handleAdd(values)}
                    >
                        <a type="link">添加</a>
                    </SshInfoAdd>
                    <Divider type="vertical" /> */}

                    <SshInfoEdit 
                      record={record}
                      onSumit={(values) => this.handleEdite(values, record)}
                    >
                        <a type="link">编辑</a>
                    </SshInfoEdit>
                    <Divider type="vertical" />

                    <Popconfirm title="确定删除吗？" onConfirm={() => this.handleDelete(record.id)}>
                        <a type="link">删除</a>
                    </Popconfirm>
                    <Divider type="vertical" />

                    <span>
                      <a type="link" record={record} onClick={() => this.getSecretThief(record)}>查看密码</a>
                    </span>
                    <Divider type="vertical" />

                    <span>
                      <a type="link" record={record} onClick={() => this.getCheckSshLink(record)}>检测连接</a>
                    </span>
                </div>
              ),
            },
        ];

        const {
            softexetute: { sshinfodata },
            loading,
        } = this.props;
          
        const dataSource = sshinfodata && sshinfodata.rows;

        const pagination = {
          showSizeChanger: true,
          onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
          current: this.state.current,
          pageSize: this.state.pageSize,
          total: sshinfodata.total,
          onChange: page => this.changePage(page),
        };

        const { visible } = this.state;
        const { children, title } = this.props;
        return (
            <> 
                {withClick(children, this.handleopenClick)}
                <Modal
                    visible={visible}
                    title={title}
                    centered
                    onCancel={this.handleCancel}
                    footer={null}
                    width={1300}
                >
                    <Row>
                      <Col span={24}>
                          <SshInfoAdd onSumit={values => this.handleAdd(values)} hostIp={this.props.softexetute.treehostdata}>
                            <Button
                              style={{ width: '100%', margin: '16px 0 8px 0' }}
                              type="dashed"
                              icon="plus"
                            >
                              添加
                            </Button>
                          </SshInfoAdd>
                      </Col>
                    </Row>
                    <Table
                        dataSource={dataSource}
                        columns={columns.filter(item => item.title !== '数据编号' || item.key !== 'id')}
                        rowKey={record => record.id}
                        scroll={{ x: 1300 }}
                        table-layout="fixed"
                        pagination={pagination}
                    />
                </Modal>
            </>
        );
    }
}

export default SshconfigModal;
