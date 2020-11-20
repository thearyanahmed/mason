<template>
  <div id="app" class="mx-auto p-5 bg-white h-screen">
    <div>
        <div id="nav" class="flex justify-center">
          <div>
            <router-link :to="{ name: 'Home' }"> TypeWriter </router-link> |
            <router-link :to="{ name: 'Story' }"> Story </router-link>
          </div>
        </div>
        <div class="mt-5">
          <router-view/>
        </div>
      </div>
  </div>
</template>

