import React, { useState } from 'react';
import { Modal, Radio, Input, Row, Col, Form, Tree, Divider, message } from 'antd';

// const { Search } = Input;
const { TreeNode } = Tree;

// const treeData1 = [
//     {
//         title: '故障处理',
//         key: '0-0',
//         children: [
//             {
//                 title: '管理员',
//                 key: '0-0-0',
//             },
//         ],
//     },
// ];
// const radiogroups = [
//     { key: 1, name: '默认' },
//     { key: 2, name: '节点配置' },
// ]
const ModelCircula = props => {
    const { title, visible, onCancel, treeDatas, dispatch, id, history } = props;
    // console.log(treeDatas);

    // const [expandedKeys1, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
    // const [checkedKeys1, setCheckedKeys] = useState(['0-0-0']);
    const [expandedKeys1, setExpandedKeys] = useState();
    const [checkedKeys1, setCheckedKeys] = useState();
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    // const [selectedKeys1, setSelectedKeys] = useState([]);
    // const [radiovalue, setRadiovalue] = useState('默认');



    const onExpand = (expandedKeys) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(!autoExpandParent);
    };

    const onCheck = (checkedKeys) => {
        setCheckedKeys(checkedKeys);
    };

    // const onChange = e => {
    //     setRadiovalue(e.target.value);
    // };

    const renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.userName} key={item.id} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.userName} key={item.id} {...item} />;
        });

    // const handleSearch = (value) => {
    //     console.log(value)
    //     let {treeData} = this.props.rootStore.treeStore;
    //     /* 获取包含搜索内容的所有节点key */
    //     let openKeys = dataList.map((item) => {
    //         if (item.name.indexOf(value) > -1) {
    //             return getParentKey(item.nodeId, treeData);
    //         }
    //         return null;
    //     }).filter((item, i, self) => item && self.indexOf(item) === i);
    //     /* 重置需要展开的父节点id */
    //     parentList = [];
    //     /* 将所选中的内容的节点id的全部父节点id写入parentList中 */
    //     getAllParentKey(openKeys);
    //     openKeys = parentList;
    //     this.setState({
    //         openKeys,
    //         searchValue: value,
    //     });
    // };

    const handleOk = () => {
        return dispatch({
            type: 'fault/getSubmitProToNextNode', // 流转
            payload: { taskId: id, userIds: checkedKeys1 }
        }).then(res => {
            if (res.code === 200) {
                message.success(res.msg);
                history.push(`/ITSM/faultmanage/todolist`);
            } else {
                message.error(res.msg);
                history.push(`/ITSM/faultmanage/todolist`);
            }
        })
    };

    return (
        <Modal
            title={title}
            visible={visible}
            maskClosable={false}
            width={800}
            onCancel={onCancel}
            onOk={handleOk}
        >
            <Row gutter={16}>
                <Form>
                    {/* <Col span={7}>
                        <Form.Item>
                            <Radio.Group value={radiovalue} onChange={onChange}>
                                {radiogroups.map(({ key, name }) => [
                                    <Radio value={name} key={key}>{name}</Radio>
                                ])}
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item>
                            <Search
                                placeholder="请输入关键字"
                                enterButton="查询"
                                onSearch={value => handleSearch(value)}
                            />
                        </Form.Item>
                    </Col>
                    <Divider /> */}
                    <Col span={24}>
                        <Form.Item>
                            {/* {
                                    radiovalue === '默认' ?
                                        <Tree
                                            checkable
                                            onExpand={onExpand}
                                            expandedKeys={expandedKeys1}
                                            autoExpandParent={autoExpandParent}
                                            onCheck={onCheck}
                                            checkedKeys={checkedKeys1}
                                            // onSelect={onSelect}
                                            // selectedKeys={selectedKeys1}
                                        >
                                            {treeDatas && renderTreeNodes(treeDatas)}
                                        </Tree>
                                        :
                                        <Tree
                                            checkable
                                            onExpand={onExpand}
                                            expandedKeys={expandedKeys1}
                                            autoExpandParent={autoExpandParent}
                                            onCheck={onCheck}
                                            checkedKeys={checkedKeys1}
                                        >
                                            {renderTreeNodes(treeData1)}
                                        </Tree>
                                } */}
                            <Tree
                                checkable
                                onExpand={onExpand}
                                expandedKeys={expandedKeys1}
                                autoExpandParent={autoExpandParent}
                                onCheck={onCheck}
                                checkedKeys={checkedKeys1}
                            // onSelect={onSelect}
                            // selectedKeys={selectedKeys1}
                            >
                                {treeDatas && renderTreeNodes(treeDatas)}
                            </Tree>
                        </Form.Item>
                    </Col>
                </Form>
            </Row>
        </Modal>
    );
};
export default Form.create({})(ModelCircula);

