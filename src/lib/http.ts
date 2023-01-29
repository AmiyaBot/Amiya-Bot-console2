// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Notice from '@/lib/message'
import Common from '@/lib/common'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElLoadingService } from 'element-plus'
import { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

type RequestPrototype = 'FormData'

interface RequestConfig extends AxiosRequestConfig {
    prototype?: RequestPrototype
    complete?: () => void
}

interface HttpOptions {
    host?: string
}

export class RequestCon {
    static requesting = 0
    static loadingInstance: LoadingInstance

    static loading (text = '等待服务器处理...') {
        this.requesting += 1
        this.loadingInstance = ElLoadingService(
            {
                fullscreen: true,
                text: text,
                customClass: 'v-loading'
            }
        )
    }

    static closeLoading () {
        this.requesting -= 1
        if (this.requesting === 0) {
            this.loadingInstance.close()
        }
    }
}

export default class HttpRequest {
    private instance: AxiosInstance

    constructor (options: HttpOptions = {}) {
        this.instance = axios.create(
            {
                timeout: 200000,
                withCredentials: false
            }
        )
        this.instance.interceptors.response.use(this.onResponse, this.onResponseError)
        this.instance.interceptors.request.use(conf => this.onRequest(conf, options))
    }

    onRequest (config: RequestConfig, options: HttpOptions) {
        const host = options.host || Common.getData('host')

        if (!host) {
            return undefined
        }

        config.baseURL = host
        config.headers = {
            ...{
                authKey: Common.getData('authKey') || ''
            },
            ...config.headers || {}
        }

        /**
         * 按照协议格式化 data 数据
         */
        const configData = {
            ...config.data,
            ...config.params
        }
        if (Object.keys(configData).length) {
            if (config.prototype === 'FormData') {
                const data = new FormData()
                for (const key in configData) {
                    data.append(key, configData[key])
                }
                config.data = data
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            } else {
                switch (config.method?.toLowerCase()) {
                    case 'post':
                        config.data = JSON.stringify(config.data)
                        config.headers['Content-Type'] = 'application/json'
                        break
                    case 'get':
                        config.params = configData
                        break
                }
            }
        }

        RequestCon.loading()

        return config
    }

    onResponse (response: AxiosResponse) {
        const data = response.data

        RequestCon.closeLoading()

        switch (data.code) {
            case 200:
                if (data.message) {
                    Notice.notify(data.message, '提示', 'success')
                }
                break
            case 500:
                Notice.notify(data.message, '操作未成功', 'error')
                return undefined
        }

        return data
    }

    onResponseError (error: AxiosError) {
        const response = error.response

        let errorMessage = ''
        if (response?.status) {
            errorMessage = `${response?.config.url}<br>Code: ${response?.status} ${response?.statusText}<br><span style="color: #f44336">${JSON.stringify(response?.data)}</span>`
        } else {
            errorMessage = '接口请求失败'
        }

        RequestCon.closeLoading()

        Notice.notify(errorMessage, error.code, 'error', 10000)
    }

    async request (options: RequestConfig): Promise<any> {
        return await this.instance.request(options)
    }

    async get (options: RequestConfig) {
        return await this.request({
            ...options,
            method: 'get'
        })
    }

    async post (options: RequestConfig) {
        return await this.request({
            ...options,
            method: 'post'
        })
    }
}
