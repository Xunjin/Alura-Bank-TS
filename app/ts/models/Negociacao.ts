export class Negociacao {

  constructor(readonly data: Date, readonly quantidade: number,
     readonly valor: number) {  // constructor  
     }
     
  get volume() {

    return this.quantidade * this.valor;
  }
}