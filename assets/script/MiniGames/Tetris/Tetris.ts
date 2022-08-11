import { _decorator, Component, Node, Prefab, Vec2, instantiate, v2, v3, input, Input, EventKeyboard, KeyCode, Label } from 'cc';
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

    private box : Node[][] = [];
    private rand : number = 0;

    //当前的块
    private currentBlock: Node = null;
    private currentBlockPart01: Node = null;
    private currentBlockPart02: Node = null;
    private currentBlockPart03: Node = null;
    private currentBlockPart04: Node = null;
    //当前块的位置
    private currentBlockPart01Pos: Vec2 = null;
    private currentBlockPart02Pos: Vec2 = null;
    private currentBlockPart03Pos: Vec2 = null;
    private currentBlockPart04Pos: Vec2 = null;

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
    }

    ChooseColor( rand : number ){
        this.currentBlockPart01 = instantiate(this.block[rand]);
        this.currentBlockPart02 = instantiate(this.block[rand]);
        this.currentBlockPart03 = instantiate(this.block[rand]);
        this.currentBlockPart04 = instantiate(this.block[rand]);
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

        this.currentBlock.addChild(this.currentBlockPart01);
        this.currentBlock.addChild(this.currentBlockPart02);
        this.currentBlock.addChild(this.currentBlockPart03);
        this.currentBlock.addChild(this.currentBlockPart04);

    }

    ChooseType(rand : number){
        if (rand == 0) {
            //正方形右上
            this.currentBlockPart01.setPosition(this.blockLength * 0.5 , this.blockLength * 0.5);
            this.currentBlockPart01Pos = v2(18, 5);  //初始化当前块的位置，相对于currentBlock
            //正方形左上
            this.currentBlockPart02.setPosition(-this.blockLength * 0.5 , this.blockLength * 0.5);
            this.currentBlockPart02Pos = v2(18, 4);
            //正方形右下
            this.currentBlockPart03.setPosition(this.blockLength * 0.5 , -this.blockLength * 0.5);
            this.currentBlockPart03Pos = v2(17, 5);
            //正方形左下
            this.currentBlockPart04.setPosition(-this.blockLength * 0.5 , -this.blockLength * 0.5);
            this.currentBlockPart04Pos = v2(17, 4);
        }
        //创建Z字形
        if (rand == 1) {
            //Z字形左
            this.currentBlockPart01.setPosition(-this.blockLength, 0);
            this.currentBlockPart01Pos = v2(18, 4);  //初始化当前块的位置，相对于currentBlock
            //Z字形中
            this.currentBlockPart02.setPosition(0, 0);
            this.currentBlockPart02Pos = v2(18, 5);
            //Z字形下
            this.currentBlockPart03.setPosition(0, -this.blockLength);
            this.currentBlockPart03Pos = v2(17, 5);
            //Z字形右
            this.currentBlockPart04.setPosition(this.blockLength, -this.blockLength);
            this.currentBlockPart04Pos = v2(17, 6);
        }
        //创建左L型
        if (rand == 2) {
            //左L形上
            this.currentBlockPart01.setPosition(0, this.blockLength);
            this.currentBlockPart01Pos = v2(19, 5);  //初始化当前块的位置，相对于currentBlock
            //左L形中
            this.currentBlockPart02.setPosition(0, 0);
            this.currentBlockPart02Pos = v2(18, 5);
            //左L形下
            this.currentBlockPart03.setPosition(0, -this.blockLength);
            this.currentBlockPart03Pos = v2(17, 5);
            //Z字形右
            this.currentBlockPart04.setPosition(this.blockLength, -this.blockLength);
            this.currentBlockPart04Pos = v2(17, 6);
        }
        //创建右L型
        if (rand == 3) {
            //右L型上
            this.currentBlockPart01.setPosition(0, this.blockLength);
            this.currentBlockPart01Pos = v2(19, 5);  //初始化当前块的位置，相对于currentBlock
            //右L型中
            this.currentBlockPart02.setPosition(0, 0);
            this.currentBlockPart02Pos = v2(18, 5);
            //右L型下
            this.currentBlockPart03.setPosition(0, -this.blockLength);
            this.currentBlockPart03Pos = v2(17, 5);
            //右L型左
            this.currentBlockPart04.setPosition(-this.blockLength, -this.blockLength);
            this.currentBlockPart04Pos = v2(17, 4);
        }
        //创建反Z型
        if (rand == 4) {
            //反Z形右
            this.currentBlockPart01.setPosition(this.blockLength, 0);
            this.currentBlockPart01Pos = v2(18, 6);  //初始化当前块的位置，相对于currentBlock
            //反Z形中
            this.currentBlockPart02.setPosition(0, 0);
            this.currentBlockPart02Pos = v2(18, 5);
            //反Z形下
            this.currentBlockPart03.setPosition(0, -this.blockLength);
            this.currentBlockPart03Pos = v2(17, 5);
            //反Z形左
            this.currentBlockPart04.setPosition(-this.blockLength, -this.blockLength);
            this.currentBlockPart04Pos = v2(17, 4);
        }
        //创建长条型
        if (rand == 5) {
            //长条型上上
            this.currentBlockPart01.setPosition(0, this.blockLength * 2);
            this.currentBlockPart01Pos = v2(19, 5);  //初始化当前块的位置，相对于currentBlock
            //长条型上
            this.currentBlockPart02.setPosition(0, this.blockLength);
            this.currentBlockPart02Pos = v2(18, 5);
            //长条型中
            this.currentBlockPart03.setPosition(0, 0);
            this.currentBlockPart03Pos = v2(17, 5);
            //长条型下
            this.currentBlockPart04.setPosition(0, -this.blockLength);
            this.currentBlockPart04Pos = v2(16, 5);
        }
        //创建T字形
        if (rand == 6) {
            //T字形上
            this.currentBlockPart01.setPosition(0, this.blockLength);
            this.currentBlockPart01Pos = v2(18, 5);  //初始化当前块的位置，相对于currentBlock
            //T字形左
            this.currentBlockPart02.setPosition(-this.blockLength, 0);
            this.currentBlockPart02Pos = v2(17, 4);
            //T字形中
            this.currentBlockPart03.setPosition(0, 0);
            this.currentBlockPart03Pos = v2(17, 5);
            //T字形右
            this.currentBlockPart04.setPosition(this.blockLength, 0);
            this.currentBlockPart04Pos = v2(17, 6);
        }

        this.CheckCurrentBlockPos();
    }

    CheckCurrentBlockPos() {
         console.log(this.currentBlockPart01Pos);
        this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y] = this.currentBlockPart01;
        this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y] = this.currentBlockPart02;
        this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y] = this.currentBlockPart03;
        this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y] = this.currentBlockPart04;
         console.log(this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y]);
    }

    DeleteCurrentBlockPos() {
        // console.log(this.currentBlockPart01Pos);
        this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y] = null;
        this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y] = null;
        this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y] = null;
        this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y] = null;
        // console.log(this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y]);
    }

    AutoDown() {
        this.autoDown = () => {
            //一直下落直到碰到下边界
            if (this.isClashBottom()) {
                this.deleteRow();   //行消除检测
                this.BuildBlock();  //创建新的方块集合
            } else if (this.isClashBlockDown()) {   //一直下落直到碰到其他方块
                this.isGameOver();  //判断游戏是否结束
                if (!this.gameStart) return;
                this.deleteRow();
                this.BuildBlock();
            } else {
                this.currentBlock.setPosition(v3(this.currentBlock.position.x , this.currentBlock.position.y - this.blockLength));
                this.DeleteCurrentBlockPos();
                this.currentBlockPart01Pos.x -= 1;
                this.currentBlockPart02Pos.x -= 1;
                this.currentBlockPart03Pos.x -= 1;
                this.currentBlockPart04Pos.x -= 1;
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
        this.currentBlockPart01Pos.y -= 1;
        this.currentBlockPart02Pos.y -= 1;
        this.currentBlockPart03Pos.y -= 1;
        this.currentBlockPart04Pos.y -= 1;
        this.CheckCurrentBlockPos();
    }

    RightButton(){
        if (this.isClashRight()) return;
        if (this.isClashBlockRight()) return;
       
        this.currentBlock.setPosition(v3(this.currentBlock.position.x + this.blockLength , this.currentBlock.position.y));
        this.DeleteCurrentBlockPos();
        this.currentBlockPart01Pos.y += 1;
        this.currentBlockPart02Pos.y += 1;
        this.currentBlockPart03Pos.y += 1;
        this.currentBlockPart04Pos.y += 1;
        this.CheckCurrentBlockPos();
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
    }

    isKickWallLeft(){
        if (this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y]) ||
            this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y]) ||
            this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y]) ||
            this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y]) ||
            this.currentBlockPart01Pos.y  < 0 || this.currentBlockPart02Pos.y  < 0 ||
            this.currentBlockPart03Pos.y  < 0 || this.currentBlockPart04Pos.y  < 0) {
            return true;
        }
        return false;
    }

    isKickWallRight(){
        if (this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y]) ||
            this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y]) ||
            this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y]) ||
            this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y]) ||
            this.currentBlockPart01Pos.y  > 9 || this.currentBlockPart02Pos.y  > 9 ||
            this.currentBlockPart03Pos.y  > 9 || this.currentBlockPart04Pos.y  > 9){
            return true;
        }
        return false;
    }

    DownButton(){
        if (this.isClashBottom()) return;
        if (this.isClashBlockDown()) return;
        this.currentBlock.setPosition(v3(this.currentBlock.position.x , this.currentBlock.position.y - this.blockLength));
        this.DeleteCurrentBlockPos();
        this.currentBlockPart01Pos.x -= 1;
        this.currentBlockPart02Pos.x -= 1;
        this.currentBlockPart03Pos.x -= 1;
        this.currentBlockPart04Pos.x -= 1;
        this.CheckCurrentBlockPos();
    }

    //判断是否即将碰撞到左边界
    isClashLeft(): boolean {
        if (this.currentBlockPart01Pos.y - 1 < 0 || this.currentBlockPart02Pos.y - 1 < 0 ||
            this.currentBlockPart03Pos.y - 1 < 0 || this.currentBlockPart04Pos.y - 1 < 0) {
            return true;
        }
        return false;
    }

    //判断是否即将碰撞到右边界 
    isClashRight(): boolean {
        if (this.currentBlockPart01Pos.y + 1 > 9 || this.currentBlockPart02Pos.y + 1 > 9 ||
            this.currentBlockPart03Pos.y + 1 > 9 || this.currentBlockPart04Pos.y + 1 > 9) {
            return true;
        }
        return false;
    }

    //判断是否即将碰撞到下边界
    isClashBottom(): boolean {
        if (this.currentBlockPart01Pos.x - 1 < 0 || this.currentBlockPart02Pos.x - 1 < 0 ||
            this.currentBlockPart03Pos.x - 1 < 0 || this.currentBlockPart04Pos.x - 1 < 0) {
            return true;
        }
        return false;
    }

    //判断是否即将碰撞到其他方块（下）
    isClashBlockDown(): boolean {
        //向下检测方块碰撞
        if (this.box[this.currentBlockPart01Pos.x - 1][this.currentBlockPart01Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart01Pos.x - 1][this.currentBlockPart01Pos.y]) ||
            this.box[this.currentBlockPart02Pos.x - 1][this.currentBlockPart02Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart02Pos.x - 1][this.currentBlockPart02Pos.y]) ||
            this.box[this.currentBlockPart03Pos.x - 1][this.currentBlockPart03Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart03Pos.x - 1][this.currentBlockPart03Pos.y]) ||
            this.box[this.currentBlockPart04Pos.x - 1][this.currentBlockPart04Pos.y] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart04Pos.x - 1][this.currentBlockPart04Pos.y])) {
            return true;
        }
        return false;
    }

    //判断是否即将碰撞到其他方块（左）
    isClashBlockLeft() {
        //向左检测方块碰撞
        if (this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y - 1]) ||
            this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y - 1]) ||
            this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y - 1]) ||
            this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y - 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y - 1])) {
            return true;
        }
        return false;
    }

    //判断是否即将碰撞到其他方块（右）
    isClashBlockRight() {
        //向右检测方块碰撞
        if (this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart01Pos.x][this.currentBlockPart01Pos.y + 1]) ||
            this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart02Pos.x][this.currentBlockPart02Pos.y + 1]) ||
            this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart03Pos.x][this.currentBlockPart03Pos.y + 1]) ||
            this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y + 1] != null && !this.isCurrentBlockChild(this.box[this.currentBlockPart04Pos.x][this.currentBlockPart04Pos.y + 1])) {
            return true;
        }
        return false;
    }

    isCurrentBlockChild(judgeObj: Node): boolean {
        for (let i = 0; i < 4; i++) {
            if (judgeObj === this.currentBlock.children[i]) {
                return true;
            }
        }
        return false;
    }

    ChangeShape() {
        this.whichPartChange(this.currentBlockPart01, this.currentBlockPart01Pos);
        this.whichPartChange(this.currentBlockPart02, this.currentBlockPart02Pos);
        this.whichPartChange(this.currentBlockPart03, this.currentBlockPart03Pos);
        this.whichPartChange(this.currentBlockPart04, this.currentBlockPart04Pos);
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
        
        this.enemyHealth.injured(this.score * this.damagePerScore);
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
        
        this.enemyHealth.injured(this.score * this.damagePerScore);

    }
}

