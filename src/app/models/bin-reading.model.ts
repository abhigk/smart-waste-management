export class BinReading {
    private binLevel: number;
    private hardwareId: string;

    constructor(binLevel: number, hardwareId: string) {
        this.binLevel = binLevel;
        this.hardwareId = hardwareId;
    }

    getbinLevel() {
        return this.binLevel;
    }

    getHardwareId() {
        return this.hardwareId;
    }


}
