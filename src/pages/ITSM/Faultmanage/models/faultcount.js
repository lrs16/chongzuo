import {
    queryfaultWorkoderCount, // 数据字典相关字段统计故障工单
    queryfaultWorkoderCount1,
    querycountdownload,
    addTroubleReport,
    saveTroubleReport,
    submitTroubleReport,
    createQualityByMainId
} from '../services/api';

export default {
    namespace: 'faultcount',

    state: {
        faultWorkoderCountList: [], // 数据字典相关字段统计故障工单
        troubleReportdetail:[]
    },

    effects: {
        // 获取数据字典相关字段统计故障工单数据
        *getfaultWorkoderCount({ payload: { pageNum, pageSize, dictType } }, { call, put }) {
            const response = yield call(queryfaultWorkoderCount, pageNum, pageSize, dictType);
            yield put({
                type: 'faultWorkoderCountList',
                payload: response,
            });
        },

        *getfaultWorkoderCount1({ payload: { pageNum, pageSize, dictType, values } }, { call, put }) {
            const response = yield call(queryfaultWorkoderCount1, pageNum, pageSize, dictType, values);
            yield put({
                type: 'faultWorkoderCountList',
                payload: response,
            });
        },

        // 故障待办列表数据 下载
        *faultcountdownload({ payload: { current, pageSize, values, dictType } }, { call }) {
            return yield call(querycountdownload, current, pageSize, values, dictType);
        },

        *addtroubleReport({ payload:{ mainId }}, { call, put }) {
          const response = yield call(addTroubleReport, mainId);
          yield put({
              type: 'troubleReportdetail',
              payload: response,
          });
      },
      //  保存生成报告
      *saveReport({ payload }, { call }) {
        return yield call(saveTroubleReport, payload);
      },
      //  提交
      *submitReport({ payload }, { call }) {
        return yield call(submitTroubleReport, payload);
      },

      *createQualityByMainId({ payload }, { call }) {
        return yield call(createQualityByMainId, payload)
      }
    },

    reducers: {
        // 数据字典相关字段统计故障工单
        faultWorkoderCountList(state, action) {
            return {
                ...state,
                faultWorkoderCountList: action.payload.data
            }
        },
        troubleReportdetail(state, action) {
            return {
                ...state,
                troubleReportdetail: action.payload
            }
        },
    },
};
