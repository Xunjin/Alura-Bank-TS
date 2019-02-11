class Negociacao {
  
  constructor(data, quantidade, valor) { // constructor

    this._data = data; // attributes
    this._quantidade = quantidade;
    this._valor = valor;
  }


  get data() { // property

    return this._data;
  }

  get quantidade() {

    return this._quantidade;
  }

  get valor() {

    return this._valor;
  }


  get volume() {

    return this._quantidade * this._valor;
  }
}