import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/LoginLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        // {
        //   name: 'login',
        //   path: '/user/login',
        //   component: './user/login/Mylogin',
        // },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          //authority: ['test','admin'],
          routes: [
            {
              path: '/',
              redirect: '/monitormanage/home',
            },
            // {
            //   path: '/welcome',
            //   name: 'welcome',
            //   icon: 'smile',
            //   component: './Welcome',
            // },
            // {
            //   path: '/admin',
            //   name: 'admin',
            //   icon: 'crown',
            //   component: './Admin',
            //   authority: ['admin'],
            // },
            //自动化运维
            {
              path: '/automation',
              name: '自动化运维',
              dynamic: true,
              icon: 'deployment-unit',
              routes: [
                {
                  path: '/automation',
                  redirect: '/automation/STT/hostlist',
                },
                // {
                //   path: '/automation/monitor',
                //   name: '作业总览',
                //   icon: 'dashboard',
                //   component: './Automation/Monitor',
                // },
                {
                  path: '/automation/opsscene',
                  name: '运维场景',
                  icon: 'control',
                  //authority: ['test'],
                  component: './Automation/Scenarios/OpsScene',
                },
                {
                  path: '/automation/opsscene/workflow',
                  name: '脚本编排',
                  icon: 'control',
                  hideInMenu: true,
                  component: './Automation/Scenarios/WorkFlow',
                },
                {
                  path: '/automation/opsscene/jobexecut',
                  name: '脚本执行历史',
                  icon: 'profile',
                  hideInMenu: true,
                  component: './Automation/Scenarios/JobExecut',
                },
                {
                  path: '/automation/jobexecut/viewjob/:id',
                  name: '脚本详情',
                  hideInMenu: true,
                  component: './Automation/Scenarios/ViewJob',
                },
                // {
                //   path: '/automation/timedjob',
                //   name: '定时作业',
                //   icon: 'history',
                //   dynamic: true,
                //   component: './Automation/TimedJob',
                // },
                {
                  path: '/automation/scriptmanage',
                  name: '脚本管理',
                  icon: 'database',
                  component: './Automation/ScriptManage',
                },
                // {
                //   path: '/automation/resourcemanage',
                //   name: '资源管理',
                //   icon: 'cloud-server',
                //   component: './Automation/ResourceManage',
                // },
                {
                  path: '/automation/STT',
                  name: '软件启停',
                  icon: 'cloud-server',
                  routes: [
                    {
                      path: '/automation/STT',
                      redirect: '/automation/STT/hostlist',
                    },
                    {
                      path: '/automation/STT/hostlist',
                      name: '主机管理',
                      icon: 'cloud-server',
                      component: './Automation/SoftTT/HostManage',
                    },
                    {
                      path: '/automation/STT/soft',
                      name: '软件管理',
                      icon: 'cloud-server',
                      component: './Automation/SoftTT/SoftManage',
                    },
                    {
                      path: '/automation/STT/process',
                      name: '进程管理',
                      icon: 'cloud-server',
                      component: './Automation/SoftTT/ProcessManage',
                    },
                    {
                      path: '/automation/STT/softexetute',
                      name: '主机_SSH2管理',
                      icon: 'cloud-server',
                      component: './Automation/SoftTT/SoftExetute',
                    },
                    {
                      path: '/automation/STT/execlog',
                      name: '执行日志',
                      icon: 'cloud-server',
                      component: './Automation/SoftTT/ExeclogView',
                    },
                  ],
                },
              ],
            },
            {
              path: '/monitormanage',
              name: '监测管理',
              icon: 'interaction',
              routes: [
                {
                  path: '/monitormanage',
                  redirect: '/monitormanage/home',
                },
                {
                  path: '/monitormanage/home',
                  name: '监控台',
                  icon: 'cloud-server',
                  component: './Monitormanage/MonitorStation',
                },
                {
                  path: '/monitormanage/measurmonitor',
                  name: '计量业务监控',
                  icon: 'cloud-server',
                  routes: [
                    {
                      path: '/monitormanage/measurmonitor',
                      redirect: '/monitormanage/measurmonitor/collection',
                    },
                    {
                      path: '/monitormanage/measurmonitor/collection',
                      name: '采集指标情况',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/Collection',
                    },
                    {
                      path: '/monitormanage/measurmonitor/measurface',
                      name: '接口数据核查情况',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/MeasurFace',
                    },
                    {
                      path: '/monitormanage/measurmonitor/fafka',
                      name: 'KAFKA消费',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/Fafak',
                    },
                    {
                      path: '/monitormanage/measurmonitor/fafkamatinal',
                      name: 'KAFKA消费（凌晨）',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/FafakMatinal',
                    },
                    {
                      path: '/monitormanage/measurmonitor/sysrunning',
                      name: '主站系统运行',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/SysRunning',
                    },
                    {
                      path: '/monitormanage/measurmonitor/databaseterminal',
                      name: '终端工况和数据入库',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/DatabaseTerminal',
                    },
                    {
                      path: '/monitormanage/measurmonitor/monitorconfiguration',
                      name: '计量业务监测配置',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/MonitorConfiguration',
                    },
                    {
                      path: '/monitormanage/measurmonitor/monitoraddedit',
                      name: '增加计量业务监测配置',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/MonitorAddedit',
                    },
                    {
                      path: '/monitormanage/measurmonitor/monitoraddedit/:id',
                      name: '增加计量业务监测配置',
                      icon: 'cloud-server',
                      component: './Monitormanage/MeasurMonitor/MonitorAddedit',
                    },

                    {
                      component: './404',
                    },
                  ],
                },
                {
                  path: '/monitormanage/basicmonitor',
                  name: '基础平台监测',
                  icon: 'cloud-server',
                  routes: [
                    {
                      path: '/monitormanage/basicmonitor/host',
                      name: '主机监测',
                      component: './Monitormanage/BasicMonitor/Host',
                    },
                    {
                      path: '/monitormanage/basicmonitor/detail',
                      name: '监测详情',
                      hideInMenu: true,
                      component: './Monitormanage/BasicMonitor/Detail',
                    },
                    {
                      path: '/monitormanage/basicmonitor/database',
                      name: '数据库监测',
                      component: './Monitormanage/BasicMonitor/Database',
                    },
                  ],
                },
                {
                  path: '/monitormanage/indicatorchain',
                  name: '指标环比数据',
                  icon: 'cloud-server',
                  component: './Monitormanage/IndicatorChain',
                },
              ],
            },
            {
              path: '/alarmmanage',
              name: '告警管理',
              icon: 'interaction',
              routes: [
                {
                  path: '/alarmmanage',
                  redirect: '/alarmmanage/measuralarm',
                },
                {
                  path: '/alarmmanage/measuralarm',
                  name: '计量业务告警',
                  icon: 'interaction',
                  routes: [
                    {
                      path: '/alarmmanage/measuralarm',
                      redirect: '/alarmmanage/measuralarm/details',
                    },
                    // {
                    //   path: '/alarmmanage/monitor',
                    //   name: '告警监控台',
                    //   icon: 'cloud-server',
                    //   component: './Alarmmanage',
                    // },
                    {
                      path: '/alarmmanage/measuralarm/details',
                      name: '告警明细信息',
                      icon: 'cloud-server',
                      component: './Alarmmanage/MeasurAlarm/Details',
                    },
                    {
                      path: '/alarmmanage/measuralarm/details/detailview/:detailsid',
                      name: '告警详细信息',
                      icon: 'cloud-server',
                      hideInMenu: true,
                      component: './Alarmmanage/MeasurAlarm/DetailView',
                    },
                    {
                      path: '/alarmmanage/measuralarm/syssetting',
                      icon: 'cloud-server',
                      name: '系统警告设定',
                      component: './Alarmmanage/MeasurAlarm/SysSetting',
                      routes: [
                        {
                          path: '/alarmmanage/measuralarm/syssetting',
                          redirect: '/alarmmanage/measuralarm/syssetting/quotas',
                        },
                        {
                          path: '/alarmmanage/measuralarm/syssetting/quotas',
                          name: '业务指标警告设置',
                          component: './Alarmmanage/MeasurAlarm/Quotas',
                        },
                        {
                          path: '/alarmmanage/measuralarm/syssetting/connector',
                          name: '接口告警设置',
                          component: './Alarmmanage/MeasurAlarm/Connector',
                        },
                        {
                          path: '/alarmmanage/measuralarm/syssetting/KAFKA',
                          name: 'KAFKA中间件告警设置',
                          component: './Alarmmanage/MeasurAlarm/KAFKA',
                        },
                        {
                          path: '/alarmmanage/measuralarm/syssetting/sysrun',
                          name: '主站系统运行',
                          component: './Alarmmanage/MeasurAlarm/SysRun',
                        },
                      ],
                    },
                    {
                      path: '/alarmmanage/measuralarm/noticesetting',
                      icon: 'cloud-server',
                      name: '告警通知设置',
                      component: './Alarmmanage/MeasurAlarm/NoticeSetting',
                      routes: [
                        {
                          path: '/alarmmanage/measuralarm/noticesetting',
                          redirect: '/alarmmanage/measuralarm/noticesetting/notifygroup',
                        },
                        {
                          path: '/alarmmanage/measuralarm/noticesetting/notifygroup',
                          name: '告警通知组设置',
                          component: './Alarmmanage/MeasurAlarm/NotifyGroup',
                        },
                        {
                          path: '/alarmmanage/measuralarm/noticesetting/notifyperson',
                          name: '告警联系人设置',
                          component: './Alarmmanage/MeasurAlarm/NotifyPerson',
                        },
                      ],
                    },
                  ],
                },
                {
                  path: '/alarmmanage/basicalarm',
                  icon: 'cloud-server',
                  name: '基础平台告警',
                  routes: [
                    {
                      path: '/alarmmanage/basicalarm',
                      redirect: '/alarmmanage/basicalarm/currentalarm',
                    },
                    {
                      path: '/alarmmanage/basicalarm/currentalarm',
                      name: '当前告警',
                      component: './Alarmmanage/BasicAlarm/CurrentAlarm',
                    },
                    {
                      path: '/alarmmanage/basicalarm/historicalalarm',
                      name: '历史告警',
                      component: './Alarmmanage/BasicAlarm/HistoricalAlarm',
                    },
                    {
                      path: '/alarmmanage/basicalarm/alarmstrategy',
                      name: '告警策略',
                      component: './Alarmmanage/BasicAlarm/AlarmStrategy',
                    },
                    {
                      path: '/alarmmanage/basicalarm/maintenanceplan',
                      name: '维护计划',
                      component: './Alarmmanage/BasicAlarm/MaintenancePlan',
                    },
                    {
                      path: '/alarmmanage/basicalarm/alarmstrategy/strategydetail/:detailsid',
                      name: '告警策略详细信息',
                      icon: 'cloud-server',
                      hideInMenu: true,
                      component: './Alarmmanage/BasicAlarm/StrategyDetail',
                    },
                    {
                      path: '/alarmmanage/basicalarm/alarmstrategy/strategyadd',
                      name: '新增策略',
                      hideInMenu: true,
                      component: './Alarmmanage/BasicAlarm/StrategyAddEdit',
                    },
                    {
                      path: '/alarmmanage/basicalarm/alarmstrategy/strategyedit/:detailsid',
                      name: '编辑策略',
                      icon: 'cloud-server',
                      hideInMenu: true,
                      component: './Alarmmanage/BasicAlarm/StrategyAddEdit',
                    },
                  ],
                },
              ],
            },
            {
              path: '/sysmanage',
              name: '系统管理',
              icon: 'team',
              routes: [
                {
                  path: '/sysmanage',
                  redirect: '/sysmanage/usersmanage',
                },
                {
                  path: '/sysmanage/usersmanage',
                  icon: 'team',
                  name: '用户管理',
                  component: './SysManage/SysuserMangage',
                },
                {
                  path: '/sysmanage/rolemanage',
                  icon: 'solution',
                  name: '角色管理',
                  component: './SysManage/RoleManage',
                },
                {
                  path: '/sysmanage/menumanage',
                  icon: 'ordered-list',
                  name: '菜单管理',
                  component: './SysManage/MenuManage',
                },
                // {
                //   path: '/sysmanage/authoritymanage',
                //   icon: 'cloud-server',
                //   name: '角色管理',
                //   component: './SysManage/Authoritymanage',
                // },
                {
                  path: '/sysmanage/deptmanage',
                  icon: 'cluster',
                  name: '组织管理',
                  component: './SysManage/DeptManage',
                },
                {
                  //采控管理
                  path: '/sysmanage/agent',
                  name: '采控管理',
                  icon: 'smile',
                  routes: [
                    {
                      path: '/sysmanage/agent/monitorConfig',
                      name: '监控配置',
                      icon: 'smile',
                      component: './collection/monitorConfig',
                    },
                  ],
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: {
    '/oauth/': {
      target: 'http://172.16.4.211:9901/', //登录
      changeOrigin: true,
    },
    '/upms/': {
      target: 'http://172.16.4.211:9901/', //用户管理
      changeOrigin: true,
    },
    '/auto/': {
      target: 'http://172.16.4.211:9901/', //软件启停
      changeOrigin: true,
    },
    '/monitor/': {
      target: 'http://172.16.4.211:9901/', //计量业务监控
      changeOrigin: true,
    },
    '/api-eai-job/oma/': {
      target: 'http://172.16.4.211:8800/', //脚本管理服务器地址,211正式，250测试
      changeOrigin: true,
      // pathRewrite: { '^/server': '' },
    },

    // '/oma/': {
    //   target: 'http://172.16.4.100:8807/', //脚本管理服务器地址,211正式，250测试
    //   changeOrigin: true,
    //   // pathRewrite: { '^/server': '' },
    // },
    '/basicMonitor/': {
      //检测管理，基础平台
      target: 'http://172.16.4.57:8889/',
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
    },
    '/api-monitoring-business/': {
      //计量现场接口
      target: 'http://172.16.4.211:8800/',
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
    },
    '/api-meter-auto/': {
      //计量现场接口
      target: 'http://172.16.4.211:8800/',
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
    },
    '/api/': {
      target: 'http://localhost:8000/', //mock接口数据
      changeOrigin: true,
    },
  },
};
