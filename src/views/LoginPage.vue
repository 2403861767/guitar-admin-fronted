<template>
    <div class="top-box">
        <div class="main-box">
            <div :class="['container', 'container-register', { 'is-txl': isLogin }]">
                <a-form
                    :model="registerForm"
                    name="registerForm"
                    ref="registerRef"
                    :rules="registerRules"
                    @finish="register"
                >
                    <h2 class="title">创建账户</h2>
                    <span class="text">注册一个账户</span>
                    <a-form-item
                        name="userAccount"
                    >
                    <a-input class="form__input"  v-model:value="registerForm.userAccount" type="text" placeholder="请输入账号"/>
                    </a-form-item>
                    <a-form-item
                        name="userPassword"
                    >
                    <a-input class="form__input" v-model:value="registerForm.userPassword" type="password" placeholder="请输入密码"/>
                    </a-form-item>
                    <a-form-item
                        name="checkPassword"
                    >
                    <a-input class="form__input" v-model:value="registerForm.checkPassword" type="password" placeholder="再次输入密码"/>
                    </a-form-item>
                    <a-form-item>
                        <a-button class="primary-btn" html-type="submit">立即注册</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div
                    :class="['container', 'container-login', { 'is-txl is-z200': isLogin }]"
            >
                <a-form
                    :model="loginForm"
                    name="loginForm"
                    ref="loginRef"
                    :rules="loginRules"
                    @finish="login"
                >
                    <h2 class="title">登录账户</h2>
                    <span class="text">登录你的账户</span>
                    <a-form-item
                        name="userAccount"
                    >
                        <a-input  class="form__input"  v-model:value="loginForm.userAccount" type="text" placeholder="请输入账号"/>
                    </a-form-item>
                    <a-form-item
                        name="userPassword"
                    >
                        <a-input class="form__input" v-model:value="loginForm.userPassword" type="password" placeholder="请输入密码"/>
                    </a-form-item>
                    <a-form-item>
                        <a-button class="primary-btn" html-type="submit">立即登录</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div :class="['switch', { login: isLogin }]">
                <div class="switch__circle"></div>
                <div class="switch__circle switch__circle_top"></div>
                <div class="switch__container">
                    <h2>{{ isLogin ? '你好,朋友 !' : '欢迎回来 !' }}</h2>
                    <p>
                        {{
                        isLogin
                            ? '输入您的个人详细信息并与我们一起开始旅程'
                            : '要使用该系统，请填写您的个人信息来登录'
                        }}
                    </p>
                    <a-button class="primary-btn" @click="isLogin = !isLogin">
                        {{ isLogin ? '立即注册' : '立即登录' }}
                    </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, message} from "ant-design-vue";
import {Rule} from "ant-design-vue/es/form";
import {useRouter} from "vue-router";
import myAxios from "../plugins/myAxios.ts";

const isLogin = ref(true)
const router = useRouter()
// 自定义校验规则
const loginRef =  ref<FormInstance>()
const registerRef =  ref<FormInstance>()
// 账号校验
let accountValidator = async (_rule: Rule, value: string) => {
    const userNamePattern = /^[a-zA-Z0-9_-]{4,16}$/;
    if (value === '') {
        return Promise.reject('账号不能为空');
    }else if (value.length < 4){
        return Promise.reject("账号不能小于4位")
    }
    else if (!userNamePattern.test(value)) {
        return Promise.reject("账号格式不符合要求");
    }else if (value.length > 16){
        return Promise.reject("账号过长")
    }
    else {
        return Promise.resolve();
    }
};
// 密码校验
let passwordValidator = async (_rule: Rule, value: string) => {
    //密码正则，最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    if (value === '') {
        return Promise.reject('密码不能为空');
    }else if (value.length < 8){
        return Promise.reject("密码不能小于8位")
    }
    else {
        return Promise.resolve();
    }
};
let checkPasswordValidator = async (_rule: Rule, value: string) => {
    //密码正则，最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    if (value === '') {
        return Promise.reject('校验密码不能为空');
    }else if (value.length < 8){
        return Promise.reject("校验密码不能小于8位")
    }else if(value!== registerForm.userPassword){
        return Promise.reject("校验密码必须与密码相同")
    }
    else {
        return Promise.resolve();
    }
};
const loginRules: Record<string, Rule[]> = {
    userAccount: [{ required: true, validator: accountValidator, trigger: 'change' }],
    userPassword: [{ required: true, validator: passwordValidator, trigger: 'change' }],
};
const registerRules: Record<string, Rule[]> = {
    userAccount: [{ required: true, validator: accountValidator, trigger: 'change' }],
    userPassword: [{ required: true, validator: passwordValidator, trigger: 'change' }],
    checkPassword: [{ required: true, validator: checkPasswordValidator, trigger: 'change' }],
};


interface loginForm{
    userAccount: string;
    userPassword: string;
}
const loginForm = reactive({
    userAccount: '',
    userPassword: '',
})

interface registerForm{
    userAccount: string;
    userPassword: string;
    checkPassword: string;
}

const registerForm = reactive({
    userAccount: '',
    userPassword: '',
    checkPassword: '',
})


const login = async () => {
    const res = await myAxios.post('/user/login',loginForm)
    if (res.code === 0){
        message.success('登录成功')
        localStorage.setItem('user',JSON.stringify(res.data))
        await router.replace('/')
    }else {
        message.error(res.message)
    }
}
// TODO 待测试
const register = async () => {
    const res = await myAxios.post('/user/register', registerForm)
    if (res.code === 0){
        message.success("注册成功")
        isLogin.value = true
    }else {
        message.error(res.message)
    }
}


</script>

<style lang="less"  scoped>
.ant-input-password {
    .ant-input {

    }
}
.top-box {
  background-color: #ecf0f3;
  height: 100vh;
}

.main-box {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  margin: auto;
  top: 10rem;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 600px;
    height: 100%;
    padding: 25px;
    background-color: #ecf0f3;
    transition: all 1.25s;

    form {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      color: #a0a5a8;

      .title {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
      }

      .text {
        margin-top: 30px;
        margin-bottom: 12px;
      }

      .form__input {
        width: 350px;
        height: 40px;
        margin: 4px 0;
        padding-left: 25px;
        font-size: 13px;
        letter-spacing: 0.15px;
        border: none;
        outline: none;
        // font-family: 'Montserrat', sans-serif;
        background-color: #ecf0f3;
        transition: 0.25s ease;
        border-radius: 8px;
        box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;

        &::placeholder {
          color: #a0a5a8;
        }
      }
    }
  }

  .container-register {
    z-index: 100;
    left: calc(100% - 600px);
  }

  .container-login {
    left: calc(100% - 600px);
    z-index: 0;
  }

  .is-txl {
    left: 0;
    transition: 1.25s;
    transform-origin: right;
  }

  .is-z200 {
    z-index: 200;
    transition: 1.25s;
  }

  .switch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 400px;
    padding: 50px;
    z-index: 200;
    transition: 1.25s;
    background-color: #ecf0f3;
    overflow: hidden;
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
    color: #a0a5a8;

    .switch__circle {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background-color: #ecf0f3;
      box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
      bottom: -60%;
      left: -60%;
      transition: 1.25s;
    }

    .switch__circle_top {
      top: -30%;
      left: 60%;
      width: 300px;
      height: 300px;
    }

    .switch__container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      width: 400px;
      padding: 50px 55px;
      transition: 1.25s;

      h2 {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
      }

      p {
        font-size: 14px;
        letter-spacing: 0.25px;
        text-align: center;
        line-height: 1.6;
      }
    }
  }

  .login {
    left: calc(100% - 400px);

    .switch__circle {
      left: 0;
    }
  }

  .primary-btn {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 50px;
    text-align: center;
    font-size: 14px;
    letter-spacing: 2px;
    background-color: #4b70e2;
    color: #f9f9f9;
    cursor: pointer;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;

    &:hover {
      box-shadow: 4px 4px 6px 0 rgb(255 255 255 / 50%),
      -4px -4px 6px 0 rgb(116 125 136 / 50%),
      inset -4px -4px 6px 0 rgb(255 255 255 / 20%),
      inset 4px 4px 6px 0 rgb(0 0 0 / 40%);
    }
  }
}
</style>

