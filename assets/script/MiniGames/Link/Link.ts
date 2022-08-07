import { _decorator, Component, Node, Label, instantiate, Prefab, resources } from 'cc';
import { Health } from '../../UI/Health';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('Link')
export class Link extends Component {

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

    private prefabTile : Prefab = null;
    private gameStart : boolean = false;
    private currTime : number = 0;
    private timeRecorder : Function = null;
    private remainTile : number = 0;
    private tiles : Tile[][] = [];
    private tileData : number[][] = [];
    private lastClickTile : Tile = null;
    private waiting : boolean = false;

    start() {
        resources.load("prefab/TilePrefab" , Prefab , (err, prefab) => {
            this.prefabTile = prefab;
        })
    }

    update(deltaTime: number) {
        if (!this.gameStart)    return;
        this.time.string = "剩余时间：" + this.currTime + "s";
        if ((this.remainTile <= 0)||(this.currTime <= 0))
        {
            this.ExitGame();
        }
    }
    GameStart(){
        // console.log(this.name);
        this.remainTile = this.line * this.cross;
        this.currTime = this.maxTime;
        this.background.active = true;
        this.gameNode.active = true;
        this.gameStart = true;

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
                let tile = instantiate(this.prefabTile).getComponent(Tile);
                tile.node.parent = this.gameNode;
                tile.node.setPosition((j + 0.5 - this.cross * 0.5) * this.spaceX , (i + 0.5 - this.line * 0.5) * this.spaceY);
                tile.link = this;
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
        let count = 0;

        for (let i = 0; i < this.line ; i++){
            this.tileData[i] = [];
            for (let j = 0; j < this.cross ; j++){
                if (count == 2){
                    count = 0;
                    type++;
                    if (type == 8){
                        type = 0;
                    }
                }
                this.tileData[i][j] = type;
                this.tiles[i][j].SetType(type);
                count++;
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
                this.tiles[i][j].SetType(this.tileData[i][j]);
            }
        }
    }

    OnTileClick(tile : Tile){

        if (this.waiting) return;

        if (tile.isSelected){
            tile.SetIsSelected(false);
            this.lastClickTile = null;
            return;
        }

        tile.SetIsSelected(true);

        if (!this.lastClickTile){
            this.lastClickTile = tile;
            return;
        }

        this.waiting = true;
        
        if (this.lastClickTile.type == tile.type){
            this.scheduleOnce(function(){
                //播放消失动画
                this.lastClickTile.IsLink();
                this.lastClickTile = null;
                tile.IsLink();
                this.remainTile -= 2;
            } , 0.5);
        } else {
            this.scheduleOnce(function(){
                this.lastClickTile.SetIsSelected(false);
                tile.SetIsSelected(false);
                this.lastClickTile = null;
            } , 0.5 );
        }

        this.scheduleOnce(function(){
            this.waiting = false;
        }, 1 );

    }

}

