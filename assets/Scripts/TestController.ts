import { _decorator, Camera, Component, EventMouse, math, Node, Vec2, Vec3 } from 'cc';
import { TestView } from './TestView';
const { ccclass, property } = _decorator;

@ccclass('TestController')
export class TestController extends Component {
    @property({type: TestView})
    private view : TestView;

    @property({type: Camera})
    private camera: Camera;

    @property({type: Node})
    private board: Node;

    private cells : number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    private checkX : number[] = [-1, 0, 1, 0];
    private checkY : number[] = [0, 1, 0, -1];

    protected start(): void {
        this.board.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);

        this.cells = this.cells.sort(() => math.random() - 0.5);
        this.view.Show(this.cells);
    }

    private onMouseUp(event : EventMouse) : void 
    {
        let pos = new Vec3();
        pos = this.camera.screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0), pos);
      
        let localPos = new Vec3();
        localPos = this.board.inverseTransformPoint(localPos, pos);
        let cellX = Math.floor((localPos.x + 150.0) / 100.0);
        let cellY = Math.floor((localPos.y + 150.0) / 100.0);
        const prevIndex = cellY*3 + cellX;
        console.log(`onMouseUp ${cellX} ${cellY}`);

        let foundIndex = -1;
        for (let i = 0; i < 4; ++i) {
            let x = cellX + this.checkX[i];
            let y = cellY + this.checkY[i];
            if (x < 0 || x > 2 || y < 0 || y > 2) continue;
            const index = y*3 + x;
            if (this.cells[index] === 0) {
                foundIndex = index;
                break;
            }
        }
        if (foundIndex < 0) return;
        
        const temp = this.cells[prevIndex];
        this.cells[prevIndex] = this.cells[foundIndex];
        this.cells[foundIndex] = temp;

        this.view.Show(this.cells);
    }
}

