import React, { useState, useEffect, Children } from 'react';
import { Modal, Table, Form, Card, Tabs, Radio, Input, Button, Row, Col } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

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
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '事件编号',
    dataIndex: 'eventNumber',
    key: 'eventNumber',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '状态',
    dataIndex: 'statue',
    key: 'statue',
  },
];

const columnRealse = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '发布编号',
    dataIndex: 'realseNumber',
    key: 'realseNumber',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '状态',
    dataIndex: 'statue',
    key: 'statue',
  },
];
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
function Associatedevent(props) {
  const [visible, setVisible] = useState(false);
  const {
    // form: { getFieldDecorator },
    children,
    dispatch,
    chooseClass,
  } = props;
  console.log('props: ', props);
  const handleopenClick = () => {
    const {
      form: { getFieldDecorator, validateFields },
    } = props;
    setVisible(true);
    // dispatch({
    //   type: 'problemmanage/fetchComConfigTree',
    // });
  };

  const handleCancel = () => {
    setVisible(false);
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
        <Form layout="inline">
          {chooseClass === 1 && (
            <Form.Item label="事件编号">
              {/* {
                getFieldDecorator('eventNumber',{})(<Input/>)
              } */}
            </Form.Item>
          )}

          {chooseClass === 2 && (
            <Form.Item label="发布编号">
              {/* {
                getFieldDecorator('releaseNumber',{})(<Input/>)
              } */}
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary">查询</Button>
          </Form.Item>

          <Form.Item>
            <Button>重置</Button>
          </Form.Item>

          <Form.Item>
            <Associatedevent>
              <Button type="primary">关联工单</Button>
            </Associatedevent>
          </Form.Item>
        </Form>
        <Card>
          <Card.Grid>
            {chooseClass === 1 && (
              <Table
                columns={columns}
                // dataSource={eventtableList.data}
              />
            )}

            {chooseClass === 2 && (
              <Table
                columns={columnRealse}
                // dataSource={realsetableList.data}
              />
            )}
          </Card.Grid>

          <Card.Grid>
            <Form>
              <Form.Item label="事件编号"></Form.Item>
              <Form.Item label="事件来源"></Form.Item>
              <Form.Item label="事件分类"></Form.Item>
              <Form.Item label="建单时间"></Form.Item>
              <Form.Item label="事件标题"></Form.Item>
              <Form.Item label="事件描述"></Form.Item>
            </Form>
          </Card.Grid>
        </Card>
      </Modal>
    </>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    loading: loading.models.problemmanage,
  }))(Associatedevent),
);
