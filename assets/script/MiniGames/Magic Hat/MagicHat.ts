import { _decorator, Component, Node, Prefab, resources, instantiate, math, Vec3, v3 } from 'cc';
import { Health } from '../../UI/Health';
import { Hat } from './Hat';
const { ccclass, property } = _decorator;

@ccclass('MagicHat')
export class MagicHat extends Component {

    @property(Node) background : Node = null;
    @property(Node) gameNode : Node = null;
    @property(Health) playerHealth : Health = null;
    @property damage : number = 0;
    @property hatNumber : number = 0;
    @property distance : number = 0;
    @property high : number = 0;
    @property moveSpeed : number = 100;
    @property exchangeSpeed : number = 200;
    @property exchangeTimes : number = 10;
    @property waitDuration : number = 0;

    public gameStart : boolean = false;
    private hats : Hat[] = [];
    private hatPrefab : Prefab = null;
    private rabbitPrefab : Prefab = null;
    private rabbitID : number = 0;
    private rabbit : Node = null;
    private currExchange : number = 0;
    private exchangeEnd : boolean = false;
    private gameWin : number = 0;

    
    start() {
        resources.load("prefab/HatPrefab" , Prefab , (err, prefab) => {
            this.hatPrefab = prefab;
        })
        resources.load("prefab/RabbitPrefab", Prefab , (err , prefab) => {
            this.rabbitPrefab = prefab;
        })
    }

    update(deltaTime: number) {
        
    }

    GameStart(){
        this.background.active = true;
        this.gameNode.active = true;
        this.gameStart = true;
        this.exchangeEnd = false;
        this.currExchange = 0;

        this.InitHats();

        this.rabbitID = Math.floor(Math.random() * this.hatNumber);
        this.SetRabbit();
        this.ShowRabbit();

        this.scheduleOnce(function(){
            this.HideRabbit();
        } , (this.high / this.moveSpeed) + this.waitDuration * 2);

        this.scheduleOnce(function(){
            this.currExchange++;
            this.ExchangeHat();
        } , (this.high / this.moveSpeed) * 2 + this.waitDuration * 3);
        
    }

    InitHats(){
        for (let i = 0; i < this.hatNumber ; i++){
            this.hats[i] = instantiate(this.hatPrefab).getComponent(Hat);
            this.gameNode.getChildByName("Hats").addChild(this.hats[i].node);
            this.hats[i].main = this;
            this.hats[i].ID = i;
            if (this.hatNumber % 2 == 1){
                this.hats[i].node.setPosition(this.distance / this.hatNumber * (i - (this.hatNumber-1) / 2 ) , 0 );
            } else {
                this.hats[i].node.setPosition(this.distance / this.hatNumber * (i - this.hatNumber / 2 + 0.5) , 0 );
            }
        }
    }

    SetRabbit(){ 
        this.rabbit = instantiate(this.rabbitPrefab);
        this.gameNode.addChild(this.rabbit);
        this.rabbit.setPosition(this.hats[this.rabbitID].node.position.x , this.hats[this.rabbitID].node.position.y);
        this.rabbit.setSiblingIndex(0);
    }

    ShowRabbit(){
        this.hats[this.rabbitID].SetTargetY(this.high);
    }

    HideRabbit(){
        this.hats[this.rabbitID].SetTargetY(0);
        this.scheduleOnce(function(){
            this.rabbit.destroy();
        } , this.high / this.moveSpeed);
        
    }

    ExchangeHat(){
        let ID1 : number = Math.floor(Math.random() * this.hatNumber);
        let ID2 : number = Math.floor(Math.random() * this.hatNumber);
        while (ID1 == ID2){
            ID2 = Math.floor(Math.random() * this.hatNumber);
        }

        this.hats[ID1].SetTargetX(this.hats[ID2].node.position.x);
        this.hats[ID2].SetTargetX(this.hats[ID1].node.position.x);
        if (this.currExchange < this.exchangeTimes ){
            this.currExchange++ ;
            this.scheduleOnce(function(){
                this.ExchangeHat();
            } , Math.abs(this.hats[ID1].node.position.x - this.hats[ID2].node.position.x) / this.exchangeSpeed + this.waitDuration);
        } else {    
            this.scheduleOnce(function(){
                this.exchangeEnd = true;
            } , Math.abs(this.hats[ID1].node.position.x - this.hats[ID2].node.position.x) / this.exchangeSpeed + this.waitDuration);
        }

    }

    HatClick(hat : Hat){
        if (!this.exchangeEnd) return;
        this.exchangeEnd = false;

        this.SetRabbit();
        hat.SetTargetY(this.high);

        if (hat.ID == this.rabbitID){
            this.gameWin = 0;
        } else {
            this.gameWin = 1;
        }

        this.scheduleOnce(function(){
            this.ExitGame();
        }, (this.high / this.moveSpeed) + this.waitDuration * 2);
    }

    ExitGame(){
        for (let i = 0; i < this.hatNumber ; i++){
            this.hats[i].node.destroy();
        }
        this.rabbit.destroy();
        
        this.background.active = false;
        this.gameNode.active = false;
        this.gameStart = false;
        this.playerHealth.injured(this.damage * this.gameWin);
    }
}

