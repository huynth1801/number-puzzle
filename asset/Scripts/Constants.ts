import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constants')
export class Constants extends Component {
    public static readonly countdownDuration: number = 90; // Đơn vị là giây
    public static readonly remainingTime: number = 0;
}

