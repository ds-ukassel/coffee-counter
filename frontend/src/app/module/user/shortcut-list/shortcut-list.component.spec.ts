import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShortcutListComponent} from './shortcut-list.component';

describe('ShortcutListComponent', () => {
  let component: ShortcutListComponent;
  let fixture: ComponentFixture<ShortcutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortcutListComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortcutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
