import {createStore} from 'vuex'
export default createStore({
	state: {
		dialogs: [],
		id: null,
		message: ''
	},
	getters: {},
	mutations: {
		add (state, dialog) {
			state.dialogs.push(dialog)
		},
		clear(state) {
			state.dialogs = []
		},
		setDialog(state, v) {
			state.dialogs = v
		},
		setMessage(state, v) {
			state.message = v
		},
		addContent(state) {

		},
		setId(state ,id){
			state.id = id
		}
	},
	actions: {},
	modules: {}
})
