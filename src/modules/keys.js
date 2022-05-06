// import keyLettersParameters from './key-letters-parameters.js';
// import keyDigitsParameters from './key-digits-parameters.js';
// import keySpecialParameters from './key-special-parameters.js';

class Key {
  constructor(keyType, keyboard, text, keysStatement) {
    this.keyType = keyType;
    this.classCode = keyType.code;
    this.keyboard = keyboard;
    this.keysStatement = keysStatement;
    this.text = text;
    this.btn = null;
    this.btnContent = null;
    this.printing = true;
  }

  createKey(lang) {
    if (this.keyType.noPrinting === true) {
      this.printing = false;
    }
    this.btn = document.createElement('div');
    this.btnContent = document.createElement('div');
    this.btn.classList.add('key');
    if (this.keyType.class) {
      this.btn.classList.add(`${this.keyType.class}`);
    }
    if (lang === 'en') {
      this.btn.innerHTML = this.keyType.en;
    } else {
      this.btn.innerHTML = this.keyType.ru;
    }
    this.btn.dataset.code = `${this.keyType.code}`;
    this.keyboard.append(this.btn);
  }

  print() {
    // let textValue = this.text.value;
    let newSymbol = '';
    newSymbol = this.btn.textContent;
    this.text.setRangeText(newSymbol, this.text.selectionStart, this.text.selectionEnd, 'end');
  }

  capsKeys(lang, caps) {
    if (lang === 'en') {
      if (caps) {
        this.btn.innerHTML = this.keyType.enCaps;
      } else {
        this.btn.innerHTML = this.keyType.en;
      }
    } else if (lang === 'ru') {
      if (caps) {
        this.btn.innerHTML = this.keyType.ruCaps;
      } else {
        this.btn.innerHTML = this.keyType.ru;
      }
    }
  }

  shiftKeys(lang, caps, shift) {
    if (lang === 'en') {
      if (caps && shift) {
        if (this.keyType.enCapsShift) {
          this.btn.innerHTML = this.keyType.enCapsShift;
        } else {
          this.btn.innerHTML = this.keyType.en;
        }
      } else if (!caps && !shift) {
        this.btn.innerHTML = this.keyType.en;
      } else if (caps && !shift) {
        this.btn.innerHTML = this.keyType.enCaps;
      } else if (!caps && shift) {
        this.btn.innerHTML = this.keyType.enShift;
      }
    } else if (lang === 'ru') {
      if (caps && shift) {
        if (this.keyType.ruCapsShift) {
          this.btn.innerHTML = this.keyType.ruCapsShift;
        } else {
          this.btn.innerHTML = this.keyType.ru;
        }
      } else if (!caps && !shift) {
        this.btn.innerHTML = this.keyType.ru;
      } else if (caps && !shift) {
        this.btn.innerHTML = this.keyType.ruCaps;
      } else if (!caps && shift) {
        this.btn.innerHTML = this.keyType.ruShift;
      }
    }
  }

  space() {
    this.btnContent.innerHTML = this.keyType.spec;
    // let textValue = this.text.value;
    const newSymbol = this.btnContent.innerHTML;
    // this.text.value = textValue;
    this.text.setRangeText(newSymbol, this.text.selectionStart, this.text.selectionEnd, 'end');
  }

  backspace() {
    const start = this.text.selectionStart;
    const end = this.text.selectionEnd;
    if (start - 1 >= 0) {
      this.text.setRangeText('', start - 1, end, 'end');
    }
  }

  delete() {
    const start = this.text.selectionStart;
    const end = this.text.selectionEnd;
    this.text.setRangeText('', start, end + 1, 'end');
  }
}

export default Key;
