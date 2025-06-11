<script setup lang="ts">
// import Header from "../components/Header.vue";  // Note: Capitalized component name
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header Component -->
    <!-- <Header>

    </Header> -->
    
    <!-- Main Chat Content -->
    <main class="flex-1 overflow-hidden">
      <div class="h-full flex flex-col">
        <h1 class="text-2xl font-bold p-4">Chat Page</h1>
        
        <!-- Chat messages container -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Chat messages will go here -->
        </div>
        
        <!-- Input area -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Add any custom styles here if needed */
</style>