declare class AppCurrency {
    private primary;
    private secondary;
    constructor(primary: number, secondary: number);
    getPrimary: () => number;
    getSecondary: () => number;
}
export { AppCurrency };
export default AppCurrency;
