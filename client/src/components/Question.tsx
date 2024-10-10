import React from 'react'
import { useRef, useState } from 'react';
import styles from "../styles/Question.module.scss"
import "../styles/MEditor.scss"
import Editor from '@monaco-editor/react';
const Question = () => {
    const editorRef = useRef<any>(null);

    const questionText = `# Q: Using reduce, calculate the maximum element of the list
from functools import reduce
l = [1, 2, 3, 4, 5, 6]

max_element = ...

assert max_element == 6, "Max element should be 6"
    `;
    const editableLines = [5, 6];
    const maxChOnLine = 100
    const maxLines = 20
    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;

        monaco.editor.defineTheme('customTheme', {
            base: 'vs-dark', // Set base theme
            inherit: true, // Inherit default rules
            rules: [
                { token: 'comment', foreground: 'FF5733' }, // Set comments to orange (#FF5733)
                { token: 'identifier', foreground: '9CDCFE' }, // Light blue identifiers
                { token: 'identifier.function', foreground: 'DCDCAA' }, // Light yellow functions
                { token: 'type', foreground: '1AAFB0' }, // Cyan for types
            ],
            colors: {},
        });

        monaco.editor.setTheme('customTheme');

        editor.deltaDecorations([], [
            {
                range: new monaco.Range(editableLines[0], 1, editableLines[1], 1), // Lines 1-6, as the question is 6 lines
                options: {
                    isWholeLine: true,
                    className: 'read-only-line', // Optional: Add a CSS class to style the read-only lines
                },
            },
        ]);

        // Disable selection and editing outside editableLines
        editor.onMouseDown((e: any) => {
            const position = e.target.position;
            if (position && (position.lineNumber < editableLines[0] || position.lineNumber > editableLines[1])) {
                // e.preventDefault(); // Prevent mouse selection in non-editable lines
                // e.stopPropagation();
            }
        });
        editor.onDidChangeCursorSelection((e: any) => {
            const selection = e.selection;

            // Check if the selection starts or extends into a non-editable line
            if (
                selection.startLineNumber < editableLines[0] || selection.startLineNumber > editableLines[1] ||
                selection.endLineNumber < editableLines[0] || selection.endLineNumber > editableLines[1]
            ) {
                // Restrict the selection to the editable lines only
                const adjustedStartLineNumber = Math.max(selection.startLineNumber, editableLines[0]);
                const adjustedEndLineNumber = Math.min(selection.endLineNumber, editableLines[1]);

                // Create a new selection limited to the editable range
                const newSelection = new monaco.Selection(
                    adjustedStartLineNumber,
                    selection.startColumn,
                    adjustedEndLineNumber,
                    selection.endColumn
                );

                editor.setSelection(newSelection); // Set the new restricted selection
            }
        });
        editor.onDidChangeModelContent(() => {
            const model = editor.getModel();
            const val = checkEditorConditions(editor, model);
        });

        editor.onKeyDown((e: any) => {
            const position = editor.getPosition();
            const model = editor.getModel();

            const isBackspace = e.keyCode === monaco.KeyCode.Backspace;
            const isEnter = e.keyCode === monaco.KeyCode.Enter;
            if (position && (position.lineNumber < editableLines[0] || position.lineNumber > editableLines[1])) {
                e.preventDefault(); // Prevent any key input on the protected lines
                e.stopPropagation();
                // if (isBackspace) {
                //     e.preventDefault(); // Disable backspace
                // }
            }
            else if (position && model) {
                const lineContent = model.getLineContent(position.lineNumber).trim();

                // Prevent backspace or enter on an empty editable line
                if (lineContent === '' && (isBackspace || isEnter)) {
                    e.preventDefault(); // Prevent backspace or enter on an empty line
                    e.stopPropagation();
                }
            }
        });

        // Handle pasting: prevent pasting into protected lines
        editor.onDidPaste((e: any) => {
            const position = editor.getPosition();
            if (position && (position.lineNumber < editableLines[0] || position.lineNumber > editableLines[1])) {
                e.preventDefault(); // Prevent any key input on the protected lines
                e.stopPropagation();
            }
        });
    }
    const checkEditorConditions = (editor: any, model: any) => {
        const lineCount = model.getLineCount();
        let longLineExists = false;
        let nonEmptyLines = 0;

        for (let i = 1; i <= lineCount; i++) {
            const lineContent = model.getLineContent(i);
            if (lineContent.length > maxChOnLine) {
                return 1
            }
            if (lineContent.trim() !== '') {
                nonEmptyLines++;
            }
        }

        if (nonEmptyLines > maxLines) return 1
        return 0
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
                height="50vh"
                defaultLanguage="python"
                defaultValue={questionText}
                onMount={handleEditorDidMount}
                options={{
                    scrollbar: {
                        vertical: 'hidden', // Hide vertical scroll bar
                        horizontal: 'hidden', // Hide horizontal scroll bar
                    },
                    overviewRulerLanes: 0, // Optionally hide the overview ruler
                    minimap: {
                        enabled: false, // Optionally disable minimap
                    },
                }}
            />
            <button className={styles.hibutton} onClick={showValue}>Show code</button>
        </>
    )
}

export default Question