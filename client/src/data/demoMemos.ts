const demoMemos = [
  {
    title: 'Go ahead and edit me!',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },
  {
    title: 'and this is just the beginning...',
    content:
      '=> way more features are coming soon - look out for the alpha release in December 2023!',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },

  {
    title: 'welcome to memoify!',
    content: '=> the web-based notes app built for your daily needs',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  }
];

export default demoMemos;
