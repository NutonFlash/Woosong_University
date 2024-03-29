<template>
  <div class="column items-center justify-end" id="intro-block">
    <div class="row">
      <div class="q-px-md" id="intro-container">
        <p id="intro-header">
          Daejeon is not just a city, it's an adventure waiting to happen!
        </p>
        <p id="intro-text">
          Our website is your ultimate guide to unlocking the best that this
          vibrant city has to offer. Whether you're a local looking for new
          experiences or an international student eager to make friends and
          explore, Walk Through Daejeon is your trusted companion.
        </p>
      </div>
    </div>
  </div>
  <div class="q-ma-xl">
    <div class="q-mb-xl">
      <p class="block-header">What Makes WTD Unique?</p>
      <div class="row q-gutter-xl justify-center">
        <div
          class="col-10 col-sm-7 col-md"
          v-for="(block, index) in uniqnesList"
          :key="index"
        >
          <q-icon :name="block.icon" size="md" />
          <span class="uniq-header">{{ block.header }}</span>
          <p class="uniq-text">{{ block.text }}</p>
        </div>
      </div>
    </div>
    <div class="q-mb-xl">
      <p class="block-header">Top 3 Places in Daejeon</p>
      <div class="q-col-gutter-md row justify-center">
        <div
          class="col-12 col-sm-8 col-md"
          v-for="place in topPlaces"
          :key="place.place_id"
        >
          <PlaceCard :place="place" />
        </div>
      </div>
    </div>
    <div class="q-mb-xl">
      <p class="block-header">Our Team</p>
      <div class="q-col-gutter-md row justify-center">
        <div
          class="col-4 col-md text-center"
          v-for="(member, index) in memberList"
          :key="index"
        >
          <div class="avatar-wrapper">
            <q-avatar size="100px">
              <img :src="member.avatar_src" />
            </q-avatar>
          </div>
          <p class="member-name">{{ member.name }}</p>
          <p class="member-role">{{ member.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import PlaceCard from "components/PlaceCard.vue";

const topPlaces = ref([]);

axios.get("/api/get_top_places").then((res) => {
  topPlaces.value = res.data;
});

const uniqnesList = [
  {
    icon: "verified",
    header: "Local Treasures",
    text: "We've scoured every nook and cranny of Daejeon to bring you the coolest and most intriguing places.You'll discover the city's well- kept secrets and hidden gems.",
  },
  {
    icon: "people",
    header: "Community",
    text: "WTD is not just about places, it's about people. Join our community, make new friends, and create lasting memories as you explore Daejeon together.",
  },
  {
    icon: "devices",
    header: "Simplicity",
    text: "Our user-friendly interface ensures you can navigate the city effortlessly. Whether you're searching for the perfect study spot, a cozy date night venue, or an adventure with friends, our website simplifies your quest.",
  },
];
const memberList = [
  {
    avatar_src: "assets/Aleksei_avatar.jpg",
    name: "Kislitsin Aleksei",
    role: "Team Leader",
  },
  {
    avatar_src: "assets/Emi_avatar.jpg",
    name: "Korona Emi",
    role: "Front End Developer",
  },
  {
    avatar_src: "assets/joseph.jpg",
    name: "Joseph",
    role: "Back End Developer",
  },
  {
    avatar_src: "assets/김준형_avatar.jpg",
    name: "김준형",
    role: "Content Creator",
  },
  {
    avatar_src: "assets/최용한_avatar.jpg",
    name: "최용한",
    role: "Web Designer",
  },
];
</script>
<style lang="sass">
#intro-block
  height: 86vh
  color: white
  background-image: linear-gradient(0deg, rgba(45,88,255,0.75) 0%, rgba(45,176,255,0.35) 86%), url(../assets/Daejeon.webp)
  background-position: center
  -webkit-background-size: cover
  -moz-background-size: cove
  -o-background-size: cover
  background-size: cover
  text-align: left
#intro-container
  margin: 0 25px
#intro-header
  font-size: 1.5rem
  font-weight: 600
#intro-text
  font-size: 1.15rem
.uniq-header
  vertical-align: middle
  font-size: 1.3rem
  padding-left: 15px
.uniq-text
  padding: 10px 0px
.block-header
  font-size: 1.5rem
  font-weight: 600
  text-align: center
.avatar-wrapper
  display: flex
  justify-content: center
.member-name, .member-role
  margin: 0
.member-name
  font-size: 1rem
  font-weight: 600
  padding-top: 10px
.member-role
  font-size: .9rem
</style>
