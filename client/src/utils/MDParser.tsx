// import showdown from 'showdown';
// import parse from 'html-react-parser';
import ReactMarkdown, { RenderProps } from 'react-markdown';

// const converter = new showdown.Converter({ extensions: [] });

// const richContent = (markdown: string) => parse(converter.makeHtml(markdown));

const MarkdownToHtmlConverter = (markdown: string) => {
  const components = {
    h1: ({ node, children }) => <h1>{children}</h1>,
    h2: ({ node, children }) => <h2>{children}</h2>,
    h3: ({ node, children }) => <h3>{children}</h3>,
    h4: ({ node, children }) => <h4>{children}</h4>,
    h5: ({ node, children }) => <h5>{children}</h5>,
    h6: ({ node, children }) => <h6>{children}</h6>,
    strong: ({ node, children }) => <strong>{children}</strong>,
    em: ({ node, children }) => <em>{children}</em>,
    ul: ({ node, children }) => <ul>{children}</ul>,
    li: ({ node, children }) => <li>{children}</li>
  };

  return <ReactMarkdown children={markdown} components={components} />;
};

export default MarkdownToHtmlConverter;

// export default MDParser;
