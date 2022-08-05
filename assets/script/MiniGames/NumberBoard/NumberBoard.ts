import { _decorator, Component, Node, Label, Prefab, resources, instantiate } from 'cc';
import { Health } from '../../UI/Health';
import { NumberTile } from './NumberTile';
const { ccclass, property } = _decorator;

@ccclass('NumberBoard')
export class NumberBoard extends Component {
    @property(Node) background : Node = null;
    @property(Node) gameNode : Node = null; 
    @property(Label) time : Label = null;
    @property maxTime : number = 0;
    @property line : number = 0;
    @property cross : number = 0;

    @property(Health) playerHealth : Health = null;
    @property damagePerTile : number = 0;
    @property spaceX : number = 60;
    @property spaceY : number = 60;
    @property rotationSpeed : number = 0;
    @property waitTime : number = 0;

    private prefabTile : Prefab = null;
    private gameStart : boolean = false;
    private currTime : number = 0;
    private timeRecorder : Function = null;
    private remainTile : number = 0;
    private currTile : number = 1;
    private tiles : NumberTile [][] = [];
    private tileData : number[][] = [];
    private waiting : boolean = false;
    private rotating : boolean = false;

    start() {
        resources.load("prefab/NumberTilePrefab" , Prefab , (err, prefab) => {
            this.prefabTile = prefab;
        })
    }

    update(deltaTime: number) {
        if (!this.gameStart)    return;
        if (this.waiting){
            this.time.string = "等待时间：" + (this.currTime -this.maxTime) + "s";
        } else {
            this.time.string = "剩余时间：" + this.currTime + "s";
        }
        if ((this.remainTile <= 0)||(this.currTime <= 0))
        {
            this.ExitGame();
        }
    }
    GameStart(){
        // console.log(this.name);
        this.remainTile = this.line * this.cross;
        this.currTile = 1;
        this.currTime = this.maxTime + this.waitTime;
        this.background.active = true;
        this.gameNode.active = true;
        this.gameStart = true;
        this.waiting = true;

        this.scheduleOnce(function(){
            this.waiting = false;
        } , this.waitTime);

        this.timeRecorder = () => {
            if (this.currTime == 0){
                this.unschedule(this.timeRecorder);
            }
            this.currTime--;
        }
        this.schedule(this.timeRecorder, 1);

        for (let i = 0; i < this.line ; i++){
            this.tiles[i] = [];
            for (let j = 0; j < this.cross ; j++){
                let tile = instantiate(this.prefabTile).getComponent(NumberTile);
                tile.node.parent = this.gameNode;
                tile.node.setPosition((j + 0.5 - this.cross * 0.5) * this.spaceX , (i + 0.5 - this.line * 0.5) * this.spaceY);
                tile.board = this;
                tile.SetWaitTime(this.waitTime);
                tile.SetSpeed(this.rotationSpeed);
                this.tiles[i][j] = tile;
            }
        }

        this.InitBoard();
        this.RandomBoard();
        this.RefreshBoard();

    }

    ExitGame(){
        this.unschedule(this.timeRecorder);
        this.background.active = false;
        this.gameNode.active = false;
        this.gameStart = false;
        this.playerHealth.injured(this.remainTile * this.damagePerTile);
    }

    InitBoard(){
        let type = 0;

        for (let i = 0; i < this.line ; i++){
            this.tileData[i] = [];
            for (let j = 0; j < this.cross ; j++){
                type++;
                this.tileData[i][j] = type;
                // this.tiles[i][j].SetNumber(type);
            }
        }
    }

    RandomBoard(){
        for (let i = 0; i < this.line ; i++){
            for (let j = 0; j < this.cross ; j++){
                let swapI = Math.floor(Math.random() * this.line);
                let swapJ = Math.floor(Math.random() * this.cross);

                let temp = this.tileData[i][j];
                this.tileData[i][j] = this.tileData[swapI][swapJ];
                this.tileData[swapI][swapJ] = temp;
            }
        }
    }

    RefreshBoard(){
        for (let i = 0; i < this.line ; i++){
            for (let j = 0; j < this.cross; j++){
                this.tiles[i][j].SetNumber(this.tileData[i][j]);
            }
        }
    }

    OnTileClick(tile : NumberTile){

        if (this.waiting) return;
        if (this.rotating) return;

        tile.SetTargetRotation(0);

        this.rotating = true;

        if (tile.number == this.currTile){
            this.scheduleOnce(function(){
                tile.node.active = false;
                this.currTile ++;
                this.remainTile --;
                this.rotating = false;
            } , 0.5 + 180 / this.rotationSpeed);
        } else {
            this.scheduleOnce(function(){
                tile.SetTargetRotation(180);
                this.rotating = false;
            },  0.5 + 180 / this.rotationSpeed);
        }
    }
}

