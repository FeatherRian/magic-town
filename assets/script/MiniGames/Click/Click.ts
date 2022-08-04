import { _decorator, Component, Node, Label , EventMouse , Input , input} from 'cc';
import { RoundSystem } from '../../GameManager/RoundSystem';
import { DialogSystem } from '../../UI/DialogSystem';
import { Health } from '../../UI/Health';
const { ccclass, property } = _decorator;

@ccclass('Click')
export class Click extends Component {
    
    @property(Node) background : Node = null;
    @property(Node) gameNode : Node = null; 
    @property(Label) clicks : Label = null;
    @property(Label) time : Label = null;
    @property targetClicks : number = 0;
    @property maxTime : number = 0;

    @property(Health) playerHealth : Health = null;
    @property damagePerClick : number = 0;

    private gameStart : boolean = false;
    private currClicks : number = 0;
    private currTime : number = 0;
    private timeRecorder : Function = null;
    
    onEnable(){
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    start() {

    }

    update(deltaTime: number) {
        if (!this.gameStart)    return;
        this.clicks.string = "当前点击："+ this.currClicks + "/" + this.targetClicks;
        this.time.string = "剩余时间：" + this.currTime + "s";
        if ((this.currClicks >= this.targetClicks)||(this.currTime <= 0))
        {
            this.ExitGame();
        }
    }

    onDisable(){
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    GameStart(){
        // console.log(this.name);
        this.currClicks = 0;
        this.currTime = this.maxTime;
        this.background.active = true;
        this.gameNode.active = true;
        this.gameStart = true;

        this.timeRecorder = () => {
            if (this.currTime == 0){
                this.unschedule(this.timeRecorder);
            }
            this.currTime--;
        }
        this.schedule(this.timeRecorder, 1);

    }

    onMouseDown(event : EventMouse){
        if (!this.gameStart)    return;
        if ((event.getButton() == 0)||(event.getButton() == 2))
        {
            this.currClicks++;
        }
    }

    ExitGame(){
        this.unschedule(this.timeRecorder);
        this.background.active = false;
        this.gameNode.active = false;
        this.gameStart = false;
        this.playerHealth.injured((this.targetClicks-this.currClicks) * this.damagePerClick);
    }

}

