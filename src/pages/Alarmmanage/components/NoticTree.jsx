import React, { useState } from 'react';
import { Tree, Form, Row, Col, Input, Drawer, Button, AutoComplete } from 'antd';
import { SearchUsers } from '../../SysManage/services/api';

const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = AutoComplete;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

function NoticTree(props) {
  const { visible, ChangeVisible, openType, alarmgroup, selectdata } = props;
  const { getFieldDecorator, resetFields, getFieldsValue, setFieldsValue } = props.form;
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [users, setUsers] = useState([]);

  const hanldleCancel = () => {
    ChangeVisible(false)
  };
  const handleOk = () => {
    ChangeVisible(false)
  }
  const onExpand = (Keys) => {
    setExpandedKeys(Keys);
  };
  const onCheck = (Keys) => {
    console.log(Keys)
    setCheckedKeys(Keys)
  };
  const onSelect = (Keys, info) => {
    setSelectedKeys(Keys)
  };

  const Searchuser = (queKey) => {
    if (queKey) {
      SearchUsers({ queKey, page: 1, limit: 100 }).then(res => {
        if (res.code === 200) {
          setUsers(res.data.rows)
        }
      })
    };
  }

  const handleSelectduser = (v, opt) => {
    setFieldsValue({
      key1: opt.props.user.userName,
      key2: opt.props.user.deptNameExt,
      key3: opt.props.user.userPhone,
    })
  }

  // 用户列表
  const userlist = users.map(opt => (
    <Option key={opt.id} value={opt.userName} user={opt}>
      <div>
        <span>{opt.userName}</span>
        <span>{opt.deptNameExt}</span>
        <span>{opt.userPhone}</span>
      </div>
    </Option>
  ));

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const measurmap = getTypebykey('1436608796393205762');          // 计量
  const hostmap = getTypebykey('1437319207950217217');            // 主机巡检内容
  const softmap = getTypebykey('1442405396184997889');            // 软件      
  const appmap = getTypebykey('1437322008466026497');             // 应用程序
  const filesmmap = getTypebykey('1442417886570639362');          // 配置文件
  const messagermap = getTypebykey('1437584114700386305');        // 上下行报文
  const alarmgroupmap = getTypebykey('1443057641104752641');        // 告警通知
  console.log(measurmap);

  const treenodemap = new Map([
    ['计量业务告警', measurmap],
    ['主机巡检告警', hostmap],
    ['软件巡检告警', softmap],
    ['应用程序运行状态告警', appmap],
    ['配置文件变更告警', filesmmap],
    ['上下行报文页面告警', messagermap],
  ]);

  return (
    <Drawer
      title="新增告警联系人"
      placement="right"
      onClose={hanldleCancel}
      visible={visible}
      width={500}
    >
      <Row>
        <Form {...formItemLayout}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="告警通知人">{
                getFieldDecorator('key1')(
                  <>
                    <AutoComplete
                      defaultActiveFirstOption={false}
                      filterOption={false}
                      optionLabelProp="value"
                      dataSource={userlist}
                      dropdownMatchSelectWidth={false}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      dropdownStyle={{ width: 600 }}
                      onSelect={(v, opt) => handleSelectduser(v, opt)}
                      disabled={openType === 'view'}
                    >
                      <Search
                        placeholder="可输入姓名或用户ID搜索"
                        onSearch={values => Searchuser(values)}
                        allowClear
                      />
                    </AutoComplete>
                  </>
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="所属部门">{
                getFieldDecorator('key2')(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="联系电话">{
                getFieldDecorator('key3')(
                  <Input allowClear />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              {alarmgroup && alarmgroup.length > 0 && (<Form.Item label="告警通知组">{
                getFieldDecorator('key4')(
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    defaultExpandedKeys={['a']}
                  >
                    <TreeNode title='全部' key='a'>
                      {alarmgroup.map(item => {
                        const type = treenodemap.get(item.val);
                        if (type) {
                          return (<TreeNode key={item.key} title={item.val} >
                            {type.map(obj => [
                              <TreeNode key={`${item.val}_${obj.title}`} title={obj.title} >
                                <TreeNode key={`${item.val}_${obj.title}_告警`} title='告警' />
                                <TreeNode key={`${obj.key}_2`} title='确认告警' />
                                <TreeNode key={`${obj.key}_3`} title='取消告警' />
                              </TreeNode>
                            ])}
                          </TreeNode>)
                        }
                        return (
                          <TreeNode key={item.key} title={item.val} >
                            <TreeNode key={`${item.key}_1`} title='告警' />
                            <TreeNode key={`${item.key}_2`} title='确认告警' />
                            <TreeNode key={`${item.key}_3`} title='取消告警' />
                          </TreeNode>)
                      })}
                    </TreeNode>
                  </Tree>
                )}
              </Form.Item>
              )}
            </Col>
          </Row>
        </Form>

      </Row>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

export default Form.create()(NoticTree);