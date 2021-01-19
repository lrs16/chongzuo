import React, { useState, useEffect, Children } from 'react';
import { Modal, Tree, Form, Card, Tabs, Radio, Input, message, Row, Col } from 'antd';
import Link from 'umi/link';
import route from 'umi/router';

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
const getOption= [];
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
function Circulation(props) {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState([]);
  const [user, setUser] = useState('');
  const {
    form: { getFieldDecorator, validateFields },
    children,
    dispatch,
    currentObj,
    selectData,
    taskId,
    tobepeople,
  } = props;
  const handleopenClick = () => {
    console.log(list,'list');
    console.log(getOption,'getOption');
    setVisible(true);
    return dispatch({
      type: 'problemmanage/optionPeople',
      payload: {taskId}
    }).then(res  => {
      if(res.code === 200) {
        console.log('res: ', res);
        // if(selectData.length) {
          (res.data).forEach(function(item){
            getOption.push(<Radio value={item.id} key={item.id}>{item.userName}</Radio>)
            console.log(getOption,'getOption');
            setList(getOption);
          })
     
        // }
      }
    })
  };

  const handleCancel = () => {
    setVisible(false);
    // getOption.length = 0;
    // list.length = 0;
  };

  const handleCirculation = () => {
    if(!user.length) {
      message.info('请选择处理人')
      return;
    }
    props.onSubmit();
    handleCancel();
    getOption.length = 0;
  };

  const getback = result => {
    console.log('result: ', result);
    return dispatch({
      type: 'problemmanage/gotoCirculation',
      payload: { taskId, result },
    }).then(res => {
      if(res.code === 200) {
        route.push({pathname:`/ITSM/problemmanage/besolved`})
      }
    })
  };

  const onChange = (e) => {
    setUser(e.target.value);
  }

  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        visible={visible}
        maskClosable={false}
        width={850}
        checkable
        onCancel={handleCancel}
        onOk={handleCirculation}
      >
        <Card bordered={false} title="请选择下一节点处理人">
          <Form layout="inline">
             <Radio.Group onChange={onChange}>
                {list}
             </Radio.Group>
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
