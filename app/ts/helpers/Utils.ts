import { Imprimivel } from '../models/index';

export function imprime(...objetos: Imprimivel[]) {

  objetos.forEach(objetos => objetos.paraTexto());
}