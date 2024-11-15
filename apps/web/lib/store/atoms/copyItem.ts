import { atom } from 'recoil';

interface File {
    id: string,
    name: string,
    type: string,
    items?: string,
    size?: string,
    modifiedAt: string | Date,
    isFavorite: boolean
  }
// Generic atom definition
export const copyItemState = atom<File[]>({
    key: 'copyItemState',
    default: []
})