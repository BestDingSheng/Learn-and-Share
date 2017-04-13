<template>
  <div id="nav-menu">
    <el-menu default-active="1" theme="dark">
      <h3 class="role"><i class="iconfont">&#xe603;</i>管理员</h3>
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-menu"></i>导航一</template>
        <el-menu-item index="1-1">
          <router-link to="/page1" class="nav-link">二级导航一</router-link>
        </el-menu-item>
        <el-menu-item index="1-2">
          <router-link to="/page2" class="nav-link">二级导航二</router-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="2">
        <router-link to="/page3" class="nav-link"><i class="el-icon-message"></i>导航二</router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="sass">
  #nav-menu {
    width: 240px;
    min-width: 240px;
    height: 100%;
    position: fixed;
    top: 60px;
    left: 0;
    z-index: 2;
    border-radius: 0;
    background-color: #324057;
    box-shadow: 5px 0 20px rgba(0,0,0,.3);
    .role{
      color: #c0ccda;
      font-size: 14px;
      text-align: center;
      height: 40px;
      line-height: 26px;
      border-bottom: 1px solid #475669;
      .iconfont {
        font-size: 20px;
        margin-right: 5px;
      }
    }
    .nav-link {
      display: block;
    }
    .el-menu {
      background-color: #324057;
    }
    .el-menu-item,
    .el-submenu .el-submenu__title {
      height: 44px;
      line-height: 44px;
      color: #dbdbdb;
      &:hover {
        background-color: #475669;
      }
    }
    .router-link-active {
      color: #03a9f4;
    }
  }
</style>
