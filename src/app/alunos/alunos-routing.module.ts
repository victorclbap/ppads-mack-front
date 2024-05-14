import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlunosComponent } from './alunos.component';
import { PresencasComponent } from './presencas/presencas.component';

const routes: Routes = [
  {
    path: '',
    component: AlunosComponent,
  },
  {
    path: 'presencas',
    component: PresencasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlunosRoutingModule {}
