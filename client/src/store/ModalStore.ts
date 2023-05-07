import { makeAutoObservable } from 'mobx'

interface IModal {
  Component: React.FC<any>
  props: IModalProps
}

export interface IModalProps {
  visible: boolean
  symbol: symbol
  close: () => void
}

class ModalStore {
  modals: IModal[] = []

  constructor() {
    makeAutoObservable(this)
  }

  openModal(Component: React.FC<any>, props: any) {
    const symbol = Symbol()
    const close = (destroy?: boolean) => {
      destroy ? this.destroyModal(symbol) : this.cloesModal(symbol)
    }
    this.modals = [...this.modals, { Component, props: { ...props, visible: true, symbol, close } }]
    return close
  }

  destroyModal(symbol: symbol) {
    this.modals = this.modals.filter(modal => modal.props.symbol !== symbol)
  }

  cloesModal(symbol: symbol) {
    this.modals = this.modals.map(modal => {
      if (modal.props.symbol === symbol) {
        modal.props.visible = false
      }
      return modal
    })
  }
}

const modalStore = new ModalStore()

export default modalStore
