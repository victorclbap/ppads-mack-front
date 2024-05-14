import { Component, ViewChild } from '@angular/core';
import {
  PoModalComponent,
  PoNotificationService,
  PoTableColumn,
  PoTableLiterals,
} from '@po-ui/ng-components';
import { Subject, takeUntil } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlunosService } from '../shared/services/alunos/alunos.service';
import { UtilService } from '../shared/services/util/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.scss'],
})
export class AlunosComponent {
  formAdicionarAluno!: FormGroup;

  public readonly pageActions = [
    {
      label: 'Novo aluno',
      icon: 'po-icon po-icon-plus',
      action: () => this.adicionarNovoAluno(),
    },
    {
      label: 'Editar aluno',
      icon: 'po-icon po-icon-edit',
      action: () => this.editarAluno(),
    },
    {
      label: 'Presenças',
      icon: 'po-icon po-icon-edit',
      action: () => this.navegarParaPresencas(),
    },
  ];

  // Form
  public searchField = new FormControl();

  // Pagina
  public readonly customLiterals: PoTableLiterals = {
    loadingData: 'Carregando dados',
    loadMoreData: 'Carregando mais dados',
  };

  // Util
  private destroy$ = new Subject<boolean>();
  public isEditarAluno = false;

  // Tabela
  public listAlunos: any[] = [];
  public clonedListAlunos: any[] = [];
  public columnsAlunos: PoTableColumn[] = [];

  // Loading
  public showMoreDisabled = false;
  public isLoading = false;

  // Paginação
  public page = 1;
  public hasNext = true;

  public anos: any[] = [
    { label: '1º Ano', value: '1' },
    { label: '2º Ano', value: '2' },
    { label: '3º Ano', value: '3' },
  ];

  public turmas: any[] = [
    { label: '5A', value: 'a' },
    { label: '5B', value: 'b' },
    { label: '6A', value: 'c' },
    { label: '6B', value: 'd' },
  ];

  public disciplinas: any[] = [
    { label: 'Matemática', value: 'mat' },
    { label: 'Física', value: 'fis' },
    { label: 'Química', value: 'qui' },
    { label: 'Geografia', value: 'geo' },
    { label: 'Inglês', value: 'ing' },
    { label: 'Artes', value: 'art' },
    { label: 'Ciências', value: 'cie' },
  ];

  public alunos: any[] = [
    { label: 'João Silva', value: 'J' },
    { label: 'Maria Oliveira', value: 'M' },
    { label: 'Pedro Santos', value: 'P' },
  ];

  aluno = {
    nome_aluno: '',
    turma: '',
    responsavel: '',
  };

  constructor(
    private alunosService: AlunosService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private notificationService: PoNotificationService,
    private router: Router
  ) {}

  @ViewChild(PoModalComponent, { static: true }) modal!: PoModalComponent;

  ngOnInit(): void {
    this.initializeData();
  }

  /**
   * Inicialização dos dados
   */
  private initializeData(): void {
    this.createForm();
    this.setEpisodesColumns();
    this.getAlunos();
  }

  /**
   * Obtêm os alunos
   */
  public getAlunos(): void {
    this.isLoading = true;

    this.alunosService
      .obterTodosAlunos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.listAlunos = response;
        },
        error: (error) => this.utilService.handleApiError(error),
        complete: () => (this.isLoading = false),
      });
  }

  /**
   * Seta as colunas da tabela
   */
  public setEpisodesColumns(): void {
    this.columnsAlunos = this.getColumns();
  }

  /**
   * Retorna as colunas da tabela
   * @returns
   */
  public getColumns(): PoTableColumn[] {
    return [
      { property: 'id', label: 'Id', width: '22%', visible: false },
      { property: 'nome_aluno', label: 'Nome', width: '22%' },
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
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


  createForm() {
    this.formAdicionarAluno = this.fb.group({
      id: [''],
      nome_aluno: ['', Validators.required],
      turma: ['', Validators.required],
      responsavel: ['', Validators.required],
      email_responsavel: ['', Validators.required],
    });
  }

  public adicionarNovoAluno() {
    this.formAdicionarAluno.reset();
    this.isEditarAluno = false;
    this.modal.open();
  }

  public editarAluno() {
    const aluno = this.listAlunos.filter((item) => item.$selected);
    if (!aluno.length) {
      return this.notificationService.warning('Selecione um aluno!');
    }
    this.formAdicionarAluno.reset();
    this.isEditarAluno = true;
    this.formAdicionarAluno.patchValue(aluno[0]);
    this.modal.open();
  }

  public fechar() {
    this.modal.close();
  }

  public confirmar() {
    if (this.formAdicionarAluno.invalid) {
      return this.notificationService.warning('Formulário inválido!');
    }

    this.isLoading = true;

    if (this.isEditarAluno) {
      this.alunosService
        .editarAluno({
          ...this.formAdicionarAluno.value,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.notificationService.success('Aluno editado com sucesso!');
              this.getAlunos();
              this.reset();
            } else {
              this.notificationService.success('Houve um erro na edição');
              this.reset();
            }
          },
          error: (error) => {
            this.utilService.handleApiError(error), this.reset();
          },
        });
    } else {
      this.alunosService
        .criarAluno({ ...this.formAdicionarAluno.value })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.notificationService.success('Aluno criado com sucesso!');
              this.getAlunos();
              this.reset();
            } else {
              this.notificationService.success('Houve um erro na criação');
              this.reset();
            }
          },
          error: (error) => {
            this.utilService.handleApiError(error), this.reset();
          },
        });
    }
  }

  private reset() {
    this.formAdicionarAluno.reset();
    this.modal.close();
    this.isLoading = false;
  }

  private navegarParaPresencas() {
    this.router.navigate(['/alunos/presencas']);
  }
}
