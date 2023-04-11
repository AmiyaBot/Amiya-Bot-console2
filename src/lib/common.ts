interface StringDict {
    [key: string]: any
}

type DictArray = Array<StringDict>

export {
    StringDict,
    DictArray
}

export default class Common {
    static setData (name: string, data: any) {
        let dataStr = null
        if (typeof data === 'object') {
            dataStr = JSON.stringify(data)
        }
        if (typeof data === 'string' || typeof data === 'number') {
            dataStr = data.toString()
        }
        if (dataStr) {
            localStorage.setItem('amiya-' + name, dataStr)
        }
    }

    static getData (name: string) {
        let data = localStorage.getItem('amiya-' + name)
        if (data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
            }
            return data
        }
    }

    static removeData (name: string) {
        localStorage.removeItem('amiya-' + name)
    }

    static correctDate (value: Date | number | string, onInvalid?: () => Date): Date {
        if (value.constructor === Date) {
            return value
        }
        if (value.constructor === Number && value.toString().length < 13) {
            value = value * 1000
        }
        const result = new Date(value)

        if (result.toString() === 'Invalid Date') {
            if (onInvalid) {
                return onInvalid()
            }
            return new Date()
        }

        return result
    }

    static formatDate (value: Date | number | string, format = 'y-m-d h:i:s') {
        const date = this.correctDate(value)

        const zero = (num: number) => parseInt(String(num)) < 10 ? '0' + num : num
        const contrast: StringDict = {
            y: date.getFullYear(),
            m: zero(date.getMonth() + 1),
            d: zero(date.getDate()),
            h: zero(date.getHours()),
            i: zero(date.getMinutes()),
            s: zero(date.getSeconds())
        }

        for (const n in contrast) {
            format = format.replace(new RegExp(n, 'g'), contrast[n])
        }

        return format
    }

    static deepCopy (obj: any) {
        return JSON.parse(JSON.stringify(obj))
    }

    static async sleep (sec: number) {
        return new Promise(resolve => {
            setTimeout(resolve, sec * 1000)
        })
    }
}
