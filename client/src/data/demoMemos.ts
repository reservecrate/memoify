const demoMemos = [
  {
    title: 'go ahead and edit me!',
    content:
      '=> lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },
  {
    title: 'free & open-source',
    content:
      '=> with way more features coming soon - look out for any new updates in the near future!',
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
