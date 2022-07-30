import { _decorator, Component, Node , Label, input , Input, RichText, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DialogSystem')
export class DialogSystem extends Component {

    @property playSpeed:number = 0;
    private speed: number;

    @property(RichText) dialogLabel : RichText = null;
    @property(Node) dialogNode : Node = null;
    private contentStr : string = "";
    private currTextIndex : number = 0;
    private currDialogIndex : number = 0;
    private isPlaying : boolean = false;
    private inDialogMode : boolean = false;

    private contentList: Array<string> = null;

    private endEvent:Function = null;

    @property(Node) background : Node = null;
    @property(Node) gameNode : Node = null; 



    onLoad(){
        input.on(Input.EventType.MOUSE_DOWN,  this.onClickBox, this);
        input.on(Input.EventType.TOUCH_START, this.onClickBox, this);
    }

    onDestroy(){
        input.off(Input.EventType.MOUSE_DOWN,  this.onClickBox, this);
        input.off(Input.EventType.TOUCH_START, this.onClickBox, this);
    }

    onClickBox(){
        if (!this.inDialogMode) return;
        if (this.isPlaying){
            this.dialogLabel.string = this.contentStr;
            this.reset();
        } else 
        {
            this.currDialogIndex++;
            if (this.contentList[this.currDialogIndex] == null)
            {
                this.currDialogIndex = 0;
                this.ExitDialog();
            } else {
                this.playDialog(this.contentList[this.currDialogIndex]);
            }
        }
    }


    start() {
        this.dialogNode.active = false;
    }

    update(deltaTime: number) {
        if (!this.inDialogMode) return;
        if (this.isPlaying)
        {
            this.speed -= deltaTime;
            if (this.speed <= 0)
            {
                this.speed = this.playSpeed;
                if (this.contentStr[this.currTextIndex] == null)
                {
                    this.reset(); 
                } else
                {
                    this.addText(this.contentStr[this.currTextIndex]);
                    this.currTextIndex++;
                }
            }
        } else return;
    }

    playDialog(str:string, callback?:Function){
        this.isPlaying = true;
        this.contentStr = str;
        this.clearContent();

        if (callback)
        {
            this.endEvent = callback;
        }

    }

    setSpeed(num:number){
        this.playSpeed = num;
    }

    reset(){
        this.isPlaying = false;
        this.contentStr = "";
        this.currTextIndex = 0;
        this.speed = this.playSpeed;
    }

    clearContent(){
        this.dialogLabel.string = "";
    }

    addText(addStr:string){
        this.dialogLabel.string += addStr;
    }

    EnterDialogWithTxt(dialogSpeed:number, dialogText:TextAsset , callback ?: Function){
        let lineData : Array<string> = dialogText.text.toString().split('\n');
        this.EnterDialog(dialogSpeed , lineData , callback);
    }

    EnterDialog( dialogSpeed : number , dialogStr: Array<string> , callback?:Function)
    {
        this.inDialogMode = true;
        this.dialogNode.active = true;
        this.setSpeed(dialogSpeed);
        this.speed = this.playSpeed;
        this.contentList = dialogStr;
        if (callback){
            this.endEvent = callback;
        } else {
            this.endEvent = null;
        }
        this.playDialog(this.contentList[this.currDialogIndex]);
    }

    ExitDialog(){
        this.reset();
        this.inDialogMode = false;
        this.dialogNode.active = false;
        if (this.endEvent)
        {
            this.endEvent();
        }
    }
}

