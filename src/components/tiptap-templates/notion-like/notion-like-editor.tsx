"use client";

import * as React from "react";
import {
  EditorContent,
  EditorContext,
  useEditor,
  EditorProvider as TiptapEditorProvider,
} from "@tiptap/react";
import type { Doc as YDoc } from "yjs";
import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { createPortal } from "react-dom";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Mention } from "@tiptap/extension-mention";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Placeholder, Selection } from "@tiptap/extensions";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Mathematics } from "@tiptap/extension-mathematics";
import { UniqueID } from "@tiptap/extension-unique-id";
import { Emoji, gitHubEmojis } from "@tiptap/extension-emoji";

// --- Hooks ---
import { useUiEditorState } from "@/hooks/use-ui-editor-state";
import { useScrollToHash } from "@/components/tiptap-ui/copy-anchor-link-button/use-scroll-to-hash";

// --- Custom Extensions ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { UiState } from "@/components/tiptap-extension/ui-state-extension";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { EmojiDropdownMenu } from "@/components/tiptap-ui/emoji-dropdown-menu";
import { MentionDropdownMenu } from "@/components/tiptap-ui/mention-dropdown-menu";
import { SlashDropdownMenu } from "@/components/tiptap-ui/slash-dropdown-menu";
import { DragContextMenu } from "@/components/tiptap-ui/drag-context-menu";

// --- Contexts ---
import { AppProvider } from "@/contexts/app-context";
import { UserProvider, useUser } from "@/contexts/user-context";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/notion-like/notion-like-editor.scss";

// --- Content ---
import { NotionEditorHeader } from "@/components/tiptap-templates/notion-like/notion-like-editor-header";
import { MobileToolbar } from "@/components/tiptap-templates/notion-like/notion-like-editor-mobile-toolbar";
import { NotionToolbarFloating } from "@/components/tiptap-templates/notion-like/notion-like-editor-toolbar-floating";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export interface EditorProviderProps {
  placeholder?: string;
  documentId: Id<"documents">;
}

/**
 * Loading spinner component shown while connecting to the notion server
 */
export function LoadingSpinner({ text = "Connecting..." }: { text?: string }) {
  return (
    <div className="spinner-container">
      <div className="spinner-content">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="spinner-loading-text">{text}</div>
      </div>
    </div>
  );
}

/**
 * EditorContent component that renders the actual editor
 */
export function EditorContentArea() {
  const { editor } = React.useContext(EditorContext)!;
  const {} = useUiEditorState(editor);

  useScrollToHash();

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      role="presentation"
      className="notion-like-editor-content"
      style={{
        cursor: editor.view.dragging ? "grabbing" : "auto",
      }}
    >
      <DragContextMenu />
      <EmojiDropdownMenu />
      <MentionDropdownMenu />
      <SlashDropdownMenu />
      <NotionToolbarFloating />

      {createPortal(<MobileToolbar />, document.body)}
    </EditorContent>
  );
}

/**
 * Component that creates and provides the editor instance
 */
export function EditorProvider(props: EditorProviderProps) {
  const { placeholder = "Start writing...", documentId } = props;
  const sync = useTiptapSync(api.prosemirror, documentId);

  if (sync.isLoading) {
    return <LoadingSpinner />;
  }

  if (!sync.initialContent) {
    return <div>No initial content</div>;
  }

  return (
    <div className="notion-like-editor-wrapper container py-8">
      <TiptapEditorProvider
        immediatelyRender={false}
        editorProps={{
          attributes: {
            class: "notion-like-editor",
          },
        }}
        extensions={[
          StarterKit.configure({
            undoRedo: false,
            horizontalRule: false,
            dropcursor: {
              width: 2,
            },
            link: { openOnClick: false },
          }),
          HorizontalRule,
          TextAlign.configure({ types: ["heading", "paragraph"] }),
          Placeholder.configure({
            placeholder,
            emptyNodeClass: "is-empty with-slash",
          }),
          Mention,
          Emoji.configure({
            emojis: gitHubEmojis.filter(
              (emoji) => !emoji.name.includes("regional")
            ),
            forceFallbackImages: true,
          }),
          Mathematics,
          Superscript,
          Subscript,
          Color,
          TextStyle,
          TaskList,
          TaskItem.configure({ nested: true }),
          Highlight.configure({ multicolor: true }),
          Selection,
          Image,
          ImageUploadNode.configure({
            accept: "image/*",
            maxSize: MAX_FILE_SIZE,
            limit: 3,
            upload: handleImageUpload,
            onError: (error) => console.error("Upload failed:", error),
          }),
          UniqueID.configure({
            types: [
              "paragraph",
              "bulletList",
              "orderedList",
              "taskList",
              "heading",
              "blockquote",
              "codeBlock",
            ],
          }),
          Typography,
          UiState,
          sync.extension,
        ]}
      >
        <EditorContentArea />
      </TiptapEditorProvider>
    </div>
  );
}

/**
 * Full editor with all necessary providers, ready to use with just a room ID
 */
export function NotionEditor({
  documentId,
  placeholder = "Start writing...",
}: EditorProviderProps) {
  return (
    <AppProvider>
      <NotionEditorContent placeholder={placeholder} documentId={documentId} />
    </AppProvider>
  );
}

/**
 * Internal component that handles the editor loading state
 */
export function NotionEditorContent({
  placeholder,
  documentId,
}: {
  placeholder?: string;
  documentId: Id<"documents">;
}) {
  return <EditorProvider placeholder={placeholder} documentId={documentId} />;
}
