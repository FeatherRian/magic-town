import { _decorator, Component, Node } from 'cc';
import { Whac_a_mole } from './Whac-a-mole';
const { ccclass, property } = _decorator;

@ccclass('Gopher')
export class Gopher extends Component {
    whac_a_mole : Whac_a_mole = null;

    onClickEvent(){
        this.node.destroy();
        this.whac_a_mole.HitGopher();
    }
}

