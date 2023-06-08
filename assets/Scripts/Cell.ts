import { _decorator, Component, Label, Node, tween, Vec2, Vec3, easing } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
    @property({type : Label})
    private label : Label;

    private index: number;
    public get Index(): number {
        return this.index;
    }

    public Initialized(index : number) : void {
        this.index = index;
        this.label.string = this.index.toString();
    }

    public SetPosition(pos: Vec2) : void {
        // this.node.position = new Vec3(pos.x, pos.y, 0.0);
        tween(this.node) 
            .to(0.1, {position: new Vec3(pos.x , pos.y, 0.0)}, {easing: 'sineInOut'})
            .start()
            .to(0.2, {position: new Vec3(pos.x , pos.y, 0.0)}, {easing: 'sineInOut'})
        
    }
}

