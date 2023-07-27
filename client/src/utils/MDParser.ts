import showdown from 'showdown';
import parse from 'html-react-parser';

const converter = new showdown.Converter();

const richContent = (markdown: string) => parse(converter.makeHtml(markdown));

export default richContent;
