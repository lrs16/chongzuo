import React, { useState } from 'react';
import { Modal, Radio, Input, Row, Col, Form, Tree } from 'antd';

const { Search } = Input;
const { TreeNode } = Tree;
const treeData = [
    {
        title: '故障处理',
        key: '0-0',
        children: [
            {
                title: '管理员',
                key: '0-0-0',
            },
            {
                title: '张三',
                key: '0-0-1',
            },
            {
                title: '李四',
                key: '0-0-2',
            },
            {
                title: '六叔',
                key: '0-0-3',
            },
            {
                title: '七伤',
                key: '0-0-4',
            },
            {
                title: '巴西',
                key: '0-0-5',
            },
        ],
    },
];

const treeData1 = [
    {
        title: '故障处理',
        key: '0-0',
        children: [
            {
                title: '管理员',
                key: '0-0-0',
            },
        ],
    },
];
const radiogroups = [
    { key: 1, name: '节点配置' },
    { key: 2, name: '自定义' },
]
const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

function ModelCircula(props) {

    const { children, title } = props;
    const [visible, setVisible] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
    const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [selectedKeys] = useState([]);
    const [radiovalue, setRadiovalue] = useState('节点配置');

    const onExpand = expandedKeys => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(!autoExpandParent);
    };

    const onCheck = checkedKeys => {
        setCheckedKeys(checkedKeys);
    };

    const handleopenClick = () => {
        setVisible(!visible);
    };

    const handleCancel = () => {
        setVisible(!visible);
    };

    const handleOk = () => {

    };

    const onChange = e => {
        setRadiovalue(e.target.value);
    };

    const renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });

    return (
        <>
            {withClick(children, handleopenClick)}
            <Modal
                title={title}
                visible={visible}
                maskClosable={false}
                onCancel={handleCancel}
                onOk={handleOk}
                width={800}
            >
                <Row gutter={16}>
                    <Form>
                        <Col span={7}>
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
                                // onSearch={value => console.log(value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item>
                                {
                                    radiovalue === '节点配置' ?
                                        <Tree
                                            checkable
                                            onExpand={onExpand}
                                            expandedKeys={expandedKeys}
                                            autoExpandParent={autoExpandParent}
                                            onCheck={onCheck}
                                            checkedKeys={checkedKeys}
                                            // onSelect={this.onSelect}
                                            selectedKeys={selectedKeys}
                                        >
                                            {renderTreeNodes(treeData)}
                                        </Tree> : <Tree
                                            checkable
                                            onExpand={onExpand}
                                            expandedKeys={expandedKeys}
                                            autoExpandParent={autoExpandParent}
                                            onCheck={onCheck}
                                            checkedKeys={checkedKeys}
                                            // onSelect={this.onSelect}
                                            selectedKeys={selectedKeys}
                                        >
                                            {renderTreeNodes(treeData1)}
                                        </Tree>
                                }

                            </Form.Item>
                        </Col>
                    </Form>
                </Row>
            </Modal>
        </>
    );
}
ModelCircula.defaultProps = {

};
export default ModelCircula;
