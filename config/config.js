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
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
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
            }, //自动化运维

            {
              path: '/automation',
              name: 'automation',
              dynamic: true,
              icon: 'deployment-unit',
              routes: [
                {
                  path: '/automation',
                  // redirect: '/automation/monitor',
                  redirect: '/automation/opsscene',
                },
                {
                  path: '/automation/monitor',
                  name: 'monitor',
                  icon: 'dashboard',
                  component: './Automation/Monitor',
                },
                {
                  path: '/automation/opsscene',
                  name: '',
                  icon: 'control',
                  component: './Automation/OpsScene',
                },
                {
                  path: '/automation/workflow',
                  name: 'workflow',
                  icon: 'control',
                  component: './Automation/WorkFlow',
                },
                {
                  path: '/automation/jobexecut',
                  name: 'joblist',
                  icon: 'profile',
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
                  icon: 'history',
                  dynamic: true,
                  component: './Automation/TimedJob',
                },
                {
                  path: '/automation/scriptmanage',
                  name: 'scriptmanage',
                  icon: 'database',
                  component: './Automation/ScriptManage',
                },
                {
                  path: '/automation/resourcemanage',
                  name: 'resourcemanage',
                  icon: 'cloud-server',
                  component: './Automation/ResourceManage',
                },
              ],
            }, // {
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
    '/api': {
      target: 'http://localhost:8001/',
      changeOrigin: true, // pathRewrite: {
      //   '^/server': '',
      // },
    },
  },
};
