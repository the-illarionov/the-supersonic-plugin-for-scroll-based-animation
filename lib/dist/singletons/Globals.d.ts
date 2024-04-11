declare const Globals: Globals;
declare const devGlobals: {
    showConsole: boolean;
    isProduction: boolean;
    consoleStyles: string;
    colors: string[];
    colorIndex: number;
    updateConsoleBg(): void;
};
export { Globals, devGlobals };
