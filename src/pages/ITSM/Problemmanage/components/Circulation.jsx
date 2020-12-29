import React, { useState, useEffect, Children } from 'react';
import { Modal, Tree, Form, Card, Tabs, Radio, Input, Button, Row, Col } from 'antd';
import Link from 'umi/link';

import { connect } from 'dva';
import { defaults } from 'lodash';

const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { Search } = Input;
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
let treeData;
let result;

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
function Circulation(props) {
  const [visible, setVisible] = useState(false);
  const [golist, setGolist] = useState(false);
  const {
    form: { getFieldDecorator, validateFields },
    children,
    dispatch,
    currentObj,
    target,
    taskId,
    tobepeople,
  } = props;
  const handleopenClick = () => {
    setVisible(true);
    dispatch({
      type: 'problemmanage/fetchComConfigTree',
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCirculation = () => {
    switch (currentObj) {
      case '5':
        result = 1;
        getback(result);
        break;
      case '9':
        result = 1;
        getback(result);
        break;
      case '25':
        result = 1;
        getback(result);
        break;
      case '29':
        result = 1;
        getback(result);
        break;
      case '45':
        result = 1;
        getback(result);
        break;
      case '65':
        result = 1;
        getback(result);
        break;
      case '69':
        result = 1;
        getback(result);
        break;
      case '85':
        result = 1;
        getback(result);
        break;
      default:
        break;
    }
  };

  const getback = result => {
    console.log('result: ', result);
    dispatch({
      type: 'problemmanage/gotoCirculation',
      payload: { taskId, result },
    });
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        visible={visible}
        // centered='true'
        maskClosable={false}
        width={850}
        checkable
        // height={1000}
        onCancel={handleCancel}
        // onOk={handleCirculation}
        footer={null}
      >
        <Card bordered={false} title="选择提交节点">
          <Form layout="inline">
            <Row>
              <Col span={9}>
                <Form.Item>
                  <Radio.Group>
                    <Radio value={1}>默认</Radio>
                    <Radio value={2}>配置节点</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item>{getFieldDecorator('search', {})(<Input />)}</Form.Item>
              </Col>

              <Col span={10}>
                <Form.Item>
                  <Button type="primary" style={{ marginRight: '10px' }}>
                    查询
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={handleCirculation}
                  >
                    <Link
                      to={{
                        pathname: '/ITSM/problemmanage/besolved',
                      }}
                    >
                      确定
                    </Link>
                  </Button>
                  <Button>取消</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    </>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    selectData: problemmanage.selectData,
    tobepeople: problemmanage.tobepeople,
    loading: loading.models.problemmanage,
  }))(Circulation),
);
