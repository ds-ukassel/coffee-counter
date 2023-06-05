import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutologComponent } from './autolog.component';

describe('AutologComponent', () => {
  let component: AutologComponent;
  let fixture: ComponentFixture<AutologComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutologComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutologComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
