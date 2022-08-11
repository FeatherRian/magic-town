import { _decorator, Component, Node, Input } from 'cc';
import { Tetris } from './Tetris';
const { ccclass, property } = _decorator;

@ccclass('CrossButton')
export class CrossButton extends Component {

    @property(Tetris) main : Tetris = null;
    @property pressingTime : number = 0.5;
    @property pressingDuration : number = 0.1;
    @property doubleClickTime : number = 0.2;

    private clickEvent : Function = null;
    private pressingEvent : Function = null;
    private doubleClickEvent : Function = null;
    private touchTime : number = 0;
    private touchFlag : boolean = false;
    private pressingFlag : boolean = false;
    private doubleClickFlag : boolean = false;
    private touchDuration : number = 0;
    

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
                this.doubleClickEvent = this.main.LeftButton.bind(this.main);
                break;
            case "RightButton" :
                this.clickEvent = this.main.RightButton.bind(this.main);
                this.pressingEvent = () => {
                    this.main.RightButton.bind(this.main)();
                };
                this.doubleClickEvent = this.main.RightButton.bind(this.main);
                break;
            case "UpButton" :
                this.clickEvent = this.main.UpButton.bind(this.main);
                this.pressingEvent = () => {

                };
                this.doubleClickEvent = this.main.UpButton.bind(this.main);
                break;
            case "DownButton" : 
                this.clickEvent = this.main.DownButton.bind(this.main);
                this.pressingEvent = () => {
                    this.main.DownButton.bind(this.main)();
                };
                this.doubleClickEvent = this.main.Drop.bind(this.main);
                break;
        }
    }

    TouchStart(){
        this.touchFlag = true;
        this.touchTime = 0;
    }

    TouchEnd(){
        this.touchFlag = false;

        if (this.pressingFlag){
            this.unschedule(this.pressingEvent);
            this.doubleClickFlag = false;
            this.pressingFlag =false;
            return;
        }

        if (this.doubleClickFlag){
            this.DoubleClick();
            this.doubleClickFlag = false;
            return;
        }

        this.clickEvent();
        this.doubleClickFlag = true;

        
    }

    DoubleClick(){
        this.doubleClickEvent();
    }

    Pressing(){
        this.pressingFlag = true;
        this.schedule(this.pressingEvent , this.pressingDuration);
    }

    update(deltaTime: number) {
        if (this.touchFlag){
            this.touchTime += deltaTime;

            if (this.touchTime >= this.pressingTime){
                if (!this.pressingFlag){
                    this.Pressing();
                }
            }

            if (this.doubleClickFlag){
                if (this.touchDuration >= this.doubleClickTime){
                    this.doubleClickFlag = false;
                }
            }

            this.touchDuration = 0;
        } else {
            this.touchDuration += deltaTime;
        }
    }

    onDisable(){
        this.node.off(Input.EventType.TOUCH_START , this.TouchStart , this);
        this.node.off(Input.EventType.TOUCH_END , this.TouchEnd , this);
    }
}

