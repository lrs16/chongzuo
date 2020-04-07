// import mockjs from 'mockjs';

const jobDatas = [
  {
    id: '1234561',
    name: '输出占用内存最多的TopN进程 ',
    account: 'admin',
    state: '未执行',
    starttime: '2019.11.28 10:30',
    endtime: '2019.12.28 10:55',
    startingmode:'快速执行',
    taking:'1.039',
  },
  {
    id: '1234562',
    name: 'Weblogic巡检-获取域所有子系统信息2.0',
    account: 'admin',
    state: '正在执行',
    starttime: '2019.11.20 10:30',
    endtime: '2019.12.20 10:55',
    startingmode:'定时作业',
    taking:'1.039',
  },
  {
    id: '1234563',
    name: '删除甲骨文保存模式',
    account: 'admin',
    state: '执行成功',
    starttime: '2019.11.8 10:30',
    endtime: '2019.12.8 10:55',
    startingmode:'快速执行',
    taking:'1.043',
  },
  {
    id: '1234564',
    name: 'Oracle-生成NEWNAME临时表空间文件Tomcat ',
    account: 'admin',
    state: '执行失败',
    starttime: '2019.11.2 10:30',
    endtime: '2019.12.2 10:55',
    startingmode:'定时作业',
    taking:'1.063',
  },
  {
    id: '1234565',
    name: '巡检2.0-获取服务端口连接数',
    account: 'admin',
    state: '忽略错误',
    starttime: '2019.10.28 10:30',
    endtime: '2019.11.28 10:55',
    startingmode:'快速执行',
    taking:'1.038',
  },
];

export default {
  'GET /api/jobs': jobDatas,
  'POST /api/addjob': (req, res) => {
    const { id} = req.body;
    if (id === 'Script-0') {
      res.send({
        status: '200',
        msg:'执行成功',
      });
      return;
    }
    res.send({
      status: 'error',
      msg:'失败',
    });
  },
};
