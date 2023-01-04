import mockjs from 'mockjs';

export default {
  'POST /api/history': mockjs.mock({
    data: {
      'cpu|30': [{ date: '@time()', 'value|1-50': 3, 'use|1': ['已使用', '未使用'] }],
      'diskAvailable|15': [{ 'available|1-100': 1, path: '@url' }],
      'diskUse|10': [{ 'value|1-50': 1, path: 'device:/@url' }],
      'ram|20': [{ 'value|1-80': 1, date: '@time()', 'use|1': ['已使用', '未使用', '未分配'] }],
      'ramUse|20': [{ 'value|1-100': 1, date: '@time()' }],
      'network|20': [{ 'value|1-10': 1, date: '@time()', 'action|1': ['接收', '发送'] }],
      'io|20': [{ 'value|1-10': 1, date: '@time()', 'action|1': ['读', '写'] }],
      'swap|20': [{ 'value|1-10': 1, date: '@time()', 'use|1': ['空闲', '已使用'] }],
      'cpuWaitIO|20': [{ 'value|1-100': 1, date: '@time()' }],
      'systemLoad|20': [{ 'value|0.1': 1, date: '@time()', 'load|1': ['1min', '5min', '15min'] }],
      'inodes|20': [{ 'value|1-100': 1, date: '@time()' }],
      'packets|20': [{ 'value|1-10': 1, date: '@time()', 'action|1': ['接收', '发送'] }],
      'tcp|20': [{ 'value|1-100': 1, date: '@time()', 'action|1': ['接收', '发送'] }],
    },
  }),
};
