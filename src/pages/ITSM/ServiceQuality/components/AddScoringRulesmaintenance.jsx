import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Layout,
  Tree,
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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

const { Sider, Content } = Layout;
const { TreeNode } = Tree;

function getAllLeaf(data) {
  const result = [];
  function getLeaf(data) {
    console.log('data: ', data);
    if (data[0].children.length === 1) {
      getLeaf(data[0].children);
    } else {
      result.push(data[0].children);
    }
  }
  getLeaf(data);
  return result[0];
}

function AddScoringRulesmaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator },
    dispatch
  } = props;
  const required = true;
  const [treeData, setTreeData] = useState([]);

  // 按需加载树节点
  const getalldata = () => {
    dispatch({
    type: 'upmsmenu/fetchdatas',
    payload: {
      pid: '0',
    },
  })
    .then(res => {
      setTimeout(() => {
        setTreeData( res.data );
      }, 0);
    });
};


// 点击加载结点
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
          //  message.info('已经到最后一层！');
        }
      });
    setTimeout(() => {
      setTreeData([...treeData]);
      resolve();
    }, 600);
  });

// 渲染树结构
const renderTreeNodes = data =>
  data.map(item => {
    console.log('data: ', data);
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} {...item} dataRef={item} />;
  });


return (
  <PageHeaderWrapper title={pagetitle}>
    <Card>
      <Row>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label='评分细则编号'>
              {
                getFieldDecorator('no', {})
                  (<Input />)
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='评分细则名称'>
              {
                getFieldDecorator('no', {
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
                getFieldDecorator('no', {
                  rules: [
                    {
                      required,
                      messages: '请选择考核类型'
                    }
                  ]
                })
                  (<Input />)
              }
            </Form.Item>
          </Col>

        </Form>
      </Row>

      <Layout>
        <Sider theme="light">
          <Tree
            loadData={onLoadData}
          //  onCheck={onCheck}
          // onSelect={this.handleClick}
          >
            {renderTreeNodes(treeData)}
          </Tree>
        </Sider>
        <Content style={{ background: '#fff' }}>
          {/* <div>
              <Form style={{ float: 'right', width: '30%' }}>
                <Search
                  placeholder="请输入关键字"
                  onSearch={values => this.handleSearch(values)}
                />
              </Form>
              <MenuModal onSumit={handleUpdate} pidkey={this.state.pidkey}>
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  type="dashed"
                  icon="plus"
                >
                  新建菜单
                </Button>
              </MenuModal>
              <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={record => record.id}
                pagination={pagination}
                scroll={{ x: 1300 }}
              />
            </div> */}
        </Content>
      </Layout>

    </Card>

  </PageHeaderWrapper>
)
}

export default Form.create({})(
  connect(({ qualityassessment, upmsmenu, loading }) => ({
    maintenanceData: qualityassessment.maintenanceData,
  }))(AddScoringRulesmaintenance)
)
