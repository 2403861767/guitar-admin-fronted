<template>
    <div>
        <div style="display: flex">
            <div style="flex: 1">
                <el-input v-model="searchText" style="width: 200px" size="middle"
                          placeholder="请输入搜索关键字"
                          :prefix-icon="Search"
                          @clear="removeAll" @change="searchUser" clearable/>
            </div>
            <div>
                <el-button @click="doAdd" type="primary">添加用户</el-button>
            </div>
        </div>
        <el-table :data="userList" style="width: 100%;margin-top: 20px;" border>
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column prop="userAccount" label="账号"/>
            <el-table-column prop="userName" label="昵称"/>
            <el-table-column prop="age" label="年龄"/>
            <el-table-column prop="gender" label="性别"/>
            <el-table-column prop="userStatus" label="状态"/>
            <el-table-column prop="userRole" label="角色"/>
            <el-table-column prop="operation" label="操作" width="200">
                <template #default="scope">
                    <el-button @click="showDetail(scope.row.id)" link size="large">详细</el-button>
                    <el-button @click="doUpdate(scope.row)" link type="primary" size="large">修改</el-button>
                    <el-popconfirm @confirm="del(scope.row.id)" title="确定删除吗">
                        <template #reference>
                            <el-button link type="danger" size="large">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-popconfirm @confirm="ban(scope.row.id)" title="确定封号吗">
                        <template #reference>
                            <el-button link type="danger" size="large">封号</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>

        </el-table>
        <!--         分页-->
        <el-pagination
                style="justify-content: center;margin-top: 20px;"
                v-model:current-page="current"
                v-model:page-size="pageSize"
                background
                layout="prev, pager, next, total"
                :total="total"
                @current-change="handleCurrentChange"
        />
        <!--编辑或者添加 的对话框-->
        <el-dialog
                v-model="dialogVisible"
                :title="`${addOrUpdate}用户`"
                width="30%"
        >
            <el-form :model="formData" ref="formRef">
                <el-form-item prop="userAccount" label="账号">
                    <el-input v-model="formData.userAccount" autocomplete="off"/>
                </el-form-item>
                <el-form-item prop="gender" label="性别">
                    <el-select v-model="formData.gender" placeholder="请选择性别">
                        <el-option label="男" value="男"/>
                        <el-option label="女" value="女"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="age" label="年龄">
                    <el-input v-model="formData.age"/>
                </el-form-item>
                <el-form-item prop="userRole" label="角色">
                    <el-select v-model="formData.userRole" placeholder="请选择角色">
                        <el-option label="普通用户" value="user"/>
                        <el-option label="制谱师" value="genealogist"/>
                        <el-option label="分享者" value="sharer"/>
                        <el-option label="管理员" value="admin"/>
                        <el-option label="超级管理员" value="superAdmin"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addOrUpdate==='修改'" prop="userName" label="昵称">
                    <el-input v-model="formData.userName" autocomplete="off"/>
                </el-form-item>
                <el-form-item v-if="addOrUpdate==='修改'" prop="userStatus" label="状态">
                    <el-select v-model="formData.userStatus" placeholder="请选择用户状态">
                        <el-option label="正常" value="正常"/>
                        <el-option label="会员" value="会员"/>
                        <el-option label="封禁" value="封禁"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addOrUpdate==='修改'" prop="userProfile" label="描述">
                    <el-input v-model="formData.userProfile" :autosize="{ minRows: 2, maxRows: 4 }"
                              type="textarea"/>
                </el-form-item>
                <!--                TODO 头像-->
            </el-form>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="doCancel">取消</el-button>
        <el-button type="primary" @click="doConfirm">
          确定
        </el-button>
      </span>
            </template>
        </el-dialog>

        <!--        抽屉/遮罩层-->
        <a-drawer
                v-model:visible="visible"
                class="custom-class"
                style="color: red"
                title="详细信息"
                placement="right"
                width="500px"
                @after-visible-change="afterVisibleChange"
        >
            <div style="font-size: 20px">
                <div>
                    <span>头像：</span>

                    <a-image-preview-group>
                        <a-image v-if="detailUser.userAvatar!=null" :width="200" :src="detailUser.userAvatar"/>
                        <a-image
                            v-else
                            :width="200"
                            :height="200"
                            src="https://www.antdv.com/#error"
                            fallback="data:image/png;base64,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"
                        />
                    </a-image-preview-group>
                    <!--                    <a-avatar :size="64">-->
                    <!--                        <template #icon>-->
                    <!--                            <UserOutlined/>-->
                    <!--                        </template>-->
                    <!--                    </a-avatar>-->
                </div>
                <div style="margin-top: 20px;">
                    <span>账号：</span>
                    <span>{{detailUser.userAccount}}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>昵称：</span>
                    <span>{{ detailUser.userName }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>年龄：</span>
                    <span>{{ detailUser.age }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>性别：</span>
                    <span>{{ detailUser.gender }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>角色：</span>
                    <span>{{ detailUser.userRole }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>状态：</span>
                    <span>{{ detailUser.userStatus }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>创建时间：</span>
                    <span>{{ detailUser.createTime}}</span>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script lang="ts" setup>
import {Search, UserOutined} from '@element-plus/icons-vue'
import {computed, onMounted, reactive, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {FormInstance, message} from "ant-design-vue";
import {UserOutlined} from "@ant-design/icons-vue";

const visible = ref(false)
const addOrUpdate = ref('添加')
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const userList = ref([])
const formData = reactive({
    id: 0,
    userAccount: "",
    gender: "",
    age: 20,
    userRole: "user",
    userName: "",
    userStatus: '正常',
    userProfile: "",
})


// 分页
const searchText = ref('')
const total = ref(0);
const current = ref(1)
const pageSize = ref(15)
// 分页参数
const params = {
    current: current.value,
    pageSize: pageSize.value,
    searchText: searchText.value,
}
// 分页
const handleCurrentChange = async (val) => {
    current.value = val
    params.current = val
    // console.log("current ->", current.value)
    // console.log("params.current -> ", params.current)
    await getUserList()
}
const searchUser = async (value) => {
    params.current = 1
    current.value = 1
    searchText.value = value
    params.searchText = value
    await getUserList()
}
// 重置查询
const removeAll = async () => {
    params.current = 1
    current.value = 1
    searchText.value = ''
    params.searchText = ''
    await getUserList()
}
// 分页查询
const getUserList = async () => {
    const res = await myAxios.post('/user/list/page', params)
    if (res.code === 0) {
        userList.value = res.data.userList
        total.value = res.data.total
        message.success('获取数据成功')
    } else {
        message.error("获取数据失败")
    }
}
// 只能在测试阶段用
const getAllList = async () => {
    const res = await myAxios.get('/user/list')
    if (res.code === 0) {
        message.success('获取数据成功')
        userList.value = res.data
    } else {
        message.error("获取数据失败")
    }
}

// 新增或者更新
// 新增操作
const doAdd = () => {
    dialogVisible.value = true
    addOrUpdate.value = '添加'
}
const doUpdate = async (row) => {
    console.log('row ->', row)
    dialogVisible.value = true
    addOrUpdate.value = '修改'
    const tempUser = row
    formData.id = tempUser.id
    formData.age = tempUser.age
    formData.userRole = tempUser.userRole
    formData.userAccount = tempUser.userAccount
    formData.userName = tempUser.userName
    formData.gender = tempUser.gender
    formData.userProfile = tempUser.userProfile
    if (tempUser.userStatus === 0) {
        formData.userStatus = '正常'
    } else if (tempUser.userStatus === 1) {
        formData.userStatus = '会员'
    } else {
        formData.userStatus = '封号'
    }
}
const doConfirm = async () => {
    // 新增参数
    const addRequest = reactive({
        userAccount: formData.userAccount,
        gender: formData.gender,
        age: formData.age,
        userRole: formData.userRole
    })
    // 修改参数
    const tempUserStatus = ref(0)
    if (formData.userStatus === '正常') {
        tempUserStatus.value = 0
    } else if (formData.userStatus === '会员') {
        tempUserStatus.value = 1
    } else {
        tempUserStatus.value = 2
    }
    const updateRequest = reactive({
        id: formData.id,
        userAccount: formData.userAccount,
        gender: formData.gender,
        age: formData.age,
        userRole: formData.userRole,
        userName: formData.userName,
        userStatus: tempUserStatus.value,
        userProfile: formData.userProfile
    })
    // 1. 判断是新增还是删除
    if (addOrUpdate.value === '添加') {
        const res = await myAxios.post('/user/add', addRequest)
        if (res.code === 0) {
            message.success('添加成功')
            doCancel()
            // dialogVisible.value = false
            // // 清空表单
            // formRef.value?.resetFields()
            await removeAll()
        } else {
            message.error('添加失败')
        }
    } else {
        const res = await myAxios.post('/user/update', updateRequest)
        if (res.code === 0) {
            message.success('修改成功')
            doCancel()
            // dialogVisible.value = false
            // // 清空表单
            // formRef.value?.resetFields()
            await removeAll()
        } else {
            message.error('修改失败')
        }
    }
}
// 取消表单
const doCancel = () => {
    dialogVisible.value = false
    // 清空表单
    // resetForm(formRef.value)
    formRef.value?.resetFields()
}
// 删除用户
const del = async (id) => {
    const deleteRequest = reactive({
        id: id
    })
    const res = await myAxios.post('/user/delete', deleteRequest)
    if (res.code === 0) {
        message.success('删除成功!')
        await removeAll()
    } else {
        message.error('删除失败!')
    }

}
// 封禁用户
const ban = async (id) => {
    const deleteRequest = reactive({
        id: id
    })
    const res = await myAxios.post('/user/ban', deleteRequest)
    if (res.code === 0) {
        message.success('封号成功!')
        await removeAll()
    } else {
        message.error('封号失败!')
    }

}

// 用户详情
const detailUser = ref({})
/**
 * 显示用户详细信息
 */
const showDetail = async (id) => {
    visible.value = true
    const res = await myAxios.get('/user/get/' + id)
    if (res.code === 0) {
        detailUser.value = res.data
        if (detailUser.value.userStatus === 0){
            detailUser.value.userStatus = '正常'
        }else if (detailUser.value.userStatus === 1){
            detailUser.value.userStatus = '会员'
        }else {
            detailUser.value.userStatus = '封禁'
        }
        message.success('获取成功!')
        console.log(detailUser.value)
    }else {
        message.error('获取失败!')
    }
}
onMounted(async () => {
    await getUserList()

})
</script>

<style lang="less" scoped>

</style>