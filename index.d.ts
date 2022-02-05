declare module "fpcalc" {
    export interface FpcalcOptions {
        length?: number
        raw?: boolean
        command?: string
    }

    export interface FpcalcResult<T extends Buffer | string> {
        file?: string
        duration?: number
        fingerprint: T
    }

    function fpcalc(file: string | ReadableStream, callback: (err: Error, result: FpcalcResult<string>) => void)
    function fpcalc(file: string | ReadableStream, options: FpcalcOptions & { raw: true }, callback: (err: Error, result: FpcalcResult<Buffer>) => void)
    function fpcalc(file: string | ReadableStream, options: FpcalcOptions, callback: (err: Error, result: FpcalcResult<string>) => void)

    export default fpcalc
}