import { _decorator, Component, Node, Prefab, Vec2, instantiate, v2, v3, input, Input, EventKeyboard, KeyCode, Label, Sprite } from 'cc';
import { Health } from '../../UI/Health';
const { ccclass, property } = _decorator;

@ccclass('Tetris')
export class Tetris extends Component {
    @property([Prefab]) block : Prefab[] = [];
    @property(Node) background : Node = null;
    @property(Node) gameNode : Node = null;
    @property(Health) enemyHealth : Health = null;
    @property blockLength : number = 0;
    @property damagePerScore : number = 0;
    @property(Label) scoreLabel : Label = null;
    @property shadowAlpha : number = 120;

    private box : Node[][] = [];
    private rand : number = 0;

    //当前的块
    private currentBlock: Node = null;
    private currentBlockPart : Node[] = [];
    //当前块的位置
    private currentBlockPartPos : Vec2[] = [];

    //当前的块的投影
    private shadowBlock: Node = null;
    private shadowBlockPart : Node[] = [];
    //当前块的投影的位置
    private shadowBlockPartPos: Vec2[] = [];

    public gameStart : boolean = false;
    private remainBlock : number = 0;
    private score : number = 0;

    private autoDown : Function = null;

    // onKeyDown(event : EventKeyboard){
    //     switch (event.keyCode) {
    //         case KeyCode.ARROW_LEFT:
    //             this.LeftButton();
    //             break;
    //         case KeyCode.ARROW_RIGHT:
    //             this.RightButton();
    //             break;
    //         case KeyCode.ARROW_UP:
    //             this.UpButton();
    //             break;
    //         case KeyCode.ARROW_DOWN:
    //             this.DownButton();
    //             break;
    //     }
    // }
    onLoad(){
        
    }

    update(){
        this.scoreLabel.string = "当前得分：" + this.score;
    }

    GameStart(){
        // input.on(Input.EventType.KEY_DOWN, this.onKeyDown , this);
        this.background.active = true;
        this.gameNode.active = true;
        this.gameStart = true;
        this.remainBlock = 5;
        this.score = 0;

        this.InitBox();
        this.AutoDown();
    }

    ThisRoundStart(){
        this.background.active = true;
        this.gameNode.active = true;
        this.remainBlock = 5;
        this.score = 0;

        this.BuildBlock();
        this.AutoDown();
    }

    InitBox() {
        for (let i = 0; i < 20; i++) {
            this.box[i] = [];
            for (let j = 0; j < 10; j++) {
                this.box[i][j] = null;
            }
        }
        //生成不同的方块集合
        this.BuildBlock();
    }

    BuildBlock() {
        if (this.remainBlock == 0){
            this.ThisRoundEnd();
            return;
        }
        this.remainBlock--;
        
        this.rand = Math.floor(7 * Math.random());
        this.ChooseColor(this.rand);
        this.ChooseType(this.rand);

        //同时创造对应的影子
        this.BuildShadow();
        this.ShadowDrop();
    }

    ChooseColor( rand : number ){
        for (let i = 1; i <= 4 ; i++){
            this.currentBlockPart[i] = instantiate(this.block[rand]);
        }
        this.currentBlock = new Node();
        this.gameNode.addChild(this.currentBlock);

        switch (rand){
            //正方形方块
            case 0: 
                this.currentBlock.setPosition(0, this.blockLength *8);
                break;
            //Z字形方块
            case 1: 
                this.currentBlock.setPosition(this.blockLength * 0.5 , this.blockLength * 8.5);
                break;
            //左L型方块
            case 2: 
                this.currentBlock.setPosition(this.blockLength * 0.5 , this.blockLength * 8.5);
                break;
            //右L型方块
            case 3: 
                this.currentBlock.setPosition(this.blockLength * 0.5 , this.blockLength * 8.5);
                break;
            //反Z型方块
            case 4: 
                this.currentBlock.setPosition(this.blockLength * 0.5 , this.blockLength * 8.5);
                break;
            //长条型方块
            case 5:
                this.currentBlock.setPosition(this.blockLength * 0.5 , this.blockLength * 7.5);
                break;
            //T字形方块
            case 6:
                this.currentBlock.setPosition(this.blockLength * 0.5 , this.blockLength * 7.5);
                break;
        }
        
        for (let i = 1; i <= 4 ; i++){
            this.currentBlock.addChild(this.currentBlockPart[i]);
        }

    }

    ChooseType(rand : number){
        if (rand == 0) {
            //正方形右上
            this.currentBlockPart[1].setPosition(this.blockLength * 0.5 , this.blockLength * 0.5);
            this.currentBlockPartPos[1] = v2(18, 5);  //初始化当前块的位置，相对于currentBlock
            //正方形左上
            this.currentBlockPart[2].setPosition(-this.blockLength * 0.5 , this.blockLength * 0.5);
            this.currentBlockPartPos[2] = v2(18, 4);
            //正方形右下
            this.currentBlockPart[3].setPosition(this.blockLength * 0.5 , -this.blockLength * 0.5);
            this.currentBlockPartPos[3] = v2(17, 5);
            //正方形左下
            this.currentBlockPart[4].setPosition(-this.blockLength * 0.5 , -this.blockLength * 0.5);
            this.currentBlockPartPos[4] = v2(17, 4);
        }
        //创建Z字形
        if (rand == 1) {
            //Z字形左
            this.currentBlockPart[1].setPosition(-this.blockLength, 0);
            this.currentBlockPartPos[1] = v2(18, 4);  //初始化当前块的位置，相对于currentBlock
            //Z字形中
            this.currentBlockPart[2].setPosition(0, 0);
            this.currentBlockPartPos[2] = v2(18, 5);
            //Z字形下
            this.currentBlockPart[3].setPosition(0, -this.blockLength);
            this.currentBlockPartPos[3] = v2(17, 5);
            //Z字形右
            this.currentBlockPart[4].setPosition(this.blockLength, -this.blockLength);
            this.currentBlockPartPos[4] = v2(17, 6);
        }
        //创建左L型
        if (rand == 2) {
            //左L形上
            this.currentBlockPart[1].setPosition(0, this.blockLength);
            this.currentBlockPartPos[1] = v2(19, 5);  //初始化当前块的位置，相对于currentBlock
            //左L形中
            this.currentBlockPart[2].setPosition(0, 0);
            this.currentBlockPartPos[2] = v2(18, 5);
            //左L形下
            this.currentBlockPart[3].setPosition(0, -this.blockLength);
            this.currentBlockPartPos[3] = v2(17, 5);
            //Z字形右
            this.currentBlockPart[4].setPosition(this.blockLength, -this.blockLength);
            this.currentBlockPartPos[4] = v2(17, 6);
        }
        //创建右L型
        if (rand == 3) {
            //右L型上
            this.currentBlockPart[1].setPosition(0, this.blockLength);
            this.currentBlockPartPos[1] = v2(19, 5);  //初始化当前块的位置，相对于currentBlock
            //右L型中
            this.currentBlockPart[2].setPosition(0, 0);
            this.currentBlockPartPos[2] = v2(18, 5);
            //右L型下
            this.currentBlockPart[3].setPosition(0, -this.blockLength);
            this.currentBlockPartPos[3] = v2(17, 5);
            //右L型左
            this.currentBlockPart[4].setPosition(-this.blockLength, -this.blockLength);
            this.currentBlockPartPos[4] = v2(17, 4);
        }
        //创建反Z型
        if (rand == 4) {
            //反Z形右
            this.currentBlockPart[1].setPosition(this.blockLength, 0);
            this.currentBlockPartPos[1] = v2(18, 6);  //初始化当前块的位置，相对于currentBlock
            //反Z形中
            this.currentBlockPart[2].setPosition(0, 0);
            this.currentBlockPartPos[2] = v2(18, 5);
            //反Z形下
            this.currentBlockPart[3].setPosition(0, -this.blockLength);
            this.currentBlockPartPos[3] = v2(17, 5);
            //反Z形左
            this.currentBlockPart[4].setPosition(-this.blockLength, -this.blockLength);
            this.currentBlockPartPos[4] = v2(17, 4);
        }
        //创建长条型
        if (rand == 5) {
            //长条型上上
            this.currentBlockPart[1].setPosition(0, this.blockLength * 2);
            this.currentBlockPartPos[1] = v2(19, 5);  //初始化当前块的位置，相对于currentBlock
            //长条型上
            this.currentBlockPart[2].setPosition(0, this.blockLength);
            this.currentBlockPartPos[2] = v2(18, 5);
            //长条型中
            this.currentBlockPart[3].setPosition(0, 0);
            this.currentBlockPartPos[3] = v2(17, 5);
            //长条型下
            this.currentBlockPart[4].setPosition(0, -this.blockLength);
            this.currentBlockPartPos[4] = v2(16, 5);
        }
        //创建T字形
        if (rand == 6) {
            //T字形上
            this.currentBlockPart[1].setPosition(0, this.blockLength);
            this.currentBlockPartPos[1] = v2(18, 5);  //初始化当前块的位置，相对于currentBlock
            //T字形左
            this.currentBlockPart[2].setPosition(-this.blockLength, 0);
            this.currentBlockPartPos[2] = v2(17, 4);
            //T字形中
            this.currentBlockPart[3].setPosition(0, 0);
            this.currentBlockPartPos[3] = v2(17, 5);
            //T字形右
            this.currentBlockPart[4].setPosition(this.blockLength, 0);
            this.currentBlockPartPos[4] = v2(17, 6);
        }

        this.CheckCurrentBlockPos();
    }

    CheckCurrentBlockPos() {
        for (let i = 1; i <= 4 ; i++){
            this.box[this.currentBlockPartPos[i].x][this.currentBlockPartPos[i].y] = this.currentBlockPart[i];
        }
    }

    DeleteCurrentBlockPos() {
        for (let i = 1; i <= 4 ; i++){
            this.box[this.currentBlockPartPos[i].x][this.currentBlockPartPos[i].y] = null;
        }
    }

    AutoDown() {
        this.autoDown = () => {
            //一直下落直到碰到下边界
            if (this.isClashBottom()) {
                console.log("isClashBottom");
                this.deleteRow();   //行消除检测
                this.BuildBlock();  //创建新的方块集合
            } else if (this.isClashBlockDown()) {   //一直下落直到碰到其他方块
                console.log("isClashBlockDown");
                this.isGameOver();  //判断游戏是否结束
                if (!this.gameStart) return;
                this.deleteRow();
                this.BuildBlock();
            } else {
                this.currentBlock.setPosition(v3(this.currentBlock.position.x , this.currentBlock.position.y - this.blockLength));
                this.DeleteCurrentBlockPos();
                for (let i = 1; i <= 4 ; i++){
                    this.currentBlockPartPos[i].x -= 1;
                }
                this.CheckCurrentBlockPos();
            }
        }
        this.schedule(this.autoDown , 1);
    }

    LeftButton(){
        if (this.isClashLeft()) return;
        if (this.isClashBlockLeft()) return;
       
        this.currentBlock.setPosition(v3(this.currentBlock.position.x - this.blockLength , this.currentBlock.position.y));
        this.DeleteCurrentBlockPos();
        for (let i = 1; i <= 4 ; i++){
            this.currentBlockPartPos[i].y -= 1;
        }
        this.CheckCurrentBlockPos();

        this.ShadowDrop();
    }

    RightButton(){
        if (this.isClashRight()) return;
        if (this.isClashBlockRight()) return;
       
        this.currentBlock.setPosition(v3(this.currentBlock.position.x + this.blockLength , this.currentBlock.position.y));
        this.DeleteCurrentBlockPos();
        for (let i = 1; i <= 4 ; i++){
            this.currentBlockPartPos[i].y += 1;
        }
        this.CheckCurrentBlockPos();

        this.ShadowDrop();
    }

    UpButton(){
        this.DeleteCurrentBlockPos();
        this.ChangeShape();
        //判定踢墙
        if (this.isKickWallLeft()) {
            this.KickWallLeft();
        } else 
        if (this.isKickWallRight()){
            this.KickWallRight();
        }

        this.CheckCurrentBlockPos();

        this.ShadowDrop();
    }

    isKickWallLeft(){
        if (this.box[this.currentBlockPartPos[1].x][this.currentBlockPartPos[1].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[1].x][this.currentBlockPartPos[1].y]) ||
            this.box[this.currentBlockPartPos[2].x][this.currentBlockPartPos[2].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[2].x][this.currentBlockPartPos[2].y]) ||
            this.box[this.currentBlockPartPos[3].x][this.currentBlockPartPos[3].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[3].x][this.currentBlockPartPos[3].y]) ||
            this.box[this.currentBlockPartPos[4].x][this.currentBlockPartPos[4].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[4].x][this.currentBlockPartPos[4].y]) ||
            this.currentBlockPartPos[1].y  < 0 || this.currentBlockPartPos[2].y  < 0 ||
            this.currentBlockPartPos[3].y  < 0 || this.currentBlockPartPos[4].y  < 0) {
            return true;
        }
        return false;
    }

    isKickWallRight(){
        if (this.box[this.currentBlockPartPos[1].x][this.currentBlockPartPos[1].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[1].x][this.currentBlockPartPos[1].y]) ||
            this.box[this.currentBlockPartPos[2].x][this.currentBlockPartPos[2].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[2].x][this.currentBlockPartPos[2].y]) ||
            this.box[this.currentBlockPartPos[3].x][this.currentBlockPartPos[3].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[3].x][this.currentBlockPartPos[3].y]) ||
            this.box[this.currentBlockPartPos[4].x][this.currentBlockPartPos[4].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[4].x][this.currentBlockPartPos[4].y]) ||
            this.currentBlockPartPos[1].y  > 9 || this.currentBlockPartPos[2].y  > 9 ||
            this.currentBlockPartPos[3].y  > 9 || this.currentBlockPartPos[4].y  > 9){
            return true;
        }
        return false;
    }

    DownButton(){
        if (this.isClashBottom()) return;
        if (this.isClashBlockDown()) return;
        this.currentBlock.setPosition(v3(this.currentBlock.position.x , this.currentBlock.position.y - this.blockLength));
        this.DeleteCurrentBlockPos();
        for (let i = 1; i <= 4 ; i++){
            this.currentBlockPartPos[i].x -= 1;
        }
        this.CheckCurrentBlockPos();
    }

    //判断是否即将碰撞到左边界
    isClashLeft(): boolean {
        for (let i = 1 ; i <= 4 ; i++){
            if (this.currentBlockPartPos[i].y - 1 < 0) return true;
        }
        // if (this.currentBlockPartPos[1].y - 1 < 0 || this.currentBlockPartPos[2].y - 1 < 0 ||
        //     this.currentBlockPartPos[3].y - 1 < 0 || this.currentBlockPartPos[4].y - 1 < 0) {
        //     return true;
        // }
        return false;
    }

    //判断是否即将碰撞到右边界 
    isClashRight(): boolean {
        for (let i = 1 ; i <= 4 ; i++){
            if (this.currentBlockPartPos[i].y + 1 > 9) return true;
        }
        // if (this.currentBlockPartPos[1].y + 1 > 9 || this.currentBlockPartPos[2].y + 1 > 9 ||
        //     this.currentBlockPartPos[3].y + 1 > 9 || this.currentBlockPartPos[4].y + 1 > 9) {
        //     return true;
        // }
        return false;
    }

    //判断是否即将碰撞到下边界
    isClashBottom(): boolean {
        for (let i = 1 ; i <= 4 ; i++){
            if (this.currentBlockPartPos[i].x - 1 < 0) return true;
        }
        // if (this.currentBlockPartPos[1].x - 1 < 0 || this.currentBlockPartPos[2].x - 1 < 0 ||
        //     this.currentBlockPartPos[3].x - 1 < 0 || this.currentBlockPartPos[4].x - 1 < 0) {
        //     return true;
        // }
        return false;
    }

    //判断是否即将碰撞到其他方块（下）
    isClashBlockDown(): boolean {
        //向下检测方块碰撞
        for (let i = 1 ; i <= 4 ; i++){
            if (this.box[this.currentBlockPartPos[i].x - 1][this.currentBlockPartPos[i].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[i].x - 1][this.currentBlockPartPos[i].y])){
                return true;
            }
        }
        
        // if (this.box[this.currentBlockPartPos[1].x - 1][this.currentBlockPartPos[1].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[1].x - 1][this.currentBlockPartPos[1].y]) ||
        //     this.box[this.currentBlockPartPos[2].x - 1][this.currentBlockPartPos[2].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[2].x - 1][this.currentBlockPartPos[2].y]) ||
        //     this.box[this.currentBlockPartPos[3].x - 1][this.currentBlockPartPos[3].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[3].x - 1][this.currentBlockPartPos[3].y]) ||
        //     this.box[this.currentBlockPartPos[4].x - 1][this.currentBlockPartPos[4].y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[4].x - 1][this.currentBlockPartPos[4].y])) {
        //     return true;
        // }
        return false;
    }

    //判断是否即将碰撞到其他方块（左）
    isClashBlockLeft() {
        //向左检测方块碰撞
        for (let i = 1 ; i <= 4 ; i++){
            if (this.box[this.currentBlockPartPos[i].x][this.currentBlockPartPos[i].y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[i].x][this.currentBlockPartPos[i].y - 1])){
                return true;
            }
        }
        
        // if (this.box[this.currentBlockPartPos[1].x][this.currentBlockPartPos[1].y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[1].x][this.currentBlockPartPos[1].y - 1]) ||
        //     this.box[this.currentBlockPartPos[2].x][this.currentBlockPartPos[2].y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[2].x][this.currentBlockPartPos[2].y - 1]) ||
        //     this.box[this.currentBlockPartPos[3].x][this.currentBlockPartPos[3].y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[3].x][this.currentBlockPartPos[3].y - 1]) ||
        //     this.box[this.currentBlockPartPos[4].x][this.currentBlockPartPos[4].y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[4].x][this.currentBlockPartPos[4].y - 1])) {
        //     return true;
        // }
        return false;
    }

    //判断是否即将碰撞到其他方块（右）
    isClashBlockRight() {
        //向右检测方块碰撞
        for (let i = 1 ; i <= 4 ; i++){
            if (this.box[this.currentBlockPartPos[i].x][this.currentBlockPartPos[i].y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[i].x][this.currentBlockPartPos[i].y + 1])){
                return true;
            }
        }

        // if (this.box[this.currentBlockPartPos[1].x][this.currentBlockPartPos[1].y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[1].x][this.currentBlockPartPos[1].y + 1]) ||
        //     this.box[this.currentBlockPartPos[2].x][this.currentBlockPartPos[2].y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[2].x][this.currentBlockPartPos[2].y + 1]) ||
        //     this.box[this.currentBlockPartPos[3].x][this.currentBlockPartPos[3].y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[3].x][this.currentBlockPartPos[3].y + 1]) ||
        //     this.box[this.currentBlockPartPos[4].x][this.currentBlockPartPos[4].y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPartPos[4].x][this.currentBlockPartPos[4].y + 1])) {
        //     return true;
        // }
        return false;
    }

    isCurrentBlockChild(judgeObj: Node): boolean {
        for (let i = 0; i < 4; i++) {
            if (judgeObj === this.currentBlock.children[i] || judgeObj === this.shadowBlock.children[i]) {
                return true;
            }
        }
        return false;
    }

    ChangeShape() {
        for (let i = 1 ; i <= 4 ; i++){
            this.whichPartChange(this.currentBlockPart[i], this.currentBlockPartPos[i]);
        }
        // this.whichPartChange(this.currentBlockPart[1], this.currentBlockPartPos[1]);
        // this.whichPartChange(this.currentBlockPart[2], this.currentBlockPartPos[2]);
        // this.whichPartChange(this.currentBlockPart[3], this.currentBlockPartPos[3]);
        // this.whichPartChange(this.currentBlockPart[4], this.currentBlockPartPos[4]);
    }

    //传入被判断的部分
    whichPartChange(currentBlockPart: Node, currentBlockPartPos: Vec2) {
        //修正参数，用于旋转currentBlockPartPos的位置，从左边到上边，上边到右边，右边到下边，下边到左边，在象限中的不需要用到
        let modParameterX = Math.abs(currentBlockPart.position.x / this.blockLength);
        let modParameterY = Math.abs(currentBlockPart.position.y / this.blockLength);
        let modParameterMax = Math.max(modParameterX, modParameterY);
        //y轴上半
        if (currentBlockPart.position.x == 0 && currentBlockPart.position.y > 0) {
            //行- 列+
            currentBlockPartPos.x -= modParameterMax;
            currentBlockPartPos.y += modParameterMax;
            //旋转当前块的位置
            currentBlockPart.setPosition(currentBlockPart.position.y, currentBlockPart.position.x);
        }
        //x轴左半 
        else if (currentBlockPart.position.x < 0 && currentBlockPart.position.y == 0) {
            //行+ 列+
            currentBlockPartPos.x += modParameterMax;
            currentBlockPartPos.y += modParameterMax;
            //旋转当前块的位置
            currentBlockPart.setPosition(currentBlockPart.position.y, -currentBlockPart.position.x);
        }
        //y轴下半
        else if (currentBlockPart.position.x == 0 && currentBlockPart.position.y < 0) {
            //行+ 列-
            currentBlockPartPos.x += modParameterMax;
            currentBlockPartPos.y -= modParameterMax;
            //旋转当前块的位置
            currentBlockPart.setPosition(currentBlockPart.position.y, currentBlockPart.position.x);
        }
        //x轴右半
        else if (currentBlockPart.position.x > 0 && currentBlockPart.position.y == 0) {
            //行- 列-
            currentBlockPartPos.x -= modParameterMax;
            currentBlockPartPos.y -= modParameterMax;
            //旋转当前块的位置
            currentBlockPart.setPosition(currentBlockPart.position.y, -currentBlockPart.position.x);
        }
        //第一象限
        if (currentBlockPart.position.x > 0 && currentBlockPart.position.y > 0) {
            //行-
            if (currentBlockPart.position.x >= this.blockLength && currentBlockPart.position.y >= this.blockLength) {
                currentBlockPartPos.x -= 2;
            } else {
                currentBlockPartPos.x -= 1;
            }
            //旋转当前块的位置
            currentBlockPart.setPosition(currentBlockPart.position.x, -currentBlockPart.position.y);
        }
        //第二象限
        else if (currentBlockPart.position.x < 0 && currentBlockPart.position.y > 0) {
            //列+
            if (currentBlockPart.position.x <= -this.blockLength && currentBlockPart.position.y >= this.blockLength) {
                currentBlockPartPos.y += 2;
            } else {
                currentBlockPartPos.y += 1;
            }
            //旋转当前块的位置
            currentBlockPart.setPosition(-currentBlockPart.position.x, currentBlockPart.position.y);
        }
        //第三象限
        else if (currentBlockPart.position.x < 0 && currentBlockPart.position.y < 0) {
            //行+
            if (currentBlockPart.position.x <= -this.blockLength && currentBlockPart.position.y <= -this.blockLength) {
                currentBlockPartPos.x += 2;
            } else {
                currentBlockPartPos.x += 1;
            }
            //旋转当前块的位置
            currentBlockPart.setPosition(currentBlockPart.position.x, -currentBlockPart.position.y);
        }
        //第四象限
        else if (currentBlockPart.position.x > 0 && currentBlockPart.position.y < 0) {
            //列-
            if (currentBlockPart.position.x >= this.blockLength && currentBlockPart.position.y <= -this.blockLength) {
                currentBlockPartPos.y -= 2;
            } else {
                currentBlockPartPos.y -= 1;
            }
            //旋转当前块的位置
            currentBlockPart.setPosition(-currentBlockPart.position.x, currentBlockPart.position.y);
        }
    }

    KickWallLeft(){
        //长条形单独讨论
        if (this.rand == 5){
            if (!this.isClashBlockRight()){
                this.RightButton();
                if (this.isKickWallLeft()){
                    if (!this.isClashBlockRight()){
                        this.RightButton();
                    } else {
                        this.LeftButton();
                        this.ChangeShape();
                        this.ChangeShape();
                        this.ChangeShape();
                    }
                }
            } else {
                //如果不能踢墙就恢复原状
                this.ChangeShape();
                this.ChangeShape();
                this.ChangeShape();
            }
            return;
        }

        if (!this.isClashBlockRight()){
            this.RightButton();
        } else {
            //如果不能踢墙就恢复原状
            this.ChangeShape();
            this.ChangeShape();
            this.ChangeShape();
        }
    }

    KickWallRight(){
        //长条形单独讨论
        if (this.rand == 5){
            if (!this.isClashBlockLeft()){
                this.LeftButton();
                if (this.isKickWallRight()){
                    if (!this.isClashBlockLeft()){
                        this.LeftButton();
                    } else {
                        this.RightButton();
                        this.ChangeShape();
                        this.ChangeShape();
                        this.ChangeShape();
                    } 
                }
            } else {
                this.ChangeShape();
                this.ChangeShape();
                this.ChangeShape();
            }
            return;
        }

        if (!this.isClashBlockLeft()){
            this.LeftButton();
        } else {
            //如果不能踢墙就恢复原状
            this.ChangeShape();
            this.ChangeShape();
            this.ChangeShape();
        }
    }

    deleteRow() {
        let row = 0;
        for (let i = 0; i < 18; i++) {
            let count = 0;
            for (let j = 0; j < 10; j++) {
                if (this.box[i][j] != null) {
                    count++;
                }
            }
            if (count == 10) {
                row++;
                for (let j = 0; j < 10; j++) {
                    this.box[i][j].removeFromParent();
                    this.box[i][j] = null;
                }
                this.rowDown(i);
                i--;
            }
        }

        switch(row){
            case 1: 
                this.score += 1;
                break;
            case 2:
                this.score += 3;
                break;
            case 3:
                this.score += 5;
                break;
            case 4:
                this.score += 8;
        }
    }

    //全体方块向下移动一格
    rowDown(i: number) {
        //记录i值，即被当前被消除行
        let k = i;
        //列遍历
        for (let j = 0; j < 10; j++) {
            //temp:用于计算当前被消除行上面有多少行的方块元素（包括中间层存在镂空）
            let temp = -1;
            for (i = k; i < 18; i++) {
                temp++;
                if (this.box[i][j] != null) {
                    this.box[i - 1][j] = this.box[i][j];
                    this.box[i][j].setPosition(this.box[i][j].position.x , this.box[i][j].position.y - this.blockLength);
                    if (this.box[i + 1][j] == null) {
                        this.box[temp + k][j] = null;
                    }

                }
            }
        }
    }

    isGameOver() {
        for (let i = 16; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.box[i][j] != null) {
                    this.ExitGame();
                }
            }
        }
    }

    ThisRoundEnd(){
        this.unschedule(this.autoDown);
        this.background.active = false;
        this.gameNode.active = false;
        
        this.enemyHealth.injured(this.score * this.damagePerScore , true);
    }

    ExitGame(){
        
        // input.off(Input.EventType.KEY_DOWN, this.onKeyDown , this);

        //失败时清空当前场面
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.box[i][j] != null){
                    this.box[i][j].removeFromParent();
                    this.box[i][j] = null;
                }
            }
        }

        this.unschedule(this.autoDown);
        this.background.active = false;
        this.gameNode.active = false;
        this.gameStart = false;
        
        this.enemyHealth.injured(this.score * this.damagePerScore , true);

    }

    Drop(){
        while(!this.isClashBottom() && !this.isClashBlockDown()){
            this.DownButton();
        }
    }

    BuildShadow(){
        this.shadowBlock = new Node();
        this.gameNode.addChild(this.shadowBlock);
        this.shadowBlock.setPosition(this.currentBlock.position);
        for (let i = 1; i <= 4 ; i++){
            this.shadowBlockPart[i] = instantiate(this.currentBlockPart[i]);
            this.shadowBlockPart[i].getComponent(Sprite).color.set(255 , 255 , 255 ,this.shadowAlpha);
            this.shadowBlock.addChild(this.shadowBlockPart[i]);
            this.shadowBlockPart[i].setPosition(this.currentBlockPart[i].position);
            this.shadowBlockPartPos[i] = this.currentBlockPartPos[i].clone();
        }
    }

    ShadowDrop(){
        this.shadowBlock.setPosition(this.currentBlock.position);
        for (let i = 1; i <= 4 ; i++){
            this.shadowBlockPartPos[i] = this.currentBlockPartPos[i].clone();
        }

        while (!this.isShadowClashBottom() && !this.isShadowClashBlockDown()){
            this.shadowBlock.setPosition(v3(this.shadowBlock.position.x , this.shadowBlock.position.y - this.blockLength));
            for (let i = 1; i <= 4 ; i++){
                this.shadowBlockPartPos[i].x -= 1;
                // console.log(this.shadowBlockPartPos[i]);
            }
        }
        
    }

    isShadowClashBottom(): boolean {
        for (let i = 1 ; i <= 4 ; i++){
            if (this.shadowBlockPartPos[i].x - 1 < 0) return true;
        }
        return false;
    }

    //判断是否即将碰撞到其他方块（下）
    isShadowClashBlockDown(): boolean {
        //向下检测方块碰撞
        for (let i = 1 ; i <= 4 ; i++){
            if (this.box[this.shadowBlockPartPos[i].x - 1][this.shadowBlockPartPos[i].y] != null && !this.isShadowBlockChild(this.box[this.shadowBlockPartPos[i].x - 1][this.shadowBlockPartPos[i].y])){
                return true;
            }
        }
        return false;
    }

    isShadowBlockChild(judgeObj: Node): boolean {
        for (let i = 0; i < 4; i++) {
            if (judgeObj === this.shadowBlock.children[i] || judgeObj === this.currentBlock.children[i]) {
                return true;
            }
        }
        return false;
    }
}

