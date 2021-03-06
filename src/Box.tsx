import type { Component } from 'solid-js'
import { Show, createEffect, createSignal } from 'solid-js'
import { getOhbugObject, getSelector } from '@ohbug/utils'
import html2canvas from 'html2canvas'
import Selector from './Selector'
import { Close, Screen } from './assets'
import { setStore, store } from './store'

import './main-btn.css'
import './send-btn.css'

const Box: Component = () => {
  const [visible, setVisible] = createSignal(false)
  const [feedback, setFeedback] = createSignal('')
  function handleStartWork() {
    setStore({ working: true })
  }

  const [loading, setLoading] = createSignal(false)
  async function handleFinish() {
    setLoading(true)

    let selector: string
    let outerHTML: string
    if (store.selectedElement) {
      const event = { target: store.selectedElement } as unknown as Event
      const canvas = await html2canvas(store.selectedElement)
      const dataURL = canvas.toDataURL()

      selector = getSelector(event)
      outerHTML = store.selectedElement.outerHTML
      const ohbug = getOhbugObject()
      const ohbugClient = ohbug.client
      const ohbugEvent = ohbugClient.createEvent({
        category: 'feedback',
        type: 'feedback',
        detail: { selector, outerHTML, feedback: feedback(), dataURL },
      })
      await ohbugClient.notify(ohbugEvent)
    }

    // clear
    setVisible(false)
    setFeedback('')
    setStore({ working: false, selectedElement: null })

    setLoading(false)
  }

  createEffect(() => {
    if (store.working === false && store.selectedElement === null) {
      setVisible(false)
    }
    else if (store.working && !store.selectedElement) {
      setVisible(false)
    }
    else {
      setVisible(true)
    }
  })

  return (
    <div
      class="z-max relative"
      data-ohbug-selector
    >
      <Show when={store.working}>
        <Selector />
      </Show>

      <div>
        <Show when={!(store.working && !store.selectedElement)}>
          <button
            class="main-btn"
            data-ohbug-selector
            onClick={() => setVisible(v => !v)}
            type="button"
          >
            {visible() ? '????' : '????'}
          </button>
        </Show>

        <Show when={visible()}>
          <div
            class="bg-white flex flex-col h-60 shadow z-max right-8 bottom-20 w-80 fixed"
            data-ohbug-selector
          >
            <div
              class="bg-gray-300 p-4"
              data-ohbug-selector
            >
              <textarea
                autofocus
                class="bg-transparent outline-none w-full resize-none"
                data-ohbug-selector
                maxLength="1000"
                onInput={e => setFeedback(e.currentTarget.value)}
                placeholder="Tell me how you feel..."
                rows="4"
                value={feedback()}
              />
              <button
                class="cursor-pointer"
                data-ohbug-selector
                onClick={handleStartWork}
                style={
                  { '--color': store.selectedElement ? 'blue' : 'gray' }
                }
                type="button"
              >
                <Screen />
              </button>
            </div>

            <div
              class="flex flex-1 p-4 justify-between items-center"
              data-ohbug-selector
            >
              <span
                class="text-sm"
                data-ohbug-selector
              >
                Try
                <a
                  class="ml-1 underline"
                  data-ohbug-selector
                  href="https://ohbug.net"
                  rel="noreferrer"
                  target="_blank"
                >
                  Ohbug
                </a>
                ?
              </span>
              <button
                class="send-btn"
                data-ohbug-selector
                disabled={!feedback() || loading()}
                onClick={handleFinish}
                type="button"
              >
                {loading() ? 'Sending...' : 'Send'}
              </button>
            </div>

            <button
              class="rounded-full cursor-pointer flex bg-blue-500 h-6 -top-2 -right-2 w-6 z-10 items-center justify-center absolute"
              data-ohbug-selector
              onClick={() => setVisible(v => !v)}
              type="button"
            >
              <Close />
            </button>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default Box
