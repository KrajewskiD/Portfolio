import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { richTextSanitizeSchema } from "@shared/content/rehypeSanitizeSchema";

type RichTextContentProps = {
  content: string;
  className?: string;
};

const markdownComponents: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

function RichTextContent({ content, className = "" }: RichTextContentProps) {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return null;
  }

  return (
    <div className={["site-rich-text", className].filter(Boolean).join(" ")}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, richTextSanitizeSchema]]}
        components={markdownComponents}
      >
        {trimmedContent}
      </Markdown>
    </div>
  );
}

export default RichTextContent;
