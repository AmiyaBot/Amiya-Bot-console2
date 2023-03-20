<template>
    <div class="main-nav">
        <div class="menu">
            <div v-for="(item, index) in indexChildren" :key="index"
                 :class="{ selected: isSelected(index) }"
                 @click="selectMenu(index)">
                <el-icon class="icon">
                    <component :is="navIcon[item.name]"></component>
                </el-icon>
                {{ navName[item.name] || item.name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { RouteRecordRaw } from 'vue-router'
import { indexChildren } from '@/router'
import {
    Monitor,
    Connection,
    DocumentCopy,
    CreditCard,
    MessageBox,
    User,
    Key,
    Setting,
    Goods,
    Link
} from '@element-plus/icons-vue'

const navName = {
    index: '控制台',
    instance: '实例管理',
    replace: '词语替换管理',
    operator: '干员管理',
    gacha: '卡池管理',
    admin: '管理员管理',
    user: '用户管理',
    config: '配置项管理',
    plugin: '插件管理',
    shop: '插件商店'
}

const navIcon = {
    index: shallowRef(Monitor),
    instance: shallowRef(Connection),
    replace: shallowRef(DocumentCopy),
    operator: shallowRef(CreditCard),
    gacha: shallowRef(MessageBox),
    admin: shallowRef(Key),
    user: shallowRef(User),
    config: shallowRef(Setting),
    plugin: shallowRef(Link),
    shop: shallowRef(Goods)
}

export {
    navName,
    navIcon
}

@Options({
    watch: {
        selected (index) {
            const item = this.indexChildren[index]

            this.$emit('onSelected', item.name)
            this.$router.push(item.path)
        }
    },
    mounted () {
        if (this.$route.name) {
            for (const index in this.indexChildren) {
                const item = this.indexChildren[index]

                if (this.$route.name === item.name) {
                    this.selected = parseInt(index)
                    break
                }
            }
        }
    }
})
export default class MainNav extends Vue {
    public selected: null | number = null

    public indexChildren: Array<RouteRecordRaw> = indexChildren

    public navName = navName
    public navIcon = navIcon

    public selectMenu (index: number): void {
        this.selected = index
    }

    public isSelected (index: number): boolean {
        return index === this.selected
    }
}
</script>

<style scoped lang="scss">
.main-nav {
    height: 100%;
    border-radius: 4px;
    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
    overflow: hidden;
}

.menu {
    display: flex;
    flex-direction: column;

    & > div {
        height: 40px;
        padding: 0 20px;
        transition: all 200ms ease-in-out;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    & > div.selected {
        color: var(--c-main);
        background: var(--c-main-light);
    }

    & > div:hover:not(.selected) {
        color: #fff;
        background: var(--c-main);
    }

    .icon {
        margin-right: 8px;
    }
}
</style>
