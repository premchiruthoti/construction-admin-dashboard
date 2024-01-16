// components/custom-editor.js

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "code",
    "subscript",
    "superscript",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "|",
    "highlight:yellowMarker",
    "highlight:greenMarker",
    "highlight:pinkMarker",
    "highlight:greenPen",
    "highlight:redPen",
    "removeHighlight",
    "|",
    "horizontalLine",
    "alignment",
    "|",
    "insertImage",
    "toggleImageCaption",
    "imageTextAlternative",
    "|",
    "link",
    "findAndReplace",
    "codeBlock",
    "fontSize",
    "fontColor",
    "fontBackgroundColor",
    "removeFormat",
    "showBlocks",
    "specialCharacters",
    "undo",
    "redo",
  ],
};

function CustomEditor(props) {
  return (
    <CKEditor 
      editor={Editor}
      config={editorConfiguration}
      data={props.initialData}
      onChange={(event, editor) => {
        const data = editor.getData();
        props.description(data);
        // console.log( { event, editor, data } );
      }}
    />
  );
}

export default CustomEditor;
