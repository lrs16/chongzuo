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
  401: '用户没有权限，请登录',
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
    sessionStorage.clear();
    window.location.pathname = '/user/login';
  };

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    //  
    if (status === 401) {
      const resJson = response.json();
      resJson.then((res) => {
        notification.destroy();
        setTimeout(() => {
          close()
        }, 500);
        notification.error({
          message: `${status}`,
          description: res.msg,
          // onClose: close,
          duration: 4,
        });

      })
    }
    // if (status === 401) {
    //   const resJson = response.json();
    //   const arr = response.url?.split('/');
    //   resJson.then((res) => {
    //     if (arr[arr.length - 1] === 'getOverTimeNum') {
    //       notification.error({
    //         message: `${status}`,
    //         description: res.msg,
    //         //  onClose: close,
    //         duration: 2,
    //       });
    //       close();
    //     }
    //   })
    // }
    if (status >= 403 && status < 422) {
      router.push('/404');
    }
    if (status >= 500 && status <= 505) {
      notification.destroy();
      const resJson = response.json();
      resJson.then((res) => {
        notification.destroy();
        notification.error({
          message: `${status}`,
          description: res.msg || errorText,
          // onClose: close,
          duration: 4,
        });

      })
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
    // router.push('/');
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
    } if (options.requestType === 'formjosn') {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctoken}`,
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

// // 拦截返回后的特殊处理
request.interceptors.response.use((response, options) => {
  // if (response.status === 200 && options.responseType === 'blob') {
  //   // const newRes = response;
  //   console.log(response);
  //   // return new Promise((resolve, reject) => {
  //   //   newRes.json().then(res => {
  //   //     if (res.code === -1) {
  //   //       return reject();
  //   //     }
  //   //   }).catch(res => {
  //   //     return resolve(response)
  //   //   })
  //   // })
  // }
  // if(response.data.code == 1000001){
  //   console.log(response.data.msg)
  //   //通过返回的code 提示 token 过期 、token校验失败，做相应跳转
  // }
  return response;
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
