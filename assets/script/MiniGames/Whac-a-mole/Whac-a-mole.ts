import { _decorator, Component, Node, Prefab, misc, Label, instantiate, resources } from 'cc';
import { Health } from '../../UI/Health';
import { Gopher } from './Gopher';
const { ccclass, property } = _decorator;

@ccclass('Whac_a_mole')
export class Whac_a_mole extends Component {

    gopher : Prefab = null;
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

    start(){
        resources.load("prefab/Gopher" , Prefab , (err, prefab) => {
            this.gopher = prefab;
        })
    }
    update(deltaTime: number) {
        if (!this.gameStart)    return;
        this.clicks.string = "当前击打地鼠："+ this.currClicks + "/" + this.targetClicks;
        this.time.string = "剩余时间：" + this.currTime + "s";
        if ((this.currClicks >= this.targetClicks)||(this.currTime <= 0))
        {
            this.ExitGame();
        }
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
        this.InitGopher();

    }

    HitGopher(){
        this.currClicks ++ ;
        this.InitGopher();
    }

    InitGopher(){
        let newNode : Node = instantiate(this.gopher);
        this.gameNode.addChild(newNode);
        newNode.setPosition( (Math.random() - 0.5) * 480 , (Math.random() - 0.5) * 480);
        newNode.getComponent(Gopher).whac_a_mole = this;
    }

    ExitGame(){
        this.unschedule(this.timeRecorder);
        this.background.active = false;
        this.gameNode.active = false;
        this.gameStart = false;
        this.playerHealth.injured((this.targetClicks-this.currClicks) * this.damagePerClick);
    }
}

