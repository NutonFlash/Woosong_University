<template>
  <q-card flat bordered class="place-card">
    <q-carousel
      animated
      v-model="slide"
      arrows
      swipeable
      navigation
      infinite
      height="12rem"
      >
      <q-carousel-slide v-for="(image, index) in place.images" :key="index" :name="index+1" :img-src="image.base_64"></q-carousel-slide>
    </q-carousel>
    <q-card-section>
      <p class="place-name">{{ place.name_eng }}</p>
        <div style="position: relative;">
          <q-rating readonly v-model="rating" :max="5" size="20px" />
          <div style="display: inline-block;">
            <span class="place-prop rating">{{ place.rating }}/5</span>
            <span class="place-prop review-number">Reviews 0</span>
          </div>
        </div>
        <div style="margin-bottom: 5px;">
          <q-icon name="location_on" size="sm"/>
          <span class="place-prop">{{place.location_eng}}</span>
        </div>
        <div style="margin-bottom: 5px;">
          <q-icon name="schedule" size="sm"/>
          <span class="place-prop">{{ convertTime(place.open_time) + " - " + convertTime(place.close_time)}}</span>
        </div>
        <div style="margin-bottom: 5px;">
          <q-icon name="call" size="sm"/>
          <span class="place-prop">{{ place.phone_number }}</span>
        </div>
        <div style="margin-bottom: 5px;">
            <q-icon name="language" size="sm"/>
            <span class="place-prop" v-if="place.website">
              <a :href="place.website" target="_blank">{{ place.website }}</a>
            </span>
            <span class="place-prop" v-else>
                not defined
              </span>
          </div>
    </q-card-section>
  </q-card>
  </template>
  <script setup>
  import { ref } from 'vue'

  const slide = ref(1);

  const rating = ref(props.place.rating);

  const props = defineProps(['place']);

  function convertTime(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1, -1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }
  </script>
<style lang="sass">
.place-name
  font-size: 1.35rem
  margin-bottom: 10px
.place-prop
  font-size: .9rem
  padding-left: 10px
  vertical-align: middle
  margin-bottom: 0
.rating, .review-number
  color: grey
  display: inline-block
  transform: translateY(1px)
.rating
  padding-left: 5px

.place-card .q-carousel__navigation-inner .q-icon
  font-size: .8rem
</style>
