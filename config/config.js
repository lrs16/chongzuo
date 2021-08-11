import slash from 'slash2';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

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
  history: 'browser', // browser
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
        {
          path: '/user/ITlogin',
          name: 'ITSM',
          component: './user/ITlogin',
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
          routes: [
            {
              path: '/',
              component: '../layouts/UserLayout',
              routes: [
                {
                  path: '/',
                  redirect: '/ITSM/home',
                },
                {
                  path: '/home',
                  name: '首页',
                  dynamic: true,
                  icon: 'deployment-unit',
                  routes: [
                    {
                      path: '/home',
                      redirect: '/ITSM/home',
                    },
                    {
                      path: '/ITSM/home',
                      name: 'IT服务监控台',
                      icon: 'control',
                    },
                  ],
                },
                {
                  path: '/ITSM',
                  name: 'IT服务管理',
                  dynamic: true,
                  icon: 'deployment-unit',
                  routes: [
                    {
                      path: '/ITSM',
                      redirect: '/ITSM/home',
                    },
                    {
                      path: '/ITSM/home',
                      name: 'IT服务监控台',
                      icon: 'control',
                      component: './HomePage',
                    },
                    {
                      path: '/ITSM/todo',
                      name: 'IT服务待办',
                      icon: 'control',
                      component: './ITSM/ITSMtodo',
                    },
                    {
                      path: '/ITSM/eventmanage',
                      name: '事件管理',
                      icon: 'control',
                      routes: [
                        {
                          path: '/ITSM/eventmanage',
                          redirect: '/ITSM/eventmanage/registration',
                        },
                        {
                          path: '/ITSM/eventmanage/registration',
                          name: '事件登记',
                          icon: 'cloud-server',
                          component: './ITSM/Eventmanage/Registration',
                        },
                        {
                          path: '/ITSM/eventmanage/to-do',
                          name: '事件待办',
                          icon: 'cloud-server',
                          component: './ITSM/Eventmanage/ToDolist',
                        },
                        {
                          path: '/ITSM/eventmanage/to-do/record',
                          name: '事件办理',
                          icon: 'cloud-server',
                          component: './ITSM/Eventmanage/ToDodetails',
                          routes: [
                            {
                              path: '/ITSM/eventmanage/to-do/record',
                              redirect: '/ITSM/eventmanage/to-do/record/workorder',
                            },
                            {
                              path: '/ITSM/eventmanage/to-do/record/workorder',
                              name: '事件工单',
                              component: './ITSM/Eventmanage/WorkOrder',
                            },
                            {
                              path: '/ITSM/eventmanage/to-do/record/process',
                              name: '事件流程',
                              component: './ITSM/Eventmanage/Process',
                            },
                          ],
                        },
                        {
                          path: '/ITSM/eventmanage/query',
                          name: '事件查询',
                          icon: 'cloud-server',
                          component: './ITSM/Eventmanage/QueryList',
                        },
                        {
                          path: '/ITSM/eventmanage/eventstatistics',
                          name: '事件统计',
                          icon: 'cloud-server',
                          routes: [
                            {
                              path: '/ITSM/eventmanage/eventstatistics/maintenance',
                              name: '运维分类情况统计',
                              icon: 'cloud-server',
                              component: './ITSM/Eventmanage/eventstatistics/Maintenance',
                            },
                            {
                              path: '/ITSM/eventmanage/eventstatistics/maintenanceservice',
                              name: '软件运维服务指标完成情况',
                              icon: 'cloud-server',
                              component: './ITSM/Eventmanage/eventstatistics/Maintenanceservice',
                            },
                            {
                              path: '/ITSM/eventmanage/eventstatistics/solution',
                              name: '一线事件解决情况',
                              icon: 'cloud-server',
                              component: './ITSM/Eventmanage/eventstatistics/Solution',
                            },
                            {
                              path: '/ITSM/eventmanage/eventstatistics/workordertopn',
                              name: '工单TOPN',
                              icon: 'cloud-server',
                              component: './ITSM/Eventmanage/eventstatistics/Workordertopn',
                            },
                            {
                              path: '/ITSM/eventmanage/eventstatistics/workordertreatmentrate',
                              name: '工单处理率',
                              icon: 'cloud-server',
                              component: './ITSM/Eventmanage/eventstatistics/Workordertreatmentrate',
                            },
                          ],
                        },
                        {
                          path: '/ITSM/eventmanage/query/details',
                          name: '事件工单详情',
                          icon: 'cloud-server',
                          component: './ITSM/Eventmanage/EventDetails',
                        },
                        {
                          path: '/ITSM/eventmanage/overtime',
                          name: '超时查询',
                          icon: 'cloud-server',
                          component: './ITSM/Eventmanage/Overtime',
                        },
                      ],
                    },
                    {
                      path: '/ITSM/problemmanage',
                      name: '问题管理',
                      icon: 'control',
                      routes: [
                        {
                          path: '/ITSM/problemmanage',
                          redirect: '/ITSM/problemmanage/registration',
                        },
                        {
                          path: '/ITSM/problemmanage/registration',
                          name: '问题登记',
                          icon: 'cloud-server',
                          component: './ITSM/Problemmanage/Registration',
                        },
                        {
                          path: '/ITSM/problemmanage/besolved',
                          name: '问题待办',
                          icon: 'cloud-server',
                          component: './ITSM/Problemmanage/Besolved',
                        },
                        {
                          path: '/ITSM/problemmanage/problemquery',
                          name: '问题查询',
                          icon: 'cloud-server',
                          component: './ITSM/Problemmanage/Problemquery',
                        },
                        {
                          path: '/ITSM/problemmanage/besolveddetail/workorder',
                          name: '问题工单',
                          icon: 'cloud-server',
                          component: './ITSM/Problemmanage/Workorder',
                        },
                        {
                          path: '/ITSM/problemmanage/problemquery/detail',
                          name: '问题工单详情',
                          icon: 'cloud-server',
                          component: './ITSM/Problemmanage/Queryworkdetail',
                        },
                        {
                          path: '/ITSM/problemmanage/statistics',
                          name: '问题统计',
                          icon: 'alibaba',
                          routes: [
                            {
                              path: '/ITSM/problemmanage/statistics/treatmentrate',
                              name: '问题解决进度管控表',
                              icon: 'fork',
                              component: './ITSM/Problemmanage/Handlingrate',
                            },
                            {
                              path: '/ITSM/problemmanage/statistics/classifiedstatistics',
                              name: '问题分类统计',
                              icon: 'experiment',
                              component: './ITSM/Problemmanage/ClassifiedStatistics',
                            },
                            {
                              path: '/ITSM/problemmanage/statistics/statusstatistics',
                              name: '问题状态统计',
                              icon: 'dropbox',
                              component: './ITSM/Problemmanage/Statusstatistics',
                            },
                            {
                              path: '/ITSM/problemmanage/statistics/timeoutstatistics',
                              name: '问题超时统计',
                              icon: 'euro',
                              component: './ITSM/Problemmanage/TimeoutStatistics',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: '/ITSM/demandmanage',
                      name: '需求管理',
                      icon: 'control',
                      routes: [
                        {
                          path: '/ITSM/demandmanage',
                          redirect: '/ITSM/demandmanage/registration',
                        },
                        {
                          path: '/ITSM/demandmanage/registration',
                          name: '需求登记',
                          icon: 'cloud-server',
                          component: './ITSM/Demandmanage/Registration',
                        },
                        {
                          path: '/ITSM/demandmanage/to-do',
                          name: '需求待办',
                          icon: 'cloud-server',
                          component: './ITSM/Demandmanage/ToDolist',
                        },
                        {
                          path: '/ITSM/demandmanage/to-do/record',
                          name: '需求办理',
                          icon: 'cloud-server',
                          component: './ITSM/Demandmanage/ToDodetails',
                          routes: [
                            {
                              path: '/ITSM/demandmanage/to-do/record',
                              redirect: '/ITSM/demandmanage/to-do/record/workorder',
                            },
                            {
                              path: '/ITSM/demandmanage/to-do/record/workorder',
                              name: '需求工单',
                              component: './ITSM/Demandmanage/WorkOrder',
                            },
                            {
                              path: '/ITSM/demandmanage/to-do/record/process',
                              name: '需求流程',
                              component: './ITSM/Demandmanage/Process',
                            },
                          ],
                        },
                        {
                          path: '/ITSM/demandmanage/query',
                          name: '需求查询',
                          icon: 'cloud-server',
                          component: './ITSM/Demandmanage/QueryList',
                        },
                        {
                          path: '/ITSM/demandmanage/query/details',
                          name: '需求工单详情',
                          icon: 'cloud-server',
                          component: './ITSM/Demandmanage/Details',
                        },
                        {
                          path: '/ITSM/demandmanage/demandstatistics',
                          name: '需求统计',
                          icon: 'cloud-server',
                          routes: [
                            {
                              path: '/ITSM/demandmanage/demandstatistics/demandrequirement',
                              name: '功能需求统计',
                              icon: 'cloud-server',
                              component: './ITSM/Demandmanage/demandstatistics/DemandRequirement',
                            },
                            {
                              path: '/ITSM/demandmanage/demandstatistics/demandstate',
                              name: '需求状态统计',
                              icon: 'cloud-server',
                              component: './ITSM/Demandmanage/demandstatistics/Demandstate',
                            },
                            {
                              path: '/ITSM/demandmanage/demandstatistics/demandschedule',
                              name: '需求进度统计',
                              icon: 'cloud-server',
                              component: './ITSM/Demandmanage/demandstatistics/DemandSchedule',
                            },
                            {
                              path: '/ITSM/demandmanage/demandstatistics/demandtimeout',
                              name: '需求超时统计',
                              icon: 'cloud-server',
                              component: './ITSM/Demandmanage/demandstatistics/DemandTimeout',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: '/ITSM/faultmanage',
                      name: '故障管理',
                      icon: 'control',
                      // component: './ITSM/Faultmanage/Registration',

                      routes: [
                        {
                          path: '/ITSM/faultmanage',
                          redirect: '/ITSM/faultmanage/registration',
                        },
                        {
                          path: '/ITSM/faultmanage/registration',
                          name: '故障登记',
                          icon: 'control',
                          component: './ITSM/Faultmanage/Registration',
                        },
                        {
                          path: '/ITSM/faultmanage/todolist',
                          name: '故障待办',
                          icon: 'control',
                          component: './ITSM/Faultmanage/ToDOlist',
                        },
                        {
                          path: '/ITSM/faultmanage/todolist/record',
                          name: '故障工单',
                          icon: 'cloud-server',
                          component: './ITSM/Faultmanage/Todolistdetails',
                        },
                        {
                          path: '/ITSM/faultmanage/querylist',
                          name: '故障查询',
                          icon: 'control',
                          component: './ITSM/Faultmanage/QueryList',
                        },
                        {
                          path: '/ITSM/faultmanage/querylist/record',
                          name: '故障工单详情',
                          icon: 'cloud-server',
                          component: './ITSM/Faultmanage/Querylistdetails',
                        },
                        {
                          path: '/ITSM/faultmanage/overtime',
                          name: '超时查询',
                          icon: 'control',
                          component: './ITSM/Faultmanage/Overtime',
                        },
                        {
                          path: '/ITSM/faultmanage/faultstaticount',
                          name: '故障统计',
                          icon: 'control',
                          routes: [
                            {
                              path: '/ITSM/faultmanage/faultstaticount/faultsumstatic',
                              name: '故障类型统计',
                              icon: 'control',
                              component: './ITSM/Faultmanage/Faultbreakdownlist',
                            },
                            {
                              path: '/ITSM/faultmanage/faultstaticount/breakdowndetail',
                              name: '故障状态统计',
                              icon: 'control',
                              component: './ITSM/Faultmanage/Breakdowndetail',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: '/ITSM/releasemanage',
                      name: '故障管理',
                      icon: 'control',
                      // component: './ITSM/Faultmanage/Registration',

                      routes: [
                        {
                          path: '/ITSM/releasemanage',
                          redirect: '/ITSM/releasemanage/registration',
                        },
                        {
                          path: '/ITSM/releasemanage/registration',
                          name: '出厂测试',
                          icon: 'control',
                          component: './ITSM/Releasemanage/Registration',
                        },
                        {
                          path: '/ITSM/releasemanage/to-do',
                          name: '发布待办',
                          icon: 'control',
                          component: './ITSM/Releasemanage/ToDolist',
                        },
                        {
                          path: '/ITSM/releasemanage/to-do/record',
                          name: '发布工单处理',
                          icon: 'cloud-server',
                          component: './ITSM/Releasemanage/ToDodetails',
                        },
                        {
                          path: '/ITSM/releasemanage/verificationtodo',
                          name: '业务验证待办',
                          icon: 'control',
                          component: './ITSM/Releasemanage/VerificationTodo',
                        },
                        {
                          path: '/ITSM/releasemanage/verificationtodo/record',
                          name: '业务验证',
                          icon: 'control',
                          component: './ITSM/Releasemanage/BusinessDetail',
                        },
                        {
                          path: '/ITSM/releasemanage/checktodo',
                          name: '业务复核待办',
                          icon: 'control',
                          component: './ITSM/Releasemanage/Checktodo',
                        },
                        {
                          path: '/ITSM/releasemanage/checktodo/record',
                          name: '业务复核',
                          icon: 'control',
                          component: './ITSM/Releasemanage/BusinessDetail',
                        },
                        {
                          path: '/ITSM/releasemanage/library',
                          name: '发布库',
                          icon: 'control',
                          component: './ITSM/Releasemanage/BusinessDetail',
                        },
                      ],
                    },
                    {
                      path: '/ITSM/onsitemanage',
                      name: '巡检管理',
                      icon: 'control',
                      component: './ITSM/OnSitemanage',
                    },
                    {
                      path: '/ITSM/knowledgemanage',
                      name: '知识管理',
                      icon: 'control',
                      routes: [
                        {
                          path: '/ITSM/knowledgemanage',
                          redirect: '/ITSM/knowledgemanage/myknowledge',
                        },
                        {
                          path: '/ITSM/knowledgemanage/myknowledge',
                          name: '我的知识',
                          icon: 'fork',
                          component: './ITSM/Knowledgemanage/KnowledgeList'
                        },
                        {
                          path: '/ITSM/knowledgemanage/myknowledge/new',
                          name: '新增知识',
                          icon: 'fork',
                          component: './ITSM/Knowledgemanage/New'
                        },
                        {
                          path: '/ITSM/knowledgemanage/myknowledge',
                          name: '我的知识',
                          icon: 'fork',
                          component: './ITSM/Knowledgemanage/KnowledgeList'
                        },
                        {
                          path: '/ITSM/knowledgemanage/:id/operation',
                          name: '知识单操作',
                          icon: 'fork',
                          component: './ITSM/Knowledgemanage/Operation'
                        },
                        {
                          path: '/ITSM/knowledgemanage/maintain',
                          name: '知识维护',
                          icon: 'fork',
                          component: './ITSM/Knowledgemanage/KnowledgeList'
                        },
                        {
                          path: '/ITSM/knowledgemanage/toexamine',
                          name: '知识审核',
                          icon: 'fork',
                          component: './ITSM/Knowledgemanage/KnowledgeList'
                        },
                        {
                          path: '/ITSM/knowledgemanage/query',
                          name: '知识查询',
                          icon: 'fork',
                          component: './ITSM/Knowledgemanage/KnowledgeList'
                        },
                        {
                          path: '/ITSM/knowledgemanage/query/details',
                          name: '知识详情',
                          icon: 'fork',
                          component: './ITSM/Knowledgemanage/View'
                        },
                        {
                          path: '/ITSM/knowledgemanage/statistics',
                          name: '知识统计',
                          icon: 'fork',
                          routes: [
                            {
                              path: '/ITSM/knowledgemanage/statistics',
                              redirect: '/ITSM/knowledgemanage/statistics/type',
                            },
                            {
                              path: '/ITSM/knowledgemanage/statistics/type',
                              name: '知识分类统计',
                              icon: 'fork',
                              component: './ITSM/Knowledgemanage/StatisticsbyType'
                            },
                          ]
                        },
                      ]
                    },
                    {
                      path: '/ITSM/operationreport',
                      name: '运维周/月报',
                      icon: 'control',
                      routes: [
                        {
                          path: '/ITSM/operationreport',
                          redirect: '/ITSM/operationreport/weeklyreport'
                        },
                        {
                          path: '/ITSM/operationreport/weeklyreport',
                          name: '运维周报',
                          icon: 'cloud-server',
                          // component:'./ITSM/Operationreport/WeeklyReport/OperationmyweeklyReport',
                          routes: [
                            {
                              path: '/ITSM/operationreport/weeklyreport/myweeklyreport',
                              name: '我的周报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/OperationmyweeklyReport'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/myweeklyreportsearch',
                              name: '周报查询',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/WeeklySearch'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/softreport',
                              name: '软件运维周报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/SoftReport'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/detailSoft',
                              name: '软件运维周报详情页',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/SoftReportdetail'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/computerroomreport',
                              name: '机房运维周报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/ComputerroomReport'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/computerroomreportdetail',
                              name: '机房运维周报详情页',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/ComputerroomReportdetail'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/databasereport',
                              name: '数据库运维周报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/DatabaseReport'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/databasereportdetail',
                              name: '数据库运维周报详情页',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/DatabaseReportdetail'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/otherreport',
                              name: '其他运维周报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/OtherReport'
                            },
                            {
                              path: '/ITSM/operationreport/weeklyreport/otherreportdetail',
                              name: '其他运维周报详情',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/OtherReportdetail'
                            },
                          ]
                        },
                        {
                          path: '/ITSM/operationreport/monthlyreport',
                          name: '运维月报',
                          icon: 'cloud-server',
                          routes: [
                            {
                              path: '/ITSM/operationreport/monthlyreport',
                              redirect: '/ITSM/operationreport/monthlyreport/mymonthlyreport'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/mymonthlyreport',
                              name: '我的月报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/MonthlyReport/MymonthlyReport',
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/mymonthlysearch',
                              name: '月报查询',
                              icon: 'fork',
                              component: './ITSM/Operationreport/MonthlyReport/MymonthlySearch'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/monthsoftreport',
                              name: '软件运维月报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/SoftReport'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/monthdetailSoft',
                              name: '软件运维月报详情页',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/SoftReportdetail'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/monthcomputerroomreport',
                              name: '机房运维月报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/ComputerroomReport'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/monthcomputerroomreportdetail',
                              name: '机房运维月报详情页',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/ComputerroomReportdetail'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/monthdatabasereport',
                              name: '数据库运维月报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/DatabaseReport'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/monthdatabasereportdetail',
                              name: '数据库运维月报详情页',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/DatabaseReportdetail'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/monthotherreport',
                              name: '其他运维月报',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/OtherReport'
                            },
                            {
                              path: '/ITSM/operationreport/monthlyreport/monthotherreportdetail',
                              name: '其他运维月报详情',
                              icon: 'fork',
                              component: './ITSM/Operationreport/WeeklyReport/OtherReportdetail'
                            },
                          ]
                        },

                      ]
                    },
                    {
                      path: '/ITSM/operationplan',
                      name: '作业计划',
                      icon: 'control',

                      routes: [
                        {
                          path: '/ITSM/operationplan',
                          redirect: '/ITSM/operationplan/myoperationplan'
                        },
                        {
                          path: '/ITSM/operationplan/myoperationplan/',
                          name: '我的作业计划',
                          icon: 'control',
                          component: './ITSM/OperationPlan/MyoperationPlan',
                        },
                        {
                          path: '/ITSM/operationplan/operationplanfillin',
                          name: '作业计划填报',
                          icon: 'control',
                          component: './ITSM/OperationPlan/OperationPlanfillintion',
                        },
                        {
                          path: '/ITSM/operationplan/operationplanform',
                          name: '作业计划',
                          icon: 'control',
                          component: './ITSM/OperationPlan/Work',
                        },
                        {
                          path: '/ITSM/operationplan/operationplancheck',
                          name: '作业计划审核',
                          icon: 'control',
                          component: './ITSM/OperationPlan/OperationplanCheck',
                        },
                        {
                          path: '/ITSM/operationplan/taskexecute',
                          name: '作业计划执行',
                          icon: 'control',
                          component: './ITSM/OperationPlan/components/TaskExecute',
                        },
                        {
                          path: '/ITSM/operationplan/operationplansearch',
                          name: '作业计划查询',
                          icon: 'control',
                          component: './ITSM/OperationPlan/TaskSearch',
                        },
                        {
                          path: '/ITSM/operationplan/operationplansearchdetail',
                          name: '作业计划详情',
                          icon: 'control',
                          component: './ITSM/OperationPlan/OperationplansearchDetail',
                        },
                        {
                          path: '/ITSM/operationplan/statistics',
                          name: '作业计划统计',
                          icon: 'control',
                          routes: [
                            {
                              path: '/ITSM/operationplan/statistics/status',
                              name: '作业计划状态统计',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanStatistics/Status',
                            },
                            {
                              path: '/ITSM/operationplan/statistics/result',
                              name: '作业计划结果统计',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanStatistics/Result',
                            },
                            {
                              path: '/ITSM/operationplan/statistics/execute',
                              name: '作业计划执行情况统计',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanStatistics/Execute',
                            },
                            {
                              path: '/ITSM/operationplan/statistics/timeout',
                              name: '作业计划超时统计',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanStatistics/Timeout',
                            },
                          ]
                        },
                        {
                          path: '/ITSM/operationplan/personaccessmanage',
                          name: '人员进出管理',
                          icon: 'control',
                          routes: [
                            {
                              path: '/ITSM/operationplan/personaccessmanage/newcheck',
                              name: '人员进出审核',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanPersonaccessmanage/Newcheck',
                            },
                            {
                              path: '/ITSM/operationplan/personaccessmanage/toregister',
                              name: '人员进出登记',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanPersonaccessmanage/Toregister',
                            },
                            {
                              path: '/ITSM/operationplan/personaccessmanage/tocheck',
                              name: '人员进出审核',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanPersonaccessmanage/ToCheck',
                            },
                            {
                              path: '/ITSM/operationplan/personaccessmanage/toquery',
                              name: '人员进出查询',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanPersonaccessmanage/ToQuery',
                            },
                            {
                              path: '/ITSM/operationplan/personaccessmanage/record',
                              name: '人员进出查询',
                              icon: 'fork',
                              component: './ITSM/OperationPlan/OperationplanPersonaccessmanage/ToQuerydetails',
                            },
                          ]
                        },
                      ]
                    },
                    {
                      path: '/ITSM/supervisework',
                      name: '工作督办',
                      icon: 'control',
                      routes: [
                        {
                          path: '/ITSM/supervisework',
                          redirect: '/ITSM/supervisework/mycreatework',
                        },
                        {
                          path: '/ITSM/supervisework/mycreatework',
                          name: '我创建的工作',
                          icon: 'fork',
                          component: './ITSM/Supervisework/MycreateWork'
                        },
                        {
                          path: '/ITSM/supervisework/taskworkfillin',
                          name: '工作任务填报',
                          icon: 'fork',
                          component: './ITSM/Supervisework/TaskworkFillin'
                        },
                        {
                          path: '/ITSM/supervisework/workplandetail',
                          name: '工作计划',
                          icon: 'control',
                          component: './ITSM/Supervisework/WorkplanDetail',
                        },
                        {
                          path: '/ITSM/supervisework/myresponwork',
                          name: '我负责的工作',
                          icon: 'fork',
                          component: './ITSM/Supervisework/MyresponWork'
                        },
                        {
                          path: '/ITSM/supervisework/executework',
                          name: '工作计划执行',
                          icon: 'control',
                          component: './ITSM/Supervisework/components/ExecuteworkEditfillin',
                        },
                        {
                          path: '/ITSM/supervisework/todelayexamine',
                          name: '工作延期审核',
                          icon: 'fork',
                          component: './ITSM/Supervisework/TodelayExamine'
                        },
                        {
                          path: '/ITSM/supervisework/querywork',
                          name: '工作查询',
                          icon: 'fork',
                          component: './ITSM/Supervisework/QueryWork'
                        },
                        {
                          path: '/ITSM/supervisework/queryworkdetails',
                          name: '工作查询详情',
                          icon: 'control',
                          component: './ITSM/Supervisework/QueryWorkDetails',
                        },
                      ]
                    },
                    {
                      path: '/ITSM/servicequalityassessment',
                      name: '服务质量考核',
                      icon: 'control',
                      routes: [
                        {
                          path: '/ITSM/servicequalityassessment',
                          redirect: '/ITSM/servicequalityassessment/serviceprovidermaintenance'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/serviceprovidermaintenance',
                          name: '服务商维护',
                          icon: 'control',
                          component: './ITSM/ServiceQuality/ProviderMaintenance'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/addserviceprovidermaintenance',
                          name: '新增服务商维护',
                          icon: 'control',
                          component: './ITSM/ServiceQuality/components/AddProviderMaintenance'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/detailserviceprovidermaintenance',
                          name: '服务商维护详情',
                          icon: 'control',
                          component: './ITSM/ServiceQuality/components/AddProviderMaintenance'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/serviceprovidersearch',
                          name: '服务商查询',
                          icon: 'control',
                          component: './ITSM/ServiceQuality/ServiceProvidersearch'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/scoringrulesmaintenance',
                          name: '评分细则维护',
                          icon: 'control',
                          component: './ITSM/ServiceQuality/ScoringRulesmaintenance'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/addscoringrulesmaintenance',
                          name: '新增评分细则维护',
                          icon: 'control',
                          component: './ITSM/ServiceQuality/components/AddScoringRulesmaintenance'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/detailscoringrulesmaintenance',
                          name: '评分细则维护详情页',
                          icon: 'control',
                          component: './ITSM/ServiceQuality/components/AddScoringRulesmaintenance'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/scoringrulessearch',
                          name: '评分细则查询',
                          icon: 'control',
                          component: './ITSM/ServiceQuality/ScoringRulesssearch'
                        },
                        {
                          path: '/ITSM/servicequalityassessment/serviceperformanceappraisal',
                          name: '服务绩效考核',
                          icon: 'control',
                          routes: [
                            {
                              path: '/ITSM/servicequalityassessment/serviceperformanceappraisal/register',
                              name: '服务绩效考核登记',
                              icon: 'fork',
                              component: './ITSM/ServiceQuality/ServicePerformanceappraisal/Registertion'
                            },
                            {
                              path: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
                              name: '服务绩效考核待办详情',
                              icon: 'fork',
                              component: './ITSM/ServiceQuality/ServicePerformanceappraisal/TobedealtForm'
                            },
                            {
                              path: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtlist',
                              name: '服务绩效考核待办',
                              icon: 'fork',
                              component: './ITSM/ServiceQuality/ServicePerformanceappraisal/TobedealtList'
                            },
                            {
                              path: '/ITSM/servicequalityassessment/serviceperformanceappraisal/search',
                              name: '服务绩效考核查询',
                              icon: 'fork',
                              component: './ITSM/ServiceQuality/ServicePerformanceappraisal/Search'
                            },
                            {
                              path: '/ITSM/servicequalityassessment/serviceperformanceappraisal/assessment',
                              name: '我的服务绩效考核',
                              icon: 'fork',
                              component: './ITSM/ServiceQuality/ServicePerformanceappraisal/Assessment'
                            }
                          ]
                        },
                        {
                          path: '/ITSM/servicequalityassessment/creditcard',
                          name: '记分卡管理',
                          icon: 'control',
                          routes: [
                            {
                              path: '/ITSM/servicequalityassessment/creditcard/creditcardregister',
                              name: '记分卡登记',
                              icon: 'fork',
                              component: './ITSM/ServiceQuality/CreditCard/CreditCardRegister'
                            },
                            {
                              path: '/ITSM/servicequalityassessment/creditcard/creditcardregisterdetail',
                              name: '记分卡登记详情页',
                              icon: 'fork',
                              component: './ITSM/ServiceQuality/CreditCard/CreditCardRegister'
                            },
                            {
                              path: '/ITSM/servicequalityassessment/creditcard/creditcardsearch',
                              name: '计分卡查询',
                              icon: 'fork',
                              component: './ITSM/ServiceQuality/CreditCard/CreditCardSearch'
                            },
                          ]
                        }
                      ]
                    },
                    {
                      path: '/ITSM/dutymanage',
                      name: '值班工作管理',
                      icon: 'control',
                      routes: [
                        {
                          path: '/ITSM/dutymanage',
                          redirect: '/ITSM/dutymanage/dutyconfiguration'
                        },
                        {
                          path: '/ITSM/dutymanage/dutyconfiguration',
                          name: '值班配置',
                          icon: 'cloud-server',
                          routes: [
                            {
                              path: '/ITSM/dutymanage/dutyconfiguration/dutyclassessetting',
                              name: '班次设置',
                              icon: 'fork',
                              component: './ITSM/Dutymanage/DutyConfiguration/DutyclassesSetting'
                            },
                            {
                              path: '/ITSM/dutymanage/dutyconfiguration/dutyclassessetting/newclasses',
                              name: '新增班次',
                              icon: 'fork',
                              component: './ITSM/Dutymanage/DutyConfiguration/NewClasses'
                            },
                            {
                              path: '/ITSM/dutymanage/dutyconfiguration/dutypersonnelsetting',
                              name: '值班人员设置',
                              icon: 'fork',
                              component: './ITSM/Dutymanage/DutyConfiguration/DutypersonnelSetting'
                            },
                            {
                              path: '/ITSM/dutymanage/dutyconfiguration/dutyaccordingsetting',
                              name: '排班设置',
                              icon: 'fork',
                              component: './ITSM/Dutymanage/DutyConfiguration/DutyaccordingSetting'
                            },
                            {
                              path: '/ITSM/dutymanage/dutyconfiguration/dutyaccordingsearch',
                              name: '排班查询',
                              icon: 'fork',
                              component: './ITSM/Dutymanage/DutyConfiguration/DutyaccordingSearch'
                            },
                          ]
                        },
                        {
                          path: '/ITSM/dutymanage/dutyhandovermanage',
                          name: '值班交接管理',
                          icon: 'cloud-server',
                          routes: [
                            {
                              path: '/ITSM/dutymanage/dutyhandovermanage',
                              redirect: '/ITSM/dutymanage/dutyhandovermanage/mydutyhandover'
                            },
                            {
                              path: '/ITSM/dutymanage/dutyhandovermanage/mydutyhandover',
                              name: '我的值班交接',
                              icon: 'fork',
                              component: './ITSM/Dutymanage/DutyHandovermanage/MydutyHandover',
                            },
                            {
                              path: '/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/newhandover',
                              name: '新增值班交接',
                              icon: 'fork',
                              component: './ITSM/Dutymanage/DutyHandovermanage/NewHandover'
                            },
                            {
                              path: '/ITSM/dutymanage/dutyhandovermanage/mydutyhandoversearch',
                              name: '值班交接查询',
                              icon: 'fork',
                              component: './ITSM/Dutymanage/DutyHandovermanage/MydutyHandoverSearch'
                            },
                          ]
                        },

                      ]
                    },
                    {
                      component: './500',
                    },
                  ],
                },
                // 自动化运维
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
                          name: '主机操作',
                          icon: 'cloud-server',
                          component: './Automation/SoftTT/SoftExetute',
                        },
                        {
                          path: '/automation/STT/execlog',
                          name: '执行日志',
                          icon: 'cloud-server',
                          component: './Automation/SoftTT/ExeclogView',
                        },
                        {
                          path: '/automation/STT/commandconfigurate',
                          name: '命令配置',
                          icon: 'cloud-server',
                          component: './Automation/SoftTT/CommandConfigurate',
                        },
                      ],
                    },
                    {
                      path: '/automation/objectmanage',
                      name: '对象管理',
                      icon: 'database',
                      routes: [
                        {
                          path: '/automation/objectmanage/agent',
                          name: 'agent管理',
                          icon: 'cloud-server',
                          component: './Automation/ObjectManage/agentManage',
                        },
                      ]
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
                          name: '终端在线和入库',
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
                          path: '/monitormanage/basicmonitor/database',
                          name: '数据库监测',
                          component: './Monitormanage/BasicMonitor/Database',
                        },
                        {
                          path: '/monitormanage/basicmonitor/:type/detail/:id',
                          name: '监测详情',
                          hideInMenu: true,
                          component: './Monitormanage/BasicMonitor/Detail',
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
                          redirect: '/alarmmanage/measuralarm/alarmoverview',
                        },
                        {
                          path: '/alarmmanage/measuralarm/alarmoverview',
                          name: '告警概览',
                          icon: 'cloud-server',
                          component: './Alarmmanage/MeasurAlarm/AlarmOverview',
                          routes: [
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview',
                              redirect: '/alarmmanage/measuralarm/alarmoverview/overview',
                            },
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview/overview',
                              name: '告警概览',
                              component: './Alarmmanage/MeasurAlarm/AlarmOverview/OverVies',
                            },
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview/overview/workorder',
                              name: '派发工单',
                              component: './Alarmmanage/MeasurAlarm/AlarmOverview/WorkOrder',
                            },
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview/quotas',
                              name: '业务指标告警',
                              component: './Alarmmanage/MeasurAlarm/AlarmOverview/OverVies',
                            },
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview/databaseterminal',
                              name: '终端在线和入库告警',
                              component: './Alarmmanage/MeasurAlarm/AlarmOverview/OverVies',
                            },
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview/connector',
                              name: '接口数据核查告警',
                              component: './Alarmmanage/MeasurAlarm/AlarmOverview/OverVies',
                            },
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview/KAFKA',
                              name: 'KAFKA消费告警',
                              component: './Alarmmanage/MeasurAlarm/AlarmOverview/OverVies',
                            },
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview/KAFKA0',
                              name: 'KAFKA消费（凌晨）告警',
                              component: './Alarmmanage/MeasurAlarm/AlarmOverview/OverVies',
                            },
                            {
                              path: '/alarmmanage/measuralarm/alarmoverview/sysrun',
                              name: '主站系统运行告警',
                              component: './Alarmmanage/MeasurAlarm/AlarmOverview/OverVies',
                            },
                          ],
                        },
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
                          component: './Alarmmanage/MeasurAlarm/SysSetting/index',
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
                    {
                      path: '/sysmanage/deptmanage',
                      icon: 'cluster',
                      name: '组织管理',
                      component: './SysManage/DeptManage',
                    },
                    {
                      path: '/sysmanage/dropdownvalueset',
                      icon: 'cluster',
                      name: '数据字典',
                      component: './SysManage/DropdownValueset',
                    },
                    {
                      // 采控管理
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
                    {
                      path: '/sysmanage/processmanagement',
                      name: '流程管理',
                      icon: 'smile',
                      routes: [
                        // {
                        //   path:'/sysmanage/processmanagement',
                        //   redirect:'/sysmanage/processmanagement/processmodel'
                        // },
                        {
                          path: '/sysmanage/processmanagement/processmodel',
                          name: '流程模型',
                          icon: 'smile',
                          component: './SysManage/ProcessManagement/ProcessModel',
                        },
                        {
                          path: '/sysmanage/processmanagement/modeledit/:id',
                          name: '编辑模型',
                          icon: 'smile',
                          component: './SysManage/ProcessManagement/ModelEdit',
                        },
                        {
                          path: '/sysmanage/processmanagement/processdefinition',
                          name: '流程定义',
                          icon: 'smile',
                          component: './SysManage/ProcessManagement/ProcessDefinition',
                        },
                      ],
                    },
                    {
                      path: '/sysmanage/expressionsmanage',
                      name: '常用语管理',
                      icon: 'smile',
                      component: './SysManage/Expressionsmanage',
                    },
                    {
                      path: '/sysmanage/disabledusermanage',
                      name: '报障用户管理',
                      icon: 'smile',
                      component: './SysManage/DisableduserManage',
                    },
                    {
                      path: '/sysmanage/timerule',
                      name: '短信维护',
                      icon: 'smile',
                      routes: [
                        {
                          path: '/sysmanage/timerule/rules',
                          name: 'ITSM超时规则',
                          icon: 'smile',
                          component: './SysManage/TimeRule',
                        },
                        {
                          path: '/sysmanage/timerule/orderday',
                          name: '工作日程',
                          icon: 'smile',
                          component: './SysManage/TimeRule/OrderDay',
                        },
                      ],
                    },
                    {
                      path: '/sysmanage/testenvironmentmanage',
                      name: '测试环境管理',
                      icon: 'smile',
                      component: './SysManage/TestEnvironmentManage',
                    },
                  ],
                },
                {
                  component: './404',
                },
                {
                  component: './500',
                },
              ],
            },
            {
              component: './404',
            },
            {
              component: './500',
            },
          ],
        }
      ]
    },
    {
      component: './404',
    },
    {
      component: './500',
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
      target: ' http://172.16.10.33:9901/', // 登录
      changeOrigin: true,
    },
    '/upms/': {
      target: ' http://172.16.10.33:9901/', // 用户管理
      changeOrigin: true,
    },
    '/auto/': {
      target: ' http://172.16.10.33:9901/', // 软件启停
      // target: 'http://172.16.10.11:9901/',
      changeOrigin: true,
    },
    '/monitor/': {
      target: ' http://172.16.10.109:9901/', // 计量业务监控
      changeOrigin: true,
    },
    '/inspection/': {
      target: 'http://172.16.10.109:8083/', //  巡检
      changeOrigin: true,
      pathRewrite: { '^/inspection': '' },
    },
    '/wholeNet/': {
      target: 'http://10.172.210.132:8083', //  网级巡检
      changeOrigin: true,
      pathRewrite: { '^/wholeNet': '' },
    },
    '/basicMonitor/': {
      // 检测管理，基础平台
      target: 'http://172.16.10.33:8889/',
      changeOrigin: true,
    },
    '/activiti/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    // '/activiti': {
    //   target: 'http://172.16.10.179:9901/',
    //   changeOrigin: true,
    // },
    '/modeler/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    // ITSM通用接口
    '/common/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    // 事件管理,问题，故障
    '/event/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    // 问题管理
    '/problem/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    // 故障管理
    '/trouble/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    // 需求管理
    '/demand/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    // 作业计划
    '/operation/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    // 工作督办
    '/work/': {
      target: ' http://172.16.10.33:9901/',
      changeOrigin: true,
    },
    '/api/': {
      target: 'http://localhost:8000/', // mock接口数据
      changeOrigin: true,
    },
    '/sys/': {
      target: ' http://172.16.10.33:9901/', // 数据字典
      changeOrigin: true,
    },
    '/check/': {
      target: ' http://172.16.10.33:9901/', // 数据字典
      changeOrigin: true,
    },
    '/regist/': {
      target: 'http://172.16.10.33:9901/', // 人员进出管理-人员进出登记
      changeOrigin: true
    },
    '/report/': {
      target: 'http://172.16.10.33:9901/',
      changeOrigin: true
    },
    '/image/': {
      target: 'http://172.16.10.33:9901/',
      changeOrigin: true
    },
    '/knowledge/': {
      target: 'http://172.16.10.33:9901/',
      changeOrigin: true
    },
    '/release/': {
      target: 'http://172.16.10.132:9901/',        // 发布管理
      changeOrigin: true
    },
    '/lasting/': {
      target: 'http://172.16.10.33:9901/',        // 自动化运维
      changeOrigin: true
    },
    '/quality/': {
      target: 'http://172.16.10.33:9901/',
      changeOrigin: true
    },
  },
};
