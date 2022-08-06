import { _decorator, Component, Node, Label, Enum, Sprite, resources, SpriteFrame } from 'cc';
import { RoundSystem } from '../../GameManager/RoundSystem';
import { DialogSystem } from '../../UI/DialogSystem';
import { Health } from '../../UI/Health';
const { ccclass, property } = _decorator;


@ccclass('Punch')
export class Punch extends Component {

    @property(Node) background : Node = null;
    @property(Node) gameNode : Node = null; 
    @property(Label) punchTimes : Label = null;
    @property(Label) time : Label = null;
    @property maxTime : number = 0;

    @property(Sprite) punchSprite1 : Sprite= null;
    @property(Sprite) punchSprite2 : Sprite= null;

    @property(Health) enemyHealth : Health= null;
    @property damagePerPunch : number = 0;

    private gameStart : boolean = false;
    private currPunches : number = 0;
    private currTime : number = 0;
    private timeRecorder : Function = null;
    private lastPunch : string = null;

    start() {
        resources.load("image/Punch1/spriteFrame" , SpriteFrame , (err, punchSprite) => {
            this.punchSprite1.spriteFrame = punchSprite;
        })
        resources.load("image/Punch2/spriteFrame" , SpriteFrame , (err, punchSprite) => {
            this.punchSprite2.spriteFrame = punchSprite;
        })
    }

    update(deltaTime: number) {
        if (!this.gameStart)    return;
        this.punchTimes.string = "当前出拳："+ this.currPunches;
        this.time.string = "剩余时间：" + this.currTime + "s";
        if (this.currTime <= 0)
        {
            this.ExitGame();
        }
    }

    GameStart(){
        // console.log(this.name);
        this.currPunches = 0;
        this.currTime = this.maxTime;
        this.background.active = true;
        this.gameNode.active = true;
        this.gameStart = true;
        this.lastPunch = null;

        this.timeRecorder = () => {
            if (this.currTime == 0){
                this.unschedule(this.timeRecorder);
            }
            this.currTime--;
        }
        this.schedule(this.timeRecorder, 1);
    }

    Punch(event: Event ,customerEventData : string){

        // console.log(customerEventData);

        if (this.lastPunch == null){
            this.lastPunch = customerEventData;
            this.currPunches++;
        } else {
            if (this.lastPunch == customerEventData){
                this.ExitGame();
            } else {
                this.lastPunch = customerEventData;
                this.currPunches++;
            }
        }
    }


    ExitGame(){
        this.unschedule(this.timeRecorder);
        this.background.active = false;
        this.gameNode.active = false;
        this.gameStart = false;
        this.enemyHealth.injured(this.currPunches * this.damagePerPunch);
    }
}

