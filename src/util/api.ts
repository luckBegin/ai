import {Get, Post} from "@/util/request";

export class Api {
	@Post('auth/code')
	sendCode(d: any): Promise<any> | any {}

	@Post('auth/smslogin')
	login(d: any): Promise<any> | any {}


	@Get('Conversation/Historys')
	historys(d: any): Promise<any> | any {}

	@Get('Conversation/Get')
	conversation(d: any): Promise<any> | any {}

	@Post('Chat/SendMessage')
	sendMsg(d: any): Promise<any> | any {}
}

export const service = new Api()
