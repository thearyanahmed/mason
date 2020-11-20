<template>
  <div id="app" class="mx-auto p-5 bg-gray-200 h-screen">
    <div>
        <div id="nav" class="flex justify-center">
          <div>
            <router-link to="/">Editor </router-link> |
            <router-link :to="{ name: 'TypeWriter' }"> TypeWriter </router-link> |
            <router-link to="/about"> About</router-link>
          </div>
        </div>
        <div class="mt-5">
          <router-view/>
        </div>
      </div>
  </div>
</template>
