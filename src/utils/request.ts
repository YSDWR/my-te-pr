import axios, { type InternalAxiosRequestConfig } from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

// axios.create

const requests = new Map<string, any>()
// 请求取消令牌映射
const cancelTokenMap = new Map()
const pendingRequest = new Map()

// Axios请求拦截器
// axios.interceptors.request.use(
//   (config) => {
//     // 根据config生成请求标识符
//     const requestKey = config.method + ':' + config.url

//     // 如果映射中已经有这个请求的取消令牌，取消当前请求
//     if (cancelTokenMap.has(requestKey)) {
//       cancelTokenMap.get(requestKey).cancel('重复请求已取消')
//       return Promise.reject({ isCanceled: true })
//     }

//     // 为当前请求创建一个新的取消令牌
//     const source = axios.CancelToken.source()
//     config.cancelToken = source.token

//     // 存储取消令牌到映射中
//     cancelTokenMap.set(requestKey, source)

//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// Axios响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 请求成功，从映射中删除取消令牌
    const requestKey = response.config.method + ':' + response.config.url
    cancelTokenMap.delete(requestKey)
    return response
  },
  (error) => {
    // 请求失败或被取消，从映射中删除取消令牌
    const requestKey = error.config.method + ':' + error.config.url
    if (error.isCanceled) {
      cancelTokenMap.delete(requestKey)
    }
    return Promise.reject(error)
  }
)

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // 区别请求的唯一标识，这里用方法名+请求路径+请求参数
  let requestKey = `${config?.method}|${config?.url}`
  if (config?.method === 'get') {
    if (config?.params) {
      requestKey += `|${
        config?.params === 'string' ? config?.params : JSON.stringify(config?.params)
      }`
    }
  }
  if (config?.data) {
    requestKey += `|${
      typeof config?.data === 'string' ? config?.data : JSON.stringify(config?.data)
    }`
  }

  // 找出是否存在重复请求
  if (pendingRequest.has(requestKey)) {
    // 取消上个重复的请求
    pendingRequest.get(requestKey).cancel()
    // 删除记录
    pendingRequest.delete(requestKey)
  }
  // 新建(重建)当前请求token
  const source = axios.CancelToken?.source()
  // 缓存本次请求标识
  pendingRequest.set(requestKey, {
    name: requestKey,
    cancel: source?.cancel
  })
  // 记录当前请求token，等待接口返回，删除本次记录
  config.cancelToken = source?.token

  // 如果请求的数据是对象类型，删除__component__参数
  if (typeof config?.data === 'string') {
    try {
      let _data = JSON.parse(config?.data)
      delete _data?.__component__
      config.data = JSON.stringify(_data)
    } catch (e) {
      config.data = config?.data.replace(/__component__=[^&]*&?/, '')
    }
  } else if (typeof config?.data === 'object') {
    delete config?.data?.__component__
  }

  return config
}

// axios拦截器
// axios.interceptors.request.use(requestInterceptor, (error) => {
//   return Promise.reject(error)
// })

axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.log('error:', error)
    return Promise.reject(error)
  }
)

export default axios

const pendingMap = new Map<string, Promise<any>>()
export const get = (url: string, params: any = {}) => {
  const fn = () => axios.get(url, { params })
  const requestKey = url + JSON.stringify(params)

  if (pendingMap.has(requestKey)) {
    const promise = pendingMap.get(requestKey)
    console.log('promise:', promise)
    return promise!
  }

  let _resolve: any
  let _reject: any
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  // const p = new Promise
  pendingMap.set(requestKey, promise)

  return fn()
    .then((res) => {
      setTimeout(() => {
        _resolve(res)
      })
      return res
    })
    .catch((err) => {
      setTimeout(() => {
        _reject(err)
      })
      return err
    })
    .finally(() => {
      pendingMap.delete(requestKey)
    })
}
