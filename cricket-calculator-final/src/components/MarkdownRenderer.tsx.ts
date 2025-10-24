<content><![CDATA[import React from 'react';
interface MarkdownRendererProps {
content: string;
}
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
const renderLines = () => {
const lines = content.split('\n');
const elements = [];
let listType: 'ul' | 'ol' | null = null;
let listItems: React.ReactElement[] = [];
code
Code
const flushList = () => {
  if (listItems.length > 0) {
    if (listType === 'ul') {
      elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-outside pl-5 space-y-1">{listItems}</ul>);
    } else if (listType === 'ol') {
      elements.push(<ol key={`ol-${elements.length}`} className="list-decimal list-outside pl-5 space-y-1">{listItems}</ol>);
    }
    listItems = [];
    listType = null;
  }
};

lines.forEach((line, index) => {
  // Bold and Italic
  const formattedLine = line
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Unordered list
  if (line.trim().startsWith('* ')) {
    if (listType !== 'ul') {
      flushList();
      listType = 'ul';
    }
    listItems.push(<li key={index} dangerouslySetInnerHTML={{ __html: formattedLine.substring(line.indexOf('* ') + 2) }} />);
  } 
  // Ordered list
  else if (line.trim().match(/^\d+\.\s/)) {
    if (listType !== 'ol') {
      flushList();
      listType = 'ol';
    }
    listItems.push(<li key={index} dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^\d+\.\s/, '') }} />);
  } 
  // Paragraphs
  else {
    flushList();
    if (line.trim() !== '') {
      elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />);
    } else if (elements.length > 0) {
        // Preserve empty lines for spacing, but not at the beginning
        elements.push(<p key={index}>&nbsp;</p>)
    }
  }
});

flushList(); // Flush any remaining list items
return elements;
};
return (
<div className="prose prose-invert max-w-none text-gray-200 space-y-3" style={{ 'whiteSpace': 'pre-wrap' }}>
{renderLines()}
</div>
);
};
export default MarkdownRenderer;
]]></content>
