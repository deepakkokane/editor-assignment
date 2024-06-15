import React, { useRef } from "react";
import MyEditor from "./components/MyEditor";
import "./app.css";
import { Title } from "./components/Title";
import SaveButton from "./components/SaveButton";

const App = () => {
  const editorRef = useRef(null);

  const saveContent = () => {
    if (editorRef.current) {
      editorRef.current.saveContent();
    }
  };

  return (
    <div className="editor-container">
      <Title text="My Editor" />
      <MyEditor ref={editorRef} />
      <SaveButton onSave={saveContent} />
    </div>
  );
};

export default App;
