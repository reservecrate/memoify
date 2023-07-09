const demoMemos = [
  {
    title: 'welcome...',
    content: '=> to Memoify!',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },
  {
    title: 'the minimalist notes web app...',
    content: '=> built for your basic daily needs!',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  },
  {
    title: 'go ahead and edit me!',
    content: '=> lorem ipsum dolor sit amet.',
    dateCreated: Date.now(),
    author: { username: 'Memoify', name: 'Memoify', id: '' },
    id: 'demoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
  }
];

export default demoMemos;
