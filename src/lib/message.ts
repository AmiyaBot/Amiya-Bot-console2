import {
    ElMessage as Message,
    ElMessageBox as MessageBox,
    ElNotification as Notification
} from 'element-plus'

type NoticeTypes = 'success' | 'info' | 'warning' | 'error'
type Callback = () => void

function doNothing () {
    //
}

export default class Notice {
    static toast (text: string, type: NoticeTypes = 'success') {
        Message(
            {
                type: type,
                message: text
            }
        )
    }

    static notify (text: string, title = '提示', type: NoticeTypes = 'info', duration = 5000) {
        Notification(
            {
                type: type,
                title: title,
                message: text,
                duration: duration,
                dangerouslyUseHTMLString: true
            }
        )
    }

    static async alert (text: string, title = '提示', callback: Callback = doNothing, type: NoticeTypes = 'info') {
        return !!await MessageBox
            .alert(text, title,
                {
                    type: type,
                    confirmButtonText: '好的',
                    callback: callback
                }
            )
    }

    static async confirm (text: string, title = '提示', type: NoticeTypes = 'warning', button: Array<string> = ['确定', '取消']) {
        try {
            return !!await MessageBox
                .confirm(text, title,
                    {
                        confirmButtonText: button[0],
                        cancelButtonText: button[1],
                        distinguishCancelAndClose: true,
                        type: type
                    }
                )
        } catch (e) {
            return false
        }
    }

    static async prompt (text: string, title = '提示') {
        const res = await MessageBox
            .prompt(text, title,
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }
            )
        if (res) {
            return res.value
        }
    }
}
