export abstract class BlocState<T = any> {
  error: Error | null;
  isLoading: boolean;
  hasError: boolean;
  initial: boolean;
  message: string;
  data: T | null;

  constructor(isLoading = false, hasError = false, initial = true, message = "", data = null, error = null) {
    this.isLoading = isLoading;
    this.hasError = hasError;
    this.initial = initial;
    this.message = message;
    this.error = error;
    this.data = data;
  }

  get hasData(): boolean {
    return this.data !== null;
  }

  get isReady() {
    return !this.initial && !this.isLoading && !this.hasError;
  }

  ready(data: T) {
    this.data = data;
    this.initial = false;
    this.isLoading = false;
    this.hasError = false;
    this.message = "";
  }

  loading(message = "") {
    this.message = message;
    this.initial = false;
    this.isLoading = true;
    this.hasError = false;
  }

  failed(message = "", error: Error) {
    this.initial = false;
    this.isLoading = false;
    this.hasError = true;
    this.message = message;
    this.error = error;
  }
}
