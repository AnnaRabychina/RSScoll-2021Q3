import './settingsTree.css';
import { PageTree } from '../../pages/page-tree';
import SettingsMenu from '../../templates/settingsMenu';
import { TreeContainer } from '../tree/tree';
import { getLocalStorage, setLocalStorage } from '../storage/storage';
import { buttonsGarland } from '../../options/options';
import { insertElement } from '../cards/cards';

let isPlay = false;
let isSnow  = false;

export class SettingsAudioAndSnow {
  protected container: HTMLElement;
  protected audio: HTMLAudioElement;
  protected audioControl: HTMLElement;
  protected snowControl: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('menu-container');
    this.audio = document.createElement('audio');
    this.audio.src = 'assets/audio/audio.mp3';
    this.audioControl = document.createElement('div');
    this.audioControl.classList.add('audio-control', 'menu-item');
    this.audioControl.onclick = () => {
      this.playAudio();
    };
    this.snowControl = document.createElement('div');
    this.snowControl.classList.add('snow-control', 'menu-item');
    this.snowControl.onclick = () => {
      this.createSnow();
    };
  }

  playAudio(): void {
    if (!isPlay) {
      this.audio.currentTime = 0;
      this.audio.play();
      isPlay = true;
      this.audioControl.classList.add('active');
    } else {
      this.audio.pause();
      isPlay = false;
      this.audioControl.classList.remove('active');
    }
  }

  createSnow(): void {
    if (!isSnow) {
      TreeContainer.snowContainer.classList.remove('hide');
      PageTree.snowInterval = setInterval(() => {
        this.createSnowFlake();
        this.snowControl.classList.add('active');
        isSnow = true;
      }, 100);
    } else {
      clearInterval(PageTree.snowInterval);
      this.snowControl.classList.remove('active');
      TreeContainer.snowContainer.classList.add('hide');
      isSnow = false;
    }
  }

  createSnowFlake(): void {
    const snowFlake: HTMLElement = document.createElement('i');
    snowFlake.style.animationDuration = String(Math.random() * 3 + 2) + 's';
    snowFlake.style.opacity = String(Math.random());
    TreeContainer.snowContainer.append(snowFlake);
  }

  render(): HTMLElement {
    this.container.append(this.audioControl, this.snowControl);
    return this.container;
  }
}

export class SettingsTree extends SettingsMenu {
  constructor() {
    super();
    this.container.classList.add('tree-container', 'menu-container');
  }

  render(): HTMLElement {
    this.setSettings('tree', 'numImgTree');
    this.renderItems(6, ['tree', 'menu-item'], 'tree', this.container);
    return this.container;
  }
}

export class SettingsBg extends SettingsMenu {
  constructor() {
    super();
    this.container.classList.add('bg-container', 'menu-container');
  }

  render(): HTMLElement {
    this.setSettings('bg', 'numBgTree');
    this.renderItems(10, ['bg', 'menu-item'], 'bg', this.container);
    return this.container;
  }
}

export class ButtonsGarland {
  container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('garland-btns');
  }

  renderButtonsGarland(arrButtons: Array<string>): void {
    arrButtons.forEach((button) => {
      const buttonHTML = <HTMLButtonElement>document.createElement('button');
      buttonHTML.classList.add(`${button}-btn`, 'color-btn');
      buttonHTML.dataset.color = button;
      this.container.append(buttonHTML);
    });
  }

  setColorGarland(): void {
    this.container.addEventListener('click', (event: Event) => {
      const target = <HTMLElement>event.target;
      const btn = <HTMLElement>target.closest('.color-btn');
      if (btn) {
        const color = <string>target.dataset.color;
        setLocalStorage('garlandColor', color);
        SettingsGarland.turnOnGarland();
      }
    });
  }

  render(): HTMLElement {
    this.renderButtonsGarland(buttonsGarland);
    this.setColorGarland();
    return this.container;
  }
}

export class SettingsGarland {
  container: HTMLElement;

  buttonsGarland: ButtonsGarland;

  garlandInput: HTMLInputElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('garland-container', 'menu-container');
    this.buttonsGarland = new ButtonsGarland();
    this.garlandInput = document.createElement('input');
    this.garlandInput.classList.add('on-switch-checkbox');
    this.garlandInput.type = 'checkbox';
    this.garlandInput.name = 'on-switch';
    this.garlandInput.id = 'garland-on-switch';
    this.garlandInput.onclick = () => {
      this.setGarland();
    };
  }

  setGarland(): void {
    setLocalStorage('isOnGarland', this.garlandInput.checked ? 'true' : '');
    SettingsGarland.turnOnGarland();
  }

  static turnOnGarland(): void {
    if (getLocalStorage('isOnGarland')) {
      TreeContainer.garlandContainer.render();
    } else {
      TreeContainer.garlandContainer.clear();
    }
  }

  renderInputContainer(): HTMLElement {
    if (getLocalStorage('isOnGarland')) {
      this.garlandInput.checked = true;
    } else {
      this.garlandInput.checked = false;
    }
    const garlandInputContainer = <HTMLElement>document.createElement('div');
    garlandInputContainer.classList.add('on-switch');
    garlandInputContainer.append(this.garlandInput);
    const label = <HTMLLabelElement>document.createElement('label');
    label.classList.add('on-switch-label');
    label.setAttribute('for', 'garland-on-switch');
    label.innerHTML = `
      <label class="on-switch-label" for="garland-on-switch">
      <div class="on-switch-inner"></div>
      <div class="on-switch-switch"></div>
      </label> 
    `;
    garlandInputContainer.append(label);
    return garlandInputContainer;
  }

  render(): HTMLElement {
    const buttonsGarlandHTML = this.buttonsGarland.render();
    const inputContainerHTML = this.renderInputContainer();
    this.container.append(buttonsGarlandHTML, inputContainerHTML);
    return this.container;
  }
}

export class SettingsMenuContainer {
  private container: HTMLElement;

  private settingsAudioAndSnow: SettingsAudioAndSnow;

  private settingsTree: SettingsTree;

  private settingsBg: SettingsBg;

  private settingsGarland: SettingsGarland;

  private resetButton: HTMLButtonElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('settings-tree-menu');
    this.settingsAudioAndSnow = new SettingsAudioAndSnow();
    this.settingsTree = new SettingsTree();
    this.settingsBg = new SettingsBg();
    this.settingsGarland = new SettingsGarland();
    this.resetButton = <HTMLButtonElement>insertElement('button', ['reset-button'], 'Сброс настроек');
    this.resetButton.onclick = () => {
      this.resetSettings();
    };
  }

  resetSettings(): void {
    localStorage.removeItem('numBgTree');
    localStorage.removeItem('numImgTree');
    PageTree.treeContainer.render();
    TreeContainer.garlandContainer.clear();
    TreeContainer.snowContainer.classList.add('hide');
    PageTree.favoritesCards.render();
  }

  render(): HTMLElement {
    const settingsAudioAndSnowHTML = this.settingsAudioAndSnow.render();
    const settingsTreeHTML = this.settingsTree.render();
    const settingsBgHTML = this.settingsBg.render();
    const settingsGarlandHTML = this.settingsGarland.render();
    this.container.append(settingsAudioAndSnowHTML, settingsTreeHTML, 
      settingsBgHTML, settingsGarlandHTML, this.resetButton);
    return this.container;
  }
}