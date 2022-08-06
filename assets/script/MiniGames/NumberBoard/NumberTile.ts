import { _decorator, Component, Node, Vec3, v3, Label } from 'cc';
import { NumberBoard } from './NumberBoard';
const { ccclass, property } = _decorator;

@ccclass('NumberTile')
export class NumberTile extends Component {
    public board : NumberBoard = null;
    private rotationSpeed : number = 300;
    private rotationY : number = 0;
    private targetRotation : number = 0;
    private label : Label = null;
    public  number : number = 1;
    private waitTime : number = 0;
    start() {
        
    }

    SetWaitTime(time : number){
        this.waitTime = time;
    }

    SetTargetRotation(targetRotation : number){
        this.targetRotation = targetRotation;
    }

    SetSpeed(speed : number){
        this.rotationSpeed =  speed;
    }


    SetNumber(num : number){
        this.label = this.node.getComponentInChildren(Label);

        this.label.string = num.toString();
        this.number = num;

        this.scheduleOnce(function(){
            this.targetRotation = 180;
        } , this.waitTime);
    }

    update(deltaTime: number) {
        this.label = this.node.getComponentInChildren(Label);

        if ((this.targetRotation == 180) && (this.rotationY < this.targetRotation)){ 
            this.rotationY += deltaTime * this.rotationSpeed;
        }
        if ((this.targetRotation == 0) && (this.rotationY > this.targetRotation)){
            this.rotationY -= deltaTime * this.rotationSpeed;
        }

        this.node.eulerAngles = v3(0 , this.rotationY , 0);

        if (this.rotationY >= 90){
            this.label.string = "";
        } else {
            this.label.string = this.number.toString();
        }
    }

    OnClickEvent(){
        this.board.OnTileClick(this);
    }
}

