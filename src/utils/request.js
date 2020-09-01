/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';
// import { async } from 'q';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;
  const close = () => {
    window.location.pathname = '/user/login';
  };
  const cleartoken = () => {
    // const token = sessionStorage.getItem('access_token');
    router.push('/500');
    sessionStorage.clear();
  };

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (status !== 401) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
        // onClose: close,
      });
    }

    // if (status === 500 && url === 'http://localhost:8000/api-upms/upms_user/getCurrUserInfo') {
    //   notification.error({
    //     message: '未登录或登录过期，请重新登录',
    //     onClose: close,
    //   });
    //   sessionStorage.clear();
    // }

    // if (status === 500) {
    //   notification.error({
    //     message: '登录过期，请重新登录',
    //     onClose: cleartoken,
    //   });
    // }

    if (status === 401) {
      notification.error({
        message: `登录失败`,
        description: errorText,
        onClose: close,
        duration: 0.5,
      });
    }

    if (status >= 404 && status < 422) {
      router.push('/404');
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

/**
 * 拦截器,添加token
 */
// request.interceptors.request.use((url, options) => {
//   const accessToken = localStorage.getItem("accessToken");
//   if(accessToken) {
//     // if(true) {
//     //   refreshToken();
//     // }

//     const headers = { Authorization: `Bearer ${accessToken}` };
//     return (
//       {
//         url : url,
//         options : { ...options, headers : headers }
//       }
//     )
//   }

//   return (
//     {
//       url : url,
//       options : options
//     }
//   )

// });
// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  const ctoken = sessionStorage.getItem('access_token');
  if (ctoken) {
    if (options.requestType === 'form') {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Accept: 'application/json',
        Authorization: `Bearer ${ctoken}`,
        // 'access_token': ctoken
      };
      return {
        url,
        options: { ...options, headers },
      };
    }
    const headers = {
      'Content-Type': 'application/json',
      // Accept: 'application/json',
      Authorization: `Bearer ${ctoken}`,
      // 'access_token': ctoken
    };
    return {
      url,
      options: { ...options, headers },
    };
  }
  return {
    url,
    options: { ...options },
  };
});

/**
 * 刷新token
 */
// async function refreshToken() {
//   const rq = extend({
//     credentials: 'include', // 默认请求是否带上cookie
//   });

//   const result = await rq('/server/oauth/token', {
//     method: 'POST',
//     headers: {
//       Authorization: 'Basic YWNtZToxMjM0NTY=',
//       'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
//     },
//     data:
//       'grant_type:=refresh_token&refresh_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbInNlcnZlciJdLCJhdGkiOiIzN2YyNzBhZC1iYTQzLTQ0ZjUtOTJkOC0wZTFhMTA5N2UxZTgiLCJleHAiOjE1Nzk2NTcyNDEsImF1dGhvcml0aWVzIjpbIkFETUlOIl0sImp0aSI6IjI2ZWFlYmIyLTE3MWQtNDU2Ni05MDYyLTQ2Y2FlMDIwN2VkNSIsImNsaWVudF9pZCI6ImFjbWUifQ.CfQoS37cGTZucBXQPmEyMlMpmNRsUVSGOfTjG7jjrF3V-mAPjUl9KUSVU48hWPnMc7qMpsLaqRsalI4s8jK5iEP6R97pCNL69da0pSTXy73Kj5pGzCQ5oHXwdgB18sG14QF75Wlwzt_kDoGfsobGyoacdKc4VyRtbvyKz3kQmvsyAKUT788oEdBtiEL8ty8gwkudpLBwSEquBmvTVSbsJb_WEm0DjE9P6eK3FUZOB5KoTFRlYvJ_4YTCW5A5imal6sGOFuPXAS2atknlXcblrcTfGVrSuC0SXwmMBFmyhvyjeGEyp-AY_cAb_N4axapUMiCBgDuz28VJO6NVVrUkaA',
//   });

//   if (result) {
//     sessionStorage.setItem('access_token', result.access_token);
//     sessionStorage.setItem('refresh_token', result.refresh_token);
//   }
// }

export default request;
