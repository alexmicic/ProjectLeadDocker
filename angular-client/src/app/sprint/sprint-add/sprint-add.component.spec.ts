import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintAddComponent } from './sprint-add.component';

describe('SprintAddComponent', () => {
  let component: SprintAddComponent;
  let fixture: ComponentFixture<SprintAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
