// 创建自定义组件，需要声明一个类，继承HTMLELement

// 如果需要自定一内置组件，则需要继承特定的HTMLElement

class Square extends HTMLElement {


  // 说明 监测属性值 以至于 属性改变回调可以正常工作！
  static get observedAttributes() {
    return ['c', 'l'];
  }

  constructor() {
    // Always call super first in constructor
    super();

    // 获取shadow Tree 我当作是独立的文档使用
    // attach => 连接
    const shadow = this.attachShadow({ mode: 'open' });

    const div = document.createElement('div');
    const style = document.createElement('style');

    // 将样式打进shadow Tree中·
    shadow.appendChild(style);
    shadow.appendChild(div);
  }

  //connectedCallback：当 custom element 首次被插入文档 DOM 时，被调用。
  connectedCallback() {
    console.log('connectedCallback：当 custom element 首次被插入文档 DOM 时，被调用。');
    updateStyle(this);
  }
  //disconnectedCallback：当 custom element 从文档 DOM 中删除时，被调用。
  disconnectedCallback() {
    console.log('disconnectedCallback：当 custom element 从文档 DOM 中删除时，被调用。');
  }
  //adoptedCallback：当 custom element 被移动到新的文档时，被调用。
  adoptedCallback() {
    console.log('adoptedCallback：当 custom element 被移动到新的文档时，被调用。');
  }
  //attributeChangedCallback: 当 custom element 增加、删除、修改自身属性时，被调用。

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback: 当 custom element 增加、删除、修改自身属性时，被调用。');
    console.log('----', arguments);
    updateStyle(this);
  }
}

// 往customElements 中定义 组件
customElements.define('custom-square', Square);

// 更新样式函数
function updateStyle(elem) {
  const shadow = elem.shadowRoot;
  shadow.querySelector('style').textContent = `
    div {
      width: ${elem.getAttribute('l')}px;
      height: ${elem.getAttribute('l')}px;
      background-color: ${elem.getAttribute('c')};
    }
  `;
}

// 下面是正常文档下，相关dom操作
const add = document.querySelector('.add');
const update = document.querySelector('.update');
const remove = document.querySelector('.remove');

let square;

update.disabled = true;
remove.disabled = true;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


add.onclick = function () {
  // 定义之后，就能通过这样使用自定义组件了！
  square = document.createElement('custom-square');
  square.setAttribute('l', '100');
  square.setAttribute('c', 'red');
  document.body.appendChild(square);

  update.disabled = false;
  remove.disabled = false;
  add.disabled = true;
};


update.onclick = function () {
  // Randomly update square's attributes
  square.setAttribute('l', random(50, 200));
  square.setAttribute('c', `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`);
};

remove.onclick = function () {
  // Remove the square
  document.body.removeChild(square);

  update.disabled = true;
  remove.disabled = true;
  add.disabled = false;
};
