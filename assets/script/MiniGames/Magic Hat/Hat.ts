import { _decorator, Component, Node } from 'cc';
import { MagicHat } from './MagicHat';
const { ccclass, property } = _decorator;

@ccclass('Hat')
export class Hat extends Component {
    public ID : number = 0;
    public main : MagicHat = null;
    private targetY : number = 0;
    private targetX : number = 0;
    private currX : number = 0;

    OnClickEvent(){
        this.main.HatClick(this);
    }

    SetTargetX(num : number){
        this.targetX = num;
        this.currX = this.node.position.x;
    }

    SetTargetY(num : number){
        this.targetY = num;
    }

    update(deltaTime : number){
        if (!this.main.gameStart) return;
        //纵向移动
        if ((this.targetY != 0) && (this.node.position.y < this.targetY)) {
            this.node.setPosition(this.node.position.x , this.node.position.y + deltaTime * this.main.moveSpeed);
        } 
        if ((this.targetY == 0) && (this.node.position.y > this.targetY)) {
            this.node.setPosition(this.node.position.x , this.node.position.y - deltaTime * this.main.moveSpeed);
        }

        //横向移动
        if ((this.targetX > this.currX) && (this.targetX > this.node.position.x)){
            this.node.setPosition(this.node.position.x + deltaTime * this.main.exchangeSpeed , this.node.position.y);
        }
        if ((this.targetX < this.currX) && (this.targetX < this.node.position.x)){
            this.node.setPosition(this.node.position.x - deltaTime * this.main.exchangeSpeed , this.node.position.y);
        }
    }
    
}

