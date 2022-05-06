import keysParameters from './keys-parameters.js';
import Key from './keys.js';

export default class Layout {
  constructor() {
    this.header = null;
    this.container = null;
    this.keyboardContainer = null;
    this.keyboard = null;
    this.text = null;
    this.params = {
      shift: false,
      caps: false,
      capsLongTouch: false,
      control: false,
      alt: false,
      lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en',
    };
    this.keys = [];
    this.press = new Set();
    this.langSwitchers = ['AltLeft', 'ControlLeft'];
    if (localStorage.getItem('lang') !== null) {
      this.lang = localStorage.getItem('lang');
    } else {
      this.lang = 'en';
    }
  }

  init() {
    console.log(this.lang);
    this.container = document.createElement('div');
    this.container.classList.add('main-container');
    document.body.prepend(this.container);
    this.text = document.createElement('textarea');
    this.text.classList.add('textarea');
    this.text.value = '';
    this.text.cols = '30';
    this.text.setAttribute('autofocus', '');
    this.container.append(this.text);
    this.keyboardContainer = document.createElement('div');
    this.keyboardContainer.classList.add('keyboard-container');
    this.container.append(this.keyboardContainer);
    this.header = document.createElement('header');
    this.header.classList.add('header');
    document.body.prepend(this.header);
    Object.values(keysParameters).forEach((item) => {
      const keyItem = new Key(item, this.keyboardContainer, this.text, this.params);
      keyItem.createKey(this.params.lang);
      this.keys.push(keyItem);
    });
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      const keyPressed = this.keys.find((item) => item.classCode === event.code);
      if (keyPressed) {
        this.press.add(keyPressed.classCode);
        if (this.press.has(this.langSwitchers[1]) && this.press.has(this.langSwitchers[0])) {
          if (this.params.lang === 'en') {
            this.params.lang = 'ru';
          } else {
            this.params.lang = 'en';
          }
          this.keys.forEach((item) => {
            item.shiftKeys(this.params.lang, this.params.caps, this.params.shift);
          });
        }
        keyPressed.btn.classList.add('active');
        if (keyPressed.classCode === 'CapsLock') {
          if (!this.params.caps) {
            this.params.caps = true;
            this.params.capsLongTouch = false;
            this.keys.forEach((item) => {
              item.capsKeys(this.params.lang, this.params.caps);
            });
          } else if (this.params.capsLongTouch) {
            this.params.caps = false;
            this.keys.forEach((item) => {
              item.capsKeys(this.params.lang, this.params.caps);
            });
          }
        }
        if (keyPressed.classCode === 'ShiftLeft' || keyPressed.classCode === 'ShiftRight') {
          this.params.shift = true;
          this.keys.forEach((item) => {
            item.shiftKeys(this.params.lang, this.params.caps, this.params.shift);
          });
        }
        if (keyPressed.classCode === 'Enter') {
          keyPressed.space();
        }
        if (keyPressed.classCode === 'Tab') {
          keyPressed.space();
        }
        if (keyPressed.classCode === 'Backspace') {
          keyPressed.backspace();
        }
        if (keyPressed.classCode === 'Delete') {
          keyPressed.delete();
        }
        if (keyPressed.printing) {
          keyPressed.print();
        }
      }
    });
    document.addEventListener('keyup', (event) => {
      event.preventDefault();
      const keyPressed = this.keys.find((item) => item.classCode === event.code);
      if (keyPressed) {
        this.press.delete(keyPressed.classCode);
        keyPressed.btn.classList.remove('active');
        if (keyPressed.classCode === 'CapsLock') {
          this.params.capsLongTouch = true;
        }
        if (keyPressed.classCode === 'ShiftLeft' || keyPressed.classCode === 'ShiftRight') {
          this.params.shift = false;
          this.keys.forEach((item) => {
            item.shiftKeys(this.params.lang, this.params.caps, this.params.shift);
          });
        }
      }
    });
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('lang', this.params.lang);
    });
  }
}
