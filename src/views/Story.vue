<template>
    <div class="w-5/6 mx-auto">

        <p class="font-light text-3xl">Mason Editor view</p>

        <div class="flex">
            <div class="w-2/6">
                <div class="p-4 mb-2 bg-gray-100">
                    <textarea v-model="jsonData" class="w-full h-64 p-5 rounded" placeholder="Place the editor generated json data here and click render."></textarea>
                    <button @click="renderData" class="p-2 bg-gray-400 rounded text-white mt-2">render</button>
                </div>
            </div>
            <div class="w-4/6">
                <div v-if="story" class="bg-white p-5">
                    <MasonEditorView :story="story" class="mt-2" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MasonEditorView from '../components/editor/MasonEditorView'

export default {
    components: {
        MasonEditorView
    },

    data() {
        return {
            story: null,
            jsonData: null,
        }
    },

    methods: {
        renderData() {
            this.story = JSON.parse(this.jsonData)
        }
    }
}
</script>