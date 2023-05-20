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
                <el-button @click="doAdd" type="primary">添加谱子</el-button>
            </div>
        </div>
        <el-table :data="musicList" style="width: 100%;margin-top: 20px;" border>
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column prop="musicName" label="音乐名"/>
            <el-table-column prop="singer" label="歌手"/>
            <el-table-column show-overflow-tooltip prop="musicDescription" label="描述"/>
            <el-table-column prop="difficult" label="难度"/>
            <el-table-column prop="price" label="价格"/>
            <el-table-column prop="createUser" label="创建人"/>
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag
                            :type="scope.row.status === '待审核' ? '' : scope.row.status === '审核通过'?'success':scope.row.status === '审核未通过'?'danger': ''"
                            disable-transitions
                    >{{ scope.row.status }}
                    </el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="250">
                <template #default="scope">
                    <el-button @click="showDetail(scope.row.id)" link size="large">详细</el-button>
                    <el-button @click="doUpdate(scope.row)" link type="primary" size="large">修改</el-button>
                    <el-popconfirm @confirm="del(scope.row.id)" title="确定删除吗">
                        <template #reference>
                            <el-button link type="danger" size="large">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-popconfirm @confirm="examine(scope.row.id)" title="确定通过吗">
                        <template #reference>
                            <el-button link type="danger" size="large">审核通过</el-button>
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
                :title="`${addOrUpdate}谱子`"
                width="30%"
        >
            <el-form :model="formData" ref="formRef">
                <el-form-item prop="musicName" label="音乐名">
                    <el-input v-model="formData.musicName" autocomplete="off"/>
                </el-form-item>
                <el-form-item prop="singer" label="歌手">
                    <el-input v-model="formData.singer" autocomplete="off"/>
                </el-form-item>
                <el-form-item prop="price" label="价格">
                    <el-input v-model="formData.price"/>
                </el-form-item>
                <el-form-item prop="difficult" label="难度">
                    <el-input v-model="formData.difficult"/>
                </el-form-item>
                <el-form-item  prop="status" label="状态">
                    <el-select v-model="formData.status" placeholder="请选择用户状态">
                        <el-option label="待审核" value="待审核"/>
                        <el-option label="审核通过" value="审核通过"/>
                        <el-option label="审核未通过" value="审核未通过"/>
                    </el-select>
                </el-form-item>
                <el-form-item  prop="musicDescription" label="描述">
                    <el-input v-model="formData.musicDescription" :autosize="{ minRows: 2, maxRows: 4 }"
                              type="textarea"/>
                </el-form-item>
                <!--                TODO 谱子图片-->
                <el-form-item v-if="addOrUpdate === '添加'" prop="imgUrl" label="上传谱子">
                    <van-uploader v-model="imgUrlList" :max-count="5" multiple  :after-read="afterRead" />
                </el-form-item>
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
<!--详情页面-->
        <!--        抽屉/遮罩层-->
        <a-drawer
                v-model:visible="visible"
                class="custom-class"
                style="color: red"
                title="详细信息"
                placement="right"
                width="500px"
        >
            <div style="font-size: 20px">
                <div>
                    <span>音乐名：</span>
                    <span>{{ detailMusic.musicName }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>歌手：</span>
                    <span>{{ detailMusic.singer }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>描述：</span>
                    <span>{{ detailMusic.musicDescription }}</span>
                </div>
                <div  style="margin-top: 20px;">
                    <span>谱子：</span>
<!--                    TODO 待完善-->
<!--                    <span v-if="imgList.value=={}">暂无谱子</span>-->
                       <a-image
                           v-for="item in imgList"
                           :width="80"
                           :src="item"
                           :preview="item"
                       />
                </div>
                <div style="margin-top: 20px;">
                    <span>难度：</span>
                    <span>{{ detailMusic.difficult }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>价格：</span>
                    <span>{{ detailMusic.price }}元</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>创建人：</span>
                    <span>{{ detailMusic.createUser }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>状态：</span>
                    <span>{{ detailMusic.status }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>创建时间：</span>
                    <span>{{ detailMusic.createTime }}</span>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script lang="ts" setup>
import {Search} from '@element-plus/icons-vue'
import {computed, onMounted, reactive, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {FormInstance, message} from "ant-design-vue";
import {UserOutlined} from "@ant-design/icons-vue";

const visible = ref(false)
const addOrUpdate = ref('添加')
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const musicList = ref([])
const formData = reactive({
    id: 0,
    musicName: "",
    musicDescription: "",
    singer: "",
    price: 0.00,
    difficult: 0,
    status: '待审核',
    imgUrls: [],
})


// 分页
const searchText = ref('')
const total = ref(0);
const current = ref(1)
const pageSize = ref(10)
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
    await getMusicList()
}
const searchUser = async (value) => {
    params.current = 1
    current.value = 1
    searchText.value = value
    params.searchText = value
    await getMusicList()
}
// 重置查询
const removeAll = async () => {
    params.current = 1
    current.value = 1
    searchText.value = ''
    params.searchText = ''
    await getMusicList()
}
// 分页查询
const getMusicList = async () => {
    const res = await myAxios.post('/music/list/page', params)
    if (res.code === 0) {
        // musicList.value = res.data.musicList
        let tempList = res.data.musicList
        tempList.forEach((item) => {
            if (item.status == 0) {
                item.status = '待审核'
            } else if (item.status == 1) {
                item.status = '审核通过'
            } else {
                item.status = '审核未通过'
            }
        })
        musicList.value = tempList
        total.value = res.data.total
        message.success('获取数据成功')
    } else {
        message.error("获取数据失败")
    }
}
// 只能在测试阶段用
// const getAllList = async () => {
//     const res = await myAxios.get('/user/list')
//     if (res.code === 0) {
//         message.success('获取数据成功')
//         userList.value = res.data
//     } else {
//         message.error("获取数据失败")
//     }
// }

// 新增或者更新
// 新增操作

// 上传谱子
const imgUrlList = ref([])
const imgUrls = ref([])
const afterRead =async (file) => {
    // 此时可以自行将文件上传至服务器
    console.log('afterRead',file);
    const res = await myAxios.post('/oss/upload',file, {
        headers: {"Content-Type": "multipart/form-data"}
    })
    if (res.code === 0){
        imgUrls.value.push(res.data)
        console.log( ' imgUrlList -> ',imgUrlList.value)
    }


};


const doAdd = () => {
    dialogVisible.value = true
    addOrUpdate.value = '添加'
}
const doUpdate =  async (row) => {
    console.log('row ->', row)
    dialogVisible.value = true
    addOrUpdate.value = '修改'
    const tempUser = row
    formData.id = tempUser.id
    formData.musicName = tempUser.musicName
    formData.musicDescription = tempUser.musicDescription
    formData.singer = tempUser.singer
    formData.price = tempUser.price
    formData.difficult = tempUser.difficult
    formData.status = row.status
    // const res = await myAxios.get('/music/get/' + row.id)
    // if (res.code === 0) {
    //     detailMusic.value = res.data
    //     imgList.value = res.data.imgUrls
    //     console.log('imgList.value',imgList.value)
    // } else {
    //     message.error('获取失败!')
    // }
}
const doConfirm = async () => {
    // 新增参数
    formData.imgUrls = imgUrls.value
    // 修改参数
    const tempUserStatus = ref(0)
    if (formData.status === '待审核') {
        tempUserStatus.value = 0
    } else if (formData.status === '审核通过') {
        tempUserStatus.value = 1
    } else {
        tempUserStatus.value = 2
    }
    const addRequest = reactive({
        musicName: formData.musicName,
        musicDescription: formData.musicDescription,
        singer: formData.singer,
        difficult: formData.difficult,
        price: formData.price,
        status: tempUserStatus.value,
        imgUrls: formData.imgUrls
    })

    const updateRequest = reactive({
        id: formData.id,
        musicName: formData.musicName,
        musicDescription: formData.musicDescription,
        singer: formData.singer,
        difficult: formData.difficult,
        price: formData.price,
        status: tempUserStatus.value,
    })
    // 1. 判断是新增还是删除
    if (addOrUpdate.value === '添加') {
        const res = await myAxios.post('/music/add', addRequest)
        if (res.code === 0) {
            message.success('添加成功')
            await doCancel()
            // dialogVisible.value = false
            // // 清空表单
            // formRef.value?.resetFields()
            await removeAll()
        } else {
            message.error('添加失败')
        }
    } else {
        const res = await myAxios.post('/music/update', updateRequest)
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
    const res = await myAxios.post('/music/delete/'+id)
    if (res.code === 0) {
        message.success('删除成功!')
        await removeAll()
    } else {
        message.error('删除失败!')
    }

}


// 谱子详情
const detailMusic = ref({})
const imgList = ref()
/**
 * 显示用户详细信息
 */
const showDetail = async (id) => {
    visible.value = true
    const res = await myAxios.get('/music/get/' + id)
    if (res.code === 0) {
        detailMusic.value = res.data
        if (detailMusic.value.status === 0) {
            detailMusic.value.status = '待审核'
        } else if (detailMusic.value.status === 1) {
            detailMusic.value.status = '审核通过'
        } else {
            detailMusic.value.status = '审核未通过'
        }
        message.success('获取成功!')
        imgList.value = res.data.imgUrls
        // console.log(detailMusic.value)
        console.log('imgList.value',imgList.value)
    } else {
        message.error('获取失败!')
    }
}

// 审核通过
const examine  = async (id) => {
    const res = await myAxios.get('/music/examine/'+id)
    if (res.code === 0){
        await getMusicList()
        message.success('审核通过!')
    }else {
        message.error('通过失败!')
    }
}
onMounted(async () => {
    await getMusicList()

})
</script>

<style lang="less" scoped>

</style>