import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SliderPage } from './slider.page';

describe('SliderPage', () => {
  let component: SliderPage;
  let fixture: ComponentFixture<SliderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SliderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
