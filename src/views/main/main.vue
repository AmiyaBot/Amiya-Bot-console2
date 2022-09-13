<template>
    <div class="header">
        <div class="title">
            AmiyaBot Console
            <el-tag style="margin-left: 5px" type="danger" effect="dark" size="small">Beta</el-tag>
        </div>
        <div class="options">
            <div onclick="window.open('https://www.amiyabot.com/')"><span class="icon-book"></span>文档</div>
            <div onclick="window.open('https://github.com/AmiyaBot')">
                <span class="icon-github"></span>Github
            </div>
            <div class="connect">
                <div class="status" :class="{ off: !host() }"></div>
                <div v-if="host()" style="display: flex">
                    Connected@
                    <el-link :underline="false" :href="originHost() + '/docs'" target="_blank" style="color: #fff">
                        {{ host() }}
                    </el-link>
                </div>
                <div v-else>Unconnected</div>
            </div>
        </div>
    </div>
    <div class="body" v-if="ready">
        <div class="nav-con">
            <main-nav @on-selected="name => this.name = name"></main-nav>
        </div>
        <div class="app-con">
            <div>
                <div style="font-size: 20px;display: flex;">
                    <el-icon class="icon">
                        <component :is="navIcon[name]"></component>
                    </el-icon>
                    {{ navName[name] }}
                </div>
                <div class="options-con">
                    <div class="icon bot"></div>
                    <div class="icon setting" @click="setting = true"></div>
                </div>
            </div>
            <div>
                <router-view v-slot="{ Component }">
                    <transition name="slide-fade">
                        <component :is="Component"/>
                    </transition>
                </router-view>
            </div>
        </div>

        <el-drawer v-model="setting">
            <template #header>
                <div class="setting-header">
                    <el-icon style="margin-right: 5px">
                        <Setting/>
                    </el-icon>
                    设置中心
                </div>
            </template>
            <el-card>
                <template #header>
                    <span>服务设置</span>
                </template>
                <el-form :model="settingForm" label-position="top">
                    <el-form-item label="AmiyaBot 服务地址">
                        <el-input v-model="settingForm.host" placeholder="请填写服务地址"/>
                    </el-form-item>
                    <el-form-item label="AmiyaBot 服务密匙">
                        <el-input v-model="settingForm.authKey" placeholder="请填写服务密匙" show-password/>
                    </el-form-item>
                    <el-button type="success" @click="saveServer">保存</el-button>
                    <el-button type="danger" @click="unlinkServer">注销</el-button>
                </el-form>
            </el-card>
        </el-drawer>
    </div>

    <div class="no-setting" v-else>
        <el-card class="setting-card">
            <template #header>
                <span>设置你的 AmiyaBot 服务</span>
            </template>
            <el-form :model="settingForm" label-position="top">
                <el-form-item label="AmiyaBot 服务地址">
                    <el-input v-model="settingForm.host" placeholder="请填写服务地址"/>
                </el-form-item>
                <el-form-item label="AmiyaBot 服务密匙">
                    <el-input v-model="settingForm.authKey" placeholder="请填写服务密匙" show-password/>
                </el-form-item>
            </el-form>
            <el-button type="success" @click="testAndSave">测试并连接</el-button>
        </el-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Setting } from '@element-plus/icons-vue'
import MainNav, { navName, navIcon } from '@/views/main/mainNav.vue'
import Common from '@/lib/common'
import HttpRequest from '@/lib/http'

@Options({
    components: {
        MainNav,
        Setting
    },
    methods: {
        originHost () {
            return Common.getData('host')
        },
        host () {
            return (Common.getData('host') || '')
                .replace('http://', '')
                .replace('https://', '')
        }
    },
    mounted () {
        this.ready = !!this.settingForm.host
    }
})
export default class Main extends Vue {
    public name = ''
    public navName = navName
    public navIcon = navIcon

    private ready = false
    private setting = false
    private settingForm = {
        host: Common.getData('host') || '',
        authKey: Common.getData('authKey') || ''
    }

    public async saveServer () {
        Common.setData('host', this.settingForm.host)
        Common.setData('authKey', this.settingForm.authKey)
        location.reload()
    }

    public async unlinkServer () {
        Common.removeData('host')
        Common.removeData('authKey')
        location.reload()
    }

    public async testAndSave () {
        if (!this.settingForm.host.startsWith('http')) {
            this.settingForm.host = 'http://' + this.settingForm.host
        }

        const request = new HttpRequest({
            host: this.settingForm.host
        })

        const res = await request.get({
            headers: {
                authKey: this.settingForm.authKey
            },
            url: '/bot/link'
        })

        if (res) {
            Common.setData('host', this.settingForm.host)
            Common.setData('authKey', this.settingForm.authKey)

            this.ready = true
        }
    }
}
</script>

<style scoped lang="scss" src="./main.scss"></style>
