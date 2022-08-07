import { _decorator, Component, Node, SpriteFrame , Sprite, Button, v3 } from 'cc';
import { Link } from './Link';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {

    @property([SpriteFrame]) tileSpriteFrame : SpriteFrame[] = [];

    private tileSprite : Sprite = null;
    public type : number = 0;
    public link : Link = null;
    public isSelected : Boolean = false;
    private targetRotation : number = 0;
    private rotationY : number = 0;
    private rotationSpeed : number = 360;

    update(deltaTime: number) {
        this.tileSprite = this.getComponent(Sprite);

        if ((this.targetRotation == 180) && (this.rotationY < this.targetRotation)){ 
            this.rotationY += deltaTime * this.rotationSpeed;
        }
        if ((this.targetRotation == 0) && (this.rotationY > this.targetRotation)){
            this.rotationY -= deltaTime * this.rotationSpeed;
        }

        this.node.eulerAngles = v3(0 , this.rotationY , 0);

        if (this.rotationY <= 90){
            this.tileSprite.spriteFrame = this.tileSpriteFrame[9];
        } else {
            this.tileSprite.spriteFrame = this.tileSpriteFrame[this.type];
        }
    }

    SetType( type : number ){
        this.tileSprite = this.getComponent(Sprite);
        this.tileSprite.spriteFrame = this.tileSpriteFrame[type];
        this.type = type;
    }

    OnCLickEvent(){
        this.link.OnTileClick(this);
    }

    SetIsSelected( isSelected : boolean ){
        this.tileSprite = this.getComponent(Sprite);
        this.isSelected = isSelected;
        if (isSelected){
            this.targetRotation = 180 ;
        } else {
            this.targetRotation = 0 ;
        }
    }

    IsLink(){
        this.node.active = false ;
        this.node.destroy();
    }
}

