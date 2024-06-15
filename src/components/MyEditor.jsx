import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const MyEditor = forwardRef((props, ref) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };
  useImperativeHandle(ref, () => ({
    saveContent,
  }));

  const handleBeforeInput = (input) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(startKey);
    const blockText = block.getText();

    if (blockText === "#" && input === " ") {
      applyBlockType("header-one");
      return "handled";
    }
    if (blockText === "*" && input === " ") {
      applyInlineStyle("BOLD");
      return "handled";
    }
    if (blockText === "**" && input === " ") {
      applyInlineStyle("RED");
      return "handled";
    }
    if (blockText === "***" && input === " ") {
      applyInlineStyle("UNDERLINE");
      return "handled";
    }
    if (blockText === "```" && input === " ") {
      applyBlockType("code-block");
      return "handled";
    }
    return "not-handled";
  };

  const applyBlockType = (blockType) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const block = contentState.getBlockForKey(startKey);
    const blockText = block.getText();

    const newText =
      blockType === "code-block" ? blockText.slice(3) : blockText.slice(1);
    const newContentState = Modifier.replaceText(
      contentState,
      selection.merge({
        anchorOffset: 0,
        focusOffset: blockText.length,
      }),
      newText
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "remove-range"
    );

    setEditorState(RichUtils.toggleBlockType(newEditorState, blockType));
  };

  const applyInlineStyle = (inlineStyle) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const block = contentState.getBlockForKey(startKey);
    const blockText = block.getText();

    const newText =
      inlineStyle === "RED" ? blockText.slice(2) : blockText.slice(3);
    const newContentState = Modifier.replaceText(
      contentState,
      selection.merge({
        anchorOffset: 0,
        focusOffset: blockText.length,
      }),
      newText
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "remove-range"
    );

    setEditorState(RichUtils.toggleInlineStyle(newEditorState, inlineStyle));
  };

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("editorContent", contentRaw);
    alert("Content saved!");
  };

  return (
    <div className="editor">
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        handleBeforeInput={handleBeforeInput}
        placeholder="Start typing..."
        customStyleMap={styleMap}
      />
    </div>
  );
});

const styleMap = {
  RED: {
    color: "red",
  },
};

export default MyEditor;
