const demoMemos = [
  {
    title: 'go ahead and edit me!',
    content:
      "# heading 1\n## heading 2\n### heading 3\n#### heading 4\nhere's *italicised* text\nhere's **bolded** text\nhere's ~~strikethrough~~ text\nauto-linking: https://react.dev\n> here's a blockquote\n\n`const isCodeBlock = true;`\n\n---\n##### ordered list\n1. numbered item\n2. numbered item\n---\n##### unordered list\n- bullet point\n- bullet point\n---\n##### basic table\n\n| language | created |\n| - | - |\n| Python | 1991 |\n| Ruby | 1993 |\n| PHP | 1994 |\n| JavaScript | 1995 |",
    dateCreated: Date.now(),
    author: { username: 'memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },
  {
    title: 'free & open-source',
    content:
      '=> way more features are coming soon - expect regular updates in the near future!',
    dateCreated: Date.now(),
    author: { username: 'memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },

  {
    title: 'welcome to memoify!',
    content:
      '=> the web-based notes app built for your essential daily needs, combining simplicity, accessibility and minimalism with the power of `Markdown syntax`, **rich text functionality** and *extended customisability*',
    dateCreated: Date.now(),
    author: { username: 'memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  }
];

export default demoMemos;
