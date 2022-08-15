import { _decorator, Component, Node, Button } from 'cc';
import { Wand } from './Wand';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    @property cardId : number = 0;
    @property costMana : number = 0;
    @property coolDownTime : number = 0;
    @property damage : number = 0;
    @property defense : number = 0;
    @property damageTimes : number = 0;


    public main : Wand = null;
    public currCoolDown : number = 0;
    public button : Button = null;


    onClickEvent(){
        this.main.onClickEvent(this);
    }
}

