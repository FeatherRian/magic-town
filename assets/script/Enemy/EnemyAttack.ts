import { _decorator, Component, Node } from 'cc';
import { Click } from '../MiniGames/Click';
import { DialogSystem } from '../UI/DialogSystem';
import { Enemy, EnemyType } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('EnemyAttack')
export class EnemyAttack extends Component {
    
    @property (Enemy) enemy : Enemy = null;

    @property (Click) clickGame : Click = null;
    @property (DialogSystem) dialogSystem : DialogSystem = null;

    ChooseGame(){
        switch(this.enemy.enemyType)
            {
                case EnemyType.type1:
                    this.Game1Start();
                    break;
                case EnemyType.type2:
                    this.Game2Start();
                    break;
                case EnemyType.type3:
                    this.Game3Start();
                    break;
                case EnemyType.type4:
                    this.Game4Start();
                    break;
                case EnemyType.type5:
                    this.Game5Start();
                    break;
            }
    }
    
    Game1Start(){
        this.dialogSystem.EnterDialog(0.05 , ["在规定时间内点击屏幕，次数越多，受到伤害越低"] , this.clickGame.GameStart.bind(this.clickGame));
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

