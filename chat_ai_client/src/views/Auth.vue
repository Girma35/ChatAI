<script lang="ts">
import { ref } from 'vue';
import Login from "../components/Form/Login.vue";
import SignUp from "../components/Form/signup.vue";
import {useUserStore} from "../store/user";

export default {
  name: "AuthPage",
  components: { Login, SignUp },
  setup() {

    const useStore = useUserStore();
    const isRegister = ref(false);
    const handleRegisterUpdate = () => {

     isRegister.value= !isRegister.value

    };

    return { 
      isRegister,
      handleRegisterUpdate,
      useStore
    };
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
    <div class="w-full max-w-md relative">
      <!-- Animated transition container -->
      <transition name="fade-slide" mode="out-in">
        
        <!-- Login Form -->
        <Login 
          v-if="isRegister" 
          key="login" 
          @is_register="handleRegisterUpdate"
        >
        </Login>
        <!-- Signup Form -->
        <SignUp 
          v-else 
          key="signup"
          @is_register="handleRegisterUpdate"
        >
        </SignUp>

      </transition>

      <!-- Branding/Logo -->
      <div class="absolute -bottom-20 left-0 right-0 text-center">
        <div class="text-gray-500 text-sm">
          © {{ new Date().getFullYear() }} YourBrand. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</template>

