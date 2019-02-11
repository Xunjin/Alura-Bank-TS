class NegociacaoController {

  private _inputData: JQuery;
  private _inputQuantidade: JQuery;
  private _inputValor: JQuery;
  private _negociacoes = new Negociacoes();
  private _negociacoesView = new NegociacoesView('#negociacoesView');
  private _mensagemView = new MensagemView('#mensagemView');

  constructor() {
    this._inputData = $('#data');
    this._inputQuantidade = $('#quantidade');
    this._inputValor = $('#valor');
    this._negociacoesView.update(this._negociacoes);
  }

  adiciona(event: Event) {

    event.preventDefault();

    const negociacao = new Negociacao(
      new Date((this._inputData.val() as string).replace(/-/g, ',')), // need to convert to as string because of the @Type/Jquery problem
      parseInt(this._inputQuantidade.val() as string), // need to convert to as string because of the @Type/Jquery problem
      parseFloat(this._inputValor.val() as string) // need to convert to as string because of the @Type/Jquery problem
    );

    this._negociacoes.adiciona(negociacao);

    this._negociacoesView.update(this._negociacoes);
    this._mensagemView.update('Negociação adicionada com sucesso!');
  }
}