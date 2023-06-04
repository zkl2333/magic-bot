import { makeAutoObservable } from 'mobx'
import { createId } from '@paralleldrive/cuid2'

interface Dialog<T = {}> {
  id: string
  content: React.FC<T>
  props?: T
}

export interface DialogProps {
  id: string
}

class DialogStore {
  dialogs: Dialog<any>[] = []

  constructor() {
    makeAutoObservable(this)
  }

  openDialog<T>(content: React.FC<T & DialogProps>, props?: T): string {
    const id = createId()
    this.dialogs.push({ id, content, props })
    return id
  }

  closeDialog(id: string) {
    this.dialogs = this.dialogs.filter(dialog => dialog.id !== id)
  }
}

const dialogStore = new DialogStore()

export default dialogStore
