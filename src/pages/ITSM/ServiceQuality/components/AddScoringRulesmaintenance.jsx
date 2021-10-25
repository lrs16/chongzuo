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
  Popconfirm,
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import SysDict from '@/components/SysDict';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Clause from './Clause';
import styles from '../index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { Sider, Content } = Layout;
const { TreeNode } = Tree;
const { Option } = Select;
function AddScoringRulesmaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, resetFields, setFieldsValue },
    location: {
      query: { id, scoreSearch },
    },
    location,
    scoreDetail,
    treeArr,
    treeForm,
    dispatch,
    clauseList,
    loading,
  } = props;
  const required = true;
  const [treeData, setTreeData] = useState([]);
  const [type, setType] = useState('');
  const [selectdata, setSelectData] = useState('');
  const [selectId, setSelectId] = useState('');

  const getlist = selectedKeys => {
    validateFields((err, value) => {
      const { detailed } = value;
      dispatch({
        type: 'qualityassessment/clauseListpage',
        payload: {
          detailed,
          pageNum: 1,
          pageSize: 15,
          scoreId: id,
          targetId: selectedKeys || selectId || (type === '1' ? '605' : '605'),
        },
      });
    });
  };

  //  按需加载树节点
  const getalldata = () => {
    if (id && scoreDetail && scoreDetail.assessType) {
      dispatch({
        type: 'performanceappraisal/getTypeTree',
        payload: type || scoreDetail.assessType,
      });
    } else if (!id) {
      dispatch({
        type: 'performanceappraisal/getTypeTree',
        payload: type || 1,
      });
    }
  };

  useEffect(() => {
    dispatch({
      type: 'qualityassessment/clearclauseList',
    });

    dispatch({
      type: 'qualityassessment/cleardata',
    });

    dispatch({
      type: 'performanceappraisal/clearTree',
    });
    if (location.state && location.state.reset && id) {
      getlist();
      getalldata();
    }
  }, [location.state]);

  useEffect(() => {
    dispatch({
      type: 'qualityassessment/clearclauseList',
    });

    dispatch({
      type: 'performanceappraisal/clearTree',
    });
  }, []);

  useEffect(() => {
    if (loading === false && id && treeData && treeData[0] && treeData[0].children) {
      getlist(treeData[0].children[0].id);
    }
  }, [loading, treeData]);

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

  //  点击节点
  const handleClick = (selectedKeys, event) => {
    const {
      props: { title },
    } = event.node;
    if (selectedKeys && selectedKeys.length > 0) {
      if (
        title !== ('1项目管理' && '2服务质量' && '3项目产品质量' && '4安全管理' && '5加分项') &&
        id
      ) {
        dispatch({
          type: 'qualityassessment/getTargetValue',
          payload: selectedKeys[0],
        });
        getlist(selectedKeys[0]);
        setSelectId(selectedKeys[0]);
      }
    }
  };

  const handleChange = key => {
    setType(key);
  };

  useEffect(() => {
    if (loading === false && scoreDetail && scoreDetail.assessType) {
      setFieldsValue({ assessType: scoreDetail.assessType });
      getalldata();
      setType(scoreDetail.assessType);
    }
  }, [scoreDetail]);

  useEffect(() => {
    setTreeData(treeArr);
  }, [loading]);

  useEffect(() => {
    dispatch({
      type: 'qualityassessment/clearclauseList',
    });

    dispatch({
      type: 'performanceappraisal/clearTree',
    });

    getalldata();
  }, [type]);

  useEffect(() => {
    if (
      loading === false &&
      treeData &&
      treeData.length &&
      treeData[0].children[0] &&
      treeData[0].children[0].id
    ) {
      dispatch({
        type: 'qualityassessment/getTargetValue',
        payload: treeData[0].children[0].id,
      });
    }
  }, [treeData]);

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const handleSubmit = () => {
    validateFields((err, value) => {
      if (!err) {
        if (id) {
          return dispatch({
            type: 'qualityassessment/scoreEdit',
            payload: {
              ...value,
              id,
            },
          }).then(res => {
            if (res.code === 200) {
              message.success(res.msg);
            }
          });
        }

        if (!id) {
          dispatch({
            type: 'qualityassessment/scoreAdd',
            payload: {
              ...value,
              id,
            },
          });
        }
      }
    });
  };

  const getscoredetail = () => {
    dispatch({
      type: 'qualityassessment/scoreId',
      payload: id,
    });
  };

  const submitClause = clauseData => {
    return dispatch({
      type: `${
        clauseData.title === '编辑详细条款'
          ? 'qualityassessment/clauseUpd'
          : 'qualityassessment/clauseAdd'
      }`,
      payload: {
        ...clauseData,
        scoreId: id,
        targetId: selectId || (type === '1' ? '605' : '613'),
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        getlist();
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleDelete = deleteid => {
    return dispatch({
      type: 'qualityassessment/clauseDel',
      payload: deleteid,
    }).then(res => {
      if (res.code === 200) {
        getlist();
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
    });
  };

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
      render: (text, record) => {
        if (!scoreSearch) {
          return (
            <div>
              <Clause
                id={id}
                selectId={selectId}
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
          );
        }
        return null;
      },
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'qualityassessment/clearclauseList',
    });

    dispatch({
      type: 'qualityassessment/cleardata',
    });

    dispatch({
      type: 'performanceappraisal/clearTree',
    });

    setType('');

    if (id) {
      getscoredetail();
      getlist();
    }
  }, [id]);

  const handleReset = () => {
    resetFields('detailed', '');
  };

  const handleBack = () => {
    if (scoreSearch) {
      router.push({
        pathname: `/ITSM/servicequalityassessment/scoringrulessearch`,
        query: { pathpush: true },
        state: { cache: false },
      });
    } else {
      router.push({
        pathname: `/ITSM/servicequalityassessment/scoringrulesmaintenance`,
        query: { pathpush: true },
        state: { cache: false },
      });
    }
  };

  const assessmentType = getTypebyTitle('考核类型');

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          {loading === false && !scoreSearch && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={handleSubmit}>
              保存
            </Button>
          )}

          <Button onClick={handleBack}>返回</Button>
        </>
      }
    >
      <SysDict
        typeid="576"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row>
          <Form {...formItemLayout}>
            {(id ? loading === false : true) && assessmentType && assessmentType.length > 0 && (
              <>
                <Col span={8}>
                  <Form.Item label="评分细则编号">
                    {getFieldDecorator('scoreNo', {
                      initialValue: scoreDetail && scoreDetail.scoreNo,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="评分细则名称">
                    {getFieldDecorator('scoreName', {
                      rules: [
                        {
                          required,
                          message: '请输入评分细则名称',
                        },
                      ],
                      initialValue: scoreDetail && scoreDetail.scoreName,
                    })(<Input disabled={scoreSearch} />)}
                  </Form.Item>
                </Col>
              </>
            )}

            <Col span={8}>
              <Form.Item label="考核类型">
                {getFieldDecorator('assessType', {
                  rules: [
                    {
                      required,
                      message: '请选择考核类型',
                    },
                  ],
                  initialValue: (scoreDetail && scoreDetail.assessType) || '1',
                })(
                  <Select placeholder="请选择" onChange={handleChange} disabled={scoreSearch}>
                    {assessmentType.map(obj => [
                      <Option key={obj.dict_code} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Form>
        </Row>

        <Layout className={styles.headcolor}>
          <Card title="指标明细">
            <Sider theme="light">
              {loading === false && treeData && treeData.length > 0 && (
                <Tree
                  defaultSelectedKeys={type === '1' || type === '' ? ['605'] : ['613']}
                  onSelect={handleClick}
                  defaultExpandAll
                >
                  {renderTreeNodes(treeData)}
                </Tree>
              )}
            </Sider>
          </Card>

          <Content style={{ marginLeft: 10 }}>
            <Card title="编辑指标">
              <Form {...formItemLayout}>
                <Col span={13}>
                  <Form.Item label="一级指标">
                    {getFieldDecorator('target1Name', {
                      initialValue: treeForm && treeForm.target1,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={13}>
                  <Form.Item label="一级指标满分">
                    {getFieldDecorator('value1', {
                      initialValue: treeForm && treeForm.value1,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={13}>
                  <Form.Item label="二级指标">
                    {getFieldDecorator('target2Name', {
                      initialValue: treeForm && treeForm.target2,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={13}>
                  <Form.Item label="二级指标满分">
                    {getFieldDecorator('value2', {
                      initialValue: treeForm && treeForm.value2,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={13}>
                  <Form.Item label="详细条款">
                    {getFieldDecorator('detailed', {})(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={13} style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => getlist(selectId)}
                  >
                    查询
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                </Col>
              </Form>

              {!scoreSearch && (
                <Clause
                  id={id}
                  selectId={selectId}
                  defaultSelect={type === '1' ? ['1417306125605756929'] : ['1417307840400809985']}
                  title="添加详细条款"
                  formItemLayout={formItemLayout}
                  submitClause={newdata => submitClause(newdata)}
                >
                  <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    icon="plus"
                  >
                    新增详细条款
                  </Button>
                </Clause>
              )}

              <Col span={24}>
                <Table
                  dataSource={clauseList.records}
                  columns={columns}
                  rowKey={record => record.id}
                  scroll={{ x: 1300 }}
                />
              </Col>
            </Card>
          </Content>
        </Layout>
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ qualityassessment, performanceappraisal, upmsmenu, itsmuser, loading }) => ({
    show: upmsmenu.show,
    scoreDetail: qualityassessment.scoreDetail,
    clauseDetail: qualityassessment.clauseDetail,
    clauseList: qualityassessment.clauseList,
    treeArr: performanceappraisal.treeArr,
    treeForm: qualityassessment.treeForm,
    userinfo: itsmuser.userinfo,
    loading: loading.models.performanceappraisal,
  }))(AddScoringRulesmaintenance),
);
