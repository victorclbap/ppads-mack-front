import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlunosRoutingModule } from './alunos-routing.module';
import { AlunosComponent } from './alunos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AlunosComponent],
  imports: [
    CommonModule,
    AlunosRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    PoModule,
    SharedModule,
  ],
  exports: [AlunosComponent],
})
export class AlunosModule {}
