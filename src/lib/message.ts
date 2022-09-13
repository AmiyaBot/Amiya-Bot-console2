import {
    ElMessage as Message,
    ElMessageBox as MessageBox,
    ElNotification as Notification
} from 'element-plus'

type NoticeTypes = 'success' | 'info' | 'warning' | 'error'
type Callback = () => void

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

    static async alert (text: string, title = '提示', callback: Callback, type: NoticeTypes = 'info') {
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
        return !!await MessageBox
            .confirm(text, title,
                {
                    confirmButtonText: button[0],
                    cancelButtonText: button[1],
                    distinguishCancelAndClose: true,
                    type: type
                }
            )
    }

    static async prompt (text: string, title = '提示') {
        return !!await MessageBox
            .prompt(text, title,
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }
            )
    }
}
