import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, message } from 'antd';

const { TreeNode } = Tree;

function SelectID(props) {
  const { dispatch, GetTreenode, pid } = props;
  const [treeData, setTreedData] = useState([]);

  const getdeptree = () => {
    dispatch({
      type: 'upmsdept/needtree',
      payload: { pid },
    }).then(res => {
      if (res.data !== undefined) {
        setTimeout(() => {
          setTreedData(res.data);
        }, 0);
      } else {
        message.info('无下级组织');
      }
    });
  };

  // 加载父级节点
  useEffect(() => {
    getdeptree();
  }, []);

  // 点击加载结点
  const onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      dispatch({
        type: 'upmsdept/needtree',
        payload: {
          pid: treeNode.props.dataRef.key,
        },
      }).then(res => {
        if (res.data !== undefined) {
          treeNode.props.dataRef.children = res.data;
        } else {
          message.info('已经到最后一层！');
        }
      });
      setTimeout(() => {
        const arr = [...treeData];
        setTreedData(arr);
        resolve();
      }, 600);
    });

  // 渲染树结构
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  const handleClick = (_, e) => {
    GetTreenode({ ...e.node.props.dataRef });
  };

  return (
    <div>
      <Tree loadData={onLoadData} onSelect={handleClick}>
        {renderTreeNodes(treeData)}
      </Tree>
    </div>
  );
}

export default connect(({ upmsdept, loading }) => ({
  upmsdept,
  loading: loading.models.upmsdept,
}))(SelectID);
