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
  Divider,
  Popconfirm
} from 'antd';
import router from 'umi/router';
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
    form: { getFieldDecorator, validateFields },
    location: { query: { id, scoreSearch } },
    show,
    scoreDetail,
    clauseDetail,
    treeArr,
    treeForm,
    dispatch,
    clauseList,
    loading
  } = props;
  const required = true;
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 });
  const [treeInformation, setTreeInformation] = useState({ pid: '', queKey: '' })
  const [treeData, setTreeData] = useState([]);
  const [type, setType] = useState('')
  const [selectdata, setSelectData] = useState('');
  const [selectId, setSelectId] = useState('')

  console.log(treeForm,'treeForm')

  const getlist = (targetId) => {
    dispatch({
      type: 'qualityassessment/clauseListpage',
      payload: {
        pageNum: 1,
        pageSize: 15,
        scoreId: id,
        targetId: targetId ? targetId[0] : selectId,
      },
    });
  };

  //  按需加载树节点
  const getalldata = () => {
    dispatch({
      type: 'qualityassessment/getTypeTree',
      payload: type || scoreDetail.assessType
    }).then(res => {
      setTreeData(res.data)
    })
  }

  useEffect(() => {
    if (id) {
      getlist();
      getalldata()
    }
  }, [id]);

  //  渲染树结构
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.id} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} {...item} dataRef={item} />;
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
  const handleClick = (selectedKeys, event) => {
    const { props: { title } } = event.node;
    if (title !== ('1项目管理' || '2服务质量' || '3项目产品质量' || '4安全管理' || '5加分项')) {
      dispatch({
        type:'qualityassessment/getTargetValue',
        payload:selectedKeys[0]
      })
      getlist(selectedKeys);
      setSelectId(selectedKeys[0])
    }
  }

  console.log(selectId, 'selectId')

  const onSearch = (value) => {
  }

  const handleChange = (key) => {
    setType(key)
  }

  useEffect(() => {
    if (type) {
      getalldata();
    }
  }, [type])

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  }

  const handleSubmit = () => {
    validateFields((err, value) => {
      if (!err) {
        dispatch({
          type: 'qualityassessment/scoreAdd',
          payload: {
            ...value,
            assessType:value.assessType === '1' ? '功能开发' :'系统运维'
          }
        })
      }
    })
  }

  const getclausedetail = () => {
    dispatch({
      type: 'qualityassessment/clauseId',
      payload: id
    })
  }

  const getscoredetail = () => {
    dispatch({
      type: 'qualityassessment/scoreId',
      payload: id
    });
  }

  const submitClause = (clauseData) => {
    return dispatch({
      type: 'qualityassessment/clauseAdd',
      payload: {
        ...clauseData,
        scoreId: id,
        targetId: selectId
      }
    }).then(res => {
      if (res.code === 200) {
        getlist()
      } else {
        message.error(res.msg);
      }
    })
  }

  const handleDelete = (key) => {

  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '详细条款',
      dataIndex: 'detailed',
      key: 'detailed',
    },
    {
      title: '评价类型',
      dataIndex: 'calc',
      key: 'calc',
    },
    {
      title: '分值',
      dataIndex: 'scoreValue',
      key: 'scoreValue',
    },
    {
      title: '数据来源',
      dataIndex: 'sources',
      key: 'sources',
    },
    {
      title: '扣分说明',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => (
        <div>
          <Clause
            formItemLayout={formItemLayout}
            submitClause={newdata => submitClause(newdata)}
            title="编辑详细条款"
            clause={record}
            pidkey={record.pid}
          >
            <a type="link">编辑</a>
          </Clause>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此菜单吗？" onConfirm={() => handleDelete(record.id)}>
            <a type="link">删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (id) {
      getscoredetail();
      // getclausedetail()
      getlist()
    }
  }, [id])

  const handleBack = () => {
    if (scoreSearch) {
      router.push({
        pathname: `/ITSM/servicequalityassessment/scoringrulessearch`,
      })
    } else {
      router.push({
        pathname: `/ITSM/servicequalityassessment/scoringrulesmaintenance`,
      })
    }
  }

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize)
      }
    })
    setPaginations({
      ...paginations,
      pageSize
    })
  }

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize)
      }
    })

    setPaginations({
      ...paginations,
      current: page
    })
  }

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pagesize) => onShowSizeChange(page, pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: clauseList.total,
    showTotal: total => `总共 ${total} 条记录`,
    onChange: (page) => changePage(page)
  }

  console.log(treeData,'treeData')
  // const functionDevelopment = getTypebyTitle('功能开发');
  const assessmentType = getTypebyTitle('考核类型');
  console.log('assessmentType: ', assessmentType);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          {
            !scoreSearch && (
              <Button
                type='primary'
                style={{ marginRight: 8 }}
                onClick={handleSubmit}
              >
                保存
              </Button>
            )
          }

          <Button onClick={handleBack}>
            返回
          </Button>
        </>
      }
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
                      getFieldDecorator('scoreNo', {
                        initialValue: scoreDetail.scoreNo
                      })
                        (<Input disabled='true' />)
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
                            message: '请输入评分细则名称'
                          }
                        ],
                        initialValue: scoreDetail.scoreName
                      })
                        (<Input disabled={scoreSearch} />)
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
                            message: '请选择考核类型'
                          }
                        ],
                        initialValue: scoreDetail.assessType
                      })
                        (
                          <Select
                            placeholder="请选择"
                            onChange={handleChange}
                            disabled={scoreSearch}
                          >
                            {assessmentType.map(obj => [
                              <Option key={obj.dict_code} value={obj.dict_code}>
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
                  <Search
                    style={{ marginBottom: 8 }}
                    placeholder="Search"
                    disabled={scoreSearch}
                    onSearch={onSearch} />
                  <Tree
                    // loadData={onLoadData}
                    onSelect={handleClick}
                    disabled={scoreSearch}
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
                          getFieldDecorator('target1Name', {
                            initialValue: treeForm.target1
                          })
                            (
                              <Input disabled='true' />
                            )
                        }
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item label='一级指标满分'>
                        {
                          getFieldDecorator('value1', {
                            initialValue:treeForm.value1
                          })
                            (<Input disabled='true' />)
                        }
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item label='二级指标'>
                        {
                          getFieldDecorator('target2Name', {
                            initialValue:treeForm.target2
                          })
                            (
                              <Input disabled='true' />
                            )
                        }
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item label='二级指标满分'>
                        {
                          getFieldDecorator('value2', {
                            initialValue:treeForm.value2
                          })
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
                      <Button
                        type='primary'
                        style={{ marginRight: 8 }}
                        disabled={scoreSearch}
                      >
                        查询
                      </Button>
                      <Button
                        disabled={scoreSearch}
                      >重置</Button>
                    </Col>
                  </Form>

                  {id && !scoreSearch && selectId && (
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
                        新增详细条款
                      </Button>
                    </Clause>
                  )}

                  <Table
                    dataSource={clauseList.records || []}
                    columns={columns}
                    rowKey={record => record.id}
                    pagination={pagination}
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

AddScoringRulesmaintenance.defaultProps = {
  treeForm: {
    target1: '',
    target2:'',
    value1:'',
    value2:'',
    scoreName: '',
    assessType: ''
  }
}



export default Form.create({})(
  connect(({ qualityassessment, upmsmenu, loading }) => ({
    maintenanceData: qualityassessment.maintenanceData,
    show: upmsmenu.show,
    scoreDetail: qualityassessment.scoreDetail,
    clauseDetail: qualityassessment.clauseDetail,
    clauseList: qualityassessment.clauseList,
    treeArr: qualityassessment.treeArr,
    treeForm: qualityassessment.treeForm,
    loading: loading.models.qualityassessment
  }))(AddScoringRulesmaintenance)
)
