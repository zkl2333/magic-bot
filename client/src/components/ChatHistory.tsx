const chatHistory = [
  {
    title: 'new chat',
    content: "I don't know what you're talking about",
    time: '2021-08-01 12:00:00'
  },
  {
    title: "I don't know what you're talking about",
    content: "I don't know what you're talking about",
    time: '2021-08-01 12:00:00'
  }
]

const ChatHistory = () => {
  return (
    <>
      {chatHistory.map((item, index) => (
        <div key={index} className={'rounded-md w-full bg-base-100 shadow mb-3 last:mb-0 hover:shadow-md'}>
          <div className='p-4'>{item.title}</div>
        </div>
      ))}
    </>
  )
}

export default ChatHistory
