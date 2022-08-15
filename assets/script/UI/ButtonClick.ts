import { _decorator, Component, Node, Button, TextAsset, find } from 'cc';
import { RoundSystem } from '../GameManager/RoundSystem';
import { DialogSystem } from './DialogSystem';
import { MiniGame, Player } from '../Player/Player';
import { PlayerAttack } from '../Player/PlayerAttack';

const { ccclass, property } = _decorator;

@ccclass('ButtonClick')
export class ButtonClick extends Component {
    
    @property(RoundSystem) roundSystem : RoundSystem = null;
    @property(DialogSystem) dialogSystem : DialogSystem = null;
    @property(TextAsset) text : TextAsset = null;

    @property(Button) AttackButton : Button = null;
    @property(Button) CommunicateButton : Button = null;
    @property(Button) ItemsButton : Button = null;
    @property(Button) EscapeButton : Button = null;

    @property(Player) player : Player = null;
    @property(PlayerAttack) playerAttack : PlayerAttack = null;

    start(){

    }

    update (deltaTime: number){
        this.AttackButton.interactable = this.roundSystem.actionable;
        this.CommunicateButton.interactable = this.roundSystem.actionable;
        this.ItemsButton.interactable = this.roundSystem.actionable;
        this.EscapeButton.interactable = this.roundSystem.actionable;

        //test
        this.AttackButton.node.active = this.roundSystem.actionable;
        this.CommunicateButton.node.active = this.roundSystem.actionable;
        this.ItemsButton.node.active = this.roundSystem.actionable;
        this.EscapeButton.node.active = this.roundSystem.actionable;
    }

    Attack(){
        //console.log("attack");
        this.playerAttack.ChooseGame();
    }

    Communicate(){
        //console.log("Communicate");
        this.dialogSystem.EnterDialogWithTxt(0.05, this.text);
    }

    Items(){
        //console.log("items");
    }

    Escape(){
        //console.log("escape");
    }
}

