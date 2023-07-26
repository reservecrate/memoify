const demoMemos = [
  {
    title: 'go ahead and edit me!',
    content:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },
  {
    title: 'proudly open source and free',
    content:
      '=> way more features are coming soon - look out for any updates in the near future!',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },

  {
    title: 'welcome to memoify!',
    content: '=> the web-based notes app built for your essential daily needs',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  }
];

export default demoMemos;
