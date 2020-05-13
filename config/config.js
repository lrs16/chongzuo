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
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              // redirect: '/automation/monitor',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
            },
            //自动化运维
            {
              path: '/automation',
              name: 'automation',
              dynamic: true,
              icon: 'deployment-unit',
              routes: [
                {
                  path: '/automation',
                  redirect: '/automation/monitor',
                },
                {
                  path: '/automation/monitor',
                  name: 'monitor',
                  // icon: 'dashboard',
                  component: './Automation/Monitor',
                },
                {
                  path: '/automation/opsscene',
                  name: 'opsscene',
                  // icon: 'control',
                  component: './Automation/OpsScene',
                },
                {
                  path: '/automation/workflow',
                  name: 'workflow',
                  // icon: 'control',
                  component: './Automation/WorkFlow',
                },
                {
                  path: '/automation/jobexecut',
                  name: 'joblist',
                  // icon: 'profile',
                  component: './Automation/JobExecut',
                },
                {
                  path: '/automation/viewjob/:id',
                  name: 'viewjob',
                  hideInMenu: true,
                  component: './Automation/ViewJob',
                },
                {
                  path: '/automation/timedjob',
                  name: 'timedjob',
                  // icon: 'history',
                  dynamic: true,
                  component: './Automation/TimedJob',
                },
                {
                  path: '/automation/scriptmanage',
                  name: 'scriptmanage',
                  // icon: 'database',
                  component: './Automation/ScriptManage',
                },
                {
                  path: '/automation/resourcemanage',
                  name: 'resourcemanage',
                  // icon: 'cloud-server',
                  component: './Automation/ResourceManage',
                },
              ],
            },
            //监测管理
            {
              path: '/monitormanage',
              name: 'monitormanage',
              icon: 'interaction',
              routes: [
                {
                  path: '/monitormanage',
                  redirect: '/monitormanage/home',
                },
                {
                  path: '/monitormanage/home',
                  name: 'measurhome',
                  component: './Monitormanage',
                },
                {
                  path: '/monitormanage/measurmonitor',
                  name: 'measurmonitor',
                  routes: [
                    {
                      path: '/monitormanage/measurmonitor',
                      redirect: '/monitormanage/measurmonitor/home',
                    },
                    {
                      path: '/monitormanage/measurmonitor/home',
                      name: 'measurhome',
                      component: './Monitormanage/MeasurMonitor',
                    },
                    {
                      path: '/monitormanage/measurmonitor/collection',
                      name: 'collection',
                      component: './Monitormanage/MeasurMonitor/Collection',
                    },
                    {
                      path: '/monitormanage/measurmonitor/measurface',
                      name: 'measurface',
                      component: './Monitormanage/MeasurMonitor/MeasurFace',
                    },
                    {
                      path: '/monitormanage/measurmonitor/fafka',
                      name: 'fafka',
                      component: './Monitormanage/MeasurMonitor/Fafak',
                    },
                    {
                      path: '/monitormanage/measurmonitor/sysrunning',
                      name: 'sysrunning',
                      component: './Monitormanage/MeasurMonitor/SysRunning',
                    },
                    {
                      path: '/monitormanage/measurmonitor/databaseterminal',
                      name: 'databaseterminal',
                      component: './Monitormanage/MeasurMonitor/DatabaseTerminal',
                    },
                  ],
                },
              ],
            },

            {
              path: '/alarmmanage',
              name: 'alarmmanage',
              icon: 'interaction',
              routes: [
                {
                  path: '/alarmmanage',
                  redirect: '/alarmmanage/monitor',
                },
                {
                  path: '/alarmmanage/monitor',
                  name: 'monitor',
                  component: './Alarmmanage',
                },
                {
                  path: '/alarmmanage/details',
                  name: 'details',
                  component: './Alarmmanage/Details',
                },
                {
                  path: '/alarmmanage/details/detailview/:detailsid',
                  name: 'detailview',
                  hideInMenu: true,
                  component: './Alarmmanage/DetailView',
                },
                {
                  path: '/alarmmanage/syssetting',
                  name: 'syssetting',
                  component: './Alarmmanage/SysSetting',
                  routes: [
                    {
                      path: '/alarmmanage/syssetting',
                      redirect: '/alarmmanage/syssetting/quotas',
                    },
                    {
                      path: '/alarmmanage/syssetting/quotas',
                      name: 'quotas',
                      component: './Alarmmanage/Quotas',
                    },
                    {
                      path: '/alarmmanage/syssetting/connector',
                      name: 'connector',
                      component: './Alarmmanage/Connector',
                    },
                    {
                      path: '/alarmmanage/syssetting/KAFKA',
                      name: 'KAFKA',
                      component: './Alarmmanage/KAFKA',
                    },
                    {
                      path: '/alarmmanage/syssetting/sysrun',
                      name: 'sysrun',
                      component: './Alarmmanage/SysRun',
                    },
                  ],
                },
                {
                  path: '/alarmmanage/noticesetting',
                  name: 'noticesetting',
                  component: './Alarmmanage/NoticeSetting',
                  routes: [
                    {
                      path: '/alarmmanage/noticesetting',
                      redirect: '/alarmmanage/noticesetting/notifygroup',
                    },
                    {
                      path: '/alarmmanage/noticesetting/notifygroup',
                      name: 'notifygroup',
                      component: './Alarmmanage/NotifyGroup',
                    },
                    {
                      path: '/alarmmanage/noticesetting/notifyperson',
                      name: 'notifyperson',
                      component: './Alarmmanage/NotifyPerson',
                    },
                  ],
                },
              ],
            },
            // {
            //   path: '/monitor',
            //   name: '监测管理',
            //   icon: 'smile',
            //   // authority: ['admin', 'user'],
            //   routes: [
            //     {
            //       path: '/monitor',
            //       redirect: '/monitor/hostlist',
            //     },
            //     {
            //       name: '监测总览',
            //       icon: 'smile',
            //       path: '/monitor/hostlist',
            //       // authority: ['Eadmin'],
            //       component: './monitor/ListTableList',
            //     },
            //     {
            //       name: '监控指标',
            //       icon: 'smile',
            //       // hideInMenu: true,
            //       path: '/monitor/itemlist',
            //       component: './monitor/TableList',
            //     },
            //     {
            //       name: '监控数据',
            //       icon: 'smile',
            //       // hideInMenu: true,
            //       path: '/monitor/historylist',
            //       component: './monitor/History',
            //     }
            //   ],
            // },
            // {
            //   path: '/event',
            //   name: '告警管理',
            //   icon: 'smile',
            //   routes: [
            //     {
            //       path: '/event',
            //       redirect: '/event/list',
            //     },
            //     {
            //       path: '/event/list',
            //       name: '监控事件',
            //       icon: 'smile',
            //       component: './event',
            //     },
            //   ],
            // },
            // {
            //   path: '/agent',
            //   name: '采控管理',
            //   icon: 'smile',
            //   routes: [
            //     {
            //       path: '/agent',
            //       redirect: '/agent/cmdb',
            //     },
            //     {
            //       path: '/agent/cmdb',
            //       name: '监控配置',
            //       icon: 'smile',
            //       component: './agent/cmdb',
            //     },
            //     {
            //       path: '/agent/listtablelist',
            //       name: '查询表格',
            //       icon: 'smile',
            //       // hideInMenu: true,
            //       component: './agent/cmdb/ListTableList',
            //     },
            //   ],
            // },
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
    '/dveopsapi/': {
      target: 'http://172.16.4.105:8081/', //脚本管理服务器地址
      changeOrigin: true,
      // pathRewrite: { '^/server': '' },
    },
    '/basicMonitor/': {
      target: 'http://172.16.4.115:8889/', //监测管理
      changeOrigin: true,
      // pathRewrite: { '^/apiauth': '' }
    },
  },
};
