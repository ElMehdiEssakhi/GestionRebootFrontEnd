import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechStatsComponent } from './tech-stats.component';

describe('TechStatsComponent', () => {
  let component: TechStatsComponent;
  let fixture: ComponentFixture<TechStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
