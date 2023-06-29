import { ActionFunction, useRouteLoaderData, useSubmit } from 'react-router-dom'
import OpenaiIcon from '../../../../components/OpenaiIcon'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import MarkdownRenderer from '../../../../components/MarkdownRenderer/MarkdownRenderer'
import {
  AssistantWithForks,
  AssistantWithLocal,
  AssistantWithSyncInfo,
  creatAssistant,
  updateAssistant
} from '../../../../service/assistant'
import { useDebounce } from '../../../../hooks'
import Select from '@mui/base/Select'
import Option from '@mui/base/Option'

export const assistantIdEditAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  switch (request.method) {
    case 'PUT':
      const assistantUpdate = JSON.parse(formData.get('assistant') as string)
      await updateAssistant(assistantUpdate)
      return null
    case 'GET':
      return null
  }
}

const roleText = {
  system: '系统',
  assistant: '助手',
  user: '用户'
}

const Edit = () => {
  const { assistant: _assistant } = useRouteLoaderData('assistant') as {
    assistant: AssistantWithLocal & AssistantWithForks & AssistantWithSyncInfo
  }
  const [assistant, _setAssistant] = useState<AssistantWithLocal>(_assistant)
  let submit = useSubmit()

  useEffect(() => {
    _setAssistant(_assistant)
  }, [_assistant])

  const updateAssistant = useDebounce((assistant: AssistantWithLocal & AssistantWithSyncInfo) => {
    submit(
      { assistant: JSON.stringify(assistant) },
      {
        method: 'PUT'
      }
    )
  }, 1000)

  const pushAssistant = (
    assistant: Pick<
      AssistantWithForks,
      'name' | 'description' | 'config' | 'avatar' | 'forkedFromId' | 'isPublic'
    >
  ) => {
    creatAssistant(assistant)
    submit(null, {
      method: 'GET'
    })
  }

  const setModalConfig = (config: any) => {
    const newAssistant = {
      ...assistant,
      config: config
    }
    console.log(newAssistant)
    setAssistant(newAssistant)
  }

  const setAssistant = (assistant: AssistantWithLocal) => {
    _setAssistant(assistant)
    updateAssistant(assistant)
  }

  const itemClassName =
    'w-full h-full flex flex-col bg-base-100 rounded-box justify-between items-center p-4 lg:p-8 shadow-xl'

  const modalList = [
    {
      name: 'gpt-4',
      value: 'gpt-4'
    },
    {
      name: 'gpt-4-0314',
      value: 'gpt-4-0314'
    },
    {
      name: 'gpt-4-0613',
      value: 'gpt-4-0613'
    },
    {
      name: 'gpt-4-32k',
      value: 'gpt-4-32k',
      disabled: true
    },
    {
      name: 'gpt-4-32k-0314',
      value: 'gpt-4-32k-0314',
      disabled: true
    },
    {
      name: 'gpt-3.5-turbo',
      value: 'gpt-3.5-turbo'
    },
    {
      name: 'gpt-3.5-turbo-0301',
      value: 'gpt-3.5-turbo-0301'
    },
    {
      name: 'gpt-3.5-turbo-0613',
      value: 'gpt-3.5-turbo-0613'
    },
    {
      name: 'gpt-3.5-turbo-16k',
      value: 'gpt-3.5-turbo-16k'
    },
    {
      name: 'gpt-3.5-turbo-16k-0613',
      value: 'gpt-3.5-turbo-16k-0613'
    }
  ]

  return (
    <div className='p-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,auto))] grid-flow-row-dense overflow-y-auto'>
      <div className={itemClassName}>
        <div className='flex-1 w-full flex flex-col justify-center items-center'>
          <div className='online avatar mb-3'>
            <div className='rounded-full bg-base-content h-24 w-24 bg-opacity-10'>
              {_assistant.avatar ? (
                <img src={_assistant.avatar} />
              ) : (
                <OpenaiIcon
                  style={{
                    backgroundColor: 'rgb(16, 163, 127)'
                  }}
                  className='p-1.5 text-[#fff]'
                />
              )}
            </div>
          </div>
          <div>
            <div className='text-center'>
              <div className='text-lg font-extrabold'>{_assistant.name}</div>
              <div className='text-base-content/70 my-3 text-sm'>{_assistant.description}</div>
            </div>
            <div className='flex  justify-center space-x-4'>
              {!_assistant.isPublic && (
                <div
                  className={classNames('btn btn-sm', {
                    'btn-disabled':
                      _assistant.forks.length > 0 || _assistant.updatedAt === _assistant.createdAt
                  })}
                  onClick={() => {
                    pushAssistant({
                      name: _assistant.name,
                      description: _assistant.description,
                      config: _assistant.config,
                      avatar: _assistant.avatar,
                      forkedFromId: _assistant.id,
                      isPublic: true
                    })
                  }}
                >
                  分享到市场
                </div>
              )}
              {_assistant.forkedFrom?.isPublic && (
                <div
                  className={classNames('btn btn-sm', {
                    'btn-disabled':
                      _assistant.lastSyncAt && _assistant.lastSyncAt >= _assistant.forkedFrom.updatedAt
                  })}
                  onClick={() => {
                    {
                      _assistant.forkedFrom &&
                        updateAssistant({
                          ..._assistant,
                          config: _assistant.forkedFrom.config,
                          avatar: _assistant.forkedFrom.avatar,
                          name: _assistant.forkedFrom.name,
                          description: _assistant.forkedFrom.description,
                          lastSyncAt: new Date()
                        })
                    }
                  }}
                >
                  从市场更新
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(itemClassName)}>
        <div className='form-control w-full'>
          <h3 className='mb-4 text-xl'>基本设置</h3>
          <label className='label'>
            <span className='label-text'>模型：</span>
          </label>
          <Select
            value={assistant.config.model}
            className='select select-bordered w-full flex items-center font-normal'
            slotProps={{ listbox: { className: 'menu bg-base-100 shadow rounded-box' } }}
            onChange={(_, value) => {
              setModalConfig({
                ...assistant.config,
                model: value
              })
            }}
          >
            {modalList.map((item, index) => {
              return (
                <Option
                  key={index}
                  value={item.value}
                  disabled={item.disabled}
                  slotProps={{
                    root: {
                      className: item.disabled ? 'disabled' : ''
                    }
                  }}
                >
                  <a>{item.name}</a>
                </Option>
              )
            })}
          </Select>
        </div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>名称：</span>
          </label>
          <input
            type='text'
            value={assistant.name}
            className='input input-bordered w-full'
            onChange={e => {
              setAssistant({
                ...assistant,
                name: e.target.value
              })
            }}
          />
        </div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>描述</span>
          </label>
          <textarea
            value={assistant.description}
            className='textarea textarea-bordered w-full'
            onChange={e => {
              setAssistant({
                ...assistant,
                description: e.target.value
              })
            }}
          />
        </div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>初始消息</span>
          </label>
          <textarea
            value={assistant.config.initialMessage}
            className='textarea textarea-bordered w-full'
            onChange={e => {
              setAssistant({
                ...assistant,
                config: {
                  ...assistant.config,
                  initialMessage: e.target.value
                }
              })
            }}
          />
        </div>
      </div>
      <div className={classNames(itemClassName, 'col-span-1 lg:col-span-2')}>
        <div className='w-full'>
          <h3 className='mb-4 text-xl'>参数调节</h3>
          <label className='mb-1'>
            上下文数：
            <span className='countdown'>
              <span style={{ '--value': assistant.config.context_size } as any}></span>
            </span>
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='1'
            max='20'
            value={assistant.config.context_size}
            onChange={e => {
              setModalConfig({
                ...assistant.config,
                context_size: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            最大生成长度：
            {assistant.config.max_tokens}
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='1'
            max='2600'
            value={assistant.config.max_tokens}
            onChange={e => {
              setModalConfig({
                ...assistant.config,
                max_tokens: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            <div
              className='tooltip'
              data-tip='控制文本多样性，高值创新多样但不可信，低值保守无新意。（用于创意文本生成。）'
            >
              随机属性：
              {assistant.config.temperature}
            </div>
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='0'
            max='2'
            step='0.1'
            value={assistant.config.temperature}
            onChange={e => {
              setModalConfig({
                ...assistant.config,
                top_p: 1,
                temperature: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            <div
              className='tooltip'
              data-tip='控制文本多样性和保真度。高值多样但不准确，低值保险且准确。（用于科技文本、学术论文等需要准确性的文本生成。）'
            >
              词汇属性：
              {assistant.config.top_p}
            </div>
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='0'
            max='1'
            step='0.1'
            value={assistant.config.top_p}
            onChange={e => {
              setModalConfig({
                ...assistant.config,
                temperature: 1,
                top_p: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            <div
              className='tooltip'
              data-tip='控制文本同一词汇重复情况。当此参数值大于0时，将鼓励模型生成不同的单词，并尽可能避免使用已经在之前生成的文本中出现过的单词。'
            >
              重复惩罚：
              {assistant.config.presence_penalty}
            </div>
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='-2'
            max='2'
            step='0.1'
            value={assistant.config.presence_penalty}
            onChange={e => {
              setModalConfig({
                ...assistant.config,
                presence_penalty: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            <div
              className='tooltip'
              data-tip='控制文本罕见词汇出现情况。当此参数值大于0时，将抑制模型生成频繁出现的单词，并鼓励生成罕见的单词。'
            >
              频率惩罚：
              {assistant.config.frequency_penalty}
            </div>
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='-2'
            max='2'
            step='0.1'
            value={assistant.config.frequency_penalty}
            onChange={e => {
              setModalConfig({
                ...assistant.config,
                frequency_penalty: Number(e.target.value)
              })
            }}
          />
        </div>
      </div>
      {assistant.config.prompt && (
        <div className={classNames(itemClassName, 'col-span-1 lg:col-span-2')}>
          <div className='w-full'>
            <h3 className='mb-4 text-xl'>内置提示词</h3>
            <div className='bg-base-300 p-4 rounded-box'>
              {assistant.config.prompt.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={classNames('chat', {
                      'chat-end': item.role === 'user',
                      'chat-start': item.role !== 'user'
                    })}
                  >
                    <div className='chat-header'>{roleText[item.role]}</div>
                    {item.role === 'user' ? (
                      <div className='chat-bubble chat-bubble-primary'>{item.content}</div>
                    ) : item.role === 'assistant' ? (
                      <MarkdownRenderer
                        className='chat-bubble bg-base-100 text-base-content'
                        text={item.content}
                      />
                    ) : (
                      <div className='chat-bubble'>{item.content}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Edit
