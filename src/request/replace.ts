import HttpRequest from '@/lib/http'
import { StringDict } from '@/lib/common'

const request = new HttpRequest()

export async function getReplaceList (data: StringDict) {
    return await request.post({
        url: '/replace/getReplace',
        data
    })
}

export async function updateReplace (data: StringDict) {
    return await request.post({
        url: '/replace/updateReplace',
        data
    })
}

export async function addReplace (data: StringDict) {
    return await request.post({
        url: '/replace/addReplace',
        data
    })
}

export async function delReplace (data: StringDict) {
    return await request.post({
        url: '/replace/deleteReplace',
        data
    })
}

export async function getReplaceSettingList () {
    return await request.get({
        url: '/replace/getReplaceSetting'
    })
}

export async function addReplaceSetting (data: StringDict) {
    return await request.post({
        url: '/replace/addReplaceSetting',
        data
    })
}

export async function delReplaceSetting (data: StringDict) {
    return await request.post({
        url: '/replace/deleteReplaceSetting',
        data
    })
}

export async function syncReplace () {
    return await request.get({
        url: '/replace/syncReplace'
    })
}
