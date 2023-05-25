import { ActionFunction, useRouteLoaderData, useSubmit } from 'react-router-dom'
import { Assistant } from '../../types'
import OpenaiIcon from '../../../../components/OpenaiIcon'
import { useState } from 'react'
import classNames from 'classnames'
import { updateAssistant } from '../../service/assistant'

export const assistantEditAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const assistantUpdate = JSON.parse(formData.get('assistant') as string)
  updateAssistant(assistantUpdate)
  return null
}

const Edit = () => {
  const { assistant: _assistant } = useRouteLoaderData('assistant') as { assistant: Assistant }
  const [assistant, _setAssistant] = useState(_assistant)
  let submit = useSubmit()

  const setModalConfig = (config: any) => {
    const newAssistant = {
      ...assistant,
      modelConfig: config
    }
    setAssistant(newAssistant)
  }

  const setAssistant = (assistant: Assistant) => {
    _setAssistant(assistant)
    submit(
      { assistant: JSON.stringify(assistant) },
      {
        method: 'PUT'
      }
    )
  }

  const itemClassName =
    'w-full h-full flex flex-col bg-base-100 rounded-box justify-between items-center p-8 shadow-xl'

  return (
    <div className='p-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(380px,auto))]'>
      <div className={classNames(itemClassName)}>
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
            <div
              className='tooltip'
              data-tip='控制文本多样性，高值创新多样但不可信，低值保守无新意。（用于创意文本生成。）'
            >
              随机属性：
              {assistant.modelConfig.temperature}
            </div>
          </label>
          <input
            type='range'
            className='range range-xs range-primary'
            min='0'
            max='2'
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
            <div
              className='tooltip'
              data-tip='控制文本多样性和保真度。高值多样但不准确，低值保险且准确。（用于科技文本、学术论文等需要准确性的文本生成。）'
            >
              词汇属性：
              {assistant.modelConfig.top_p}
            </div>
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
            <div
              className='tooltip'
              data-tip='控制文本同一词汇重复情况。当此参数值大于0时，将鼓励模型生成不同的单词，并尽可能避免使用已经在之前生成的文本中出现过的单词。'
            >
              重复惩罚：
              {assistant.modelConfig.presence_penalty}
            </div>
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
            <div
              className='tooltip'
              data-tip='控制文本罕见词汇出现情况。当此参数值大于0时，将抑制模型生成频繁出现的单词，并鼓励生成罕见的单词。'
            >
              频率惩罚：
              {assistant.modelConfig.frequency_penalty}
            </div>
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
