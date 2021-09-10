/* eslint-disable react-hooks/rules-of-hooks */
import React, {
    useEffect,
    useState
} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Button, Form, Input, Select, Row, Col, Divider, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;

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

function softwareConfig(props) {
    const pagetitle = props.route.name;
    const {
        loading,
        dispatch,
        softList,
        location,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    const [expand, setExpand] = useState(false);
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const [data, setData] = useState([]);

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.createTime1 = values.createTime1 ? moment(values.createTime1).format('YYYY-MM-DD HH:mm:ss') : '';
        values.createTime2 = values.createTime2 ? moment(values.createTime2).format('YYYY-MM-DD HH:mm:ss') : '';
        values.updateTime1 = values.updateTime1 ? moment(values.updateTime1).format('YYYY-MM-DD HH:mm:ss') : '';
        values.updateTime2 = values.updateTime2 ? moment(values.updateTime2).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'softwaremanage/findSoftList1',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        }).then(res => {
            if (res.code === 200) {
                const newarr = res.data.rows.map((item, index) => {
                    return Object.assign(item, { key: index });
                });
                setData(newarr);
            }
        })
    };


    useEffect(() => {
        searchdata(1, 15);
    }, [location]);


    const handleReset = () => {
        resetFields();
        searchdata(1, 15);
        setPageinations({ current: 1, pageSize: 15 });
    };

    const onShowSizeChange = (page, size) => {
        searchdata(page, size);
        setPageinations({
            ...paginations,
            pageSize: size,
        });
    };

    const changePage = page => {
        searchdata(page, paginations.pageSize);
        setPageinations({
            ...paginations,
            current: page,
        });
    };

    const pagination = {
        showSizeChanger: true,
        onShowSizeChange: (page, size) => onShowSizeChange(page, size),
        current: paginations.current,
        pageSize: paginations.pageSize,
        total: softList.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    const handleSearch = () => {
        setPageinations({
            ...paginations,
            current: 1,
        });
        searchdata(1, paginations.pageSize);
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
                searchdata(1, 15);
            }
        });
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

    const toggleEditable = (e, key) => {
        e.preventDefault();
        const newData = data.map(item => ({ ...item }));
        const target = getRowByKey(key, newData);
        if (target) {
            target.editable = !target.editable;
            setData(newData);
        }
    }

    const saveRow = (e, key) => {
        const target = getRowByKey(key) || {};
        delete target.key;
        target.editable = false;
        const id = target.id === '' ? '' : target.id;
        savedata(target, id);
    };

    const columns = [
        {
            title: '区域',
            dataIndex: 'hostZoneId',
            key: 'hostZoneId',
            width: 120,
        },
        {
            title: '主机名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 180,
        },
        {
            title: '主机IP',
            dataIndex: 'hostIp',
            key: 'hostIp',
            width: 200,
        },
        {
            title: '软件名称',
            dataIndex: 'softName',
            key: 'softName',
            width: 180,
        },
        {
            title: '配置文件路径',
            dataIndex: 'softPort',
            key: 'softPort',
            width: 250,
        },
        {
            title: '配置文件名称',
            dataIndex: 'softPath',
            key: 'softPath',
            width: 250,
        },
        {
            title: '配置文件大小',
            dataIndex: 'softVersion',
            key: 'softVersion',
            width: 250,
        },
        {
            title: '配置文件内容',
            dataIndex: 'softStatus',
            key: 'softStatus',
            width: 300,
        },
        {
            title: '配置文件版本号',
            dataIndex: 'director',
            key: 'director',
            width: 150,
            editable: true,
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Input
                            type='text'
                            placeholder="请输入"
                            defaultValue={text}
                            onChange={e => handleFieldChange(e.target.value, 'director', record.key)}
                        />
                    );
                }
                return text;
            },
        },
        {
            title: '获取时间',
            dataIndex: 'gettime',
            key: 'gettime',
            width: 150,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 200,
            render: (text, record) => {
                if (record.editable === '') {
                    return null;
                }
                return record.editable ? (
                    <span>
                        <a
                            onClick={e => saveRow(e, record.key)}
                        >
                            保存
                        </a>
                        <Divider type="vertical" />
                        <a type="link"
                            record={record}
                            text={text}
                        >
                            历史版本
                        </a>
                    </span>
                ) : (
                    <span>
                        <a onClick={e => toggleEditable(e, record.key)}>
                            编辑版本号
                        </a>
                        <Divider type="vertical" />
                        <a type="link"
                            record={record}
                            text={text}
                        >
                            历史版本
                        </a>
                    </span>
                );
            },
        },
    ];

    // 查询
    const extra = (<>
        <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
        <Button
            style={{ marginLeft: 8 }}
            type="link"
            onClick={() => {
                setExpand(!expand);
            }}
        >
            {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
        </Button></>
    )

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const zonemap = getTypebyId('1428182995477942274'); // 区域

    return (
        <PageHeaderWrapper title={pagetitle}>
            <DictLower
                typeid="1428178684907835393"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="区域">
                                {getFieldDecorator('hostZoneId', {
                                    initialValue: '',
                                })(
                                    <Select placeholder="请选择" allowClear>
                                        {zonemap.map(obj => (
                                            <Option key={obj.key} value={obj.title}>
                                                {obj.title}
                                            </Option>
                                        ))}
                                    </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="主机名称">
                                {getFieldDecorator('hostName', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        {expand && (
                            <>
                                <Col span={8}>
                                    <Form.Item label="主机IP">
                                        {getFieldDecorator('hostIp', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="软件名称">
                                        {getFieldDecorator('softName', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="配置文件名称">
                                        {getFieldDecorator('softPort', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="配置文件路径">
                                        {getFieldDecorator('softPath', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                        {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <div style={{ marginBottom: 8 }}>
                    <Button type="primary" style={{ marginRight: 8 }}
                    >获取文件</Button>
                    <Button type="primary" style={{ marginRight: 8 }}
                    >备份文件</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey={(_, index) => index.toString()}
                    pagination={pagination}
                    scroll={{ x: 1600 }}
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ softwaremanage, loading }) => ({
        softList: softwaremanage.softList,
        loading: loading.models.softwaremanage,
    }))(softwareConfig),
);