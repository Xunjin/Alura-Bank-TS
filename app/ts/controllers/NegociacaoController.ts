// controller do cangaço <3

import {NegociacoesView, MensagemView} from '../views/index';
import {Negociacoes, Negociacao} from '../models/index';
import {domInject} from '../helpers/decorators/index';
import {NegociacaoParcial} from '../models/NegociacaoParcial';

let timer = 0;

export class NegociacaoController {

  @domInject('#data')
  private _inputData: JQuery;

  @domInject('#quantidade')
  private _inputQuantidade: JQuery;

  @domInject('#valor')
  private _inputValor: JQuery;
  private _negociacoes = new Negociacoes();
  private _negociacoesView = new NegociacoesView('#negociacoesView',);
  private _mensagemView = new MensagemView('#mensagemView',);

  constructor() {
    this._negociacoesView.update(this._negociacoes);
  }

  adiciona(event: Event) {

    event.preventDefault();

    let data = new Date((this._inputData.val() as string).replace(/-/g, ','));


    if (!this._ehDiaUtil(data)) {
      
      this._mensagemView.update('Somente Negociações em dias úteis')
      return
    }
    const negociacao = new Negociacao(
      data, // need to convert to as string because of the @Type/Jquery problem
      parseInt(this._inputQuantidade.val() as string), // need to convert to as string because of the @Type/Jquery problem
      parseFloat(this._inputValor.val() as string) // need to convert to as string because of the @Type/Jquery problem
    );

    this._negociacoes.adiciona(negociacao);

    this._negociacoesView.update(this._negociacoes);
    this._mensagemView.update('Negociação adicionada com sucesso!');

  }
  private _ehDiaUtil(data: Date) {

    return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo
  }

  importaDados() {

    function isOK(res: Response) {

      if(res.ok) {
        return res;
      }else {
        throw new Error(res.statusText);
      }
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      
      fetch('http://localhost:8080/dados')
        .then(res => isOK(res))
        .then(res => res.json())
        .then((dados: NegociacaoParcial[]) => {
          dados
            .map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
            .forEach(negociacao => this._negociacoes.adiciona(negociacao))
            this._negociacoesView.update(this._negociacoes)
        })
        .catch(err => console.log(err.message));
    }, 500)
  }
}

enum DiaDaSemana {
  
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}