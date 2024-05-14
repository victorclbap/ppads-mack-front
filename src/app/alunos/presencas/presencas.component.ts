import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  PoDialogService,
  PoNotificationService,
  PoTableColumn,
  PoTableLiterals,
} from '@po-ui/ng-components';
import { Subject, takeUntil } from 'rxjs';
import { AlunosService } from 'src/app/shared/services/alunos/alunos.service';
import { UtilService } from 'src/app/shared/services/util/util.service';

@Component({
  selector: 'app-presencas',
  templateUrl: './presencas.component.html',
  styleUrls: ['./presencas.component.css'],
})
export class PresencasComponent implements OnInit {
  public readonly pageActions = [
    {
      label: 'Voltar',
      icon: 'po-icon po-icon-arrow-left',
      action: () => this.voltar(),
    },
  ];

  public busca = '';
  public isLoading = false;

  public listAlunos: any[] = [];
  public columnsAlunos: PoTableColumn[] = [];
  public showMoreDisabled = false;

  // Pagina
  public readonly customLiterals: PoTableLiterals = {
    loadingData: 'Carregando dados',
    loadMoreData: 'Carregando mais dados',
  };

  private destroy$ = new Subject<boolean>();

  constructor(
    private router: Router,
    private alunosService: AlunosService,
    private utilService: UtilService,
    private notificationService: PoNotificationService,
    private poAlert: PoDialogService
  ) {}

  ngOnInit() {
    this.columnsAlunos = this.getColumns();
  }

  onSearch() {
    this.isLoading = true;

    this.alunosService
      .obterPresencas(this.busca.toUpperCase())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.listAlunos = response.map((item: any) => {
              return { ...item, favorite: ['favorite', 'documentation'] };
            });
            this.listAlunos = this.listAlunos;
          } else {
            this.listAlunos = [];
            this.notificationService.warning('Nenhum turma encontrada!');
          }

          this.isLoading = false;
        },
        error: (error) => {
          this.utilService.handleApiError(error), (this.isLoading = false);
        },
        complete: () => (this.isLoading = false),
      });
  }

  voltar() {
    this.router.navigate(['/alunos']);
  }

  /**
   * Retorna as colunas da tabela
   * @returns
   */
  public getColumns(): PoTableColumn[] {
    return [
      // { property: 'id', label: 'Id', width: '5%' },
      { property: 'nome_aluno', label: 'Nome', width: '12%' },
      { property: 'turma', label: 'Turma', width: '12%' },
      { property: 'responsavel', label: 'Responsável', width: '22%' },
      {
        property: 'nome_materia',
        label: 'Matéria',
        width: '22%',
      },
      {
        property: 'nome_professor',
        label: 'Nome do Professor',
        width: '22%',
      },
      {
        property: 'faltas',
        label: 'Faltas',
        width: '10%',
      },
      {
        property: 'favorite',
        label: 'Marcar falta',
        type: 'icon',
        width: '10%',
        sortable: false,
        icons: [
          {
            action: this.marcarFalta.bind(this),
            color: 'color-07',
            icon: 'po-icon po-icon-user-delete',
            tooltip: 'Marcar falta',
            value: 'favorite',
          },
        ],
      },
    ];
  }

  public marcarFalta(item: any) {
    this.alertDialog(item);
  }

  public alertDialog(item: any) {
    this.poAlert.confirm({
      title: 'Marcar falta',
      message: `Tem certeza que deseja marcar falta para o aluno ${item.nome_aluno}?`,
      confirm: () => this.confirmaFalta(item),
      cancel: () => {},
    });
  }

  confirmaFalta(aluno: any) {
    this.isLoading = true;

    const obj = {
      aluno_id: aluno.id,
      presente: false,
    };

    this.alunosService
      .marcarFalta(obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.notificationService.success('Falta marcada com sucesso!');
            this.onSearch();
          } else {
            this.listAlunos = [];
            this.notificationService.warning('Erro ao marcar falta!');
          }

          this.isLoading = false;
        },
        error: (error) => {
          this.utilService.handleApiError(error), (this.isLoading = false);
        },
        complete: () => (this.isLoading = false),
      });
  }
}
