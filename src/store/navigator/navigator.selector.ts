import {RootState} from '@/store/store'

export const selectHref = (store:RootState) => {
	return store.navigator.href
}
