// controller do cangaço <3

import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacoes, Negociacao } from '../models/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoParcial } from '../models/NegociacaoParcial';
import { NegociacaoService } from '../services/index';
import {imprime} from '../helpers/Utils';

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

    imprime(negociacao, this._negociacoes);

    this._negociacoes.adiciona(negociacao);

    this._negociacoes.paraTexto();

    this._negociacoesView.update(this._negociacoes);
    this._mensagemView.update('Negociação adicionada com sucesso!');

  }
  private _ehDiaUtil(data: Date) {

    return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo
  }

  @throttle()
  async importaDados() {
      try {
        
        const negociacoesParaImportar = await this._service
          .obterNegociacoes(res => {
            if(res.ok) {
              return res;
            }else {
              throw new Error(res.statusText);
            }
          });
    
          const negociacoesJaImportadas = this._negociacoes.paraArray();
    
          negociacoesParaImportar
            .filter((negociacao: Negociacao | any)=> 
              !negociacoesJaImportadas.some(jaImportada =>
                  negociacao.ehIgual(jaImportada)))
          .forEach((negociacao: Negociacao) => 
            this._negociacoes.adiciona(negociacao));
            this._negociacoesView.update(this._negociacoes);
      } catch(err) {
        this._mensagemView.update(err.message);
      }
          
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