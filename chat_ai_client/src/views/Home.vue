<script lang="ts">
import welcomeImg from "../assets/welcome.png";
import { ref } from "vue";

export default {
  name: "HomePage",
  setup() {
    const isLoading = ref(false);
    const username = ref("");
    const error = ref("");
    
    const startChatting = () => {
      if (!username.value.trim()) {
        error.value = "Please enter your name to continue";
        return;
      }
      isLoading.value = true;
      // Simulate loading for demo purposes
      setTimeout(() => {
        isLoading.value = false;
      }, 1500);
    };
    
    return { welcomeImg, username, isLoading, error, startChatting };
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-6">
    <!-- Animated background elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div v-for="i in 5" :key="i" 
           class="absolute rounded-full bg-blue-200 opacity-20"
           :class="[
             `w-${Math.floor(Math.random() * 20) + 10} h-${Math.floor(Math.random() * 20) + 10}`,
             `top-${Math.floor(Math.random() * 100)} left-${Math.floor(Math.random() * 100)}`,
             'animate-float'
           ]"
           :style="{
             animationDuration: `${Math.random() * 10 + 10}s`,
             animationDelay: `${Math.random() * 5}s`
           }">
      </div>
    </div>

    <div class="relative z-10 flex flex-col items-center justify-center max-w-2xl text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
      <!-- Header with subtle animation -->
      <h1 class="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
        <span class="inline-block animate-float">Welcome to ChatAI</span>
      </h1>
      
      <!-- Hero image with hover effect -->
      <div class="mb-8 transform transition-all duration-500 hover:scale-105">
        <img 
          :src="welcomeImg" 
          alt="AI Assistant Illustration" 
          class="w-72 h-auto drop-shadow-lg"
        />
      </div>
      
      <!-- Value proposition -->
      <p class="text-xl text-gray-600 mb-8 leading-relaxed">
        <span class="block mt-2 font-medium text-indigo-600">
          Get instant answers, creative ideas, and personalized support.
        </span>
      </p>
      
      <!-- Interactive input with validation -->
      <div class="w-full max-w-md mb-8">
        <input 
          type="text" 
          v-model="username"
          placeholder="Enter your name to begin" 
          class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-400 transition-all"
          @keyup.enter="startChatting"
        />
        <p v-if="error" class="text-red-500 mt-2 text-left pl-2">{{ error }}</p>
      </div>
      
      <!-- Animated CTA button -->
      <router-link
        to="/login"
        @click="startChatting"
        class="relative overflow-hidden group"
        :class="{ 'pointer-events-none opacity-90': isLoading }"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700 transition-all rounded-2xl"></div>
        <div class="relative z-10 flex items-center justify-center px-10 py-4 text-lg font-semibold text-white">
          <span v-if="!isLoading">Start Chatting →</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Preparing your experience...
          </span>
        </div>
        <span class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
      </router-link>
      
      <!-- Trust indicators -->
      <div class="mt-8 text-sm text-gray-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Secure & Private • Always Available • Powered by AI
      </div>
    </div>
  </div>
</template>

<style>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>