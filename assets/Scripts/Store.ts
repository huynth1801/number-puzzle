import { _decorator, Component, Node, CCInteger, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Store')
export class Store extends Component {
    @property({
        type: CCInteger,
      })
    private StoreMatrix: number = 3;
    public get storeMatrix(): number {
        return this.StoreMatrix;
    }
    public set storeMatrix(value: number) {
        this.StoreMatrix = value;
    }

    @property({
        type: CCInteger
    })
    private StoreWH: number = 100;
    public get storeWH(): number {
        return this.StoreWH;
    }
    public set storeWH(value: number) {
        this.StoreWH = value;
    }

    @property({
        type: Vec3
    })
    private StorePosition: Vec3;
    public get storePosition(): Vec3 {
        return this.StorePosition;
    }
    public set storePosition(value: Vec3) {
        this.StorePosition = value;
    }

    @property({
        type: Number
    })
    private timeExcution: number;
    public get TimeExcution(): number {
        return this.timeExcution;
    }
    public set TimeExcution(value: number) {
        this.timeExcution = value;
    }
    

    @property({
        type: Number
    })
    private volumeValue: number = 1;
    public get VolumeValue(): number {
        return this.volumeValue;
    }
    public set VolumeValue(value: number) {
        this.volumeValue = value;
    }

    @property({
        type: String
    })
    private highScore: string;
    public get HighScore(): string {
        return this.highScore;
    }
    public set HighScore(value: string) {
        this.highScore = value;
    }
}

