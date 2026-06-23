import RichTextContent from "@shared/components/RichTextContent";

type AdminMarkdownPreviewProps = {
  content: string;
};

function AdminMarkdownPreview({ content }: AdminMarkdownPreviewProps) {
  if (!content.trim()) {
    return null;
  }

  return (
    <div className="admin-markdown-preview">
      <p className="admin-markdown-preview__label">Podgląd</p>
      <RichTextContent content={content} />
    </div>
  );
}

export default AdminMarkdownPreview;
