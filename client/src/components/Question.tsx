import React from 'react'
import { useRef } from 'react';
import styles from "../styles/Question.module.scss"

import Editor from '@monaco-editor/react';
const Question = () => {
    const editorRef = useRef<any>(null);

    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;
    }

    function showValue() {
        if (editorRef.current) {
            alert(editorRef.current.getValue());
        }
    }
    return (
        <>
            <div className={styles.container}>Question</div>
            <Editor
                height="90vh"
                defaultLanguage="javascript"
                defaultValue="// some comment"
                onMount={handleEditorDidMount}
            />
        </>
    )
}

export default Question