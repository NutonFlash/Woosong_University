<template>
  <q-layout view="hHh LpR ffr">
    <q-header elevated class="bg-primary text-white" style="height: 5rem">
      <q-toolbar style="height: 100%" class="justify-center">
          <div class="col-6 col-sm-3">
            <q-btn
            dense
            flat
            round
            icon="menu"
            @click="toggleLeftDrawer"
            size="20px"
          />
            <q-avatar size="80px" style="margin-left: .5rem;">
              <img src="/assets/header-logo.svg" />
            </q-avatar>
          </div>
          <div class="col-0 col-sm-6" style="text-align: center">
            <span  id="header-title">
            Walk Through Daejeon
          </span>
          </div>
          <div class="col-6 col-sm-3" style="display: flex; justify-content: end;">
            <q-btn rounded size="1rem" color="blue-grey-1" class="q-my-md">
              <q-icon name="menu" size="1.75rem" color="primary" style="padding: 0 10px;"/>
              <q-avatar color="primary" text-color="white" size="2.5rem" v-if="isAuth">{{ firstName.at(0) }}</q-avatar>
              <q-icon name="account_circle" size="2.75rem" color="primary" style="padding: 0 10px;" v-else/>
              <q-menu v-model="dropdownMenuOpen" fit anchor="bottom right" self="top right" transition-show="jump-down" transition-hide="jump-up" :offset="[0, 5]">
                <q-list style="min-width: 100px" v-if="!isAuth">
                  <q-item clickable v-close-popup @click="()=>{
                    loginModalRef.loginModalOpen = !loginModalRef.loginModalOpen;
                    }">
                    <q-item-section>Log in</q-item-section>
                  </q-item>
                   <q-separator />
                  <q-item clickable v-close-popup @click="()=>{
                    signupModalRef.signupModalOpen = !signupModalRef.signupModalOpen;
                    }">
                    <q-item-section>Sign up</q-item-section>
                  </q-item>
                </q-list>
                <q-list style="min-width: 100px" v-else>
                  <q-item>
                    <q-item-section> Email: {{ email }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Name: {{ firstName }} {{ lastName }}</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="logout">
                    <q-item-section>Log out</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <LoginModal ref="loginModalRef" @login="isAuth = true"/>
            <SignupModal ref="signupModalRef" @signup="isAuth = true"/>
          </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      elevated
      show-if-above
      :width="250"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :to="menuItem.path" :active="activePage === menuItem.path" v-ripple @click="activePage = menuItem.path">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                <span style="font-size: medium">
                  {{ menuItem.label }}
                </span>
              </q-item-section>
            </q-item>
            <q-separator />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-primary text-white" style="height: 3.5rem">
      <div class="row" style="height: 100%; padding: 0 12px;">
        <div class="col-6 col-sm-3" style="display: flex; justify-content: start; align-items: center;">
           <router-link class="link" to="/terms-policies">Terms & Policies</router-link>
        </div>
        <div class="col-0 col-sm-6" style="display: flex; justify-content: center; align-items: center; text-align: center;">
          <span id="rights">&copy; 2023 Walk Through Daejeon. All Rights Reserved.</span>
        </div>
        <div class="col-6 col-sm-3">
          <div class="row q-gutter-x-md justify-end items-center" style="height: 100%;">
            <template v-for="(button, index) in socialMediaList" :key="index">
              <a
                :href="button.href"
                target="_blank"
                :alt="button.alt"
                class="link btn"
              >
                <div :style="button.style" class="col"></div>
              </a>
            </template>
            <a class="link btn" @click="showing = !showing">
              <div class="col" id="kakaotalk-btn">
              </div>
            </a>
            <q-tooltip class="transparent" target="#kakaotalk-btn">
                <img src="/assets/kakaot-qr.jpg" style="width:200px; height: 245px;">
            </q-tooltip>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onUpdated, watch } from "vue";
import axios from "axios";
import LoginModal from "components/LoginModal.vue";
import SignupModal from "src/components/SignupModal.vue";

const isAuth = ref(false);
const email = ref('');
const firstName = ref('');
const lastName = ref('');

watch(isAuth, (newv, oldv) => {
  if (newv == true) {
    getUserDataFromCookie()
  }
});

function getUserDataFromCookie() {
  const cookieArr = document.cookie.split(';');
  cookieArr.forEach(cookie => {
    let keyValue = cookie.split('=');
    keyValue[0] = keyValue[0].trim();
    switch (keyValue[0]) {
      case 'isAuthorized': {
        isAuth.value = (keyValue[1] === 'true');
        break;
      }
      case 'email': {
        email.value = decodeURIComponent(keyValue[1]);
        break;
      }
      case 'firstName': {
        firstName.value = decodeURIComponent(keyValue[1]);
        break;
      }
      case 'lastName': {
        lastName.value = decodeURIComponent(keyValue[1]);
        break;
      }
    }
  });
}

const leftDrawerOpen = ref(false);
const dropdownMenuOpen = ref(false);

const activePage = ref('home');

const loginModalRef = ref(null);
const signupModalRef = ref(null);

onUpdated(() => {
  leftDrawerOpen.value = true;
});

const menuList = [
  {
    icon: "home",
    label: "Home",
    path: 'home'
  },
  {
    icon: "place",
    label: "Places",
    path: 'places'
  },
  {
    icon: "groups",
    label: "Meetings",
    path: 'meetings'
  },
  {
    icon: "post_add",
    label: "Suggestions",
    path: 'suggestions'
  },
];

const socialMediaList = [
  {
    style:
      "background-image: url(/assets/inst-logo.svg); width:35px; height: 35px; display:inline-block",
    href: "https://instagram.com/walkthroughdaejeon?utm_source=qr&igshid=MzNlNGNkZWQ4Mg==",
    alt: "instagram logo",
  },
  {
    style:
      "background-image: url(/assets/naver-logo.svg); width:35px; height: 35px; display:inline-block",
    href: "https://blog.naver.com/walkthroughdaejeon",
    alt: "naver logo",
  },
];

const showing = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function logout() {
  await axios.post('/api/logout');
  isAuth.value = false;
  dropdownMenuOpen.value = false;
}

getUserDataFromCookie();
</script>
<style lang="sass">
@media screen and (max-width: 600px)
  #header-title, #rights
    visibility: hidden
    display: none

#header-title
  font-size: 1.5rem
  font-weight: 600
.link
  color: white
  text-decoration: underline
  &:hover
    cursor: pointer
    font-weight: 600
    transition: .1s
.btn
  display: flex
  align-items: center
  justify-items: center
#kakaotalk-btn
  background-image: url(/assets/kakaotalk-logo.svg)
  width:35px
  height: 35px
  display:inline-block
</style>
