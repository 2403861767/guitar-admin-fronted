<template>
    <div>
        <div style="display: flex">
            <div style="flex: 1">
                <el-input v-model="searchText" style="width: 200px" size="middle"
                          placeholder="请输入搜索关键字"
                          :prefix-icon="Search"
                          @clear="removeAll" @change="searchUser" clearable />
            </div>
            <div>
                <el-button type="primary" >添加用户</el-button>
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
                    <el-button link size="large">详细</el-button>
                    <el-button link type="primary" size="large">编辑</el-button>
                    <el-button link type="danger" size="large">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination
            style="justify-content: center;margin-top: 20px;"
                v-model:current-page="current"
                v-model:page-size="pageSize"
                background
                layout="prev, pager, next, total"
                :total="total"
                @current-change="handleCurrentChange"


        />
    </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import {computed, onMounted, reactive, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {message} from "ant-design-vue";

const userList = ref([])
const searchText = ref('')
const total = ref(0);
const current = ref(1)
const pageSize = ref(15)
const params = {
    current: current.value,
    pageSize: pageSize.value,
    // TODO
    searchText: searchText.value,
}
const handleCurrentChange = async (val) => {
    current.value = val
    params.current = val
    console.log("current ->", current.value)
    console.log("params.current -> ", params.current)
    await getUserList()
}
const searchUser = async (value)=>{
    params.current = 1
    current.value = 1
    searchText.value = value
    params.searchText = value
    await getUserList()
}
const removeAll = async () =>{
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
onMounted(async () => {
    await getUserList()

})
</script>

<style lang="less" scoped>

</style>