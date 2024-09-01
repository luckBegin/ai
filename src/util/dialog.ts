export enum DialogType {
	Human,
	Ai
}

export class Dialog {
	public type: DialogType;
	public model: string = '' ;
	public text: string = ''
	public timer: ReturnType<typeof setInterval> = null

	private content: string
	private contentArr: Array<string> = []
	private interval = 50;

	constructor(type: DialogType, text: string, model: string) {
		this.type = type
		this.content = text;
		this.model = model
		this.init()
	}

	private init() {
		if (this.content) {
			this.contentArr = this.content.split('');
		}
	}

	public complete() {
		this.text = this.contentArr.join('');
	}

	public play(fn: (s: string) => void) {
		this.timer = setInterval(() => {
			if( !this.contentArr.length ) {
				this.stop()
			} else {
				this.text += this.contentArr.shift();
				if (fn) {
					fn(this.text)
				}
			}
		}, this.interval)
	}

	public stop() {
		if (this.timer) {
			clearInterval(this.timer)
		}
	}
}
