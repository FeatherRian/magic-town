import { _decorator, Component, Node } from 'cc';
import { Click } from '../MiniGames/Click/Click';
import { Link } from '../MiniGames/Link/Link';
import { NumberBoard } from '../MiniGames/NumberBoard/NumberBoard';
import { Whac_a_mole } from '../MiniGames/Whac-a-mole/Whac-a-mole';
import { DialogSystem } from '../UI/DialogSystem';
import { Enemy, EnemyType } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('EnemyAttack')
export class EnemyAttack extends Component {
    
    @property (Enemy) enemy : Enemy = null;

    @property (Link) link : Link = null;
    @property (Click) clickGame : Click = null;
    @property (Whac_a_mole) whac_a_mole : Whac_a_mole = null;
    @property (NumberBoard) numberBoard : NumberBoard = null;
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
        this.dialogSystem.EnterDialog(0.05 , ["在规定时间内打地鼠，次数越多，受到伤害越低"] , this.whac_a_mole.GameStart.bind(this.whac_a_mole));
    }

    Game3Start(){
        this.dialogSystem.EnterDialog(0.05 , ["在规定时间内进行连连看，剩下的方块越少，受到伤害越低"], this.link.GameStart.bind(this.link));
    }

    Game4Start(){
        this.dialogSystem.EnterDialog(0.05, ["在规定时间内记住排序，并在牌子翻回去之后按顺序点击数字"], this.numberBoard.GameStart.bind(this.numberBoard));
    }

    Game5Start(){

    }
}

