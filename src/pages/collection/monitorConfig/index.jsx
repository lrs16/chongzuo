import React, { useState, useRef, useEffect } from 'react';
// import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Menu, message, Row, Col, Tag, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
// import UpdateForm from './components/UpdateForm';
import { queryRule, addRule, removeRule, querySort } from './service';
// import moment from 'moment';

const { SubMenu } = Menu;
const { confirm } = Modal;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  const interFace = [];
  if (fields.agents) {
    interFace.push({ type: 1, detail: fields.agents });
  }
  if (fields.snmps) {
    interFace.push({ type: 2, detail: fields.snmps });
  }
  if (fields.jxms) {
    interFace.push({ type: 4, detail: fields.jxms });
  }
  if (fields.ipmis) {
    interFace.push({ type: 3, detail: fields.ipmis });
  }

  try {
    await addRule({
      deviceName: fields.deviceName,
      monitorSortId: fields.monitorSortId,
      community: fields.community,
      communityPwd: fields.communityPwd,
      ipmiUerName: fields.ipmiUerName,
      ipmiPwd: fields.ipmiPwd,
      description: fields.desc,
      interFace,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (action, selectedRows) => {
  const hide = message.loading('正在删除');

  try {
    await removeRule({
      hostIds: selectedRows.map(row => row.hostId),
    });
    hide();
    message.success('删除成功，即将刷新');
    action.reload();
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  const [openkeys, setOpenKeys] = useState(['0']);
  const [menuList, setMenuList] = useState([]);
  const [configData, setConfigData] = useState();
  const actionRef = useRef();
  let id = '002001';

  useEffect(() => {
    const handleQuerySort = async () => {
      const sorts = await querySort();
      const { data } = sorts;
      setMenuList(data);
      // setSortId(data[0].cheld[0].id);
    };
    handleQuerySort();
  }, []);

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      render: (text, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setConfigData(record);
              handleModalVisible(true);
            }}
          >
            {text}
          </Button>
        );
      },
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '监控分类',
      hideInSearch: true,
      dataIndex: 'monitorSort',
    },
    {
      title: 'Agent部署状态',
      hideInSearch: true,
      dataIndex: 'agentStatus',
      valueEnum: {
        0: {
          text: '否',
          status: 'Default',
        },
        1: {
          text: '是',
          status: 'Success',
        },
      },
    },
    {
      title: '可用性',
      hideInSearch: true,
      dataIndex: 'usability',
      render: row =>
        row.map(key => {
          let color;
          if (key.status !== 0) {
            color = key.status === 1 ? '#31a662' : '#d64e4e';
          }
          return (
            <Tag key={key.typeName} color={color}>
              {key.typeName}
            </Tag>
          );
        }),
    },
    {
      title: 'agent加密',
      hideInSearch: true,
      dataIndex: 'agentEncrypt',
      valueEnum: {
        1: {
          text: <Tag color="#31a662">否</Tag>,
        },
        2: {
          text: <Tag color="#d64e4e">否</Tag>,
        },
      },
    },
    {
      title: '配置来源',
      dataIndex: 'configSource',
      initialValue: '0',
      valueEnum: {
        0: {
          text: '手动添加',
        },
        1: {
          text: '自动注册',
        },
      },
    },
  ];

  const onOpenChange = keys => {
    const latestOpenkey = keys.find(key => openkeys.indexOf(key) === -1);
    return setOpenKeys(latestOpenkey ? [latestOpenkey] : []);
  };

  const handleQuery = async (params, sortid) => {
    const list = await queryRule({ ...params, sortId: sortid });
    const { data } = list;
    return {
      data: data.data,
      total: data.total,
      success: true,
      pageSize: data.pageSize,
      // current: 1,
    };
  };

  return (
    <PageHeaderWrapper>
      <Row>
        <Col span={6}>
          <Menu
            mode="inline"
            openKeys={openkeys}
            onOpenChange={onOpenChange}
            onClick={params => {
              const { key } = params;
              id = key;
              actionRef.current.reload();
            }}
          >
            {menuList &&
              menuList.map((n, index) => (
                <SubMenu key={index} title={n.sortName}>
                  {n.cheld &&
                    n.cheld.map(i => (
                      <Menu.Item key={i.monitorGroupId}>{i.monitorGroupName}</Menu.Item>
                    ))}
                </SubMenu>
              ))}
          </Menu>
        </Col>
        <Col span={18}>
          <ProTable
            actionRef={actionRef}
            rowKey="ip"
            toolBarRender={(action, { selectedRows }) => [
              <Button
                type="primary"
                onClick={() => {
                  setConfigData();
                  handleModalVisible(true);
                }}
              >
                添加
              </Button>,
              // <Button type="primary" onClick={() => handleModalVisible(true)}>
              //   编辑
              // </Button>,
              <Button
                type="primary"
                onClick={() => {
                  if (selectedRows.length <= 0) return message.warning('请先选择需要删除的数据！');
                  return confirm({
                    title: '是否确认删除？',
                    onOk() {
                      handleRemove(action, selectedRows);
                    },
                    onCancel() {},
                  });
                }}
              >
                删除
              </Button>,
            ]}
            // request={params => queryRule(params)}
            request={params => handleQuery(params, id)}
            columns={columns}
            rowSelection={{}}
          />
        </Col>
      </Row>
      {createModalVisible && (
        <CreateForm
          onSubmit={async value => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          darwerlVisible={createModalVisible}
          onCancel={() => handleModalVisible(false)}
          sorts={menuList}
          data={configData}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default TableList;
