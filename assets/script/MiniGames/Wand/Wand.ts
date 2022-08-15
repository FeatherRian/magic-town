import { _decorator, Component, Node, Prefab, ProgressBar, Label, instantiate, Button } from 'cc';
import { RoundSystem } from '../../GameManager/RoundSystem';
import { Health } from '../../UI/Health';
import { Card } from './Card';
const { ccclass, property } = _decorator;

@ccclass('Wand')
export class Wand extends Component {
    @property(RoundSystem) roundSystem : RoundSystem = null;
    @property(Node) background : Node = null;
    @property(Node) gameNode : Node = null;  
    @property(Health) enemyHealth : Health= null;
    @property damagePerScore : number = 0;
    @property(ProgressBar) manaBar : ProgressBar = null;
    @property(Label) manaLabel : Label = null;
    
    @property setMaxMana : number = 5;
    @property([Prefab]) magicCardsPre : Prefab[] = [];
    @property([Boolean]) magicCardsAvailable : Boolean[] = [];

    public gameStart : boolean = false;
    private currentRound : number = 0;

    public magicCards : Card[] = [];
    private maxMana : number = 5;
    private currMana : number = 0;

    private doubleMagic : boolean = false;
    private powerNumber : number = 0;
    private powerTime : number = 0;
    private manaUpgrade : boolean = false;
    private nextCardZeroCost : boolean = false;

    private defenseTime : number = 0;
    private currDefense : number = 0;
    private strengthenDefense : boolean = false;

    GameStart(){
        this.background.active = true;
        this.gameNode.active = true;
        this.gameStart = true;
        this.currentRound = 0;
        this.maxMana = this.setMaxMana;
        this.currMana = this.maxMana;
        this.doubleMagic = false;
        this.powerNumber = 0;
        this.powerTime = 0;
        this.manaUpgrade = false;
        this.nextCardZeroCost = false;
        this.defenseTime = 0;
        this.currDefense = 0;
        this.strengthenDefense = false;

        this.InitCard();
        this.ThisRoundStart();
    }

    InitCard(){
        for (let i = 0; i <= 10; i++){
            if (this.magicCardsAvailable[i]){
                let card : Card = instantiate(this.magicCardsPre[i]).getComponent(Card);
                card.node.setParent(this.gameNode);
                card.node.setPosition( -420 , 50 *( 5 - i ));
                card.main = this;
                card.button = card.node.getComponent(Button);
                this.magicCards[i] = card;
            }
        }
    }

    ThisRoundStart(){
        this.background.active = true;
        this.gameNode.active = true;
        this.currentRound += 1;

        if (this.manaUpgrade && (this.currentRound % 2 == 1)){
            this.currMana += this.maxMana;
        } else {
            this.currMana = this.maxMana;
        }

        if (this.currDefense > 0){
            this.defenseTime -= 1;
            if (this.defenseTime == 0){
                this.currDefense = 0;
            }
        }

        if (this.powerNumber != 0){
            this.powerTime -= 1;
            if (this.powerTime == 0){
                this.powerNumber = 0;
            }
        }

        for (let i = 0; i <= 10; i++){
            if (this.magicCardsAvailable[i]){
                this.magicCards[i].node.active = true;
                if (this.magicCards[i].currCoolDown > 0){
                    this.magicCards[i].currCoolDown -= 1;
                }
            }
        }
    }

    ThisRoundEnd(){
        this.background.active = false;
        this.gameNode.active = false;
        this.roundSystem.EnemyRoundBegin();
    }

    onClickEvent(card : Card){
        
        this.CostMana(card);

        if (this.doubleMagic){
            this.doubleMagic = false;
            this.Hit(card);
            this.SpecialEffect(card);
        }
        this.Hit(card);
        this.SpecialEffect(card);
        
        this.IntoCoolDown(card);
    }

    CostMana(card){
        //消耗法力
        if (this.nextCardZeroCost){
        this.nextCardZeroCost = false;
        } else if (card.cardId == 9){
            this.currMana = 0;
        } else {
            this.currMana -= card.costMana;
        }
    }

    Hit(card){
        //造成伤害
        if (card.damage != 0){
            this.enemyHealth.injured((card.damage + this.powerNumber) * card.damageTimes * this.damagePerScore, false);
        }
    }

    SpecialEffect(card){
        //特殊效果
        switch (card.cardId){
            case 1 : //防御
                this.currDefense += card.defense;
                this.defenseTime = 1;
                break;
            case 2 : //双发
                this.doubleMagic = true;
                break;
            case 3 : //冥想
                this.currMana += 3;
                break;

            case 4 : //防御强化（未完成）
                this.strengthenDefense = true;
                break;

            case 5 : //突破法力上限
                this.maxMana += 3;
                break;
            case 7 : //力量附加
                this.powerNumber = 1;
                this.powerTime = 2;
                break;
            case 8 : //发力容器改装
                this.manaUpgrade = true;
                break;
            case 9 : //无谋竭力
                this.nextCardZeroCost = true;
                break;
        }
    }

    IntoCoolDown(card){
        //进入冷却
        this.magicCards[card.cardId].currCoolDown = card.coolDownTime;
    }

    start() {

    }

    update(deltaTime: number) {

        this.manaBar.progress = this.currMana / this.maxMana;
        this.manaLabel.string = this.currMana + "/" + this.maxMana;

        for (let i = 0; i <= 10; i++){
            if (this.magicCardsAvailable[i]){
                this.magicCards[i].node.active = true;

                if ((this.magicCards[i].currCoolDown == 0) && ((this.currMana >= this.magicCards[i].costMana) || (this.nextCardZeroCost))){
                    this.magicCards[i].button.interactable = true;
                } else {
                    this.magicCards[i].button.interactable = false;
                }
            }
        }
    }
}

