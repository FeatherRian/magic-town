import { _decorator, Component, Node , ProgressBar, Label } from 'cc';
const { ccclass, property } = _decorator;

import { Health } from './Health';

@ccclass('HealthBar')
export class HealthBar extends Component {

    private healthBar:ProgressBar;

    @property(Health) health: Health;

    
    @property(Label) healthText: Label;

    start(){
        this.healthBar = this.getComponent(ProgressBar);
    }

    update(deltaTime: number) {
        this.healthBar.progress = this.health.currentHealth / this.health.maxHealth;
        this.healthText.string = this.health.currentHealth + "/" + this.health.maxHealth;
    }
}

