<template>
    <div class="w-1/2 mx-auto">

        <p class="font-light text-3xl">Editor</p>
        <Editor :editor="editorData" @upload="handleUpload" @dispatched-editor-data="setData" />
        <button @click="getJSON" class="p-2 bg-gray-400 rounded text-white mt-2">get data</button>
        <div v-if="jsonData" class="mt-4">
            <p>Save the following to your database.It will be used in the EditorView component.</p>

            <div class="text-gray-400 mt-4">
                {{ jsonData }}
            </div>
        </div>
    </div>
</template>

<script>
import Editor from '../components/Editor'

export default {
    components: {
        Editor,
    },

    data() {
        return {
            editorData: [],
            jsonData: null,
        }
    },

    methods: {
        getJSON() {
            this.$root.$emit('fetch_editor_data')
        },

        setData(e) {
            this.jsonData = e
        },

        handleUpload(data) {
            console.log('data',data)

            setTimeout(() => {
                let xdata = {
                    status: 'success',
                    index: data.index,
                    file_url: `https://cataas.com/cat/says/hello%20world!`
                }
                this.$root.$emit('mason-file-upload-finished', xdata)
            },5000)

        }
    }
}
</script>