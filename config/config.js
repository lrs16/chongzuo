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
                      name: '事件详情',
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
                      path: '/ITSM/problemmanage/besolveddetail/workorder/:id',
                      name: '问题工单',
                      icon: 'cloud-server',
                      component: './ITSM/Problemmanage/Workorder',
                    },
                    {
                      path: '/ITSM/problemmanage/querydetail/:id/queryworkdetail',
                      name: '问题查询',
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
                      name: '需求详情',
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
                      path: '/ITSM/faultmanage/todolist/record/:id',
                      name: '待办详情',
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
                      path: '/ITSM/faultmanage/querylist/record/:id',
                      name: '查询详情',
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
                  path: '/ITSM/onsitemanage',
                  name: '巡检管理',
                  icon: 'control',
                  component: './ITSM/OnSitemanage',
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
                      name: '短信规则',
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
      target: ' http://172.16.4.211:9901/', // 登录
      changeOrigin: true,
    },
    '/upms/': {
      target: ' http://172.16.4.211:9901/', // 用户管理
      changeOrigin: true,
    },
    '/auto/': {
      target: ' http://172.16.4.211:9901/', // 软件启停
      // target: 'http://172.16.4.211:9901/',
      changeOrigin: true,
    },
    '/monitor/': {
      target: ' http://172.16.4.211:9901/', // 计量业务监控
      changeOrigin: true,
    },
    '/inspection/': {
      target: 'http://172.16.4.93:8083/', //
      changeOrigin: true,
      pathRewrite: { '^/inspection': '' },
    },
    '/basicMonitor/': {
      // 检测管理，基础平台
      target: 'http://172.16.4.211:8889/',
      changeOrigin: true,
    },
    '/activiti/': {
      target: ' http://172.16.4.211:9901/',
      changeOrigin: true,
    },
    // '/activiti': {
    //   target: 'http://172.16.4.179:9901/',
    //   changeOrigin: true,
    // },
    '/modeler/': {
      target: ' http://172.16.4.211:9901/',
      changeOrigin: true,
    },
    // ITSM通用接口
    '/common/': {
      target: ' http://172.16.4.211:9901/',
      changeOrigin: true,
    },
    // 事件管理,问题，故障
    '/event/': {
      target: ' http://172.16.4.211:9901/',
      changeOrigin: true,
    },
    // 问题管理
    '/problem/': {
      target: ' http://172.16.4.211:9901/',
      changeOrigin: true,
    },
    // 故障管理
    '/trouble/': {
      target: ' http://172.16.4.211:9901/',
      changeOrigin: true,
    },
    // 需求管理
    '/demand/': {
      target: ' http://172.16.4.211:9901/',
      changeOrigin: true,
    },
    '/api/': {
      target: 'http://localhost:8000/', // mock接口数据
      changeOrigin: true,
    },
    '/sys/': {
      target: ' http://172.16.4.211:9901/', // 数据字典
      changeOrigin: true,
    },
  },
};
