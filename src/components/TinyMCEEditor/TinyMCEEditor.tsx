import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditorInstance } from 'tinymce';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useEditorImageUploader } from '@/hooks/useEditorImageUploader';
import type { TinyMCEEditorProps } from './TinyMCEEditor.types';
import styles from './TinyMCEEditor.module.scss';

const TINYMCE_BASE_URL = 'https://public.grimity.com/tinymce';
const TINYMCE_SCRIPT_SRC = `${TINYMCE_BASE_URL}/tinymce.min.js`;

export function TinyMCEEditor({ value, onChange }: TinyMCEEditorProps) {
  const editorRef = useRef<TinyMCEEditorInstance | null>(null);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isTablet = useMediaQuery('(max-width: 900px)');
  const { uploadImage } = useEditorImageUploader();

  return (
    <div className={styles.container}>
      <Editor
        tinymceScriptSrc={TINYMCE_SCRIPT_SRC}
        licenseKey="gpl"
        onInit={(_, editor) => {
          editorRef.current = editor;
        }}
        init={{
          height: isMobile ? 500 : isTablet ? 700 : 600,
          resize: 'both',
          menubar: false,
          plugins: ['image', 'link', 'autolink'],
          toolbar: isMobile
            ? 'undo redo | h1 h2 link image | bold italic underline strikethrough | forecolor backcolor'
            : 'undo redo | h1 h2 | bold italic underline strikethrough | forecolor backcolor | link image',
          content_style: `
            body {
              font-family: Pretendard, sans-serif;
              font-size: 14px;
            }
            img {
              max-width: 100%;
              height: auto !important;
            }
            h1 { margin: 14px 0; }
            h2 { margin: 14px 0; }
            p { margin: 6px 0; }
          `,
          base_url: TINYMCE_BASE_URL,
          skin_url: `${TINYMCE_BASE_URL}/skins/ui/oxide`,
          icons_url: `${TINYMCE_BASE_URL}/icons/default/icons.js`,
          statusbar: false,
          indent: false,
          indent_use_margin: true,
          indent_size: 4,
          relative_urls: false,
          remove_script_host: false,
          setup: (editor) => {
            editor.on('keydown', (event) => {
              if (event.key === 'Tab') {
                event.preventDefault();
                editor.execCommand('mceInsertContent', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
              }
            });
          },
          images_upload_handler: uploadImage,
        }}
        value={value}
        onEditorChange={onChange}
      />
    </div>
  );
}
