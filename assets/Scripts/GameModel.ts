import { _decorator, Component, Node, Prefab, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    @property({
        type: Prefab
    })
    private AddCell: Prefab;
    public get addCell(): Prefab {
        return this.AddCell;
    }
    public set addedCell(value: Prefab) {
        this.AddCell = value;
    }
}

