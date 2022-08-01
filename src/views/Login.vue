<template>
  <div class="login-panel">
    <el-form
      ref="ruleFormRef"
      :model="loginForm"
      :rules="loginFormRules"
      label-position="top"
      label-width="80px"
      size="large"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="loginForm.account" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" :show-password="true" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
    </el-form>
		<div>
			<el-checkbox v-model="loginForm.rember" label="记住我" />
			<el-button type="primary" style="width:100%" @click="login">登录</el-button>
		</div>
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
    })
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
    })
    /**登录 */
    const login = async () => {
			//@ts-ignore
      let result = await axios.post("/admin/login", {
        account: loginForm.account,
        password: loginForm.password,
      });
      if (result.data.code == 200) {
        adminStore.token = result.data.data.token;
        adminStore.account = result.data.data.account;
        adminStore.id = result.data.data.id;

        //把数据存储到localStorage
        if (loginForm.rember) {
          localStorage.setItem("account", loginForm.account);
          localStorage.setItem("password", loginForm.password);
					//@ts-ignore
          localStorage.setItem("rember", loginForm.rember ? 1 : 0);
        }
        router.push("/dashboard/article");
        ElMessage.success("登录成功");
      } else {
        ElMessage.error("登录失败");
      }
    };
    return {
      ruleFormRef,
      loginFormRules,
			loginForm,
      login
    };
  },
});
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
