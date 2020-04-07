// import mockjs from 'mockjs';

const TreeDatas = [
  {
    title: '自动化运维',
    key: 'auto1',
    children: [
      {
        title: '脚本管理',
        key: 'script',
        children: [
          {
            title: '脚本查询',
            key: 'script-1',
          },
          {
            title: '添加脚本',
            key: 'script-2',
          },
          {
            title: '编辑脚本',
            key: 'script-3',
          },
          {
            title: '删除脚本',
            key: 'script-4',
          },
        ],
      },
      {
        title: '作业管理',
        key: 'job',
        children: [
          {
            title: '作业历史',
            key: 'job-1',
          },
          {
            title: '执行作业',
            key: 'job-2',
          },
        ],
      },
      {
        title: '工厂管理',
        key: 'city',
      },
    ],
  },
  {
    title: '测试节点',
    key: '0-2',
  },
];

export default {
  // 'GET /api/authority': getTreeDatas,
  'GET /api/authority': (req, res) => {
    res.json({
      TreeDatas,
    });
  },
};
