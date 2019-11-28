import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailedInfoPage } from './detailed-info.page';

describe('DetailedInfoPage', () => {
  let component: DetailedInfoPage;
  let fixture: ComponentFixture<DetailedInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
