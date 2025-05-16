import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineStatsComponent } from './machine-stats.component';

describe('MachineStatsComponent', () => {
  let component: MachineStatsComponent;
  let fixture: ComponentFixture<MachineStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
