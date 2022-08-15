import { _decorator, Component, Node, Prefab, misc, Label, instantiate, resources, Sprite } from 'cc';
import { Health } from '../../UI/Health';
import { Gopher } from './Gopher';
const { ccclass, property } = _decorator;

@ccclass('Whac_a_mole')
export class Whac_a_mole extends Component {

    gopher : Prefab = null;
    @property(Node) background : Node = null;
    @property(Node) gameNode : Node = null; 
    @property(Label) clicks : Label = null;
    @property targetClicks : number = 0;

    @property(Health) playerHealth : Health = null;
    @property damagePerClick : number = 0;

    @property([Node]) holeNode : Node[] = [];

    private gameStart : boolean = false;
    private currClicks : number = 0;
    private currGopher : number = 0;
    private gopherEscape : Function = null;

    start(){
        resources.load("prefab/Gopher" , Prefab , (err, prefab) => {
            this.gopher = prefab;
        })
    }
    update(deltaTime: number) {
        if (!this.gameStart)    return;
        this.clicks.string = "当前击打地鼠："+ this.currClicks + "/" + this.targetClicks;
        if (this.currGopher == this.targetClicks)
        {
            this.ExitGame();
        }
    }

    GameStart(){
        // console.log(this.name);
        this.currClicks = 0;
        this.currGopher = 0;
        this.background.active = true;
        this.gameNode.active = true;
        this.gameStart = true;
        this.InitGopher();

    }

    HitGopher(){
        this.currClicks ++ ;
        this.currGopher ++ ;
        this.unschedule(this.gopherEscape);
        this.scheduleOnce(function(){
            this.InitGopher();
        } , Math.random()*1.5+1.5 );
    }

    InitGopher(){
        let holeNumber : number = Math.floor(Math.random()*6);
        let newNode : Node = instantiate(this.gopher);
        // newNode.setPosition(this.holeNode[holeNumber].position);
        this.holeNode[holeNumber].addChild(newNode);  
        newNode.getComponent(Gopher).whac_a_mole = this;

        this.gopherEscape = function(){
            newNode.destroy();
            this.currGopher ++ ;
            this.InitGopher();
        }

        this.scheduleOnce(this.gopherEscape , 1.5);
    }

    ExitGame(){
        this.background.active = false;
        this.gameNode.active = false;
        this.gameStart = false;
        this.playerHealth.injured((this.targetClicks-this.currClicks) * this.damagePerClick , true);
    }
}

