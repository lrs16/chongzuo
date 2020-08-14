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
              redirect: '/automation/opsscene',
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
                  redirect: '/automation/opsscene',
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
                      redirect: '/automation/STT/host',
                    },
                    {
                      path: '/automation/STT/host',
                      name: '主机',
                      icon: 'cloud-server',
                      component: './Automation/STT/HostManage',
                    },
                    {
                      path: '/automation/STT/soft',
                      name: '软件',
                      icon: 'cloud-server',
                      component: './Automation/STT/SoftManage',
                    },
                    // {
                    //   path: '/automation/STT/host_soft',
                    //   name: '主机与软件关系',
                    //   icon: 'cloud-server',
                    //   component: './Automation/STT/Host_Soft',
                    // },
                    {
                      path: '/automation/STT/process',
                      name: '进程',
                      icon: 'cloud-server',
                      component: './Automation/STT/ProcessManage',
                    },
                    // {
                    //   path: '/automation/STT/soft_process',
                    //   name: '软件与进程关系',
                    //   icon: 'cloud-server',
                    //   component: './Automation/STT/Soft_Process',
                    // },
                    {
                      path: '/automation/STT/softconfigure',
                      name: '启停配置',
                      icon: 'cloud-server',
                      component: './Automation/STT/SoftConfigures',
                    },
                    {
                      path: '/automation/STT/softexetute',
                      name: '程序执行',
                      icon: 'cloud-server',
                      component: './Automation/STT/SoftExetute',
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
                  redirect: '/monitormanage/measurmonitor',
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
                      path: '/monitormanage/measurmonitor/home',
                      name: 'measurhome',
                      component: './Monitormanage/MeasurMonitor',
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
                      component: './404',
                    },
                  ],
                },
                // {
                //   path: '/monitormanage/basicplamonitor',
                //   name: '基础平台监测',
                //   icon: 'interaction',
                //   routes: [
                //     {
                //       path: '/monitormanage/basicplamonitor',
                //       redirect: '/monitormanage/basicplamonitor/collection',
                //     },
                //     {
                //       path: '/monitormanage/basicplamonitor/home',
                //       name: 'basicplahome',
                //       component: './Monitormanage/MeasurMonitor',
                //     },
                //     {
                //       path: '/monitormanage/measurmonitor/collection',
                //       name: '采集指标情况',
                //       icon: 'cloud-server',
                //       component: './Monitormanage/MeasurMonitor/Collection',
                //     },
                //     {
                //       path: '/monitormanage/measurmonitor/measurface',
                //       name: '接口数据核查情况',
                //       icon: 'cloud-server',
                //       component: './Monitormanage/MeasurMonitor/MeasurFace',
                //     },
                //     {
                //       path: '/monitormanage/measurmonitor/fafka',
                //       name: 'KAFKA消费',
                //       icon: 'cloud-server',
                //       component: './Monitormanage/MeasurMonitor/Fafak',
                //     },
                //     {
                //       path: '/monitormanage/measurmonitor/fafkamatinal',
                //       name: 'KAFKA消费（凌晨）',
                //       icon: 'cloud-server',
                //       component: './Monitormanage/MeasurMonitor/FafakMatinal',
                //     },
                //     {
                //       path: '/monitormanage/measurmonitor/sysrunning',
                //       name: '主站系统运行',
                //       icon: 'cloud-server',
                //       component: './Monitormanage/MeasurMonitor/SysRunning',
                //     },
                //     {
                //       path: '/monitormanage/measurmonitor/databaseterminal',
                //       name: '终端工况和数据入库',
                //       icon: 'cloud-server',
                //       component: './Monitormanage/MeasurMonitor/DatabaseTerminal',
                //     },
                //     {
                //       component: './404',
                //     },
                //   ],
                // },
                {
                  path: '/monitormanage/basicMonitor',
                  name: '基础平台监测',
                  icon: 'cloud-server',
                  routes: [
                    {
                      path: '/monitormanage/basicMonitor/host',
                      name: '主机监测',
                      component: './Monitormanage/BasicMonitor/Host',
                    },
                  ],
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
                  redirect: '/alarmmanage/details',
                },
                // {
                //   path: '/alarmmanage/monitor',
                //   name: '告警监控台',
                //   icon: 'cloud-server',
                //   component: './Alarmmanage',
                // },
                {
                  path: '/alarmmanage/details',
                  name: '告警明细信息',
                  icon: 'cloud-server',
                  component: './Alarmmanage/Details',
                },
                {
                  path: '/alarmmanage/details/detailview/:detailsid',
                  name: '告警详细信息',
                  icon: 'cloud-server',
                  hideInMenu: true,
                  component: './Alarmmanage/DetailView',
                },
                {
                  path: '/alarmmanage/syssetting',
                  icon: 'cloud-server',
                  name: '系统警告设定',
                  component: './Alarmmanage/SysSetting',
                  routes: [
                    {
                      path: '/alarmmanage/syssetting',
                      redirect: '/alarmmanage/syssetting/quotas',
                    },
                    {
                      path: '/alarmmanage/syssetting/quotas',
                      name: '业务指标警告设置',
                      component: './Alarmmanage/Quotas',
                    },
                    {
                      path: '/alarmmanage/syssetting/connector',
                      name: '接口告警设置',
                      component: './Alarmmanage/Connector',
                    },
                    {
                      path: '/alarmmanage/syssetting/KAFKA',
                      name: 'KAFKA中间件告警设置',
                      component: './Alarmmanage/KAFKA',
                    },
                    {
                      path: '/alarmmanage/syssetting/sysrun',
                      name: '主站系统运行',
                      component: './Alarmmanage/SysRun',
                    },
                  ],
                },
                {
                  path: '/alarmmanage/noticesetting',
                  icon: 'cloud-server',
                  name: '告警通知设置',
                  component: './Alarmmanage/NoticeSetting',
                  routes: [
                    {
                      path: '/alarmmanage/noticesetting',
                      redirect: '/alarmmanage/noticesetting/notifygroup',
                    },
                    {
                      path: '/alarmmanage/noticesetting/notifygroup',
                      name: '告警通知组设置',
                      component: './Alarmmanage/NotifyGroup',
                    },
                    {
                      path: '/alarmmanage/noticesetting/notifyperson',
                      name: '告警联系人设置',
                      component: './Alarmmanage/NotifyPerson',
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
  // chainWebpack: webpackPlugin,
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  proxy: {
    // '/api': {
    //   target: 'http://localhost:8001/',
    //   changeOrigin: true, // pathRewrite: {
    //   //   '^/server': '',
    //    },
    '/api-auth/': {
      target: 'http://172.16.4.211:8800/', //登录
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
    },
    '/api-upms/': {
      target: 'http://172.16.4.211:8800/', //用户管理中心
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
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
      target: 'http://localhost:8889/', //监测管理
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
    },
    '/api-monitoring-business/': {
      //计量现场接口
      target: 'http://172.16.4.211:8800/',
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
    },
    // '/cjzb/': {
    //   target: 'http://172.16.4.211:8808/', //计量骏豪
    //   changeOrigin: true,
    //   // pathRewrite: { '^/apiauth': '' }
    // },
    // '/cjzb/': {
    //   target: 'http://172.16.4.211:8808/', //计量骏豪
    //   changeOrigin: true,
    //   // pathRewrite: { '^/apiauth': '' }
    // },
    // '/gkrk/': {
    //   target: 'http://172.16.4.211:8808/', //计量骏豪
    //   changeOrigin: true,
    //   // pathRewrite: { '^/apiauth': '' }
    // },
    '/api-meter-auto/': {
      //计量现场接口
      target: 'http://172.16.4.211:8800/',
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
    },
  },
};
