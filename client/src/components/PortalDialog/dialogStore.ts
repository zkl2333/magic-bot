import { makeAutoObservable } from 'mobx'
import { createId } from '@paralleldrive/cuid2'

interface Dialog<T = {}> {
  dialogId: string
  content: React.FC<T>
  props?: T
}

export interface DialogProps {
  dialogId: string
}

class DialogStore {
  dialogs: Dialog<any>[] = []

  constructor() {
    makeAutoObservable(this)
  }

  openDialog<T>(content: React.FC<T & DialogProps>, props?: T): string {
    const dialogId = createId()
    this.dialogs.push({ dialogId, content, props })
    return dialogId
  }

  closeDialog(dialogId: string) {
    console.log('closeDialog', dialogId)
    this.dialogs = this.dialogs.filter(dialog => dialog.dialogId !== dialogId)
  }
}

const dialogStore = new DialogStore()

export default dialogStore
