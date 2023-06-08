import { _decorator, AudioSource, Component, director, find, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Store } from './Store';

@ccclass('MenuController')
export class MenuController extends Component {
    private store: Store;

    @property({
        type: Node
    })
    private muteBtn: Node;

    @property({
        type: Node
    })
    private unMuteBtn: Node;

    @property({
        type: AudioSource
    })
    private bgMusic: AudioSource;

    @property({
        type: AudioSource
    })
    private btnSound: AudioSource;


    protected onLoad(): void {
        if (find('StoreLevel') === null)
        {
            const storeVolumeNode = new Node('StoreLevel');
            director.addPersistRootNode(storeVolumeNode);
            this.store = storeVolumeNode.addComponent(Store);
        }
        else 
        {
            this.store = find('StoreLevel').getComponent(Store);
        }
        let volumeValue = this.store.VolumeValue.valueOf();
        this.btnSound.volume = volumeValue;
        this.bgMusic.volume = volumeValue;
        this.muteBtn.active = volumeValue === 1;
        this.unMuteBtn.active = volumeValue !== 1;
        this.bgMusic.play();
    }

    private onPlayBtnClick(): void {
        director.loadScene('Level');
        this.btnSound.play();
    }

    private onMuteBtnClick(): void {
        this.setAudioVolume(0);
        this.muteBtn.active = false;
        this.unMuteBtn.active = true;
    }

    private onUnMuteBtnClick(): void {
        this.setAudioVolume(1);
        this.muteBtn.active = true;
        this.unMuteBtn.active = false;
    }

    private setAudioVolume(volume: number): void {
        this.btnSound.play();
        this.bgMusic.volume = volume;
        this.btnSound.volume = volume;
        this.btnSound.volume = volume;
        let store = find('StoreLevel').getComponent(Store);
        store.VolumeValue = volume;
    }
}

