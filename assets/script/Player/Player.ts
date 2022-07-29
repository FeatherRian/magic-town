import { _decorator, Component, Node, Enum, Sprite, SpriteFrame, resources} from 'cc';
import { Health } from '../UI/Health';
const { ccclass, property } = _decorator;

export enum MiniGame{
    game1,
    game2,
    game3,
    game4,
    game5
}

@ccclass('Player')
export class Player extends Component {
    

    @property playerName : string = "";
    @property playerMaxHealth : number = 0;
    @property playerCurrHealth : number = 0;
    @property(Sprite) playerSprite : Sprite = null;
    
    playerHealth : Health = null;
    @property({type:Enum(MiniGame)}) playerAttack : MiniGame = MiniGame.game1;

    start() {
        resources.load("image/PlayerSprite/spriteFrame" , SpriteFrame , (err, PlayerSprite) => {
            this.playerSprite.spriteFrame = PlayerSprite;
        })
        this.playerHealth = this.getComponent(Health);
        this.playerHealth.maxHealth = this.playerMaxHealth;
        this.playerHealth.currentHealth = this.playerCurrHealth;
    }

}

