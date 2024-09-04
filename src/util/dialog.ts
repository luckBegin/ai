export enum DialogType {
	Human,
	Ai
}

export class Dialog {
	public type: DialogType;
	public model: string = '';
	public text: string = ''
	public timer: ReturnType<typeof setInterval> = null

	private content: string
	private contentArr: Array<string> = []
	private interval = 15;

	constructor(type: DialogType, text: string, model: string) {
		this.type = type
		this.content = text;
		this.model = model
		this.init()
	}


	public addContent(s: string): this {
		this.content = s;
		if (s) this.contentArr = this.content.split('')
		return this
	}

	private init() {
		if (this.content) {
			this.contentArr = this.content.split('');
		}
	}

	public complete() {
		this.text = this.contentArr.join('');
		console.log(123)
		if (this.cb) {
			this.cb(this.text)
		}
	}

	private cb: (s:string) => void
	public on(fn: (s:string) => void ) {
		this.cb = fn ;
	}
	public play() {
		this.timer = setInterval(() => {
			if (!this.contentArr.length) {
				this.stop()
			} else {
				this.text += this.contentArr.shift();
				if (this.cb) {
					this.cb(this.text)
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
