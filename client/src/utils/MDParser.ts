import showdown from 'showdown';
import parse from 'html-react-parser';

const brExtension = {
  type: 'output',
  filter: (text: string) => {
    // Replace each newline with a <br> element
    return text.replace(/\n/g, '<br>\n');
  }
};

const converter = new showdown.Converter({ extensions: [] });

const richContent = (markdown: string) => parse(converter.makeHtml(markdown));

export default richContent;
