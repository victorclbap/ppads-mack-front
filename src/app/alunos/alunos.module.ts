import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlunosRoutingModule } from './alunos-routing.module';
import { AlunosComponent } from './alunos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoButtonModule, PoModule } from '@po-ui/ng-components';
import { SharedModule } from '../shared/shared.module';
import { PresencasComponent } from './presencas/presencas.component';

@NgModule({
  declarations: [AlunosComponent, PresencasComponent],
  imports: [
    CommonModule,
    AlunosRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    PoModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    PoButtonModule,
  ],
  exports: [AlunosComponent, PresencasComponent],
})
export class AlunosModule {}
