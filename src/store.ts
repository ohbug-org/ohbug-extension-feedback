import { createStore } from 'solid-js/store'

const [store, setStore] = createStore<{
  working: boolean
  selectedElement: Element | null
}>({ working: false, selectedElement: null })

export { store, setStore }
