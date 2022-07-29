import { _decorator, Component, Node } from 'cc';
import { Click } from '../MiniGames/Click'
import { DialogSystem } from '../UI/DialogSystem';
import { MiniGame, Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('PlayerAttack')
export class PlayerAttack extends Component {
    @property (Click) clickGame : Click = null;
    @property (DialogSystem) dialogSystem : DialogSystem = null;
    @property(Player) player : Player = null;

    ChooseGame(){
        switch(this.player.playerAttack)
            {
                case MiniGame.game1:
                    this.Game1Start();
                    break;
                case MiniGame.game2:
                    this.Game2Start();
                    break;
                case MiniGame.game3:
                    this.Game3Start();
                    break;
                case MiniGame.game4:
                    this.Game4Start();
                    break;
                case MiniGame.game5:
                    this.Game5Start();
                    break;
            }
    }
    
    Game1Start(){
        this.dialogSystem.EnterDialog(0.05 , ["在规定时间内点击屏幕，次数越多，伤害越高"] , this.clickGame.GameStart.bind(this.clickGame));
    }

    Game2Start(){

    }

    Game3Start(){

    }

    Game4Start(){

    }

    Game5Start(){

    }
}

