<template>
    <div class="editor">
        <div v-for="(item,i) in templateData" class="elements" :key="i">
            <div class="editor-control">
                <div class="editor-control__expand-handle js-expand-handle">
                    <div @click="toggleElementsVisibility(item)"
                            class="editor-control__expand-handle__button">
                        {{ toolbarLabel(item.model,i) }}
                    </div>
                </div>
            </div>

            <div
                    v-show="item.showElements"
                    class="editor-control__dashboard"
                    style="display: flex;"
            >
                <div
                        v-for="(el,index) in elements"
                        v-bind:key="index"
                        @click="setSelectedElement(el,item,i,index)"
                        :class="el.selectorClass"
                >
                    <span class="el-name">
                        <button><font-awesome-icon :icon="el.icon" /></button>
                    </span>

                    <p class="el-description" v-text="el.desc"></p>
                </div>
            </div>

            <div
                    v-if="renderDropZone(item)"
                    :id="'drop-point-' + i"
                    @drop.prevent="handleFileDrop($event,item,i)"
                    @dragover.prevent
                    @click="openFilePicker(i)"
                    class="drop-point"
            >
                <div class="editor-block__image__upload-panel__icon">
                    <p>
                        <i class="fas fa-image image-picker-placeholder"></i>
                    </p>
                    <div
                            style="display: inline-block;"
                    >Drag and drop a photo to upload or tap to upload</div>
                    <span style="display: none;">Uploading image...</span>
                </div>
            </div>

            <input
                    v-if="renderFilePicker(item)"
                    v-show="false"
                    type="file"
                    @change="handleImageSelection($event,item,i)"
                    :id="'image-picker-' + i"
            />

            <div class="container container-relative">
                <textarea
                        v-if="rerender"
                        v-show="item.showInput"
                        :class="item.selectedElement ? item.selectedElement.class : ''"
                        rows="1"
                        @input="grow('text_input_' + i)"
                        @keydown.enter.exact.prevent
                        v-model="item.model"
                        :placeholder="item.selectedElement ? item.selectedElement.placeholder : ''"
                        :id="'text_input_' + i"
                        type="text"
                        :required="required"
                ></textarea>

                <div v-if="item.selectedElement && item.selectedElement.isIframe" class="container">
                    <div v-html="renderIframe(item)" ></div>
                </div>

                <div v-if="item.model && item.selectedElement && item.selectedElement.isFile" class="container">
                    <img :src="item.model" />
                </div>

                <div v-if="item.model" class="actions">
                    <button type="button"
                            :disabled="!canMoveUp(i)"
                            @click="moveUp(i)"
                            class="actions-btn actions-btn--up"
                    >
                        <font-awesome-icon icon="arrow-up" />
                    </button>
                    <button type="button"
                            :disabled="!canMoveDown(i)"
                            @click="moveDown(i)"
                            class="actions-btn actions-btn--down"
                    >
                        <font-awesome-icon icon="arrow-down" />
                    </button>
                    <button type="button" @click="requestDeletion(i)" class="actions-btn actions-btn--delete">
                        <font-awesome-icon icon="times" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import ELEMENTS from './Elements.js'

    export default {
        layout: "dashboard",
        props: {
            editor: {
                type: Array,
                required: true
            },
            required: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        data() {
            return {
                selectedElement: null,
                showElements: true,
                defaultTag: null,
                templateData: [],
                rerender: true,
                elements: ELEMENTS,
            };
        },
        created() {
            if(Array.isArray(this.editor)){
                this.templateData = this.editor
            } else {
                try {
                    this.templateData = JSON.parse(this.editor)
                } catch(err) {
                    console.error('editor-error',err)
                }
            }
            this.defaultTag = this.elements[2]
            if(this.templateData.length === 0) {
                this.addNewElement(this.defaultTag, true)
            }
        },
        mounted() {

            this.$root.$on("fetch_editor_data", () => {
                const data = this.generateJSON()
                this.$emit("dispatched-editor-data", data)
            })

            this.$root.$on('mason-file-upload-finished', (data) => {
                if(data.status == 'success') {
                    this.templateData[data.index].model = data.file_url
                } else if (data.status === 'error') {
                    // show some sort of alert
                    this.templateData.splice(data.index,1)
                } else {
                    console.error('#mason_file_upload_error. status in necessary, check https://github.com/thearyanahmed/mason')
                }
            })
        },
        computed: {
            insertValidYoutubeUrlElement() {
                return `
                    <p class="red-text mt-1" style="color:red">Please insert a valid youtube url</p>
                `
            },
            templateLength() {
                return this.templateData.length
            }
        },
        methods: {
            grow(identifier) {
                let element = document.querySelector("#" + identifier)
                element.style.height = "5px"
                element.style.height = element.scrollHeight + "px"
            },
            moveUp(i) {
                this.rerender = false

                const prev = this.templateData[i - 1]

                this.templateData[i - 1] = this.templateData[i]
                this.templateData[i] = prev

                this.rerender = true
            },
            moveDown(i) {
                this.rerender = false

                const next = this.templateData[i + 1]

                this.templateData[i + 1] = this.templateData[i]
                this.templateData[i] = next

                this.rerender = true
            },
            canMoveUp(i) {
                return !(i === 0)
            },
            canMoveDown(i) {
                return !(this.templateLength - 2 === i)
            },
            generateJSON() {
                let data = []

                this.templateData.forEach(el => {
                    if (el.model) {
                        data.push(el)
                    }
                })

                return JSON.stringify(data)
            },
            requestDeletion(index) {
                const confirmed = confirm(
                    "Are you sure you want to delete this block?"
                )
                if (confirmed) {
                    this.templateData.splice(index, 1)
                }
            },
            renderFilePicker(item) {
                if(! item.selectedElement) {
                    return false
                }
                return item.selectedElement.hasFilePicker
            },
            renderDropZone(item) {
                if(! item.selectedElement) {
                    return false
                }
                return item.selectedElement.hasDropZone && !item.model
            },
            openFilePicker(index) {
                document.querySelector("#image-picker-" + index).click()
            },
            handleImageSelection(event, item, i) {
                const file = event.target.files[0]

                this.upload(file, i)

                item.model = this.localUpload(file)
            },
            handleFileDrop(event, item,i) {
                const droppedFiles = event.dataTransfer.files

                if (!droppedFiles) return

                this.upload(droppedFiles[0], i)

                item.model = this.localUpload(droppedFiles[0])
            },
            localUpload(file) {
                return URL.createObjectURL(file)
            },
            upload(file, index) {
                this.$emit('upload',{ file, index })
            },
            renderIframe(item) {
                if (!item.model) return

                const watchStringIdentifier = "watch?v="

                if (!item.model.includes(watchStringIdentifier))
                    return this.insertValidYoutubeUrlElement

                const embedStringIdentifier = "embed/"

                let embedUrl = item.model.replace(
                    watchStringIdentifier,
                    embedStringIdentifier
                )
                item.source = embedUrl

                const iframe = `
                    <iframe class="iframe" width="560" height="315"
                        src="${embedUrl}?controls=0"
                        frameborder="0"
                        allow="accelerometer;
                        autoplay;
                        encrypted-media;
                        gyroscope;
                        picture-in-picture"
                        allowfullscreen>
                </iframe>
                `
                item.showInput = false
                // item.model = iframe
                return iframe
            },
            toolbarLabel(model,index) {
                if(index + 1 === this.templateData.length && model === null) {
                    return 'Add'
                }
                return 'Edit'
            },
            showElementsText(item) {
                if (item.showElements) {
                    // showing all buttons
                    if (item.model !== null) {
                        return "Edit"
                    }
                    return "Hide"
                }
                return "Add"
            },
            toggleElementsVisibility(item) {
                item.showElements = !item.showElements
            },
            setSelectedElement(el, item, itemId,index) {
                this.selectedElement = el

                item.showElements = false
                item.selectedElement = this.selectedElement
                item.showInput = !item.selectedElement.hasDropZone

                if(this.selectedElement.id === 'video-player' || this.selectedElement.id === 'image') {
                    item.model = null
                }

                if(this.templateData.length - 1 > itemId) {
                    return
                }
                this.addNewElement(this.defaultTag)
            },
            changeURL(item) {
                item.model = null
            },
            addNewElement(dt, showElemenets = false, showInput = false) {
                const el = {
                    showElements: showElemenets,
                    selectedElement: dt,
                    model: null,
                    showInput: showInput
                }

                this.templateData.push(el)
            }
        }
    }
</script>

<style lang="css" scoped>
    .editor {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.05);
    }

    .editor .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }
    .editor .container .container {
        padding: 0 !important;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .red-text {
        color: red;
    }

    .editor .container-relative {
        position: relative;
    }
    .editor .actions {
        position: absolute;
        opacity: 0;
        right: 19px;
        top: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    /* .container-relative:focus >.actions,
    .container-relative:active >.actions, */
    .editor .container-relative:hover > .actions{
        opacity: 1;
    }
    .editor .actions-btn {
        border: none;
        border-radius: 4px;
        background-color: #ccc;
        opacity: 0.9;
        color: #222;
        width: 28px;
        height: 28px;
        box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1);
        margin-right: 10px;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .editor .actions-btn:disabled {
        opacity: 0.3;
        pointer-events: none;
        cursor: not-allowed;
        box-shadow: none;
    }

    @media (max-width: 1199.98px) {
        .editor .actions-btn {
            width: 26px;
            height: 26px;
            margin-right: 9px;
            font-size: 0.85rem;
        }
    }

    @media (max-width: 991.98px) {
        .editor .actions-btn {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            font-size: 0.8rem;
        }
    }

    @media (max-width: 767.98px) {
        .editor .actions-btn {
            width: 22px;
            height: 22px;
            margin-right: 7px;
            font-size: 0.75rem;
        }
    }

    @media (max-width: 575.98px) {
        .editor .actions-btn {
            width: 20px;
            height: 20px;
            margin-right: 6px;
            font-size: 0.7rem;
        }
    }

    .editor .actions-btn:last-child {
        margin-right: 0;
    }

    .editor .actions-btn:hover {
        opacity: 1;
        box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
    }
    .editor .actions-btn:active {
        opacity: 0.6;
    }

    .editor .container img {
        max-width: 100%;
        border-radius: 4px;
    }

    .el-name {
        font-size: 20px;
    }
    .el-desc {
        font-size: 17px;
    }
    .elem-root {
        width: auto;
        min-width: 60px;
        height: 50px;
        border-radius: 5px;
        padding: 5px;
    }
    .elements button {
        margin-right: 10px;
        position: relative;
    }
    .text-input {
        box-shadow: none !important;
        border: none !important;
    }
    .editor-control {
        font-family: "Source Sans Pro", sans-serif;
        padding-bottom: 15px;
        padding-top: 10px;
        margin-top: 10px;
        position: relative;
    }
    .editor-control__expand-handle {
        border-top: dashed 2px #eeeeee;
        cursor: pointer;
        text-align: center;
    }
    .editor-control__dashboard__button {
        border-radius: 8px;
        color: #666666;
        cursor: pointer;
        flex: 1;
        margin: 5px 0 10px 0;
        padding: 10px;
        text-align: center;
    }
    /*changed here*/
    .el-name {
        font-size: 20px;
        font-weight: 600;
    }
    .el-description {
        font-size: 14;
        font-weight: 400;
    }

    @media (max-width: 767.98px) {
        .el-description {
            display: none;
        }
    }
    /*till here*/
    .editor-control__expand-handle__button {
        background-color: white;
        border: solid 1px #eeeeee;
        border-radius: 11px;
        box-sizing: border-box;
        color: #dddddd;
        display: block;
        font-size: 14px;
        font-weight: 600;
        left: 0;
        line-height: 2;
        margin: -13.5px auto 0 auto;
        padding: 0 20px;
        text-align: center;
        width: 90px;
    }
    .input-area {
        width: 100%;
        box-shadow: none;
        border: 0;
        outline: none;
        overflow: hidden;
        resize: none;
    }
    .story-paragraph {
        font-size: 16px;
        font-weight: 400;
        line-height: 36px;
    }
    .story-heading {
        font-size: 20px;
        font-weight: 600;
        line-height: 36px;
    }
    .story-blockquote {
        border-left: solid 2px #eeeeee;
        color: #666666;
        font-size: 26px;
        font-weight: 300;
        line-height: 36px;
        padding-left: 20px;
    }
    .drop-point {
        background-color: #f4f4f4;
        border: solid 1px #eeeeee;
        border-radius: 4px;
        color: #333333;
        cursor: pointer;
        padding: 120px 30%;
        text-align: center;
    }
    .image-picker-placeholder {
        font-size: 25px;
    }
    .video-selector-placeholder {
        font-size: 25px;
    }
    .story-video {
        min-width: 100%;
        padding: 8px 10px;
        min-height: 40px;
        flex: 1;
        background-color: #fff;
        color: #666;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: inset 0 2px 3px 0 rgba(0, 0, 0, 0.1);
        font-size: 0.95rem;
    }
    .story-video:focus {
        outline-color: transparent;
        border-color: rgba(132, 207, 202, 0.8);
        box-shadow: 1px 1px 10px 1px rgba(132, 207, 202, 0.2);
    }

    .editor-block__container__delete-button {
        background-color: #333333;
        border-radius: 4px;
        box-sizing: border-box;
        color: white;
        cursor: pointer;
        display: inline-block;
        line-height: 0;
        opacity: 0.4;
        padding: 5px;
        position: absolute;
        right: 15px;
        top: -5px;
    }
    ::placeholder {
        color: #747474;
    }
    .delete-button {
        border: none;
        background: white;
    }
    textarea {
        resize: none;
        overflow: hidden;
    }
    .iframe {
        border-radius: 4px;
    }

    @media (max-width: 1199.98px) {
        .story-heading {
            font-size: 19px;
            line-height: 29px;
        }

        .story-blockquote {
            font-size: 24px;
            line-height: 32px;
            padding-left: 18px;
        }
    }

    @media (max-width: 991.98px) {
        .story-heading {
            font-size: 18px;
            line-height: 28px;
        }

        .story-blockquote {
            font-size: 22px;
            line-height: 30px;
            padding-left: 16px;
        }
    }

    @media (max-width: 767.98px) {
        .story-heading {
            font-size: 17px;
            line-height: 27px;
        }

        .story-blockquote {
            font-size: 20px;
            line-height: 28px;
            padding-left: 14px;
        }
    }

    @media (max-width: 575.98px) {
        .story-heading {
            font-size: 18px;
            line-height: 26px;
        }

        .story-blockquote {
            font-size: 18px;
            line-height: 26px;
            padding-left: 12px;
        }
    }
</style>