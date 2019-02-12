// controller do cangaço <3

import {NegociacoesView, MensagemView} from '../views/index';
import {Negociacoes, Negociacao} from '../models/index';
import {domInject, throttle} from '../helpers/decorators/index';
import {NegociacaoParcial} from '../models/NegociacaoParcial';
import {NegociacaoService} from '../services/index';

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

  private _service = new NegociacaoService();

  constructor() {
    this._negociacoesView.update(this._negociacoes);
  }

  @throttle()
  adiciona() {

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

  @throttle()
  importaDados() {

    function isOK(res: Response) {

      if(res.ok) {
        return res;
      }else {
        throw new Error(res.statusText);
      }
    }
      
    this._service.obterNegociacoes(isOK)
      .then((negociacoes: Negociacao[])  => { 
        negociacoes.forEach(negociacao => 
          this._negociacoes.adiciona(negociacao));
          this._negociacoesView.update(this._negociacoes);
        });
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