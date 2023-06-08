import { _decorator, Component, Node, Prefab, UITransform, Label, instantiate, Vec3, find, tween, easing, Vec2, AudioSource, Button, Sprite } from 'cc';
const { ccclass, property } = _decorator;
import { Cell } from './Cell';
import { Store } from './Store';

@ccclass('GameView')
export class GameView extends Component {
    @property({
        type: Node
    })
    private GridContainer: Node;

    public get gridContainer(): Node {
        return this.GridContainer;
    }
    public set gridContainer(value: Node) {
        this.GridContainer = value;
    }
    
    @property({
        type: Node
    })
    private MuteBtn: Node;
    public get muteBtn(): Node {
        return this.MuteBtn;
    }
    public set muteBtn(value: Node) {
        this.MuteBtn = value;
    }

    @property({
        type: Node
    })
    private UnMuteBtn: Node;
    public get unMuteBtn(): Node {
        return this.UnMuteBtn;
    }
    public set unMuteBtn(value: Node) {
        this.UnMuteBtn = value;
    }

    @property({
        type: Label
    })
    private TimerLabel: Label = null;
    public get timerLabel(): Label {
        return this.TimerLabel;
    }
    public set timerLabel(value: Label) {
        this.TimerLabel = value;
    }

    @property({ type: Prefab })
    private cellPrefab: Prefab;
    public get CellPrefab(): Prefab {
        return this.cellPrefab;
    }
    public set CellPrefab(value: Prefab) {
        this.cellPrefab = value;
    }

    private cells : Cell[] = [];

    @property({
        type: AudioSource
    })
    private swipeSound: AudioSource;
    public get SwipeSound(): AudioSource {
        return this.swipeSound;
    }

    @property({
        type: AudioSource
    })
    private btnSound: AudioSource;
    public get BtnSound(): AudioSource {
        return this.btnSound;
    }

    @property({
        type: AudioSource
    })
    private winSound: AudioSource;
    public get WinSound(): AudioSource {
        return this.winSound;
    }

    @property({
        type: AudioSource
    })
    private loseSound: AudioSource;
    public get LoseSound(): AudioSource {
        return this.loseSound;
    }

    @property({
        type: Node
    })
    private winBoard: Node;
    public get WinBoard(): Node {
        return this.winBoard;
    }

    @property({
        type: Label
    })
    private winLabel: Label;
    public get WinLabel(): Label {
        return this.winLabel;
    }

    @property({
        type: Node
    })
    private loseBoard: Node;
    public get LoseBoard(): Node {
        return this.loseBoard;
    }

    @property({
        type: Node
    })
    private buttonBoard: Node;
    public get ButtonBoard(): Node {
        return this.buttonBoard;
    }

    @property({
        type: Node
    })
    private bgBlur: Node;
    public get BgBlur(): Node {
        return this.bgBlur;
    }

    @property({
        type: Button
    })
    private homeBtn: Button;
    public get HomeBtn(): Button {
        return this.homeBtn;
    }

    @property({
        type: Button
    })
    private restartBtn: Button;
    public get RestartBtn(): Button {
        return this.restartBtn;
    }

    @property({
        type: Button
    })
    private chooseLevelBtn: Button;
    public get ChooseLevelBtn(): Button {
        return this.chooseLevelBtn;
    }

    @property({
        type: Button
    })
    private muteInteractBtn: Button;
    public get MuteInteractBtn(): Button {
        return this.muteInteractBtn;
    }

    @property({
        type: Button
    })
    private unMuteInteractBtn: Button;
    public get UnMuteInteractBtn(): Button {
        return this.unMuteInteractBtn;
    }

    @property({
        type: Sprite
    })
    private clockBtn: Sprite;
    public get ClockBtn(): Sprite {
        return this.clockBtn;
    }


    protected onLoad(): void {
        let level = find('StoreLevel').getComponent(Store);
        let gridSize = level.storeMatrix;
        let gridWH = level.storeWH;
        for (let i = 1; i < gridSize*gridSize; ++i) {
            const cellNode = instantiate(this.cellPrefab);
            cellNode.parent = this.GridContainer;
            cellNode.getComponent(UITransform).setContentSize(gridWH,gridWH)
            const cell = cellNode.getComponent(Cell);
            cell.Initialized(i);
            this.cells.push(cell);
        }
    }

    public Show(cells: number[]) : void {
        let level = find('StoreLevel').getComponent(Store);
        let gridSize = level.storeMatrix;
        let gridWH = level.storeWH;

        let offsetX = -gridSize * gridWH * 0.5 + gridWH * 0.5;
        let offsetY = -gridSize * gridWH * 0.5 + gridWH * 0.5;
        for (let i = 0; i < gridSize*gridSize; ++i) {
            let index = cells[i];
            if (index > 0) { 
                const r = Math.floor(i / gridSize);
                const c = i % gridSize;
                const x = c * gridWH + offsetX;
                const y = r * gridWH + offsetY;
                this.cells[index - 1].SetPosition(new Vec2(x, -y));
            }
        }
    }
}

