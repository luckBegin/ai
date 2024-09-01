import {api} from './axios'
import {StrUtil} from "./str";
export const Config = {
	host: "http://47.92.249.48:8099/api/"
}
export function Get(u: string) {
	return function (c: any, m: any, p: any) {
		p.value = function (arg: any = {}) {
			let url = u
			if (arg.variable) {
				url = StrUtil.tmpReplace(u, arg.variable)
			}
			return api.get(Config.host + url, {params: arg.data})
		}
	}
}

export function Post(u: string, type: 'json' | 'formData' = 'json') {
	return function (c: any, m: any, p: any) {
		p.value = function (arg: any) {
			return api.post(Config.host + u, arg.data, {data: arg.param})
		}
	}
}


export function Delete(u: string) {
	return function (c: any, m: any, p: any) {
		p.value = function (arg: any) {
			let url = u
			if (arg.variable) {
				url = StrUtil.tmpReplace(u, arg.variable)
			}
			return api.delete(Config.host + url, arg.data)
		}
	}
}

export function Put(u: string) {
	return function (c: any, m: any, p: any) {
		p.value = function (arg: any) {
			let url = u
			if (arg.variable) {
				url = StrUtil.tmpReplace(u, arg.variable)
			}
			return api.put(Config.host + url, arg.data)
		}
	}
}
