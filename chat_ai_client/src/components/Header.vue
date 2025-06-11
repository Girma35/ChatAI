<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6">
      <!-- Left side - Logo and navigation -->
      <div class="flex items-center space-x-4">
        <!-- Mobile menu button (hidden on desktop) -->
        <button @click="toggleMobileMenu" class="p-2 rounded-md text-gray-500 lg:hidden">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="ml-2 text-xl font-semibold text-gray-900 hidden sm:block">ChatAI</span>
          </div>
        </router-link>
      </div>

      <!-- Center - Model selector (visible on desktop) -->
      <div class="hidden lg:flex items-center">
        <div class="relative">
          <button @click="toggleModelDropdown" class="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200">
            <span class="mr-2">{{ selectedModel.name }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Model dropdown -->
          <div v-if="showModelDropdown" class="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div class="py-1">
              <button 
                v-for="model in availableModels" 
                :key="model.id"
                @click="selectModel(model)"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                :class="{ 'bg-blue-50 text-blue-600': model.id === selectedModel.id }"
              >
                {{ model.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side - User controls -->
      <div class="flex items-center space-x-3">
        <!-- New chat button -->
        <button @click="newChat" class="p-2 rounded-full text-gray-500 hover:bg-gray-100">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        <!-- User profile dropdown -->
        <div class="relative">
          <button @click="toggleUserDropdown" class="flex items-center focus:outline-none">
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <template v-if="user.avatar">
                <img :src="user.avatar" alt="User avatar" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                <span class="text-sm font-medium text-gray-600">{{ userInitials }}</span>
              </template>
            </div>
          </button>

          <!-- User dropdown menu -->
          <div v-if="showUserDropdown" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
            <div class="px-4 py-2 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
              <p class="text-xs text-gray-500">{{ user.email }}</p>
            </div>
            <router-link 
              to="/settings" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </router-link>
            <button 
              @click="logout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu (hidden by default) -->
    <div v-if="showMobileMenu" class="lg:hidden bg-white border-t border-gray-200 px-4 py-3">
      <div class="space-y-2">
        <button 
          v-for="model in availableModels" 
          :key="model.id"
          @click="selectModel(model)"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
          :class="model.id === selectedModel.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'"
        >
          {{ model.name }}
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    // State
    const showUserDropdown = ref(false);
    const showModelDropdown = ref(false);
    const showMobileMenu = ref(false);
    
    // Models data
    const availableModels = ref([
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-3.5', name: 'GPT-3.5' },
      { id: 'claude', name: 'Claude' },
    ]);
    
    const selectedModel = ref(availableModels.value[0]);
    
    // User data (replace with your actual user data)
    const user = computed(() => userStore.user || {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null
    });
    
    const userInitials = computed(() => {
      if (!user.value.name) return '?';
      return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase();
    });
    
    // Methods
    const toggleUserDropdown = () => {
      showUserDropdown.value = !showUserDropdown.value;
      showModelDropdown.value = false;
    };
    
    const toggleModelDropdown = () => {
      showModelDropdown.value = !showModelDropdown.value;
      showUserDropdown.value = false;
    };
    
    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
    };
    
    const selectModel = (model: any) => {
      selectedModel.value = model;
      showModelDropdown.value = false;
      showMobileMenu.value = false;
      // Emit event or call store action to change model
    };
    
    const newChat = () => {
      // Logic to start a new chat
      router.push('/chat/new');
    };
    
    const logout = async () => {
      await userStore.logout();
      router.push('/login');
    };
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        showUserDropdown.value = false;
        showModelDropdown.value = false;
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return {
      showUserDropdown,
      showModelDropdown,
      showMobileMenu,
      availableModels,
      selectedModel,
      user,
      userInitials,
      toggleUserDropdown,
      toggleModelDropdown,
      toggleMobileMenu,
      selectModel,
      newChat,
      logout
    };
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>