let ELEMENTS = [
    {
        icon: "heading",
        desc: "Header",
        placeholder: "Header",
        class: "input-area story-heading",
        selectorClass:
            "editor-control__dashboard__button js-header-button"
    },
    {
        icon: `quote-right`,
        desc: "Quote",
        placeholder: "Quote",
        class: "input-area story-blockquote",
        selectorClass:
            "editor-control__dashboard__button js-quote-button"
    },
    {
        icon: "paragraph",
        desc: "Text",
        placeholder: "Text",
        class: "input-area story-paragraph",
        selectorClass:
            "editor-control__dashboard__button js-text-button"
    },
    {
        icon: `image`,
        desc: "Image",
        class: "input-area story-image",
        selectorClass:
            "editor-control__dashboard__button js-image-button",
        hasDropZone: true,
        hasFilePicker: true,
        isFile: true
    },
    {
        icon: `video`,
        desc: "Video",
        class: "story-video",
        placeholder: "https://www.youtube.com/",
        selectorClass:
            "editor-control__dashboard__button js-video-button",
        isIframe: true
    }
]

export default ELEMENTS