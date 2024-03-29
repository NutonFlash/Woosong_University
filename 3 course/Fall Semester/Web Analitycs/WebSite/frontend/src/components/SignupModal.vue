<template>
  <q-dialog v-model="signupModalOpen">
    <div class="q-pa-md" style="width: 400px;">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Sign up</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="signupModalOpen = !signupModalOpen"/>
      </q-card-section>
      <q-card-section>
        <q-form greedy @submit="onSubmit" @reset="onReset">
          <div class="q-gutter-md">
            <q-input outlined v-model="firstNameInput" label="First name" type="text" clearable clear-icon="close" no-error-icon @blur="validateInput('firstName')" @update:model-value="validateInput('firstName')">
              <template v-slot:append>
                <q-icon
                    :style="errorFirstNameInput ? '' : 'display:none'"
                    name="error"
                    color="negative"
                  >
                  <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                    {{ firstNameTooltip }}
                  </q-tooltip>
                </q-icon>
              </template>
              </q-input>
            <q-input outlined v-model="lastNameInput" label="Last name" type="text" clearable clear-icon="close" no-error-icon @blur="validateInput('lastName')" @update:model-value="validateInput('lastName')">
              <template v-slot:append>
                <q-icon
                    :style="errorLastNameInput ? '' : 'display:none'"
                    name="error"
                    color="negative"
                  >
                  <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                    {{ lastNameTooltip }}
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
            <q-input outlined v-model="emailInput" label="Email" type="email" maxlength="45" placeholder="example@gmail.com" clearable clear-icon="close" no-error-icon @blur="validateInput('email')" @update:model-value="validateInput('email')">
              <template v-slot:append>
                  <q-icon
                      :style="errorEmailInput ? '' : 'display:none'"
                      name="error"
                      color="negative"
                    >
                    <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                      {{ emailTooltip }}
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>
            <q-input outlined v-model="passwordInput" label="Password" :type="isPwd ? 'password' : 'text'" clearable clear-icon="close" maxlength="255" :input-class="{'password-input': isPwd}" no-error-icon @blur="validateInput('password')" @update:model-value="validateInput('password')">
              <template v-slot:append>
                <q-icon
                    :style="errorPasswordInput ? '' : 'display:none'"
                    name="error"
                    color="negative"
                  >
                  <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                    {{ passwordTooltip }}
                  </q-tooltip>
                </q-icon>
                 <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="visibility-icon"
                    @click="isPwd = !isPwd"
                  />
              </template>
            </q-input>
          </div>
          <div class="q-mt-md q-mb-sm">
            <q-btn label="Register" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    </div>
  </q-dialog>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const emit = defineEmits(['signup']);

const signupModalOpen = ref(false);

const isPwd = ref(true);

const nameRules = [value => !!value || 'Field is required'];
const emailRules = [value => !!value || 'Field is required', value => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) || `Invalid email address`];
const passwordRules = [value => !!value || 'Field is required', value => value.length >= 8 || 'Minimum 8 characters'];

const firstNameInput = ref('');
const lastNameInput = ref('');
const emailInput = ref('');
const passwordInput = ref('');

const errorFirstNameInput = ref(false);
const errorLastNameInput = ref(false);
const errorEmailInput = ref(false);
const errorPasswordInput = ref(false);

const firstNameTooltip = ref('');
const lastNameTooltip = ref('');
const emailTooltip = ref('');
const passwordTooltip = ref('');

function validateInput(inputName) {
  switch (inputName) {
    case 'firstName': {
      for (let rule of nameRules) {
        const result = rule(firstNameInput.value);
        if (result !== true) {
          errorFirstNameInput.value = true;
          firstNameTooltip.value = result;
          break;
        } else {
          errorFirstNameInput.value = false;
        }
      }
      break;
    }
    case 'lastName': {
      for (let rule of nameRules) {
        const result = rule(lastNameInput.value);
        if (result !== true) {
          errorLastNameInput.value = true;
          lastNameTooltip.value = result;
          break;
        } else {
          errorLastNameInput.value = false;
        }
      }
      break;
    }
    case 'email': {
      for (let rule of emailRules) {
        const result = rule(emailInput.value);
        if (result !== true) {
          errorEmailInput.value = true;
          emailTooltip.value = result;
          break;
        } else {
          errorEmailInput.value = false;
        }
      }
      break;
    }
    case 'password': {
      for (let rule of passwordRules) {
        const result = rule(passwordInput.value);
        if (result !== true) {
          errorPasswordInput.value = true;
          passwordTooltip.value = result;
          break;
        } else {
          errorPasswordInput.value = false;
        }
      }
      break;
    }
  }
}

function onSubmit() {
  validateInput('firstName');
  validateInput('lastName');
  validateInput('email');
  validateInput('password');
  if ((!errorFirstNameInput.value && !errorLastNameInput.value && !errorEmailInput.value && !errorPasswordInput.value) && (firstNameInput.value && lastNameInput.value && emailInput.value && passwordInput.value)) {
    axios({
      method: 'post',
      url: '/api/register',
      data: {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        password: passwordInput.value
      }
    }).then(res => {
      if (res.status == 200) {
        if (res.data['hasError']) {
          $q.notify({
            message: res.data['errorMessage'],
            icon: 'error',
            color: 'negative',
            actions: [
              { icon: 'close', color: 'white', round: true }
            ]
          });
        } else {
          $q.notify({
            message: 'Successful sign up',
            icon: 'check_circle',
            color: 'positive',
            actions: [
              { icon: 'close', color: 'white', round: true }
            ]
          });
          signupModalOpen.value = false;
          emit('signup');
        }
      } else {
        $q.notify({
            message: 'Something go wrong',
            icon: 'error',
            color: 'negative',
            actions: [
              { icon: 'close', color: 'white', round: true }
            ]
          });
      }
    }).catch(err => {
      $q.notify({
            message: 'Something go wrong',
            icon: 'error',
            color: 'negative',
            actions: [
              { icon: 'close', color: 'white', round: true }
            ]
          });
    });
  } else {
    $q.notify({
      message: 'Invalid fields input',
      icon: 'error',
      color: 'negative',
      actions: [
            { icon: 'close', color: 'white', round: true}
          ]
    })
  }
}

function onReset() {
  firstNameInput.value = '';
  lastNameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';

  errorFirstNameInput.value = false;
  errorLastNameInput.value = false;
  errorEmailInput.value = false;
  errorPasswordInput.value = false;
}

defineExpose({
  signupModalOpen
});

</script>
<style lang="sass">
@font-face
  font-family: 'pass'
  font-style: normal
  font-weight: 400
  src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAATsAA8AAAAAB2QAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABWAAAABwAAAAcg9+z70dERUYAAAF0AAAAHAAAAB4AJwANT1MvMgAAAZAAAAA/AAAAYH7AkBhjbWFwAAAB0AAAAFkAAAFqZowMx2N2dCAAAAIsAAAABAAAAAQAIgKIZ2FzcAAAAjAAAAAIAAAACAAAABBnbHlmAAACOAAAALkAAAE0MwNYJ2hlYWQAAAL0AAAAMAAAADYPA2KgaGhlYQAAAyQAAAAeAAAAJAU+ATJobXR4AAADRAAAABwAAAAcCPoA6mxvY2EAAANgAAAAEAAAABAA5gFMbWF4cAAAA3AAAAAaAAAAIAAKAE9uYW1lAAADjAAAARYAAAIgB4hZ03Bvc3QAAASkAAAAPgAAAE5Ojr8ld2ViZgAABOQAAAAGAAAABuK7WtIAAAABAAAAANXulPUAAAAA1viLwQAAAADW+JM4eNpjYGRgYOABYjEgZmJgBEI2IGYB8xgAA+AANXjaY2BifMg4gYGVgYVBAwOeYEAFjMgcp8yiFAYHBl7VP8wx/94wpDDHMIoo2DP8B8kx2TLHACkFBkYA8/IL3QB42mNgYGBmgGAZBkYGEEgB8hjBfBYGDyDNx8DBwMTABmTxMigoKKmeV/3z/z9YJTKf8f/X/4/vP7pldosLag4SYATqhgkyMgEJJnQFECcMOGChndEAfOwRuAAAAAAiAogAAQAB//8AD3jaY2BiUGJgYDRiWsXAzMDOoLeRkUHfZhM7C8Nbo41srHdsNjEzAZkMG5lBwqwg4U3sbIx/bDYxgsSNBRUF1Y0FlZUYBd6dOcO06m+YElMa0DiGJIZUxjuM9xjkGRhU2djZlJXU1UDQ1MTcDASNjcTFQFBUBGjYEkkVMJCU4gcCKRTeHCk+fn4+KSllsJiUJEhMUgrMUQbZk8bgz/iA8SRR9qzAY087FjEYD2QPDDAzMFgyAwC39TCRAAAAeNpjYGRgYADid/fqneL5bb4yyLMwgMC1H90HIfRkCxDN+IBpFZDiYGAC8QBbSwuceNpjYGRgYI7594aBgcmOAQgYHzAwMqACdgBbWQN0AAABdgAiAAAAAAAAAAABFAAAAj4AYgI+AGYB9AAAAAAAKgAqACoAKgBeAJIAmnjaY2BkYGBgZ1BgYGIAAUYGBNADEQAFQQBaAAB42o2PwUrDQBCGvzVV9GAQDx485exBY1CU3PQgVgIFI9prlVqDwcZNC/oSPoKP4HNUfQLfxYN/NytCe5GwO9/88+/MBAh5I8C0VoAtnYYNa8oaXpAn9RxIP/XcIqLreZENnjwvyfPieVVdXj2H7DHxPJH/2/M7sVn3/MGyOfb8SWjOGv4K2DRdctpkmtqhos+D6ISh4kiUUXDj1Fr3Bc/Oc0vPqec6A8aUyu1cdTaPZvyXyqz6Fm5axC7bxHOv/r/dnbSRXCk7+mpVrOqVtFqdp3NKxaHUgeod9cm40rtrzfrt2OyQa8fppCO9tk7d1x0rpiQcuDuRkjjtkHt16ctbuf/radZY52/PnEcphXpZOcofiEZNcQAAeNpjYGIAg///GBgZsAF2BgZGJkZmBmaGdkYWRla29JzKggxD9tK8TAMDAxc2D0MLU2NjENfI1M0ZACUXCrsAAAABWtLiugAA) format('woff')

.password-input
  font-family: 'pass', 'Roboto', Helvetica, Arial, sans-serif
.visibility-icon
  opacity: 0.6
  &:hover
    opacity: 1
</style>
