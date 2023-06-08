import { _decorator, Component, director, Node, find, instantiate, Vec3, UITransform, Label, Sprite, Input, input, Prefab, EventMouse, Camera, randomRange, math, Game, tween, Vec2, Color } from 'cc';
import { Store } from './Store';
import { GameView } from './GameView';
import { GameModel } from './GameModel';
import { Constants } from './Constants';
import { Cell } from './Cell';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property({type:GameView})
    private gameView: GameView;
    
    @property({
        type: Node
    })
    private board: Node;

    @property({
        type: GameModel
    })
    private gameModel: GameModel;

    @property({
        type: Camera
    })
    private camera: Camera;

    private cells : number[] = [];
    private checkX : number[] = [-1, 0, 1, 0];
    private checkY : number[] = [0, 1, 0, -1];

    // private countdownDuration: number = 1000; 
    private remainingTime: number = 0;
    private gameState: boolean;
    private highScore_3: number = 0;
    private highScore_4: number = 0;
    private highScore_5: number = 0;
    private highScore_6: number = 0;
    private currentScore: number = 0;

    protected onLoad(): void {
        let store = find('StoreLevel').getComponent(Store);
        let gridSize = store.storeMatrix;
        let highScoreText = store.HighScore;
        let volumeValue = store.VolumeValue;
        this.gameView.muteBtn.active = volumeValue === 1;
        this.gameView.unMuteBtn.active = volumeValue !== 1;
        this.gameView.SwipeSound.volume = volumeValue;
        this.gameView.LoseSound.volume = volumeValue;
        this.gameView.WinSound.volume = volumeValue;
        if (gridSize === 3) {
            this.saveHighScore(this.highScore_3, highScoreText);
        } else if (gridSize === 4) {
            this.saveHighScore(this.highScore_4, highScoreText);
        } else if (gridSize === 5) {
            this.saveHighScore(this.highScore_5, highScoreText);
        } else {
            this.saveHighScore(this.highScore_6, highScoreText);
        }
        this.startCountdown();
    }

    protected start(): void {
        let level = find('StoreLevel').getComponent(Store);
        let gridSize = level.storeMatrix;
        let gridWH = level.storeWH;
        this.board.getComponent(UITransform).setContentSize(gridSize*gridWH, gridSize*gridWH);
        this.board.on(Node.EventType.TOUCH_END, this.onMouseUp, this);
        this.cells = this.generateSolvableGame(gridSize);
        this.gameView.Show(this.cells);
    }

    private generateSolvableGame(gridSize: number): number[] {
        let solvable = false;
        let puzzle: number[] = [];
    
        while (!solvable) {
            for (let i=0; i<gridSize*gridSize; i++) {
                    puzzle.push(i);
            }
            puzzle.sort(() => Math.random() - 0.5);
    
            if (this.isSolvable(puzzle)) {
                solvable = true;
            } else {
                puzzle = [];
            }
        }
        return puzzle;
    }


    private onMouseUp(event : EventMouse) : void 
    {
        let level = find('StoreLevel').getComponent(Store);
        let gridSize = level.storeMatrix;
        let gridWH = level.storeWH;
        let pos = new Vec3();
        pos = this.camera.screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0), pos);
        let localPos = new Vec3();
        localPos = this.board.inverseTransformPoint(localPos, pos);
        let cellX = Math.floor((localPos.x + gridWH * gridSize / 2) / gridWH);
        let cellY = Math.floor((localPos.y - gridWH * gridSize / 2) / -gridWH);
        let offsetX = -gridSize * gridWH * 0.5 + gridWH * 0.5;
        let offsetY = -gridSize * gridWH * 0.5 + gridWH * 0.5;
        const prevIndex = cellY*gridSize + cellX;
        // console.log(`onMouseUp ${cellX} ${cellY}`);

        let foundIndex = -1;
        for (let i = 0; i < 4; ++i) {
            let x = cellX + this.checkX[i];
            let y = cellY + this.checkY[i];
            if (x < 0 || x > gridSize - 1 || y < 0 || y > gridSize - 1) continue;
            const index = y*gridSize + x;
            if (this.cells[index] === 0) {
                foundIndex = index;
                break;
            }
        }
        if (foundIndex < 0) return;
        
        const temp = this.cells[prevIndex];
        this.cells[prevIndex] = this.cells[foundIndex];
        this.cells[foundIndex] = temp;
        this.gameView.SwipeSound.play();
        this.gameView.Show(this.cells);
        // console.log('end', this.cells);

        if (this.checkWin()) {
            if (this.checkWin()) {
                this.gameState = true;
                this.cells.splice(-1);
                let lastCell = instantiate(this.gameView.CellPrefab);
                lastCell.getComponent(UITransform).setContentSize(gridWH, gridWH);
                this.board.addChild(lastCell);
                lastCell.getComponentInChildren(Label).string = (gridSize*gridSize).toString();
                let lastCellPosX = offsetX + (gridSize-1)*gridWH;
                let lastCellPosY = offsetY + (gridSize-1)*gridWH;
                tween(lastCell)
                .to(0, {position: new Vec3(lastCellPosX + gridWH*(gridSize-1), -lastCellPosY, 0.0)}, {easing: 'cubicInOut'})
                .to(0.5, {position: new Vec3(lastCellPosX, -lastCellPosY, 0.0)}, {easing: 'cubicInOut'})
                .start()
                setTimeout(() => {
                    this.gameView.WinSound.play();
                    this.ControlGameButtons(this.gameState);
                    this.gameView.WinBoard.active = true;
                    this.gameView.ClockBtn.color = new Color(124,124,124,255);
                }, 650)
            }
        }
    }

    private getInvCount(arr: number[]): number {
        let invCount = 0;
        const n = arr.length;
      
        for (let i = 0; i < n - 1; i++) {
          for (let j = i + 1; j < n; j++) {
            if (arr[j] && arr[i] && arr[j] > arr[i]) {
              invCount += 1;
            }
          }
        }
        return invCount;
      }
      
    private isSolvable(puzzle: number[]): boolean {
        const invCount = this.getInvCount(puzzle);
        const N = puzzle.length;

        if (N % 2 === 1) {
            return invCount % 2 === 0;
        } else {
            const pos = this.findXPosition(puzzle);
            return (pos % 2 === 1) === (invCount % 2 === 0);
        }
    }

    private findXPosition(puzzle): number {
        const N = puzzle.length;
        
        for (let i = N - 1; i >= 0; i--) {
          if (puzzle[i] === 0) {
            return N - i;
          }
        }
    }

    private checkWin(): boolean {
        let level = find('StoreLevel').getComponent(Store);
        let gridSize = level.storeMatrix;
        
        for (let i = 0; i < gridSize * gridSize - 1; i++) {
          if (this.cells[i] !== i + 1) {
            // Nếu tìm thấy ô không đúng thứ tự, trò chơi chưa kết thúc
            return false;
          }
        }
        return true;
    }


    private showResult() {
        this.board.off(Node.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    private onHomeBtnClick(): void {
        this.gameView.BtnSound.play();
        director.loadScene('Entry');
    }

    private onMuteBtnClick(): void {
        this.setAudioVolume(0);
        this.gameView.BtnSound.play();
        this.gameView.muteBtn.active = false;
        this.gameView.unMuteBtn.active = true;
    }

    private onUnMuteBtnClick(): void {
        this.setAudioVolume(1);
        this.gameView.BtnSound.play();
        this.gameView.unMuteBtn.active = false;
        this.gameView.muteBtn.active = true;
    }

    private setAudioVolume(volume: number): void {
        this.gameView.BtnSound.play();
        this.gameView.SwipeSound.volume = volume;
        this.gameView.BtnSound.volume = volume;
        this.gameView.LoseSound.volume = volume;
        this.gameView.WinSound.volume = volume;
        let store = find('StoreLevel').getComponent(Store);
        store.VolumeValue = volume;
    }

    private removeLastNodeFromContainer(container: Node): void {
        const children = container.children;
        if (children.length > 0) {
          const lastNode = children[children.length - 1];
          lastNode.destroy(); 
        }
    }

    private onRestartBtnClick(): void {
        this.gameState = false;
        this.gameView.LoseBoard.active = false;
        this.gameView.WinBoard.active = false;
        this.ControlGameButtons(this.gameState);
        this.gameView.ClockBtn.color = new Color(255,255,255,255);
        this.gameView.BtnSound.play();
        let level = find('StoreLevel').getComponent(Store);
        let gridSize = level.storeMatrix;
        let gridWH = level.storeWH;
        if (this.gameView.gridContainer.children.length === gridSize*gridSize) {
            this.removeLastNodeFromContainer(this.gameView.gridContainer);
        }
        this.cells = [];
        this.board.getComponent(UITransform).setContentSize(gridSize*gridWH, gridSize*gridWH);
        this.board.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.cells.splice(0, this.cells.length);
        this.cells = this.generateSolvableGame(gridSize);
        this.gameView.Show(this.cells);    
        this.startCountdown();
    }

    private ControlGameButtons(gameState: boolean): void {
        this.gameView.BgBlur.active = gameState;
        this.gameView.ButtonBoard.active = gameState;
        this.gameView.RestartBtn.interactable = !gameState;
        this.gameView.HomeBtn.interactable = !gameState;
        this.gameView.ChooseLevelBtn.interactable = !gameState;
        this.gameView.MuteInteractBtn.interactable = !gameState;
        this.gameView.UnMuteInteractBtn.interactable = !gameState;
    }

    private onBackLevelClick(): void {
        this.gameView.BtnSound.play();
        director.loadScene('Level');
    }

    // Time countdown
    private startCountdown(): void {
        let level = find('StoreLevel').getComponent(Store);
        let countdownDuration = level.TimeExcution;
        this.remainingTime = countdownDuration;
        this.schedule(this.updateCountdownLabel, 1, level.TimeExcution, 0);
        this.updateCountdownLabel();
    }
    
    private updateCountdownLabel(): void {
        let level = find('StoreLevel').getComponent(Store);
        let gridSize = level.storeMatrix;
        let levelText = level.HighScore;
        let countdownDuration = level.TimeExcution;
        this.gameView.timerLabel.string = this.formatTime(this.remainingTime);
        if (this.remainingTime <= 0) {
            this.unschedule(this.updateCountdownLabel);
            this.showResult();
            this.gameState = true;
            this.ControlGameButtons(this.gameState);
            this.gameView.LoseSound.play();
            this.gameView.LoseBoard.active = true;
            this.gameView.ClockBtn.color = new Color(124,124,124,255);
        }
        else if (this.checkWin()) {
            this.unschedule(this.updateCountdownLabel);
            this.gameView.WinLabel.string = 'Time execute\n' + this.formatTime(countdownDuration - this.remainingTime);
            let score = countdownDuration - this.remainingTime;
            this.updateScore(score, gridSize, levelText);
        }
        else {
            this.remainingTime--;
        }
        // console.log(this.remainingTime);
    }
    
    private formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = minutes.toString().length < 2 ? "0" + minutes : minutes.toString();
        const formattedSeconds = remainingSeconds.toString().length < 2 ? "0" + remainingSeconds : remainingSeconds.toString();
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    private saveHighScore(score: number , levelText: string): void {  
        // Lấy điểm cao nhất đã lưu trước đó từ local storage
        const previousHighScore = localStorage.getItem(levelText);
        // Nếu đã có điểm cao nhất lưu trước đó, so sánh với điểm mới và lưu điểm cao nhất mới vào local storage
        if (previousHighScore) {
        const currentHighScore = Number(previousHighScore);
            if (score > currentHighScore) {
                localStorage.setItem(levelText, String(score));
            }
        }
        else {
            // Nếu chưa có điểm cao nhất lưu trước đó, lưu điểm mới vào local storage
            localStorage.setItem(levelText, String(score));
        }
    }
    
    private updateScore(score: number, level: number, levelText: string): void {
        // Cập nhật điểm hiện tại
        this.currentScore = score;
        
        // Kiểm tra và cập nhật điểm cao nhất
        if (level === 3) {
            if (this.highScore_3 === 0) {
                this.highScore_3 = score;
                this.saveHighScore(this.highScore_3, levelText);
            } else if (score < this.highScore_3) {
                this.highScore_3 = score;
                this.saveHighScore(this.highScore_3, levelText);
            }
        }  else if (level === 4) {
            if (this.highScore_4 === 0) {
                this.highScore_4 = score;
                this.saveHighScore(this.highScore_4, levelText);
            } else if (score < this.highScore_4) {
                this.highScore_4 = score;
                this.saveHighScore(this.highScore_4, levelText);
            } 
        } else if (level === 5) {
            if (this.highScore_5 === 0) {
                this.highScore_5 = score;
                this.saveHighScore(this.highScore_5, levelText);
            } else if (score < this.highScore_5) {
                this.highScore_5 = score;
                this.saveHighScore(this.highScore_5, levelText);
            } 
        } else {
            if (this.highScore_6 === 0) {
                this.highScore_6 = score;
                this.saveHighScore(this.highScore_6, levelText);
            } else if (score < this.highScore_6) {
                this.highScore_6 = score;
                this.saveHighScore(this.highScore_6, levelText);
            } 
        }
    }
    
    private convertTimeStringToSeconds(timeString: string): number {
        const [minutes, seconds] = timeString.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        return totalSeconds;
    }
}

