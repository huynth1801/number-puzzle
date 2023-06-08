import { _decorator, Component, instantiate, math, Node, Prefab, Vec2 } from 'cc';
import { Cell } from './Cell';
const { ccclass, property } = _decorator;

@ccclass('TestView')
export class TestView extends Component {

    @property({type: Node})
    private boardNode : Node;
    @property({type: Prefab})
    private cellPrefab : Prefab;

    private cells : Cell[] = [];

    protected onLoad(): void {
        for (let i = 1; i < 9; ++i) {
            const cellNode = instantiate(this.cellPrefab);
            cellNode.parent = this.boardNode;
            const cell = cellNode.getComponent(Cell);
            cell.Initialized(i);
            this.cells.push(cell);
        }
    }

    public Show(cells: number[]) : void {
        for (let i = 0; i < 9; ++i) {
            let index = cells[i];
            if (index > 0) { 
                const r = Math.floor(i / 3);
                const c = i % 3;
                this.cells[index - 1].SetPosition(new Vec2(c * 100.0 - 100.0, r * 100.0 - 100.0));
            }
        }
    }
}

