export class PromiseClass<T> {
    promise: Promise<T>;
    reject?: (reason?: T) => void;
    resolve?: (value: T) => void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}
