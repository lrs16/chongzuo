import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Layout,
  Tree,
  message,
  Table,
  Button,
  Select,
  Cascader
} from 'antd';
import { connect } from 'dva';
import SysDict from '@/components/SysDict';
import Clause from './Clause';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '../index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const { Search } = Input;
const { Sider, Content } = Layout;
const { TreeNode } = Tree;
const { Option } = Select;



function AddScoringRulesmaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator },
    show,
    dispatch,
  } = props;
  const required = true;
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 });
  const [treeInformation, setTreeInformation] = useState({ pid: '', queKey: '' })
  const [treeData, setTreeData] = useState([]);
  const [selectdata, setSelectData] = useState('');

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '详细条款',
      dataIndex: 'menuDesc',
      key: 'menuDesc',
    },
    {
      title: '评价类型',
      dataIndex: 'menuName',
      key: 'menuName',
    },
    {
      title: '分值',
      dataIndex: 'menuUrl',
      key: 'menuUrl',
    },
    {
      title: '数据来源',
      dataIndex: 'menuIcon',
      key: 'menuIcon',
    },
    {
      title: '扣分说明',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      // render: (text, record) => (
      //   <div>
      //     <MenuModal
      //       onSumit={values => handleEdite(values)}
      //       title="编辑菜单"
      //       record={record}
      //       pidkey={record.pid}
      //     >
      //       <a type="link">编辑</a>
      //     </MenuModal>
      //     <Divider type="vertical" />
      //     <Popconfirm title="确定删除此菜单吗？" onConfirm={() => handleDelete(record.id)}>
      //       <a type="link">删除</a>
      //     </Popconfirm>
      //   </div>
      // ),
    },
  ];

  const getlist = () => {
    const page = paginations.current;
    const limit = paginations.pageSize;
    const { queKey, pidkey } = treeInformation;
    dispatch({
      type: 'upmsmenu/search',
      payload: {
        page,
        limit,
        queKey,
        pid: pidkey,
      },
    });
  };

  //  按需加载树节点
  const getalldata = () => {
    dispatch({
      type: 'upmsmenu/fetchdatas',
      payload: {
        pid: '0'
      },
    }).then(res => {
      setTreeData(res.data)
    })
  }

  useEffect(() => {
    getlist();
    getalldata()
  }, []);

  //  渲染树结构
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  const getAllLeaf = (data) => {
    const result = [];
    const getLeaf = data => {
      if (data[0].children.length === 1) {
        getLeaf(data[0].children);
      } else {
        result.push(data[0].children)
      }
    }
    getLeaf(data);
    return result[0];
  }

  //  异步加载数据
  const onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      dispatch({
        type: 'upmsmenu/fetchdatas',
        payload: {
          pid: treeNode.props.dataRef.key,
        },
      })
        .then(res => {
          if (res.data !== undefined) {
            const sontreedata = getAllLeaf(res.data);
            treeNode.props.dataRef.children = sontreedata;
          } else {
            message.info('已经到最后一层！');
          }
        });
      setTimeout(() => {
        // this.setState({
        //   treeData: [...this.state.treeData],
        // });
        setTreeData([...treeData])
        resolve();
      }, 600);

    });

  //  点击节点
  const handleClick = selectedKeys => {
    const page = paginations.current;
    const limit = paginations.pageSize;
    dispatch({
      type: 'upmsmenu/search',
      payload: {
        page,
        limit,
        pid: selectedKeys[0]
      }
    })
  }

  const onSearch = (value) => {
  }

  const handleChange = (value) => {

  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  }

  const submitClause = (clauseData) => {
    console.log('clauseData: ', clauseData);

  }

  // const functionDevelopment = getTypebyTitle('功能开发');
  const assessmentType = getTypebyTitle('考核类型');

  return (
    <PageHeaderWrapper 
    title={pagetitle}
    >
      <SysDict
        typeid='1410413049587699713'
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {
        assessmentType && assessmentType.length > 0 && (
          <Card>
            <Row>
              <Form {...formItemLayout}>
                <Col span={8}>
                  <Form.Item label='评分细则编号'>
                    {
                      getFieldDecorator('scoreNo', {})
                        (<Input disabled='true'/>)
                    }
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='评分细则名称'>
                    {
                      getFieldDecorator('scoreName', {
                        rules: [
                          {
                            required,
                            messages: '请输入评分细则名称'
                          }
                        ]
                      })
                        (<Input />)
                    }
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label='考核类型'>
                    {
                      getFieldDecorator('assessType', {
                        rules: [
                          {
                            required,
                            messages: '请选择考核类型'
                          }
                        ]
                      })
                        (
                          <Select
                            placeholder="请选择"
                            onChange={handleChange}
                          >
                            {assessmentType.map(obj => [
                              <Option key={obj.key} value={obj.dict_code}>
                                {obj.title}
                              </Option>,
                            ])}
                          </Select>,
                        )
                    }
                  </Form.Item>
                </Col>

              </Form>
            </Row>
            <Layout className={styles.headcolor}>
              <Card title='指标明细' >
                <Sider theme="light">
                  <Search style={{ marginBottom: 8 }} placeholder="Search" onSearch={onSearch} />
                  <Tree
                    loadData={onLoadData}
                    onSelect={handleClick}
                  >
                    {renderTreeNodes(treeData)}
                  </Tree>
                </Sider>
              </Card>

              <Content style={{ marginLeft: 10 }}>
                <Card title='编辑指标'>
                  <Form {...formItemLayout}>
                    <Col span={13}>
                      <Form.Item label='一级指标'>
                        {
                          getFieldDecorator('no55', {})
                            (
                              <Input disabled='true' />
                            )
                        }
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item label='一级指标满分'>
                        {
                          getFieldDecorator('no66', {})
                            (<Input disabled='true' />)
                        }
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item label='二级指标'>
                        {
                          getFieldDecorator('no77', {})
                            (
                              <Input disabled='true' />
                            )
                        }
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item label='二级指标满分'>
                        {
                          getFieldDecorator('no88', {})
                            (<Input disabled='true' />)
                        }
                      </Form.Item>
                    </Col>
                    <Col span={13}>
                      <Form.Item label='详细条款'>
                        {
                          getFieldDecorator('no99', {})
                            (<Input disabled='true' />)
                        }
                      </Form.Item>
                    </Col>

                    <Col span={13} style={{ textAlign: 'right' }}>
                      <Button type='primary' style={{ marginRight: 8 }}>查询</Button>
                      <Button>重置</Button>
                    </Col>
                  </Form>

                  <Clause
                    title='添加详细条款'
                    formItemLayout={formItemLayout}
                    submitClause={newdata => submitClause(newdata)}
                  >
                    <Button
                      style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                      type="dashed"
                      icon='plus'
                    >
                      新增评分细则
                    </Button>
                  </Clause>

                  <Table
                    // dataSource={show.rows}
                    columns={columns}
                    rowKey={record => record.id}
                    // pagination={pagination}
                    scroll={{ x: 1300 }}
                  />
                </Card>
              </Content>
            </Layout>
          </Card>
        )
      }

    </PageHeaderWrapper>
  )
}



export default Form.create({})(
  connect(({ qualityassessment, upmsmenu, loading }) => ({
    maintenanceData: qualityassessment.maintenanceData,
    show: upmsmenu.show,
  }))(AddScoringRulesmaintenance)
)
