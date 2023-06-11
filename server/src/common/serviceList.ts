const serviceList = [
  {
    name: 'GPT-3.5',
    type: 'gpt-3.5',
    include: ['gpt-3.5-turbo', 'gpt-3.5-turbo-0301']
  },
  {
    name: 'GPT-4',
    type: 'gpt-4',
    include: ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314']
  }
]

export const getServiceType = (modal: string) => {
  for (const service of serviceList) {
    if (service.include.includes(modal)) {
      return service.type
    }
  }
  return null
}

export default serviceList
