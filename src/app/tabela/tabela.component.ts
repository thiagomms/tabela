import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css']
})
export class TabelaComponent implements OnInit {

  tabela: { 
      id: number, 
      nome: string, 
      dependencia: string, 
      municipio: string,
      uf: string }[] = [
    { id: 0, nome: "Ana Cleber", dependencia: "AJURE DIST.FEDERAL", municipio: "Brasília", uf: "DF"},
    { id: 1, nome: "RayWord",  dependencia: "AUDIT/GA CAINF", municipio: "Brasília", uf: "DF"},
    { id: 2, nome: "Pedro Raimundo", dependencia: "AUDIT/GA CLIENTES ", municipio: "Brasília", uf: "DF" }
  ];
 

  constructor() { }

  ngOnInit() {
  }

}
