# Mason Editor


![Editor example](https://i.ibb.co/3CdP2Zh/image.png)

Mason editor is a pretty simple editor, consisting only header, paragraph, text , image and video (youtube).

To use the editor, you can clone this repository and use the MasonEditor and MasonEditorView from `src/components/editor`. You also need the Elements.js inside the folder.
But in your pages/views/components you'll just need to call the MasonEditor and MasonEditorView components.

## Using the editor

```
import MasonEditor from '/path/to/MasonEditor'

// in the template
<MasonEditor :editor="editorData" @upload="handleUpload" @dispatched-editor-data="setData" />
```
## Props

The component accepts one prop, `editor` and it is to be an `array`.
After writting, you need to save the json data from the editor. To get the editor data, you can dispatch an event to the root component.

```
getJSON() {
    this.$root.$emit('fetch_editor_data')
},
```

// As you have probably saw the @dispatched-editor-data="setData"
your setData method will return a JSON. You'll need to store it in your datastore/database. This json data will be used to display the content.

## Displaying the story

```
import MasonEditorView from '../components/editor/MasonEditorView'

<MasonEditorView :story="story" class="mt-2" />

// the story is the parsed data
// so basically

this.story = JSON.parse(jsonDataFromTheMasonEditor)
```

## Output

![Editor example](https://i.ibb.co/6Dh24rq/image.png)
![Editor example](https://i.ibb.co/HhLNzmc/image.png)

## file upload

```
//  @upload="handleUpload"

this upload event will be triggered when a upload was request, you should handle the upload in your logic, how you wish to handle the image.

//
handleUpload(data) {
    axios.post('/upload')
        .then(res => {
            let notifyMasonEditor = {
                status: 'success',
                index: data.index,
                file_url: response.data.image_url // from your server, should be the absolute path.
            }
            this.$root.$emit('mason-file-upload-finished', notifyMasonEditor)
        })
        .catch(() => {
            let notifyMasonEditor = {
                status: 'error',
                index: data.index,
            }
            this.$root.$emit('mason-file-upload-finished', notifyMasonEditor)
        })
}
```


More to come, hopefully.
