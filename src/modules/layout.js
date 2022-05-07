import keysParameters from './keys-parameters';
import Key from './keys';

export default class Layout {
  constructor() {
    this.header = null;
    this.title = null;
    this.text1 = null;
    this.text2 = null;
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
    this.title = document.createElement('h1');
    this.title.classList.add('title');
    this.title.textContent = 'Виртуальная Клавиатура';
    this.text1 = document.createElement('p');
    this.text1.classList.add('text');
    this.text1.textContent = 'Клавиатура создана на основе ОС Windows';
    this.text2 = document.createElement('p');
    this.text2.classList.add('text');
    this.text2.textContent = 'Для переключения языка используйте комбинацию левый Ctrl + левый Alt';
    document.body.prepend(this.header);
    this.header.append(this.title);
    this.container.append(this.text1);
    this.container.append(this.text2);
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
            keyPressed.btn.classList.add('caps-lock-active');
            this.keys.forEach((item) => {
              item.capsKeys(this.params.lang, this.params.caps);
            });
          } else if (this.params.capsLongTouch) {
            this.params.caps = false;
            keyPressed.btn.classList.remove('caps-lock-active');
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
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('key')) {
        const clicked = this.keys.find((item) => item.classCode === event.target.dataset.code);
        if (clicked) {
          if (clicked.classCode === 'CapsLock') {
            if (!this.params.caps) {
              this.params.caps = true;
              this.params.capsLongTouch = true;
              clicked.btn.classList.add('caps-lock-active');
              this.keys.forEach((item) => {
                item.capsKeys(this.params.lang, this.params.caps);
              });
            } else {
              this.params.caps = false;
              clicked.btn.classList.remove('caps-lock-active');
              this.keys.forEach((item) => {
                item.capsKeys(this.params.lang, this.params.caps);
              });
            }
          }
          if (clicked.classCode === 'Enter') {
            clicked.space();
          }
          if (clicked.classCode === 'Tab') {
            clicked.space();
          }
          if (clicked.classCode === 'Backspace') {
            clicked.backspace();
          }
          if (clicked.classCode === 'Delete') {
            clicked.delete();
          }
          if (clicked.printing) {
            clicked.print();
          }
        }
      }
    });
    document.addEventListener('mousedown', (event) => {
      if (!event.target.classList.contains('textarea')) {
        event.preventDefault();
      }
      if (event.target.classList.contains('key')) {
        const clicked = this.keys.find((item) => item.classCode === event.target.dataset.code);
        if (clicked) {
          clicked.btn.classList.add('active');
          if (clicked.classCode === 'ShiftLeft' || clicked.classCode === 'ShiftRight') {
            this.params.shift = true;
            this.keys.forEach((item) => {
              item.shiftKeys(this.params.lang, this.params.caps, this.params.shift);
            });
          }
        }
      }
    });
    document.addEventListener('mouseup', () => {
      this.keys.forEach((item) => {
        item.btn.classList.remove('active');
      });
      this.params.shift = false;
      this.keys.forEach((item) => {
        item.shiftKeys(this.params.lang, this.params.caps, this.params.shift);
      });
    });
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('lang', this.params.lang);
    });
  }
}
