import { _decorator, Component, Node, Input } from 'cc';
import { Tetris } from './Tetris';
const { ccclass, property } = _decorator;

@ccclass('CrossButton')
export class CrossButton extends Component {

    @property(Tetris) main : Tetris = null;
    @property pressingTime : number = 0.5;
    @property pressingDuration : number = 0.1;

    private clickEvent : Function = null;
    private pressingEvent : Function = null;
    private touchTime : number = 0;
    private touchFlag : boolean = false;

    onEnable(){
        this.node.on(Input.EventType.TOUCH_START , this.TouchStart , this);
        this.node.on(Input.EventType.TOUCH_END , this.TouchEnd , this);
        this.touchFlag = false;

        switch (this.node.name){
            case "LeftButton" : 
                this.clickEvent = this.main.LeftButton.bind(this.main);
                this.pressingEvent = () => {
                    this.main.LeftButton.bind(this.main)();
                };
                break;
            case "RightButton" :
                this.clickEvent = this.main.RightButton.bind(this.main);
                this.pressingEvent = () => {
                    this.main.RightButton.bind(this.main)();
                };
                break;
            case "UpButton" :
                this.clickEvent = this.main.UpButton.bind(this.main);
                this.pressingEvent = () => {

                };
                break;
            case "DownButton" : 
                this.clickEvent = this.main.DownButton.bind(this.main);
                this.pressingEvent = () => {
                    this.main.DownButton.bind(this.main)();
                };
                break;
        }
    }

    TouchStart(){
        this.touchFlag = true;
        this.touchTime = 0;
    }

    TouchEnd(){
        if (this.touchFlag){
            this.touchFlag = false;
            this.clickEvent();
        } else {
            this.unschedule(this.pressingEvent);
        }
    }

    Pressing(){
        this.touchFlag = false;
        this.schedule(this.pressingEvent , this.pressingDuration);
    }

    update(deltaTime: number) {
        if (this.touchFlag){
            this.touchTime += deltaTime;
            if (this.touchTime >= this.pressingTime){
                this.Pressing();
            }
        }
    }

    onDisable(){
        this.node.off(Input.EventType.TOUCH_START , this.TouchStart , this);
        this.node.off(Input.EventType.TOUCH_END , this.TouchEnd , this);
    }
}

