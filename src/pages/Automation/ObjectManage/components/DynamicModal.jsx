import React, { useState, useEffect } from 'react';
// import { connect } from 'dva';
import {
    Form,
    Modal,
    Popconfirm,
    Table,
    Button,
    Input,
    Select,
    Divider,
    message
} from 'antd';
import KeyVal from '@/components/SysDict/KeyVal';

const { Option } = Select;

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

function DynamicModal(props) {
    const {
        children,
        dispatch,
        softId,
        // loading,
    } = props;

    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([]);
    const [selectdata, setSelectData] = useState(undefined);
    const [newbutton, setNewButton] = useState(false);

    // 列表
    const getlistdata = () => {
        dispatch({
            type: 'softwaremanage/tofindDynamic',
            payload: {
                softId,
                pageNum: 1,
                pageSize: 15,
            },
        }).then(res => {
            if (res.code === 200) {
                const newarr = res.data.rows.map((item, index) => {
                    return Object.assign(item, { key: index });
                });
                setData(newarr);
                setNewButton(false);
            }
        });
    };

    // 提交保存数据
    const savedata = (target, id) => {
        dispatch({
            type: 'softwaremanage/todynamicaddOrEdit',
            payload: {
                ...target,
                id,
            },
        }).then(res => {
            if (res.code === 200) {
                message.success(res.msg);
                getlistdata();
            }
        });
    };

    useEffect(() => {
        return () => {
            setData([]);
            setSelectData([]);
            setNewButton(false);
        };
    }, []);

    const handleCancel = () => {
        setVisible(false);
    };

    const handleopenClick = () => {
        setVisible(true);
        getlistdata();
    };

    const handleAdd = () => { // 新增其他属性
        const newData = data.map(item => ({ ...item }));
        newData.push({
            key: data.length + 1,
            softId,
            dynamicName: '',
            dynamicCode: '',
            dynamicSorts: '',
            dynamicRemarks: '',
            editable: true,
            isNew: true,
        });
        setData(newData);
        setNewButton(true);
    };

    // 获取行
    const getRowByKey = (key, newData) => {
        return (newData || data).filter(item => item.key === key)[0];
    };

    // 更新表单信息
    const handleFieldChange = (e, fieldName, key) => {
        const newData = data.map(item => ({ ...item }));
        const target = getRowByKey(key, newData);
        if (target) {
            target[fieldName] = e;
            setData(newData);
        }
    };

    // 编辑记录
    const toggleEditable = (e, key) => {
        e.preventDefault();
        const newData = data.map(item => ({ ...item }));
        const target = getRowByKey(key, newData);
        if (target) {
            // 进入编辑状态时保存原始数据
            //   if (!target.editable) {
            //     setcacheOriginData({ key: { ...target } });
            //   }
            target.editable = !target.editable;
            setData(newData);
        }
    };

    // 保存记录
    const saveRow = (e, key) => {
        const target = getRowByKey(key) || {};
        if (!target.dynamicCode || !target.dynamicSorts) {
            message.error('请填写完整信息!');
            e.target.focus();
            return;
        }
        delete target.key;
        target.editable = false;
        const id = target.id === '' ? '' : target.id;
        savedata(target, id);
        if (target.isNew) {
            setNewButton(false);
        }
    };

    // 删除
    const handleDelete = id => {
        const target = getRowByKey(id) || {};
        dispatch({
            type: 'softwaremanage/todeleteDynamic',
            payload: { Ids: target.id },
        }).then(res => {
            if (res.code === 200) {
                message.success(res.msg);
                getlistdata();
            }
        });
    };

    // 取消按钮
    const cancel = (e, key) => {
        e.preventDefault();
        const newData = data.map(item => ({ ...item }));
        const target = getRowByKey(key, newData);
        const newArr = newData.filter(item => item.key !== target.key);
        setData(newArr);
        setNewButton(false);
    };

    const columns = [
        {
            title: '属性名称',
            dataIndex: 'dynamicName',
            key: 'dynamicName',
            width: 200,
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Select
                            defaultValue={text}
                            placeholder="请选择"
                            onChange={e => handleFieldChange(e, 'dynamicName', record.key)}
                            style={{ width: '100%' }}
                        >
                            {selectdata.assets_dynamic.map(obj => [
                                <Option key={obj.key} value={obj.val}>
                                    {obj.val}
                                </Option>,
                            ])}
                        </Select>
                    )
                }
                return text;
            }
        },
        {
            title: '属性值',
            dataIndex: 'dynamicCode',
            key: 'dynamicCode',
            width: 300,
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Input
                            placeholder="请输入"
                            defaultValue={text}
                            onChange={e => handleFieldChange(e.target.value, 'dynamicCode', record.key)}
                        />
                    );
                }
                return text;
            },
        },
        {
            title: '属性排序',
            dataIndex: 'dynamicSorts',
            key: 'dynamicSorts',
            width: 150,
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Input
                            type='number'
                            placeholder="请输入数字"
                            defaultValue={text}
                            onChange={e => handleFieldChange(e.target.value, 'dynamicSorts', record.key)}
                        />
                    );
                }
                return text;
            },
        },
        {
            title: '属性备注',
            dataIndex: 'dynamicRemarks',
            key: 'dynamicRemarks',
            width: 300,
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Input
                            placeholder="请输入"
                            defaultValue={text}
                            onChange={e => handleFieldChange(e.target.value, 'dynamicRemarks', record.key)}
                        />
                    );
                }
                return text;
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (text, record) => {
                if (record.editable === '') {
                    return null;
                }
                if (record.editable) {
                    if (record.isNew) {
                        return (
                            <span>
                                <a onClick={e => saveRow(e, record.key)}>保存</a>
                                <Divider type="vertical" />
                                <a onClick={e => cancel(e, record.key)}>取消</a>
                            </span>
                        );
                    }
                    return (
                        <span>
                            <a onClick={e => saveRow(e, record.key)}>保存</a>
                            <Divider type="vertical" />
                            <Popconfirm title="是否要删除此行？" onConfirm={() => handleDelete(record.key)}>
                                <a style={{color: 'red'}}>删除</a>
                            </Popconfirm>
                        </span>
                    );
                }

                return (
                    <span>
                        <a onClick={e => toggleEditable(e, record.key)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="是否要删除此行？" onConfirm={() => handleDelete(record.key)}>
                            <a style={{color: 'red'}}>删除</a>
                        </Popconfirm>
                    </span>
                );
            },
        },
    ];

    return (
        <>
            {withClick(children, handleopenClick)}
            <Modal
                title='其他属性'
                onCancel={() => handleCancel()}
                footer={null}
                visible={visible}
                width={1160}
                centered
                maskClosable
                closable
            >
                <KeyVal
                    style={{ display: 'none' }}
                    dictModule="assets"
                    dictType="assets_dynamic"
                    ChangeSelectdata={newvalue => setSelectData(newvalue)}
                />
                <Table
                    dataSource={data}
                    // loading={loading}
                    columns={columns}
                    bordered
                    rowKey={record => record.id}
                    pagination={false}
                />
                <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    icon="plus"
                    onClick={() => handleAdd()}
                    disabled={newbutton}
                >
                    新增其他属性
                </Button>
            </Modal>
        </>
    );
}

export default Form.create({})(DynamicModal);
// (
//     connect(({ softwaremanage, loading }) => ({
//         // dynamicList: softwaremanage.dynamicList,
//         loading: loading.models.softwaremanage,
//     }))(DynamicModal),
// );
