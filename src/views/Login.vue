<template>
  <div class="container">
	<link rel='stylesheet' href='nprogress.css'/>
    <div class="content">
      <div class="login-wrapper">
        <div class="login-panel">
          <el-form
            ref="ruleFormRef"
            :model="loginForm"
            :rules="loginFormRules"
            label-position="top"
            label-width="80px"
            size="large"
          >
					<div class="login-title">派大星的后台管理系统</div>
					<div class="login-desc">欢迎回来！❤️❤️</div>
            <el-form-item label="账号" prop="account">
              <el-input v-model="loginForm.account" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                :show-password="true"
                type="password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-checkbox v-model="loginForm.rember" label="记住我" />
            <el-button type="primary" style="width: 100%;height:40px;margin-top:10px" @click="login">登录</el-button>
          </div>
        </div>
      </div>
    </div>
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="parallax">
        <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
        <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
        <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
        <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
      </g>
    </svg>
  </div>
</template>
<script lang="ts">

import { defineComponent, ref, reactive, inject, toRefs } from "vue";
import { AdminStore } from "../stores/AdminStore";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import type { ElForm } from "element-plus";
type FormInstance = InstanceType<typeof ElForm>;
interface loginFormType {
  account: string;
  password: string;
  rember: any;
}
export default defineComponent({
  name: "login",
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const ruleFormRef = ref<FormInstance>();
    const axios = inject("axios");
    const adminStore = ref<any>(AdminStore());
    /**管理员登录数据 */
    const loginForm = reactive<loginFormType>({
      account: localStorage.getItem("account") || "",
      password: localStorage.getItem("password") || "",
      //@ts-ignore
      rember: localStorage.getItem("rember") == 1 || false,
    });
    /**验证表单规则 */
    const loginFormRules = ref<object>({
      account: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 3, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" },
      ],
    });
    /**登录 */
    const login = async () => {
      //@ts-ignore
      let result = await axios.post("/admin/login", {
        account: loginForm.account,
        password: loginForm.password,
      });
      if (result.data.code == 200) {
        adminStore.value.token = result.data.data.token;
        adminStore.value.account = result.data.data.account;
        adminStore.value.id = result.data.data.id;

        //把数据存储到localStorage
        if (loginForm.rember) {
          localStorage.setItem("account", loginForm.account);
          localStorage.setItem("password", loginForm.password);
          //@ts-ignore
          localStorage.setItem("rember", loginForm.rember ? 1 : 0);
        }
        ElMessage.success("登录成功");
        router.push("/dashboard/article");
      } else {
        ElMessage.error("登录失败");
      }
    };
    return {
      ruleFormRef,
      loginFormRules,
      loginForm,
			adminStore,
      login,
    };
  },
});
</script>

<style lang="less" scoped>
.container {
  background: linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%);
	position: relative;
  .login-panel {
		.login-title {
			text-align: center;
			font-size: 24px;
			margin-bottom: 20px;
		}
		.login-desc {
			font-size: 16px;
			margin-bottom: 12px;
		}
		border-radius: 12px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
    z-index: 99;
    width: 450px;
    background: #fff;
		background: rgba(255, 255, 255, .5);
		-webkit-backdrop-filter: blur(50px);
		backdrop-filter: blur(1px);
    padding: 20px;
    box-sizing: border-box;
  }
}
.content {
  height: 65vh;
  width: 100%;
  margin: 0;
  padding: 0;
}
.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px; /* 修复 Safari 等浏览器下方空隙 */
  min-height: 100px;
  max-height: 150px;
}
.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>
