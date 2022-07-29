import { _decorator, Component, Node, } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Health')
export class Health extends Component {
    
    private _currentHealth : number ;
    public maxHealth : number = 1000;
    public get currentHealth(){
        return this._currentHealth
    }
    set currentHealth(value){
        this._currentHealth = value;
    }

    start(){
        this.currentHealth = this.maxHealth;
    }



    injured( damage:number){
        if (this.currentHealth <= damage)
        {
            this.currentHealth = 0;
            this.death();
        }
        else{
            this.currentHealth -= damage;
        }
    }

    death(){

    }
}

