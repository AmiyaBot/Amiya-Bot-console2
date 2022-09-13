import HttpRequest from '@/lib/http'
import { StringDict } from '@/lib/common'

const request = new HttpRequest()

export async function getGachaList (data: StringDict) {
    return await request.post({
        url: '/gacha/getPool',
        data
    })
}

export async function submitGacha (data: StringDict) {
    return await request.post({
        url: data.id ? '/gacha/updatePool' : '/gacha/addPool',
        data
    })
}

export async function delGacha (data: StringDict) {
    return await request.post({
        url: '/gacha/deletePool',
        data
    })
}

export async function syncPool () {
    return await request.get({
        url: '/gacha/syncPool'
    })
}
