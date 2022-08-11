import { _decorator, Component, Node, find } from 'cc';
import { RoundSystem } from '../GameManager/RoundSystem';
import { Link } from '../MiniGames/Link/Link';
import { MagicHat } from '../MiniGames/Magic Hat/MagicHat';
import { Whac_a_mole } from '../MiniGames/Whac-a-mole/Whac-a-mole';
import { DialogSystem } from '../UI/DialogSystem';
import { Enemy, EnemyType } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('EnemyAttack')
export class EnemyAttack extends Component {
    
    

    @property (MagicHat) magicHat : MagicHat = null;
    @property (Link) link : Link = null;
    @property (Whac_a_mole) whac_a_mole : Whac_a_mole = null;
    @property (DialogSystem) dialogSystem : DialogSystem = null;
    @property (RoundSystem) roundSystem : RoundSystem = null;
    
    private enemy : Enemy = null;

    start(){
        this.enemy = this.getComponent(Enemy);
        this.roundSystem = find("GameManager").getComponent(RoundSystem);
    }
    

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
        this.dialogSystem.EnterDialog(0.05 , ["盯紧有兔子的魔术帽，并在帽子停止移动后找出它"] , this.magicHat.GameStart.bind(this.magicHat));
    }

    Game2Start(){
        this.dialogSystem.EnterDialog(0.05 , ["在规定时间内打地鼠，次数越多，受到伤害越低"] , this.whac_a_mole.GameStart.bind(this.whac_a_mole));
    }

    Game3Start(){
        this.dialogSystem.EnterDialog(0.05 , ["在规定时间内进行翻牌连连看，剩下的方块越少，受到伤害越低"], this.link.GameStart.bind(this.link));
    }

    Game4Start(){
        
    }

    Game5Start(){
        this.SkipRound();
    }

    SkipRound(){
        this.roundSystem.PlayerRoundBegin.bind(this.roundSystem)();
    }
}

