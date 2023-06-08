import { _decorator, Component, director, EventHandler, Node, find, Vec3, Vec2, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
import { Store } from './Store';

@ccclass('LevelController')
export class LevelController extends Component {
    private level: Store;
    
    private onBackBtnClick(): void {
        this.btnSound.play();
        director.loadScene('Entry');
    }

    @property({
        type: AudioSource
    })
    private bgMusic: AudioSource;

    @property({
        type: AudioSource
    })
    private btnSound: AudioSource;


    protected onLoad(): void {
        this.level = find('StoreLevel').getComponent(Store);
        let volumeValue = this.level.VolumeValue.valueOf();
        this.bgMusic.volume = volumeValue;
        this.btnSound.volume = volumeValue;
        this.bgMusic.play();
    }

    private onLevelClick(event, customEventData: string): void {
        this.btnSound.play();
        switch(customEventData){
            case '0':
                this.level.storeMatrix = 3;
                this.level.storeWH = 100;
                this.level.TimeExcution = 60;
                this.level.HighScore = 'highScore_3';
                break;
            case '1':
                this.level.storeMatrix = 4;
                this.level.storeWH = 90;
                this.level.TimeExcution = 120;
                this.level.HighScore = 'highScore_4';
                break;
            case '2':
                this.level.storeMatrix = 5;
                this.level.storeWH = 80;
                this.level.TimeExcution = 200;
                this.level.HighScore = 'highScore_5';
                break;
            case '3':
                this.level.storeMatrix = 6;
                this.level.storeWH = 75;
                this.level.TimeExcution = 300;
                this.level.HighScore = 'highScore_6';
                break;
            // case '4':
            //     this.level.storeMatrix = 7;
            //     break;
            // case '5':
            //     this.level.storeMatrix = 8;
            //     break;
            // case '6':
            //     this.level.storeMatrix = 9;
            //     break;     
        }
        director.loadScene('Game');
    }
}

