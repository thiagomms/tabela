app.component('test', {
    templateUrl: 'pages/test/test.component.html',
    controller: ['$rootScope', 'carteiraService', 'globalService', '$filter', '$state', 'toastr', prefixoFormController],
    controllerAs: 'vm'
 
 })
 
function prefixoFormController($rootScope, carteiraService, globalService, $filter, $state, toastr) {
    let vm = this;

    vm.peso = 0;
    vm.carteirasSelecionadas = [];
    vm.matriculaAtual = {};
    vm.matriculasGestores = '';
    vm.desabilidadoForcado = true

    vm.$onInit = () => {
        $rootScope.$broadcast('waitScreen', true);
        vm.paginaAtual = 1;
        vm.usuario = $rootScope.usuario;
        if (vm.usuario.dados.coddep != 8559) {
            vm.search = {}
            vm.search.carteira_prefixo_gepes = vm.usuario.dados.coddep
        }
        vm.getCarteiras();
        vm.prefixoGepesUsuario();
    }
    vm.arrayMatriculas = [
        'C1310047','C1310252','F2698839','F6771577',
        'F2700587','F9821869','F0504097', 'F0722087',
        'F7303879','F6864929','F6472770','F6770738',
        'F6002322','F8528334','F8944968','F1146389',
        'F0424998','F9676538','F2064411'
    ]

    $rootScope.$on('refr', function() {
        $scope.doRefresh();
    });

    vm.validaMatricula = (usuario)=> {
        vm.matriculaAtual = usuario.matricula ? usuario.matricula: usuario.dados.matricula;
         vm.booleano = vm.arrayMatriculas.includes(vm.matriculaAtual);
        return vm.booleano;
    }

    vm.getCarteiras = () => {
        vm.carteiras = []
        let parametro = {prefixo: 0, carteira: 0}

        globalService.Call('p_dependencias_jurisdicionadas', parametro, response => {
            $rootScope.$broadcast('waitScreen', false);
             if (response.success) {
                 vm.item = []
                 for (var i = 0; i < 10; i++) {
                    vm.item.push(response.data[i])
                 }
               
                vm.carteiras = response.data
                vm.filtrar()
            }
        })
    }

    vm.prefixoGepesUsuario = () => {
        carteiraService.getFuncionario(vm.usuario.dados.matricula.replace(/\D/g, ''), response => {
            vm.prefixoGepesUser = response.data;
        })
    }

    vm.selecionaCarteira = (carteira) => {
        if (typeof vm.prefixoGepesUser.prefixoLocalizado !== "undefined") {
            if (carteira.carteira_prefixo_gepes == vm.prefixoGepesUser.prefixoLocalizado || vm.prefixoGepesUser.prefixoLocalizado == 8559) {

                carteira.color = !carteira.color;

                if (vm.selecionaTodos) {
                    carteira.color = vm.selecionaPorTipo
                }
                
                   
                vm.carteirasSelecionadas = vm.carteiras.filter(item => item.color);
                if (carteira.color) {
                    vm.peso = vm.peso + parseInt(carteira.peso_dependencia);
                } else {
                    vm.peso = vm.peso - parseInt(carteira.peso_dependencia);
                }
                vm.matriculasGestores = '';
                var matriculas = [];
                vm.carteirasSelecionadas.forEach(element => {
                    matriculas.push(element.chave_gerente);
                });
                vm.matriculasGestores = matriculas.toString();
            } else {
                toastr.error('Não é possível selecionar prefixos de outra Gepes!');
            }
        } else {
            toastr.error('Usuário sem prefixo localizado não pode selecionar carteiras');
        }
    }


    vm.copy = () => {
        var $temp_input = $("<input>");
        $("body").append($temp_input);
        $temp_input.val(vm.matriculasGestores).select();
        document.execCommand("copy");
        $temp_input.remove();
        toastr.success('Matriculas Copiadas');
    }

    vm.selectAll = (tipo) => {
        vm.selecionaTodos = true
        vm.selecionaPorTipo = tipo
        vm.selecaoRealizada = tipo
        vm.carteirasParaInfinit.forEach(element => {
            vm.selecionaCarteira(element);
        });
        vm.selecionaTodos = false
    }

    vm.filtrar = () => {
        vm.carteirasParaInfinit = $filter('filter')(vm.carteiras, vm.search)
    }

    vm.ordenar = (campo) => {
        let filtro = ''
        let ordenacao = false
        if (vm.ultimoCampo == campo) {
            if (vm.ultimoTipoOrdenacao != undefined) {
                ordenacao = !vm.ultimoTipoOrdenacao
            }
            vm.ultimoTipoOrdenacao = ordenacao
            filtro = campo
        } else {
            filtro = campo
            vm.ultimoTipoOrdenacao = false
        }

        vm.ultimoCampo = campo

        vm.carteirasParaInfinit = $filter('orderBy')(vm.carteirasParaInfinit, filtro, ordenacao)
    }

    vm.direcionaGestor = () => {
        $state.go("listaGestores");
    }

    vm.alteraJurisdicao = () => {
        vm.carteirasSelecionadas = vm.carteiras.filter(item => item.color)
        // let gepesDistintas = [...new Set(vm.carteiras.map(prefixo => prefixo.nome_carteira + ' de ' + prefixo.carteira_prefixo_gepes))];
        let gepesDistintas = [...new Set(vm.carteiras.map(prefixo => prefixo.carteira_prefixo_gepes + '|' + prefixo.carteira_codigo))];
        gepesDistintas = gepesDistintas.filter(carteira => carteira != null)

        $rootScope.$broadcast('showMudaJurisdicaoModal', {
            carteiras: vm.carteiras,
            carteirasSelecionadas: vm.carteirasSelecionadas,
            peso: vm.peso,
            filtro: gepesDistintas
        });
    }

    vm.alterarResponsaveis = () => {

        $rootScope.$broadcast('showResponsaveisModal',
        );
    }

    vm.registraContato = (prefixo) => {
        $rootScope.$broadcast('showContatoFormModal', prefixo);
    }

    vm.verTimeLine = (prefixo) => {
        $rootScope.$broadcast('contatoTimeLineModal', prefixo);
    }

    $rootScope.$on("recarregaPagina", function (evt, data) {
        vm.getCarteiras()
    });
}



