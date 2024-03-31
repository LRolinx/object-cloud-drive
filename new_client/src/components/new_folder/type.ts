import NewFolder from '../newFolder.vue'

export type NewFolderProps = {
  open?: boolean
}

export type NewFolderEmits = {
  'update:open': (value: boolean) => void
  submit: (value: string) => void
}
