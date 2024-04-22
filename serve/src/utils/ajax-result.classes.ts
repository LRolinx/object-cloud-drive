export class AjaxResult<T = any> {
  data?: T;

  code = Number(500);

  state = true;

  message = '操作成功';

  // private constructor(code: number) {
  //   this.code = code;
  // }

  private constructor(code: number, data: T, state: boolean, message: string) {
    if (code != void 0) {
      this.code = code;
    }
    if (data != void 0) {
      this.data = data;
    }
    if (state != void 0) {
      this.state = state;
    }
    if (message != void 0) {
      this.message = message;
    }
  }

  static success<T>(data?: T, message?: string, code?: number): AjaxResult<T>;
  static success<T>(data: T, message?: string, code?: number): AjaxResult<T>;
  static success<T>(data: T, message: string, code?: number): AjaxResult<T>;
  static success<T>(data: T, message: string, code: number): AjaxResult<T> {
    return new AjaxResult<T>(code ?? 200, data, true, message ?? '操作成功');
  }

  static fail<T>(message?: string, code?: number, data?: T): AjaxResult<T>;
  static fail<T>(message: string, code?: number, data?: T): AjaxResult<T>;
  static fail<T>(message: string, code: number, data?: T): AjaxResult<T>;
  static fail<T>(message: string, code: number, data?: T): AjaxResult<T> {
    return new AjaxResult<T>(code ?? 500, data, false, message ?? '操作失败');
  }
}
