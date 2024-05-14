/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PresencasComponent } from './presencas.component';

describe('PresencasComponent', () => {
  let component: PresencasComponent;
  let fixture: ComponentFixture<PresencasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresencasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresencasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
