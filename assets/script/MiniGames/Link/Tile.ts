import { _decorator, Component, Node, SpriteFrame , Sprite, Button } from 'cc';
import { Link } from './Link';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {

    @property([SpriteFrame]) tileSpriteFrame : SpriteFrame[] = [];

    private tileSprite : Sprite = null;
    public type : number = 0;
    public link : Link = null;
    public isSelected : Boolean = false;

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
            //this.tileSprite.color.set(255 , 255 , 255 , 125);
            this.getComponent(Button).normalColor.set(255 , 255 , 255 , 125);
        } else {
            //this.tileSprite.color.set(255 , 255 , 255 , 255);
            this.getComponent(Button).normalColor.set(255 , 255 , 255 , 255);
        }
    }

    IsLink(){
        this.node.active = false ;
        this.node.destroy();
    }
}

