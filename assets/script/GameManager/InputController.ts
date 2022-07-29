import { _decorator, Component, Node, Input, input, EventMouse, EventKeyboard } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputController')
export class InputController extends Component {
    
    onLoad(){
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy(){
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }


    onMouseDown (event: EventMouse){
        if (event.getButton() == 0)
        {
            console.log("鼠标左键被按下");
        }
        else if (event.getButton() == 2)
        {
            console.log("鼠标右键被按下");
        }
        
    }

    onKeyDown (event: EventKeyboard){
        console.log(String.fromCharCode(event.keyCode));
    }
}

