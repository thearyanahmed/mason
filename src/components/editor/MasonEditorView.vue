<template>
    <div class="editor-view">
        <div v-if="!isEmpty" v-html="renderJLEditor()"></div>
    </div>
</template>

<script>
    export default {
        props: {
            story: {
                type: Array,
                required: true
            }
        },
        computed: {
            isEmpty() {
                if(!this.story)
                    return true

                if(this.story.length === 0)
                    return true

                if(this.story.length === 1) {
                    if(this.story[0].model === '' || this.story[0].model === null) {
                        return true
                    }
                }

                return false
            }
        },
        methods: {
            renderJLEditor() {
                let html = '';
                this.story.forEach(el => {
                    html += this.render(el)
                })
                return html
            },
            render(el) {
                if(!el.model) return ''

                const selected = el.selectedElement

                if(selected.isFile)
                    return this.renderImage(el)

                if(selected.isIframe)
                    return this.renderIFrame(el)

                return this.renderBaseElement(el)
            },
            renderBaseElement(el) {
                return `
                    <div class="${el.selectedElement.class}">${el.model}</div>
                `
            },
            renderImage(el) {
                return `
                    <div class="${el.selectedElement.class}"><img src="${el.model}"></div>
                `
            },
            renderIFrame(el) {
                const watchStringIdentifier = "watch?v="

                if (!el.model.includes(watchStringIdentifier))
                    return null

                const embedStringIdentifier = "embed/"

                let embedUrl = el.model.replace(
                    watchStringIdentifier,
                    embedStringIdentifier
                )

                const iframe = `
                        <div class="story-video-wrapper text-center">
                            <iframe class="iframe"
                                width="770"
                                height="425"
                                src="${embedUrl}?controls=0"
                                frameborder="0"
                                allow="accelerometer;
                                autoplay;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>
                    `
                return iframe;
            },
        }
    }
</script>

<style>
    .story-paragraph {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        padding: 10px 0;
    }
    .story-heading {
        font-size: 20px;
        font-weight: 600;
        line-height: 30px;
        padding: 10px 0;
    }
    .story-image {
        font-size: 0;
        line-height: 0;
        margin: 0;
        height: auto;
        padding: 10px 0
    }
    .story-image img {
        margin: 0 auto;
        width: 100%;
    }
    .story-blockquote {
        border-left: 2px solid #eee;
        box-sizing: border-box;
        color: #666;
        font-size: 30px;
        font-weight: 300;
        line-height: 40px;
        padding: 10px 10px 10px 20px;
        margin: 10px 0;
    }
    .story-video-wrapper {
        background-color: #000;
        margin: 0;
        padding: 0;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
        cursor: pointer;
    }
    .story-video-wrapper {
        width: 100%;
        position: relative;
        margin: 15px 0;
        padding-top: 25%;
        padding-bottom: 25%;
    }
    .story-video-wrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
    }
</style>