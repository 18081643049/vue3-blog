<template>
  <div class="common-header-container">
    <div class="left-side-wrapper">
    </div>
    <div class="right-side-wrapper">
      <div class="user-info">
        <el-avatar :size="32" @error="avatarErrorHandle">
          <el-icon>
            <userFilled />
          </el-icon>
        </el-avatar>
        <p class="email">{{ userName }}</p>
      </div>
      <div class="logout" @click="logOut">
        <el-icon :size="16" color="#000000"><SwitchButton /></el-icon>
        <p>{{ '退出' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessageBox } from "element-plus"

export default defineComponent({
  name: "CommonHeader",
  setup(props, ctx) {
    const language = ref<string>("")
    const route = useRoute()
    const router = useRouter()
    const currentIndex = ref<string>("")
    const isMerchantSettingTipsDialogShow = ref<boolean>(false)
    const avatarErrorHandle = () => true
    const jumpPage = (path: string) => {
      router.push(path)
    }
    const userName = computed(() => localStorage.getItem("account"))
    const logOut = () => {
      ElMessageBox.confirm('退出', '确定要退出吗？', {
        type: "warning",
        cancelButtonText: '确定',
        confirmButtonText: '退出',
      }).then(() => {
        router.push("/login");
      })
    }
    const goToStepDialog = () => {
      ctx.emit("goToStepDialog")
    }
    watch(
      () => route.meta.groupName,
      (val: any) => {
        currentIndex.value = val
      },
      { immediate: true }
    )
    onMounted(() => {
      
    })
    return {
      currentIndex,
      language,
      isMerchantSettingTipsDialogShow,
      userName,
      jumpPage,
      logOut,
      goToStepDialog,
      avatarErrorHandle,
    }
  },
})
</script>

<style lang="less" scoped>
.common-header-container {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  margin-bottom: 20px;

  .left-side-wrapper,
  .right-side-wrapper {
    display: flex;
    align-items: center;
  }

  .left-side-wrapper {
    .logo {
      width: 155px;
      margin-right: 50px;
      text-align: center;

      img {
        height: 40px;
      }
    }

    .menu-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .menu-item {
        list-style: none;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.6);
        padding: 10px 24px;
        cursor: pointer;
        border-radius: 3px;

        &:hover {
          color: #155af5;
        }

        &.current {
          background: #155af5;
          color: #fff;

          &:hover {
            color: #fff;
          }
        }
        .menu-text {
          :deep(.el-badge) {
            &.badge-hidden .el-badge__content {
              display: none;
            }
            &__content {
              font-weight: 400;
              font-size: 12px;
              background-color: red;
              zoom: 0.85;
            }
          }
        }
      }
    }
  }

  .right-side-wrapper {
    justify-content: flex-end;

    .novice-setting {
      font-size: 14px;
      padding: 6px 8px;
      border-radius: 3px;
      color: #266fe8;
      background: #ecf2fe;
      border: 1px solid #266fe8;
      margin-right: 24px;
      cursor: pointer;
    }

    .user-info {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-right: 24px;
      border-right: 1px solid #ced0e0;

      .el-avatar {
        margin-right: 16px;
      }

      .email {
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
      }
    }

    .logout {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 24px 0 40px;
      cursor: pointer;
      p {
        cursor: pointer;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.9);
        margin-left: 8px;
      }
    }
  }
}

.el-dropdown__popper .el-dropdown-menu {
  padding: 4px;
  border: none;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: #155af5;
  color: #fff;
  border-radius: 4px;
}
</style>
