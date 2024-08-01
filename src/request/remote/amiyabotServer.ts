import HttpRequest from '@/lib/http'
import { StringDict } from '@/lib/common'

export const amiyaBotServerHost = 'https://server.amiyabot.com:10001'
export const uploadPluginUrl = amiyaBotServerHost + '/uploadPlugin'

export const amiyaBotServer = new HttpRequest({
    host: amiyaBotServerHost
})

export async function commitToCustomShop (data: StringDict) {
    return await amiyaBotServer.post({
        url: '/commitPlugin',
        data
    })
}

export async function getCustomPluginShop () {
    return await amiyaBotServer.post({
        url: '/getPlugins'
    })
}

export async function delCustomPlugin (data: StringDict) {
    return await amiyaBotServer.post({
        url: '/deletePlugin',
        data
    })
}

export async function getHistoryVersion (data: StringDict) {
    return await amiyaBotServer.get({
        url: '/getHistoryVersion',
        data: {
            plugin_id: data.plugin_id
        }
    })
}

export async function recordInstalledCount (data: StringDict) {
    await amiyaBotServer.post({
        url: '/recordInstalledCount',
        data
    })
}

export async function getBotCommunity () {
    return await amiyaBotServer.get({
        url: '/getBotCommunity'
    })
}
