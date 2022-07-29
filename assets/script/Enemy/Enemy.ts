import { _decorator, Component, Node , Enum , Sprite, resources, SpriteFrame } from 'cc';
import { Health } from '../UI/Health';
const { ccclass, property } = _decorator;

export enum EnemyType{
    type1,
    type2,
    type3,
    type4,
    type5
}

@ccclass('Enemy')
export class Enemy extends Component {

    @property enemyName : string = "";
    @property({type:Enum(EnemyType)}) enemyType : EnemyType = EnemyType.type1;
    @property enemyMaxHealth : number = 0;
    @property enemyCurrHealth : number = 0;
    @property(Sprite) enemySprite : Sprite = null;
    
    enemyHealth : Health = null;
    

    start() {
        resources.load("image/EnemySprite/spriteFrame" , SpriteFrame , (err, enemySprite) => {
            this.enemySprite.spriteFrame = enemySprite;
        })
        this.enemyHealth = this.getComponent(Health);
        this.enemyHealth.maxHealth = this.enemyMaxHealth;
        this.enemyHealth.currentHealth = this.enemyCurrHealth;

    }
}

