<template>
  <q-page>
    <div class="row">
      <div class="col-5 col-sm-4 col-md-3">
        <q-scroll-area style="height: 86vh">
          <div class="q-pa-md">
            <p class="places-block-header">Filters</p>
            <div class="q-pa-sm q-mb-sm filter-block">
              <div>
                <p class="filter-header">Establishment Type</p>
                <div class="row justify-start">
                  <div
                    class="col-12"
                    v-for="(checkbox, index) in placeTypeList"
                    :key="index"
                  >
                    <q-checkbox
                      :label="checkbox.label"
                      v-model="checkbox.val.value"
                      size="2.25rem"
                      @update:model-value="
                        onPlaceTypeFilterUpdate(checkbox.prop, checkbox.label)
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="q-pa-sm q-mb-sm filter-block">
              <div>
                <p class="filter-header">Price</p>
                <div class="row justify-start">
                  <div
                    class="col-12"
                    v-for="(checkbox, index) in priceTypeList"
                    :key="index"
                  >
                    <q-checkbox
                      :label="checkbox.label"
                      v-model="checkbox.val.value"
                      size="2.25rem"
                      @update:model-value="
                        onPriceTypeFilterUpdate(checkbox.prop, checkbox.label)
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="q-pa-sm q-mb-sm filter-block">
              <div>
                <p class="filter-header">Rating</p>
                <div class="row justify-start">
                  <div
                    class="col-12"
                    v-for="(checkbox, index) in ratingList"
                    :key="index"
                  >
                    <q-checkbox
                      v-model="checkbox.val.value"
                      :labeL="index"
                      size="2.25rem"
                      @update:model-value="
                        onRatingFilterUpdate(checkbox.starsNumber)
                      "
                    >
                      <q-rating
                        v-model="checkbox.starsNumber"
                        :max="5"
                        readonly
                        size="1rem"
                      />
                      & up
                    </q-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div class="col-7 col-sm-8 col-md-9">
        <div class="q-pa-md">
          <p class="places-block-header">Places</p>
          <div v-if="filteredPlaces.length == 0 && selectedFilters.length != 0">
            <div id="no-place-alarm-wrapper">
              <q-icon
                name="warning"
                color="negative"
                size="1.25rem"
                tag="div"
              />
              <span>There is no places match your filters</span>
              <a @click="clearFilters">Clear all filters</a>
            </div>
          </div>
          <div class="row">
            <div
              class="col-auto q-ma-sm"
              v-for="(filter, index) in selectedFilters"
              :key="index"
            >
              <q-btn
                unelevated
                rounded
                no-caps
                color="grey-4"
                text-color="dark"
                @click="excludeFilter(filter)"
              >
                {{ filter.label }}
                <q-icon name="close" size="18px" style="padding-left: 3px" />
              </q-btn>
            </div>
          </div>
          <div class="row" id="places-row">
            <div
              class="col-12 col-sm-10 col-md-6 q-pa-md"
              v-for="place in filteredPlaces"
              :key="place.place_id"
            >
              <PlaceCard :place="place" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import PlaceCard from "components/PlaceCard.vue";

const placeTypeList = [
  {
    label: "Restuarants",
    val: ref(false),
    prop: "restuarant",
  },
  {
    label: "Cafes",
    val: ref(false),
    prop: "cafe",
  },
  {
    label: "Bars",
    val: ref(false),
    prop: "bar",
  },
];

const priceTypeList = [
  {
    label: "Cheap Eats",
    val: ref(false),
    prop: "cheap",
  },
  {
    label: "Mid-Range",
    val: ref(false),
    prop: "mid_range",
  },
  {
    label: "Fine Dining",
    val: ref(false),
    prop: "expensive",
  },
];

const ratingList = [
  {
    starsNumber: 2,
    val: ref(false),
  },
  {
    starsNumber: 3,
    val: ref(false),
  },
  {
    starsNumber: 4,
    val: ref(false),
  },
];

const selectedFilters = ref([]);

function excludeFilter(filter) {
  let foundFilter;
  switch (filter.category) {
    case "placeType":
      foundFilter = placeTypeList.find(
        (placeTypeFilter) => placeTypeFilter.prop == filter.value
      );
      if (foundFilter) {
        foundFilter.val.value = false;
        onPlaceTypeFilterUpdate(filter.value, filter.label);
      }
      break;
    case "priceType":
      foundFilter = priceTypeList.find(
        (priceTypeFilter) => priceTypeFilter.prop == filter.value
      );
      if (foundFilter) {
        foundFilter.val.value = false;
        onPriceTypeFilterUpdate(filter.value, filter.label);
      }
      break;
    case "rating":
      foundFilter = ratingList.find(
        (ratingFilter) => ratingFilter.starsNumber == filter.value
      );
      if (foundFilter) {
        foundFilter.val.value = false;
        onRatingFilterUpdate(filter.value);
      }
      break;
  }
}

function onPlaceTypeFilterUpdate(nvalue, label) {
  const currentFilterIndex = selectedFilters.value.findIndex(
    (filter) => filter.category === "placeType" && filter.value === nvalue
  );

  if (currentFilterIndex > -1) {
    selectedFilters.value.splice(currentFilterIndex, 1);
  } else {
    selectedFilters.value.push({
      category: "placeType",
      value: nvalue,
      label,
    });
  }
}

function onPriceTypeFilterUpdate(nvalue, label) {
  const currentFilterIndex = selectedFilters.value.findIndex(
    (filter) => filter.category === "priceType" && filter.value === nvalue
  );

  if (currentFilterIndex > -1) {
    selectedFilters.value.splice(currentFilterIndex, 1);
  } else {
    selectedFilters.value.push({
      category: "priceType",
      value: nvalue,
      label,
    });
  }
}

function onRatingFilterUpdate(nvalue) {
  for (let ratingFilter of ratingList) {
    if (ratingFilter.starsNumber != nvalue) {
      ratingFilter.val.value = false;
    }
  }

  const currentFilterIndex = selectedFilters.value.findIndex(
    (filter) => filter.category === "rating"
  );

  if (currentFilterIndex > -1) {
    if (selectedFilters.value[currentFilterIndex].value != nvalue) {
      selectedFilters.value.push({
        category: "rating",
        value: nvalue,
        label: nvalue + " stars & up",
      });
    }
    selectedFilters.value.splice(currentFilterIndex, 1);
  } else {
    selectedFilters.value.push({
      category: "rating",
      value: nvalue,
      label: nvalue + " stars & up",
    });
  }
}

function clearFilters() {
  while (selectedFilters.value.length > 0) {
    for (const filter of selectedFilters.value) {
      excludeFilter(filter);
    }
  }
}

const allPlaces = ref([]);

const filteredPlaces = computed(() => {
  return allPlaces.value.filter((place) => {
    if (placeTypeList.filter((checkbox) => checkbox.val.value).length > 0) {
      for (let filter of placeTypeList) {
        if (!filter.val.value) {
          if (place.place_type === filter.prop) return false;
        }
      }
    }
    if (priceTypeList.filter((checkbox) => checkbox.val.value).length > 0) {
      for (let filter of priceTypeList) {
        if (!filter.val.value) {
          if (place.price_category === filter.prop) return false;
        }
      }
    }
    if (ratingList.filter((checkbox) => checkbox.val.value).length > 0) {
      for (let filter of priceTypeList) {
        if (!filter.val.value) {
          if (place.rating <= filter.starsNumber) return false;
        }
      }
    }
    return true;
  });
});

axios.get("/api/get_all_places").then((res) => {
  allPlaces.value = res.data;
});
</script>
<style lang="sass">
.places-block-header
  font-size: 1.25rem
  font-weight: 600
  margin-bottom: 5px
.filter-block
  border-radius: 2px
  background-color: rgba(238, 238, 238, .8)
.filter-header
  font-size: 1rem
  margin-bottom: 0
#no-place-alarm-wrapper
  display: flex
  align-items: bottom
  span, a
    font-size: 1rem
    padding-left: 5px
  a
    padding-left: 10px
    text-decoration: underline
    cursor: pointer
#places-row
  justify-content: center
@media screen and (min-width: 1024px)
  #places-row
    justify-content: start
</style>
