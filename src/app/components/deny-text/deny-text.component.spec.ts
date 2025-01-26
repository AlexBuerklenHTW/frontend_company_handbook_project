import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenyTextComponent } from './deny-text.component';

describe('DenytextComponent', () => {
  let component: DenyTextComponent;
  let fixture: ComponentFixture<DenyTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DenyTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenyTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
