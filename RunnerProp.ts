
class RunnerProp  {
    static readonly env: string = process.env.ENV?.toUpperCase() ?? "QA";
    static readonly browser: string = process.env.BROWSER ?? "chromium";
    static readonly DefaultTimeout: number = Number(process.env.DEFAULT_TIMEOUT) || 62000;
    static readonly DefaultStepTimeout: number = Number(process.env.DEFAULT_STEP_TIMEOUT) || 81000;
    static readonly DefaultNavigationTimeout: number = Number(process.env.DEFAULT_NAVIGATION_TIMEOUT) || 62000;
    static readonly tags: string = process.env.TAGS ?? "testcasekey=SP-test";
    static readonly retry: number = Number(process.env.RETRY) || 1;
    static readonly parallelThreads: number  = 1;
    static readonly sequentiallyThreads: number  = 1;
    static readonly recordVideo: boolean = RunnerProp.getBooleanValue(process.env.RECORD_VIDEO, false);
    static readonly headlessMode: boolean = RunnerProp.getBooleanValue(process.env.HEADLESS_MODE, true);
    static readonly debugMode: boolean = RunnerProp.getBooleanValue(process.env.HEADLESS_MODE, false);
    static readonly ORACLE_USER:string ="test";
    static readonly ORACLE_PASSWORD:string ="testPW";
    static readonly ORACLE_CONNECT_STRING:string ="testConn";
    static readonly PRIME_LANGUAGE:string="English";
    static readonly SECONDARY_LANGUAGE:string="Arabic";

    private static getBooleanValue(value: string | undefined, defaultValue: boolean): boolean {
        return value !== undefined ? value.toLowerCase() === "true" : defaultValue;
    }
}
export { RunnerProp };