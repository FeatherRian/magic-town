import { _decorator, Component, Node, } from 'cc';
import { Enemy } from '../Enemy/Enemy';
import { RoundSystem } from '../GameManager/RoundSystem';
import { Player } from '../Player/Player';
import { DialogSystem } from './DialogSystem';
const { ccclass, property } = _decorator;

@ccclass('Health')
export class Health extends Component {
    
    @property(DialogSystem) dialogSystem : DialogSystem = null;
    @property(RoundSystem) roundSystem : RoundSystem = null;
    @property(Node) playerNode : Node = null;
    @property(Node) enemyNode : Node = null;
    private _currentHealth : number = 0;
    public maxHealth : number = 1000;
    public get currentHealth(){
        return this._currentHealth;
    }
    set currentHealth(value){
        this._currentHealth = value;
    }

    start(){
        this.currentHealth = this.maxHealth;
    }



    injured(damage:number){
        if (this.currentHealth <= damage){
            this.currentHealth = 0;
            if (this.node.name == "Player"){
                //console.log(this);
                this.dialogSystem.EnterDialog(0.05 , [this.playerNode.getComponent(Player).playerName+"受到"+this.enemyNode.getComponent(Enemy).enemyName+"的"+damage+"点伤害并被击败了"]);
            }
            if (this.node.name == "Enemy"){
                //console.log(this);
                this.dialogSystem.EnterDialog(0.05 , [this.playerNode.getComponent(Player).playerName+"对"+this.enemyNode.getComponent(Enemy).enemyName+"造成"+damage+"点伤害并击败了他"]);
            }
            this.death();
        }
        else{
            this.currentHealth -= damage;
            if (this.node.name == "Player"){
                //console.log(this);
                this.dialogSystem.EnterDialog(0.05 , [this.playerNode.getComponent(Player).playerName+"受到"+this.enemyNode.getComponent(Enemy).enemyName+"的"+damage+"点伤害"] , this.roundSystem.PlayerRoundBegin.bind(this.roundSystem));
            }
            if (this.node.name == "Enemy"){
                //console.log(this);
                this.dialogSystem.EnterDialog(0.05 , [this.playerNode.getComponent(Player).playerName+"对"+this.enemyNode.getComponent(Enemy).enemyName+"造成"+damage+"点伤害"] , this.roundSystem.EnemyRoundBegin.bind(this.roundSystem));
            }
        }
    }

    death(){

    }
}

