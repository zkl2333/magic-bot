import { ActionFunction, useRouteLoaderData, useSubmit } from 'react-router-dom'
import { LocalAssistant } from '../../types'
import OpenaiIcon from '../../../../components/OpenaiIcon'
import { useState } from 'react'
import { updateLocalAssistant } from '../../../../service/localAssistant'
import classNames from 'classnames'
import MarkdownRenderer from '../../../../components/MarkdownRenderer/MarkdownRenderer'
import { creatAssistant } from '../../../../service/assistant'

export const assistantEditAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const assistantUpdate = JSON.parse(formData.get('assistant') as string)
  updateLocalAssistant(assistantUpdate)
  return null
}

const roleText = {
  system: '系统',
  assistant: '助手',
  user: '用户'
}

const Edit = () => {
  const { assistant: _assistant } = useRouteLoaderData('assistant') as { assistant: LocalAssistant }
  const [assistant, _setAssistant] = useState(_assistant)
  let submit = useSubmit()

  const setModalConfig = (config: any) => {
    const newAssistant = {
      ...assistant,
      config: config
    }
    setAssistant(newAssistant)
  }

  const setAssistant = (assistant: LocalAssistant) => {
    _setAssistant(assistant)
    submit(
      { assistant: JSON.stringify(assistant) },
      {
        method: 'PUT'
      }
    )
  }

  const itemClassName =
    'w-full h-full flex flex-col bg-base-100 rounded-box justify-between items-center p-4 lg:p-8 shadow-xl'

  return (
    <div className='p-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,auto))] grid-flow-row-dense'>
      <div className={itemClassName}>
        <div className='flex-1 flex flex-col justify-center items-center'>
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
            <div className='space-x-4'>
              <div
                className='btn btn-sm'
                onClick={() => {
                  creatAssistant({
                    name: _assistant.name,
                    description: _assistant.description,
                    config: _assistant.config,
                    avatar: _assistant.avatar,
                    isPublic: true
                  })
                }}
              >
                分享到市场
              </div>
              <div className='btn btn-sm btn-disabled'>从市场更新</div>
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
          <input
            type='text'
            value={assistant.config.model}
            className='input input-bordered w-full'
            onChange={e => {
              setModalConfig({
                ...assistant.config,
                model: e.target.value
              })
            }}
          />
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
            className='textarea input-bordered w-full'
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
            className='textarea input-bordered w-full'
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
