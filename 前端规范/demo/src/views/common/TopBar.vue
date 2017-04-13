<template>
  <div class="header">
    <el-col :span="24">
      <el-col :span="20">
        <div class="grid-content bg-purple">
            <h1>demo</h1>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div class="user-area pull-right">
            <div class="user-avatar">
              <span class="avatar-img" :style="{ backgroundImage: 'url(' + avatar_url + ')' }"></span>
              <i class="el-icon-arrow-down"></i>
              <div class="drop-menu">
              <ul>
                <li @click="signOut"><i class="iconfont">&#xe602;</i>退出</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script type="text/javascript">
  export default {
    data() {
      return {
        avatar_url: 'http://img0.imgtn.bdimg.com/it/u=1787407765,2524017231&fm=11&gp=0.jpg',
      };
    },
    methods: {
      signOut() {
        console.log('退出登录');
      },
    },
  };
</script>

<style lang="sass">
  .header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: #1f2d3d;
    z-index: 100;
    h1{
      color: #fff;
      margin-top: 13px;
      margin-left: 30px;
    }
    .user-area {
      padding: 16px 10px;
      margin-right: 30px;
      display: inline-block;
      position: relative;
      &:hover {
        background-color: #36475a;
        .drop-menu {
          display: block;
        }
      }
      .user-avatar {
        height: 32px;
        .avatar-img {
          display: inline-block;
          width: 32px;
          height: 32px;
          border-radius: 16px;
          margin-right: 10px;
          vertical-align: middle;
          background: center no-repeat;
          background-size: cover;
          background-color: #1f2d3d;
        }
        .el-icon-arrow-down {
          vertical-align: middle;
          font-size: 12px;
          color: #C0CCDA;
        }
      }
    }
    .drop-menu {
      position: absolute;
      right: 0;
      top: 64px;
      display: none;
      width: 140px;
      z-index: 1;
      background-color: #36475a;
      box-shadow: 0 5px 20px rgba(0,0,0,.3);
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        padding: 12px 20px;
        cursor: pointer;
        line-height: 1;
        font-size: 14px;
        color: #fff;
        &:hover {
          background-color: #1f2d3d;
        }
      }
      .iconfont {
        font-size: 20px;
        margin-right: 10px;
      }
    }
  }
</style>
