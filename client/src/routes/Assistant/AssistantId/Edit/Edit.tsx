import { useRouteLoaderData } from 'react-router-dom'
import { Assistant } from '../../types'
import OpenaiIcon from '../../../../components/OpenaiIcon'
import { useState } from 'react'
import classNames from 'classnames'
import { updateAssistant } from '../../service/assistant'

const Edit = () => {
  const { assistant: _assistant } = useRouteLoaderData('assistant') as { assistant: Assistant }
  const [assistant, _setAssistant] = useState(_assistant)
  const setModalConfig = (config: any) => {
    const newAssistant = {
      ...assistant,
      modelConfig: config
    }
    setAssistant(newAssistant)
    updateAssistant(newAssistant)
  }

  const setAssistant = (assistant: Assistant) => {
    _setAssistant(assistant)
    updateAssistant(assistant)
  }

  const itemClassName =
    'w-full h-full flex flex-col bg-base-100 rounded-box justify-between items-center p-8 shadow-xl'

  return (
    <div className='p-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(380px,auto))]'>
      <div className={classNames(itemClassName)}>
        <div className='flex-1 flex flex-col justify-center items-center'>
          <div className='online avatar mb-3'>
            <div className='rounded-full bg-base-content h-24 w-24 bg-opacity-10 p-px'>
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
          </div>
        </div>
      </div>
      <div className={itemClassName}>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>模型：</span>
          </label>
          <input
            type='text'
            value={assistant.modelConfig.model}
            className='input input-bordered w-full'
            onChange={e => {
              setModalConfig({
                ...assistant.modelConfig,
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
            value={assistant.initialMessage}
            className='textarea input-bordered w-full'
            onChange={e => {
              setAssistant({
                ...assistant,
                initialMessage: e.target.value
              })
            }}
          />
        </div>
      </div>
      <div className={itemClassName}>
        <div className='w-full'>
          <label className='mb-1'>
            上下文数：
            <span className='countdown'>
              <span style={{ '--value': assistant.modelConfig.context_size } as any}></span>
            </span>
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='1'
            max='20'
            value={assistant.modelConfig.context_size}
            onChange={e => {
              setModalConfig({
                ...assistant.modelConfig,
                context_size: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            最大生成长度：
            {assistant.modelConfig.max_tokens}
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='1'
            max='2600'
            value={assistant.modelConfig.max_tokens}
            onChange={e => {
              setModalConfig({
                ...assistant.modelConfig,
                max_tokens: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            随机属性：
            {assistant.modelConfig.temperature}
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='0'
            max='1'
            step='0.1'
            value={assistant.modelConfig.temperature}
            onChange={e => {
              setModalConfig({
                ...assistant.modelConfig,
                top_p: 1,
                temperature: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            词汇属性：
            {assistant.modelConfig.top_p}
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='0'
            max='1'
            step='0.1'
            value={assistant.modelConfig.top_p}
            onChange={e => {
              setModalConfig({
                ...assistant.modelConfig,
                temperature: 1,
                top_p: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            重复惩罚：
            {assistant.modelConfig.presence_penalty}
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='-2'
            max='2'
            step='0.1'
            value={assistant.modelConfig.presence_penalty}
            onChange={e => {
              setModalConfig({
                ...assistant.modelConfig,
                presence_penalty: Number(e.target.value)
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label className='mb-1'>
            频率惩罚：
            {assistant.modelConfig.frequency_penalty}
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='-2'
            max='2'
            step='0.1'
            value={assistant.modelConfig.frequency_penalty}
            onChange={e => {
              setModalConfig({
                ...assistant.modelConfig,
                frequency_penalty: Number(e.target.value)
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Edit
