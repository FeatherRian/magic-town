import { _decorator, Component, Node, find } from 'cc';
import { EnemyAttack } from '../Enemy/EnemyAttack';
import { DialogSystem } from '../UI/DialogSystem';
const { ccclass, property } = _decorator;

@ccclass('RoundSystem')
export class RoundSystem extends Component {

    @property(Node) enemyNode : Node = null ;
    @property(DialogSystem) dialogSystem : DialogSystem = null; 
    @property(Node) gameNode : Node = null;
    @property(Node) gameButtonNode : Node = null;


    @property playerRound: boolean = false;
    @property actionable: boolean = false;

    start(){
        this.gameNode.active = false;
        this.playerRound = false;
        this.actionable = false;
    }

    PlayerRoundBegin(){

        // console.log("PlayerRoundBegin");
        this.dialogSystem.EnterDialog(0.05 , ["你的回合开始了"] , (() => {
            this.playerRound = true;
            this.actionable = true;
            // console.log("PlayerRoundBegin");
        }).bind(this));
    }

    AfterChoose(){
        this.actionable = false;
        // console.log("AfterChoose");
    }

    EnemyRoundBegin(){
        // console.log("EnemyRoundBegin");
        this.dialogSystem.EnterDialog(0.05 , ["敌人的回合开始了"] , (() => {
            this.playerRound = false;
            this.enemyNode.getComponent(EnemyAttack).ChooseGame();
        }).bind(this));
    } 

    GameStart(){
        this.gameNode.active = true;
        this.gameButtonNode.active = false;
        this.PlayerRoundBegin();
    }


}

