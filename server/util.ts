export class ResInfo {

  constructor(public code: number = 0, public msg: string = 'fail', public data: any = null) {
  }

  set(code: number = 0, msg: string = 'fail', data?: any) {
    this.code = code;
    this.msg = msg;
    if (data !== undefined) {
      this.data = data;
    }
    return this;
  }

}
