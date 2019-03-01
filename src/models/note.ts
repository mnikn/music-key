export class Note {
    // key range: 1-7, use * for sharp, eg: 4*: 4.5, *4: 3.5
    public key: string;
    public sectionId: number;
    public length: 4 | 8 | 16 | 32 = 4;

    constructor(public id?: number, sectionId?: number) {
        this.sectionId = sectionId;
    }
}